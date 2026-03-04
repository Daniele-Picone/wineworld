// app/docg/page.jsx
import docgList from '../../data/docg_list.json';
import Link from 'next/link';
import MainLayout from '../components/layouts/MainLayout';

export default function DocgPage() {
  return (
    <MainLayout>


    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#7a2f2f', marginBottom: '2rem', fontSize: '2.5rem', textAlign: 'center' }}>
        DOCG Italiane
      </h1>

      {docgList.map(region => (
        <section key={region.region} style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: '#a0522d', marginBottom: '1rem', borderBottom: '2px solid #a0522d', paddingBottom: '0.3rem' }}>
            {region.region}
          </h2>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {region.docg.map(docg => (
              <li key={docg.slug} style={{ marginBottom: '0.5rem' }}>
                <Link
                  href={`/docg/${docg.slug}`}
                  style={{
                    textDecoration: 'none',
                    color: '#7a2f2f',
                    fontWeight: '600',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    transition: 'background 0.2s',
                  }}
                >
                  {docg.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
      </MainLayout>
  );
}