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
        <div className="winepageIntro">
      
        <div className="winpageIntroContent">
         <div className="winepagetext">
     <h4>Avete mai sentito parlare di Terroir?</h4>
     <p>
      Molto spesso il termine viene tradotto dal francese come “terreno”, ma nel mondo del vino il suo significato è decisamente più ampio.<br/> Non riguarda soltanto la terra su cui cresce la vite, bensì l’insieme di condizioni che contribuiscono a definire l’identità di un vino.
      </p>
      <p>
        Quando si parla di terroir si fa riferimento a fattori come il tipo di suolo, il clima, l’altitudine, l’esposizione al sole e le escursioni termiche. <br/>Tutti questi elementi influenzano la maturazione dell’uva e incidono sugli aromi, sulla struttura e sull’equilibrio finale nel calice.</p>
        <p>
          Anche a breve distanza, due vigneti possono dare risultati molto diversi: un terreno argilloso può offrire maggiore corpo, uno calcareo più freschezza, mentre un suolo vulcanico può donare una spiccata mineralità. <br/>Ogni dettaglio contribuisce a creare sfumature uniche.
          </p>
          <p>
            A tutto questo si aggiunge l’esperienza dell’uomo: le scelte agronomiche, il rispetto del territorio e la sensibilità in cantina completano il quadro. <br/> Per questo ogni bottiglia rappresenta l’espressione di un territorio e della mano che lo interpreta in cantina, raccontando la propria storia attraverso profumi, struttura e sfumature aromatiche.
            </p>
           <p>
            In questa pagina troverete articoli dedicati al terroir, pensati per aiutarvi a scoprire e comprendere tutti quei fattori che danno al vino le sue infinite sfumature.
            </p>

         </div>
         <div className="winepageimage">
          <img src="/ilmondodelvinoimage.png" alt="" />
         </div>
        </div>
        </div>
       






       <div className='postsTitle'>
    <h4>Scopri i nostri articoli</h4>
  </div>

        <div className="posts-wrapper">
        {(!posts || posts.length === 0) && (
          <p className="message">Nessun post disponibile.</p>
        )}

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
