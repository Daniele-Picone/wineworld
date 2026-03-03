import { supabase } from "@/lib/db";
import MainLayout from "@/app/components/layouts/MainLayout";
import './page.css';
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("posts")
    .select("title, content")
    .eq("slug", slug)
    .single();

  if (!post) return { title: "Post non trovato" };

  return {
    title: post.title,
    description: post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 160),
    },
  };
}

export default async function WineDetail({ params }) {
  const { slug } = await params; // <-- risolvi anche qui

  // Prende il singolo post dal database
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !post) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Post non trovato 🥲</h2>
        <p>{error?.message}</p>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="wine-detail">
        <h1>{post.title}</h1>
        <div className="wine-image">
          <img src={post.image_url} alt={post.title} />
        </div>
        <div
          className="wine-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <p className="wine-author">Autore: Daniele Picone</p>
        <div className="wine-back">
          <Link href="/wineworld" className="back-btn">
            ← Torna alla sezione vini 
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}