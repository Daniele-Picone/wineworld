import Image from "next/image";
import MainLayout from "@/app/components/layouts/MainLayout";
import HeroSection from "@/app/components/organism/HeroSection"
import WineSection from "./components/organism/WineSection";  
import CardsSection from "./components/organism/CardsSection";
import WewinoSection from "./components/organism/WewinoSection";

export const metadata = {
  title: "WineWorld | Esplora il mondo del vino",
  description:
    "Esplora il mondo del vino con guide su DOCG, vitigni e territori. Approfondisci la vinificazione e scopri WeWino, il tuo sommelier digitale personale.",
};


export default function Home() {
  return (
    <div>
      <MainLayout>
        <HeroSection />
        <CardsSection />
        {/* <WineSection /> */}
        <WewinoSection />
      </MainLayout>
    </div>
  );
}
