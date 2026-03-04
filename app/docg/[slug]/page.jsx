// app/docg/[slug]/page.jsx
import MainLayout from '../../components/layouts/MainLayout';
import docgList from '../../../data/docg_list.json';

export default function DocgDetail({ params }) {
  const { slug } = params;

  // Trova la DOCG corrispondente allo slug
  let found = null;
  docgList.forEach(region => {
    region.docg.forEach(docg => {
      if (docg.slug === slug) {
        found = { ...docg, region: region.region };
      }
    });
  });

  if (!found) return(


     <MainLayout>
      <p style={{ padding: '2rem' }}> DOCG non trovata</p>;

    </MainLayout>


  ) 

  return (
    <MainLayout>
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#7a2f2f', marginBottom: '1rem' }}>{found.name}</h1>
      <p><strong>Regione:</strong> {found.region}</p>
      {found.grape && <p><strong>Vitigno principale:</strong> {found.grape}</p>}
      {found.style && <p><strong>Tipologia:</strong> {found.style}</p>}
      {found.description && <p>{found.description}</p>}
    </div>
  </MainLayout>
  );
}