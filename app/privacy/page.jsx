// pages/privacy.jsx
import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../components/layouts/MainLayout';
import './page.css';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - WineWorld</title>
        <meta name="description" content="Privacy Policy del sito WineWorld" />
      </Head>
      <MainLayout>
        <main style={{ fontSize:'1.5rem',  maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
        <h1 className='policeTitle' >Privacy Policy di WineWorld</h1>
        <p><strong>Ultimo aggiornamento:</strong> 28 ottobre 2025</p>

        <h2>1. Titolare del trattamento</h2>
        <p>
          Il sito <strong>WineWorld</strong> (<a href="https://wineworldweb.it">wineworldweb.it</a>) è gestito da <strong>[Daniele Picone]</strong>.<br />
          Contatti: <a href="mailto:18981130@aruba.it">18981130@aruba.it</a>
        </p>

       <h2>2. Tipologia di dati raccolti</h2>
<ul>
  <li>
    <strong>Dati di interazione (Chat):</strong> Il sito mette a disposizione un assistente virtuale (WeWino). I messaggi inseriti dall'utente nella chat vengono trasmessi a fornitori terzi esclusivamente per l'elaborazione della risposta in tempo reale. Non vengono raccolti né memorizzati dati identificativi (nomi, email, indirizzi IP) sui nostri server, a meno che l'utente non li inserisca volontariamente nel testo della conversazione.
  </li>
  <li><strong>Account:</strong> Non sono previsti sistemi di login o registrazione di dati personali.</li>
 <li>
  <strong>Cookie e strumenti di tracciamento:</strong> Il sito <strong>non utilizza cookie di profilazione</strong>. 
  Vengono utilizzati strumenti di analisi statistica (Vercel Analytics) che operano in modalità anonima, senza l'uso di cookie e senza raccogliere dati che possano identificare direttamente l'utente (come indirizzi IP completi o nomi).
</li>
</ul>

<h2>3. Finalità del trattamento</h2>
<p>
  Il sito ha scopo <strong>esclusivamente informativo</strong>. Il trattamento dei dati avviene per le seguenti finalità:
</p>
<ul>
  <li><strong>Servizio di assistenza AI:</strong> Fornire consigli sugli abbinamenti cibo-vino in tempo reale tramite modelli linguistici avanzati.</li>
  <li><strong>Contatti:</strong> Eventuali dati inviati volontariamente tramite form o email vengono utilizzati solo per rispondere alle richieste dell’utente.</li>
</ul>

<h2>4. Modalità del trattamento e Terze Parti</h2>
<p>
  I dati sono trattati in forma elettronica in maniera <strong>riservata e sicura</strong>.
</p>
<p>
  <strong>Elaborazione dati tramite Terze Parti:</strong> Per il funzionamento della chat, il servizio utilizza le API di <strong>Google Generative AI (Google LLC)</strong>. Google riceve il testo del messaggio per generare la risposta e potrebbe trattare tali dati secondo i propri termini di servizio. 
  Ti invitiamo caldamente a <strong>non inserire dati sensibili o personali</strong> all'interno della chat.
</p>

<h2>5. Diritti degli utenti</h2>
<p>In conformità al GDPR, gli utenti hanno il diritto di richiedere:</p>
<ul>
  <li>Accesso ai propri dati personali inviati tramite contatti diretti.</li>
  <li>Rettifica o cancellazione dei dati (oblio).</li>
  <li>Limitazione o opposizione al trattamento.</li>
  <li>Portabilità dei dati (ove applicabile).</li>
</ul>
<p>Per l'esercizio di tali diritti, l'utente può contattare l'amministratore del sito tramite i recapiti forniti.</p>
        <p>Per esercitare questi diritti, contattare: <a href="mailto:18981130@aruba.it">18981130@aruba.it</a>.</p>

        <h2>6. Modifiche alla privacy policy</h2>
        <p>
          Questa policy può essere aggiornata senza preavviso. Si consiglia di controllare periodicamente la pagina per eventuali modifiche.
        </p>
      </main>
      </MainLayout> 
    </>
  );
}
