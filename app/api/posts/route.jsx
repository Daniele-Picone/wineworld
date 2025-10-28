import { supabase } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// ✅ Client server Supabase con SERVICE_ROLE_KEY (serve per bypassare RLS)
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const POST = async (req) => {
  try {
    // 1️⃣ Ottieni token utente
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "Utente non autenticato" }, { status: 401 });
    }

    // 2️⃣ Verifica utente
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json({ message: "Utente non valido" }, { status: 401 });
    }

    // 3️⃣ Ricevi dati dal form
    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const category = formData.get("category");
    const imageFile = formData.get("image");
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (!title || !content || !category) {
      return NextResponse.json({ message: "Compila tutti i campi obbligatori" }, { status: 400 });
    }

    // 4️⃣ Carica immagine su Storage (solo se presente)
    let publicUrl = null;
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const fileBuffer = Buffer.from(await imageFile.arrayBuffer());

      const { error: uploadError } = await supabaseServer.storage
        .from("posts")
        .upload(`images/${fileName}`, fileBuffer, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/images/${fileName}`;
    }

    // 5️⃣ Recupera nome utente (opzionale)
    const { data: profile } = await supabaseServer
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();

    const userName = profile?.name || "Anonimo";

    // 6️⃣ Inserimento nel database
    const { error: insertError } = await supabaseServer.from("posts").insert([
      {
        title,
        slug, // 👈 importante: qui salvi lo slug!
        content,
        category,
        user_id: user.id,
        user_name: userName,
        image_url: publicUrl,
      },
    ]);

    if (insertError) throw insertError;

    return NextResponse.json({ message: "✅ Post creato con successo!" });
  } catch (err) {
    console.error("Errore POST /api/posts:", err);
    return NextResponse.json({ message: err.message || "Errore server" }, { status: 500 });
  }
};

// ✅ GET - per recuperare post filtrati per categoria
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "wines";

    const { data, error } = await supabaseServer
      .from("posts")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ posts: data });
  } catch (err) {
    console.error("Errore GET /api/posts:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE - per rimuovere un post
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json({ error: "ID post mancante" }, { status: 400 });
    }

    const { error } = await supabaseServer
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) throw error;

    return NextResponse.json({ message: "🗑️ Post eliminato con successo" });
  } catch (err) {
    console.error("Errore DELETE /api/posts:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
