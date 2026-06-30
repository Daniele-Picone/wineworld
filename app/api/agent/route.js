import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-agent-secret",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const secret = req.headers.get("x-agent-secret");
    if (secret !== process.env.AGENT_SECRET_TOKEN) {
      return NextResponse.json({ message: "Non autorizzato" }, { status: 401, headers: corsHeaders });
    }

    const { title, content, category, meta_description } = await req.json();

    if (!title || !content || !category) {
      return NextResponse.json({ message: "Campi obbligatori mancanti" }, { status: 400, headers: corsHeaders });
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

    return NextResponse.json({ message: "Post pubblicato" }, { headers: corsHeaders });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500, headers: corsHeaders });
  }
}