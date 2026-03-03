// app/wineworld/page.jsx
import { supabase } from "@/lib/db";
import Link from "next/link";
import MainLayout from "../components/layouts/MainLayout";
import "./page.css";

export async function generateMetadata() {
  return {
    title: "WineWorld - Il mondo del vino e del terroir",
    description:
      "Scopri articoli dedicati al vino, al terroir e alle infinite sfumature che definiscono ogni bottiglia.",
    openGraph: {
      title: "WineWorld - Il mondo del vino",
      description: "Approfondimenti sul terroir, sul vino e il dietro le quinte della produzione.",
      images: [{ url: "/ilmondodelvinoimage.png" }],
    },
  };
}

export default async function WineWorldPage() {
  // fetch lato server, senza loader
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .ilike("category", "wineworld")
    .order("created_at", { ascending: false });

  return (
    <MainLayout>
      <div className="winepage">
        {/* Sezione introduttiva */}
        <div className="winepageIntro">
          <div className="winpageIntroContent">
            <div className="winepagetext">
              <h4>Avete mai sentito parlare di Terroir?</h4>
              <p>
                Molto spesso il termine viene tradotto dal francese come
                “terreno”, ma nel mondo del vino il suo significato è
                decisamente più ampio. Non riguarda soltanto la terra su cui
                cresce la vite, bensì l’insieme di condizioni che contribuiscono
                a definire l’identità di un vino.
              </p>
              <p>
                Quando si parla di terroir si fa riferimento a fattori come il
                tipo di suolo, il clima, l’altitudine, l’esposizione al sole e
                le escursioni termiche. Tutti questi elementi influenzano la
                maturazione dell’uva e incidono sugli aromi, sulla struttura e
                sull’equilibrio finale nel calice.
              </p>
              {/* ... altri paragrafi ... */}
            </div>
            <div className="winepageimage">
              <img src="/ilmondodelvinoimage.png" alt="WineWorld" />
            </div>
          </div>
        </div>

        {/* Lista articoli */}
        <div className="postsTitle">
          <h4>Scopri i nostri articoli</h4>
        </div>
        <div className="posts-wrapper">
          {!posts || posts.length === 0 ? (
            <p className="message">Nessun post disponibile.</p>
          ) : (
            posts.map((post) => (
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
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}