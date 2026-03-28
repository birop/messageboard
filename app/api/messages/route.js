import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "../../../lib/supabase";
import {
  assertJsonRequest,
  assertSameOrigin,
  getNoStoreHeaders,
  validateMessageContent
} from "../../../lib/message-security";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("messages")
      .select("id, content, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { headers: getNoStoreHeaders() });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Nem sikerult lekerdezni az uzeneteket."
      },
      { status: 500, headers: getNoStoreHeaders() }
    );
  }
}

export async function POST(request) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);

    const body = await request.json();
    const content = validateMessageContent(body.content);

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({ content })
      .select("id, content, created_at")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { data },
      { status: 201, headers: getNoStoreHeaders() }
    );
  } catch (error) {
    const status =
      error.message === "Ures uzenet nem mentheto." ||
      error.message === "A kerelem torzsenek JSON formatumuak kell lennie." ||
      error.message === "Cross-origin kerest nem engedelyezett." ||
      error.message?.includes("legfeljebb")
        ? 400
        : 500;

    return NextResponse.json(
      {
        error:
          status === 400
            ? error.message
            : "Nem sikerult elmenteni az uzenetet."
      },
      { status, headers: getNoStoreHeaders() }
    );
  }
}
