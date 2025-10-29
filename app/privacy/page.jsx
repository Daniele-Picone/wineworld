// pages/privacy.jsx
import Head from 'next/head';
import Link from 'next/link';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - WineWorld</title>
        <meta name="description" content="Privacy Policy del sito WineWorld" />
      </Head>
      <main style={{ fontSize:'1.5rem',  maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
        <h1>Privacy Policy di WineWorld</h1>
        <p><strong>Ultimo aggiornamento:</strong> 28 ottobre 2025</p>

        <h2>1. Titolare del trattamento</h2>
        <p>
          Il sito <strong>WineWorld</strong> (<a href="https://wineworldweb.it">wineworldweb.it</a>) è gestito da <strong>[Daniele Picone]</strong>.<br />
          Contatti: <a href="mailto:18981130@aruba.it">18981130@aruba.it</a>
        </p>

        <h2>2. Tipologia di dati raccolti</h2>
        <ul>
          <li><strong>Dati raccolti direttamente dagli utenti:</strong> Nessuno, se non tramite eventuali form di contatto.</li>
          <li><strong>Cookie e strumenti di tracciamento:</strong> Il sito <strong>non utilizza cookie né strumenti di analisi</strong>.</li>
        </ul>

        <h2>3. Finalità del trattamento</h2>
        <p>
          Il sito è <strong>solo informativo</strong> e non raccoglie dati personali, tranne eventuali informazioni inviate volontariamente tramite contatto diretto.<br />
          Eventuali dati inviati tramite form vengono utilizzati solo per rispondere alla richiesta dell’utente.
        </p>

        <h2>4. Modalità del trattamento</h2>
        <p>
          I dati eventualmente raccolti sono trattati in forma elettronica, in maniera <strong>riservata e sicura</strong>, e <strong>non sono condivisi con terze parti</strong>.
        </p>

        <h2>5. Diritti degli utenti</h2>
        <p>Gli utenti hanno diritto a:</p>
        <ul>
          <li>Accesso ai propri dati</li>
          <li>Rettifica o cancellazione dei dati</li>
          <li>Limitazione o opposizione al trattamento</li>
          <li>Portabilità dei dati</li>
        </ul>
        <p>Per esercitare questi diritti, contattare: <a href="mailto:18981130@aruba.it">18981130@aruba.it</a>.</p>

        <h2>6. Modifiche alla privacy policy</h2>
        <p>
          Questa policy può essere aggiornata senza preavviso. Si consiglia di controllare periodicamente la pagina per eventuali modifiche.
        </p>

        <Link style={{fontSize:"1.6rem", textTransform:'uppercase', color:'blue' }} href="/" >torna alla home </Link>
      </main>
    </>
  );
}
