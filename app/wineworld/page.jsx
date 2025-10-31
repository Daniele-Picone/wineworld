import { supabase } from "@/lib/db";
import Link from "next/link";
import MainLayout from "../components/layouts/MainLayout";
import "./page.css";

// ✅ Genera i meta tag SEO
export const metadata = {
  title: "Il Mondo del Vino | WineWorld",
  description: "Scopri gli articoli e le curiosità dal mondo del vino su WineWorld.",
  openGraph: {
    title: "Il Mondo del Vino | WineWorld",
    description: "Scopri gli articoli e le curiosità dal mondo del vino su WineWorld.",
    url: "https://www.wineworldweb.it/wineworld",
    siteName: "WineWorld",
    images: [
      {
        url: "/wineworld-preview.jpg", // metti una tua immagine in /public
        width: 1200,
        height: 630,
        alt: "WineWorld - Il mondo del vino",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
};

// ✅ Recupera i post lato server (SEO friendly)
export default async function WineWorldPage() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .ilike("category", "wineworld")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Errore fetching posts:", error);
  }

  return (
    <MainLayout>
      <div className="winepage">
        <h1>Il mondo del vino</h1>

        {(!posts || posts.length === 0) && (
          <p className="message">Nessun post disponibile.</p>
        )}

        <div className="posts-wrapper">
          {posts?.map((post) => (
            <Link key={post.id} href={`/wineworld/${post.slug}`}>
              <div className="post-card">
                <div className="card-img">
                  <img src={post.image_url} alt={post.title} loading="lazy" />
                </div>
                <div className="card-content">
                  <h2>{post.title}</h2>
                </div>
                <div className="card-link">
                  <p>Leggi articolo</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
