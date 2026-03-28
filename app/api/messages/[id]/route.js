import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "../../../../lib/supabase";

export async function DELETE(_request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Hianyzik a torlendo bejegyzes azonositoja." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("messages").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Nem sikerult torolni az uzenetet."
      },
      { status: 500 }
    );
  }
}
