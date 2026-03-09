// components/CardsSection.jsx
import './CardsSection.css';

export default function CardsSection() {
  const cards = [
    {
      title: "Denominazioni",
      desc: "Scopri le principali denominazioni e le caratteristiche dei vini italiani.",
      img: "/docgimage.png",
      link: "/docg"
    },
    {
      title: "Il Mondo Del Vino",
      desc: " Approfondisci il terroir e le caratteristiche che rendono unico ogni vino.",
      img: "/ilmondodelvinoimage.png",
      link: "/wineworld"
    },
    {
      title: "Il Vino",
      desc: "Esplora i segreti della vinificazione e le tecniche che trasformano l’uva in vino.",
      img: "/ilvinoimage.png",
      link: "/wine"
    },
    // {
    //   title: "La deguastazione",
    //   desc: "Guida pratica alla degustazione e consigli dei sommelier.",
    //   img: "/degustazioneimage.png",
    //   link: "#"
    // },
  ];

  return (
   
<section id="cards_section">
  <div className='cardsTitle'>
    <h2>Scopri le nostre categorie</h2>
  </div>
  <div className="cards_container">
    {cards.map((card, i) => (
      <div key={i} className="card">
        <img src={card.img} alt={card.title} />
        <h3>{card.title}</h3>
        <p>{card.desc}</p>
        <a href={card.link} className="card_button">Scopri</a>
      </div>
    ))}
  </div>
</section>
      
  );
}