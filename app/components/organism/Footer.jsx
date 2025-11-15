import './Footer.css';
import Link from 'next/link';
import { TiSocialFacebookCircular } from "react-icons/ti";
import { TiSocialInstagramCircular } from "react-icons/ti";
import { TiSocialPinterestCircular } from "react-icons/ti";
import { TiSocialLinkedinCircular } from "react-icons/ti";
import { TiSocialTwitterCircular } from "react-icons/ti";

export default function footer(){
    return(
        <footer>
            <div className="footerLinks">
            <div className="utility-links">
                <div className="utility">
                    <h4>Link utili</h4>
                </div>
                <div className="links">
                    <Link href='/privacy/'>Policy Privacy</Link>
                </div>
            
            </div>

            
            
            <div className='footer-socials'>
                <div className="follow">
                    <h4>Seguici anche </h4>
                </div>
                <div className="solcials-links">
                <Link href='https://www.instagram.com/wineworldweb.it/' className='social' > <TiSocialInstagramCircular /></Link>
            <Link href='https://www.facebook.com/profile.php?id=61583979324726' className='social'> <TiSocialFacebookCircular /> </Link>
            <Link href='https://www.linkedin.com/in/daniele-picone-9218122b2/' className='social'> <TiSocialLinkedinCircular /> </Link>
            <Link href='https://www.pinterest.com/wineworldwebit/'className='social' > <TiSocialPinterestCircular /> </Link>
            <Link href='https://x.com/wineworldweb' className='social'>  <TiSocialTwitterCircular /></Link>
                </div>

            </div>


        </div>
            <h1 className='copyright' > @2025 tutti i diritti sono rieservati alla pagina WineWordweb.it .</h1>
        </footer>
    )
}
