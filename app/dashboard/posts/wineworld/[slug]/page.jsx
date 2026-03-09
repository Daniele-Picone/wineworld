import { supabase } from "@/lib/db";
import './page.css';
import Link from "next/link";
import DashboardLayout from "../../../components/layout/dashboardLayout";


export default async function WineDetail({ params }) {
  const { slug } = await params;


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
    <DashboardLayout>

    <div className="wine-detail">
      <h1>{post.title}</h1>
      <div className="wine-image">
        <img src={post.image_url} alt={post.title} />
      </div>
      <div className="wine-content" dangerouslySetInnerHTML={{ __html: post.content }}/>
      <p className="wine-author">Autore: {post.user_name}</p>
      <div className="wine-back">
        <Link href="/dashboard/posts/wineworld" className="back-btn">
          ← Torna alla sezione vini 
        </Link>
        <Link href={`/dashboard/posts/edit/${post.id}`} className="edit-btn">
            ✏️ Modifica
          </Link>
      </div>
      
    </div>
    </DashboardLayout>
  );
}
