import './Footer.css';
import Link from 'next/link';

export default function footer(){
    return(
        <footer>
              <div className="foterLinks">
            <ul>
               <li><Link href='/privacy/'>Policy Privacy</Link></li>

            </ul>
           </div>
            <h1> @2025 tutti i diritti sono rieservati alla pagina WineWord .</h1>
        </footer>
    )
}