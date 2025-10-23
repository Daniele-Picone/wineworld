import { supabase } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Client server Supabase con SERVICE_ROLE_KEY
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const POST = async (req) => {
  try {
    // 1️⃣ Ottieni token utente dal client
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return new Response(JSON.stringify({ message: 'Utente non autenticato' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2️⃣ Ottieni utente dal token
    const { data: { user }, error: userError } = await supabaseServer.auth.getUser(token);
    if (!user || userError) {
      return new Response(JSON.stringify({ message: 'Utente non autenticato' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3️⃣ Ricevi formData
    const formData = await req.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const category = formData.get('category');
    const imageFile = formData.get('image');

    if (!title || !content || !category || !imageFile) {
      return new Response(JSON.stringify({ message: 'Compila tutti i campi obbligatori' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4️⃣ Carica immagine su Storage
    const fileName = `${Date.now()}-${imageFile.name}`;
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());

    const { error: uploadError } = await supabaseServer.storage
      .from('posts')
      .upload(`images/${fileName}`, fileBuffer, { cacheControl: '3600', upsert: true });

    if (uploadError) throw uploadError;

    // 5️⃣ URL pubblico immagine
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/images/${fileName}`;

    // 6️⃣ Prendi il nome reale dell’utente dalla tabella profiles
    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    const userName = profile?.name || null; // rimane null se non c’è

    // 7️⃣ Inserimento nel DB
    const { error: insertError } = await supabaseServer.from('posts').insert([{
      title,
      content,
      category,
      user_id: user.id,
      user_name: userName,
      image_url: publicUrl,
    }]);

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ message: 'Post creato con successo!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message || 'Errore server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'wines';

    const { data, error } = await supabaseServer
      .from('posts')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ posts: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json({ error: "ID post mancante" }, { status: 400 });
    }

    // Supabase delete
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error("Errore eliminazione Post:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Post eliminato con successo" });
  } catch (err) {
    console.error("Errore server:", err);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}