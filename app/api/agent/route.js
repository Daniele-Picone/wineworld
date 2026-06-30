import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const secret = req.headers.get("x-agent-secret");
    if (secret !== process.env.AGENT_SECRET_TOKEN) {
      return NextResponse.json({ message: "Non autorizzato" }, { status: 401 });
    }

    const { title, content, category, meta_description } = await req.json();

    if (!title || !content || !category) {
      return NextResponse.json({ message: "Campi obbligatori mancanti" }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const { error } = await supabaseServer.from("posts").insert([{
      title,
      slug,
      content,
      category,
      user_id: null,
      user_name: "WineWorld Agent",
      image_url: null,
      meta_description: meta_description || null,
    }]);

    if (error) throw error;

    return NextResponse.json({ message: "✅ Post pubblicato!" });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}