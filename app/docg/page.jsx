const docgList = require('../../data/docg_list.json');
import Link from 'next/link';
import MainLayout from '../components/layouts/MainLayout';
import './page.css';

export default function DocgPage() {
  return (
    <MainLayout>
      <div className="docg-wrapper">
        <div className="docg-header">
          <h1 className="docg-title">DOCG Italiane</h1>
          <p className="docg-subtitle">Le denominazioni di origine controllata e garantita del vino italiano</p>
        </div>

        <div className="docg-regions">
          {docgList.map(region => (
            <section key={region.region} className="docg-region">
              <h2 className="docg-region-title">{region.region}</h2>
              <ul className="docg-list">
                {region.docg.map(docg => (
                  <li key={docg.slug}>
                    <Link href={`/docg/${docg.slug}`} className="docg-link">
                      {docg.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}