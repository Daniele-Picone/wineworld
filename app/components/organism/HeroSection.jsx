
import './HeroSection.css';



export default function HeroSection(){
    return(
        <section className="hero_section">
            <div className="intro_section">
                <div className="intro_content">
                    <h1> Benvenuti in WineWorld</h1> 
                    <p>WineWorld nasce dalla passione per l’arte del vino e dal desiderio di condividere conoscenza e piacere con chiunque voglia avvicinarsi a questo mondo straordinario. Qui troverete informazioni chiare e dettagliate sulle denominazioni di origine, i processi di produzione dei vini, le caratteristiche dei vitigni e molto altro.</p> 
                    <p>Il nostro obiettivo è guidarvi attraverso ogni aspetto dell’esperienza enologica, dalla scelta della bottiglia giusta alla scoperta della figura del sommelier, fino ai consigli per degustazioni consapevoli e momenti indimenticabili.</p>
                    <p>
                            WineWorld è pensato sia per gli appassionati esperti sia per chi muove i primi passi tra i profumi e i sapori del vino. Con un approccio elegante, ma accessibile, vogliamo farvi scoprire storie, territori e tradizioni che rendono ogni calice un piccolo viaggio.
                    </p>
                </div>
                <div className="intro_img">
                    <img src="/homeWine.jpg" alt="Immagine Vigna" /> 
                </div>
            </div>
        </section>
    )
}