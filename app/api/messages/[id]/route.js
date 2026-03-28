import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "../../../../lib/supabase";
import {
  assertSameOrigin,
  getNoStoreHeaders,
  validateMessageId
} from "../../../../lib/message-security";

export async function DELETE(_request, { params }) {
  try {
    assertSameOrigin(_request);

    const id = validateMessageId(params.id);


    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("messages").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { success: true },
      { headers: getNoStoreHeaders() }
    );
  } catch (error) {
    const status =
      error.message === "Cross-origin kerest nem engedelyezett." ||
      error.message === "Ervenytelen bejegyzesazonosito."
        ? 400
        : 500;

    return NextResponse.json(
      {
        error:
          status === 400 ? error.message : "Nem sikerult torolni az uzenetet."
      },
      { status, headers: getNoStoreHeaders() }
    );
  }
}
