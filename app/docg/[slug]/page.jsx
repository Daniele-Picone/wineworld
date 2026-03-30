import MainLayout from '../../components/layouts/MainLayout';
import docgList from '../../../data/docg_list.json';
import Image from "next/image";
import styles from './page.module.css';

export async function generateStaticParams() {
  return docgList.flatMap(region =>
    region.docg.map(docg => ({
      slug: docg.slug.toLowerCase(),
    }))
  );
}

export default async function DocgDetail({ params }) {
  const { slug } = await params;
  const normalizedSlug = slug?.toLowerCase().trim();

  const regionFound = docgList.find(region =>
    region.docg.some(docg => docg.slug.toLowerCase() === normalizedSlug)
  );

  const docgFound = regionFound?.docg.find(
    docg => docg.slug.toLowerCase() === normalizedSlug
  );

  const found = docgFound
    ? { ...docgFound, region: regionFound.region }
    : null;

  if (!found) {
    return (
      <MainLayout>
        <p className={styles.notFound}>DOCG non trovata</p>
      </MainLayout>
    );
  }

  const description =
    found.description ||
    `Il ${found.name} DOCG è un vino della regione ${found.region}, apprezzato per il suo legame con il territorio.`;

  return (
    <MainLayout>
      <div className={styles.container}>

        {/* Immagine hero */}
        <div className={styles.imageWrapper}>
          <Image
            src="/imageperslugdocg.png"
            alt={found.name}
            width={700}
            height={400}
            className={styles.image}
          />
          <div className={styles.imageBadge}>{found.region}</div>
        </div>

        {/* Titolo */}
        <h1 className={styles.title}>
          {found.name} <span className={styles.titleBadge}>DOCG</span>
        </h1>

        {/* Quick Info */}
        <div className={styles.quickInfo}>
          <div className={styles.quickInfoItem}>
            <span className={styles.quickInfoLabel}>Regione</span>
            <span className={styles.quickInfoValue}>{found.region}</span>
          </div>
          {found.quickInfo?.vitigno && (
            <div className={styles.quickInfoItem}>
              <span className={styles.quickInfoLabel}>Vitigno</span>
              <span className={styles.quickInfoValue}>{found.quickInfo.vitigno}</span>
            </div>
          )}
          {found.quickInfo?.colore && (
            <div className={styles.quickInfoItem}>
              <span className={styles.quickInfoLabel}>Colore</span>
              <span className={styles.quickInfoValue}>{found.quickInfo.colore}</span>
            </div>
          )}
          {found.quickInfo?.invecchiamento && (
            <div className={styles.quickInfoItem}>
              <span className={styles.quickInfoLabel}>Invecchiamento</span>
              <span className={styles.quickInfoValue}>{found.quickInfo.invecchiamento}</span>
            </div>
          )}
        </div>

        {/* Descrizione */}
        <div className={styles.descriptionBox}>
          <h2 className={styles.descriptionTitle}>Il vino</h2>
          <p className={styles.description}>{description}</p>
        </div>

        {/* Disciplinare */}
       {found.quickInfo?.disciplinare && (
  <div className={styles.disciplinare}>
    <h2 className={styles.disciplinareTitle}>Disciplinare di Produzione</h2>
    <p className={styles.disciplinareText}>
      Consulta o scarica il disciplinare ufficiale del {found.name} DOCG.
    </p>
    <div className={styles.disciplinareActions}>
      <a
        href={found.quickInfo.disciplinare}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.btnView}
      >
        👁 Visualizza PDF
      </a>
      <a
        href={found.quickInfo.disciplinare}
        download
        className={styles.btnDownload}
      >
        ⬇ Scarica PDF
      </a>
    </div>
  </div>
)}

      </div>
    </MainLayout>
  );
}