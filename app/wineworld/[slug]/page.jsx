import { supabase } from "@/lib/db";
import MainLayout from "@/app/components/layouts/MainLayout";
import Link from "next/link";
import './page.css';

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("posts").select("title, content, image_url, user_name").eq("slug", slug).single();

  if (!post) {
    return {
      title: "Post non trovato",
      description: "L'articolo richiesto non esiste.",
      openGraph: {
        title: "Post non trovato",
        description: "L'articolo richiesto non esiste.",
      },
    };
  }

  return {
    title: post.title,
    description: post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 160),
      images: post.image_url ? [{ url: post.image_url, width: 1200, height: 630, alt: post.title }] : [],
    },
  };
}

function estimateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// ✅ Rimuove soft hyphens e stili inline che causano spezzatura delle parole
function cleanContent(html) {
  return html
    .replace(/&shy;/g, '')
    .replace(/\u00AD/g, '')
    .replace(/style="[^"]*word-break[^"]*"/gi, '')
    .replace(/style="[^"]*hyphens[^"]*"/gi, '');
}

export default async function WineDetail({ params }) {
  const { slug } = await params;

  const { data: post, error } = await supabase.from("posts").select("*").eq("slug", slug).single();

  if (error || !post) {
    return (
      <MainLayout>
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>Post non trovato 🥲</h2>
          <p>{error?.message}</p>
        </div>
      </MainLayout>
    );
  }

  const readingTime = estimateReadingTime(post.content);

  const { data: relatedPosts } = await supabase
    .from("posts").select("id, title, slug, image_url")
    .eq("category", post.category).neq("id", post.id).limit(3)
    .order("created_at", { ascending: false });

  return (
    <MainLayout>
      <div className="wine-detail">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span className="author">Autore: {post.user_name || "Anonimo"}</span> |{" "}
          <span className="reading-time">{readingTime} min di lettura</span>
        </div>

        {post.image_url && (
          <div className="wine-image">
            <img src={post.image_url} alt={post.title} />
          </div>
        )}

        {/* ✅ cleanContent applicato qui */}
        <div
          className="wine-content"
          dangerouslySetInnerHTML={{ __html: cleanContent(post.content) }}
        />

        <div className="wine-back">
          <Link href="/wineworld" className="back-btn">
            ← Torna alla sezione vini
          </Link>
        </div>
      </div>

      {relatedPosts?.length > 0 && (
        <div className="related-posts-outer">
          <h3>Articoli correlati</h3>
          <div className="related-wrapper">
            {relatedPosts.map((r) => (
              <Link key={r.id} href={`/wineworld/${r.slug}`}>
                <div className="related-card">
                  {r.image_url && (
                    <div className="related-img">
                      <img src={r.image_url} alt={r.title} />
                    </div>
                  )}
                  <p>{r.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
}