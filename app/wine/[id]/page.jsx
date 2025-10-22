import { supabase } from "@/lib/db";
import MainLayout from "@/app/components/layouts/MainLayout";
import './page.css';
import Link from "next/link";
export default async function WineDetail({ params }) {
  const { id } = params;

  // Prende il singolo post dal database
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
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
      <p className="wine-content">{post.content}</p>
      <p className="wine-author">Autore: {post.user_name}</p>
      <div className="wine-back">
        <Link href="/wine" className="back-btn">
          ← Torna ai vini
        </Link>
      </div>
    </div>
    </MainLayout>
  );
}
