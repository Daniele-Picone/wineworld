

import { supabase } from '@/lib/db';
import Link from 'next/link';
import MainLayout from '../components/layouts/MainLayout';
import  './page.css';


export async function generateMetadata() {
  return {
    title: " Wine || Dal mosto al calice - Scopri come nasce un vino",
    description: "Ogni bottiglia racconta una storia unica: dal mosto alla fermentazione, fino all’imbottigliamento. Scopri le fasi della produzione e le scelte che danno carattere e aroma al vino.",
    openGraph: {
      title: "Wine || Dal mosto al calice - Scopri come nasce un vino",
      description: "Approfondimenti sulle fasi della produzione del vino e sul ruolo del produttore nel definire struttura, aroma e personalità di ogni bottiglia.",
      images: [
        {
          url: "/ilvinoimage.png", // immagine rappresentativa della pagina
        },
      ],
    },
  };
}




export default async function WinesPage() {
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .ilike("category", "wines")
    .order("created_at", { ascending: false });

  

  return (
    <MainLayout>

      <div className="winepage">
        <div className="winepageIntro">
      
        <div className="winpageIntroContent">
         <div className="winepagetext">
<h4>Avete mai pensato a come nasce un vino?</h4>
<p>
  Ogni bottiglia racconta una storia unica, fatta di attenzione ai dettagli e passione.<br/> Il vino prende vita dal mosto e attraversa diverse fasi, dalla fermentazione alla maturazione, fino all’imbottigliamento.
</p>
<p>
  Ogni scelta in cantina — dai tempi di fermentazione alla tipologia di contenitore — influisce su aromi, struttura e personalità del vino. <br/> Anche vigneti vicini possono produrre risultati molto diversi, mostrando la ricchezza delle sfumature possibili.
</p>
<p>
  L’esperienza del produttore completa il quadro: la sensibilità e il rispetto dei tempi naturali permettono al vino di esprimere il proprio carattere autentico.
</p>
<p>
  In questa pagina troverete articoli dedicati a tutte le fasi della produzione, pensati per farvi scoprire il viaggio che trasforma l’uva in un calice pronto da gustare.
</p>

         </div>
         <div className="winepageimage">
          <img src="/ilvinoimage.png" alt="fasi di produzione del vino" />
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
            <Link key={post.id} href={`/wine/${post.slug}`}>
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
