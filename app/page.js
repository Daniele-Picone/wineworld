import Image from "next/image";
import MainLayout from "@/app/components/layouts/MainLayout";
import HeroSection from "@/app/components/organism/HeroSection"
import CardsSection from "./components/organism/CardsSection";


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

      </MainLayout>
    </div>
  );
}
