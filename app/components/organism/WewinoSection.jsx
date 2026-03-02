
import './Wewinosection.css';

export default function WewinoSection() {
    return(
        <section className="wewino_section">
  <div className="wewino_content">
    <div className="wewino_text">
      <h2> WeWino </h2>
      <p>
        WeWino è l’assistente intelligente di WineWorld, pensato per accompagnarti
        nella scoperta del vino in modo semplice e immediato. Puoi chiedere consigli
        sugli abbinamenti cibo-vino, WeWino ti guiderà con risposte chiare e personalizzate.
      </p>
      <p>
        Che tu sia curioso o appassionato, avrai sempre un sommelier a disposizione.
      </p>
        <p>
            Vuoi un consiglio personalizzato? Clicca sul logo di WeWino in basso a destra e inizia a dialogare con il tuo sommelier digitale.
        </p>
        <p className="wewino_note">
           WeWino utilizza l’intelligenza artificiale per fornire risposte informative. 
           <br />
           Ricorda! non inserire dati personali o sensibili.
        </p>
    </div>

    <div className="wewino_visual">
      <img src="/wewino.png" alt="Assistente digitale WeWino" />
    </div>
  </div>
</section>
    )
}