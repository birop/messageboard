import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "../../../lib/supabase";

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

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Nem sikerult lekerdezni az uzeneteket."
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";

    if (!content) {
      return NextResponse.json(
        { error: "Ures uzenet nem mentheto." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({ content })
      .select("id, content, created_at")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Nem sikerult elmenteni az uzenetet."
      },
      { status: 500 }
    );
  }
}
