import styles from './MainLayout.css';
import Header from "@/app/components/organism/Header";
import Footer from "@/app/components/organism/Footer";

export default function MainLayout({ children }) {
  return (
    <div >
      <Header />
      <main  className='main_layout' >{children}</main>
      <Footer />
    </div>
  );
}
