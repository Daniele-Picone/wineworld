import Image from "next/image";
import MainLayout from "@/app/components/layouts/MainLayout";
import HeroSection from "@/app/components/organism/HeroSection"
import WineSection from "./components/organism/WineSection";  
import CardsSection from "./components/organism/CardsSection";
import WewinoSection from "./components/organism/WewinoSection";

export const metadata = {
  title: "WineWorld",
  description: "Scopri il meraviglioso mondo del vino con WineWorld.",
   metadataBase: new URL("https://www.wineworldweb.it"),
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
