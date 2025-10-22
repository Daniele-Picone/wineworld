import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

// GET - Lista utenti
export async function GET() {
  try {
    // Ottieni tutti gli utenti dalla view
    const { data: users, error } = await supabase
      .from("users_view")
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Errore recupero utenti:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users });
  } catch (err) {
    console.error("Errore server:", err);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}

// DELETE - Elimina utente
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "ID utente mancante" }, { status: 400 });
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      console.error("Errore eliminazione profilo:", profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Utente eliminato con successo" });
  } catch (err) {
    console.error("Errore eliminazione:", err);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}
