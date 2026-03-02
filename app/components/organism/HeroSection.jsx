
import Link from 'next/link';
import './HeroSection.css';



export default function HeroSection(){
    return(
        <section className="hero_section">
            <div className="intro_section">
                <div className="intro_content">
                    <h1> Benvenuti in WineWorld</h1> 
                    <p>WineWorld nasce dalla nostra passione per l’arte del vino e dal desiderio di condividere conoscenza, emozioni e piccoli segreti con chiunque voglia esplorare questo mondo straordinario.<br/> Qui troverete informazioni chiare sulle denominazioni, i vitigni e i processi di produzione, insieme a consigli pratici per degustazioni consapevoli.
                     <br/>  Che siate appassionati esperti o curiosi alle prime esperienze, vogliamo accompagnarvi alla scoperta di storie, territori e tradizioni, trasformando ogni calice in un piccolo viaggio da vivere con piacere.</p> 
                <Link className='intro_content_button' href="/CardsSection">Scopri di più</Link>
                </div>

                <div className="intro_img">
                    <img src="/homeWine.jpg" alt="Immagine Vigna" /> 
                </div>
            </div>
        </section>
    )
}