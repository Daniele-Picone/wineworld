import styles from './MainLayout.css';
import Header from "@/app/components/organism/Header";
import Footer from "@/app/components/organism/Footer";
import FloatingWineChat from "@/app/components/organism/FloatingWineChat";

export default function MainLayout({ children }) {
  return (
    <div >
      <Header />
      <main  className='main_layout' >{children}</main>
      <Footer />
      <FloatingWineChat />
    </div>
  );
}
