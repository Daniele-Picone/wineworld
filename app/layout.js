import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/app/context/UserContext";
import { Analytics } from "@vercel/analytics/next";

// ✅ Font setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ SEO + OpenGraph + Favicon + Twitter meta
export const metadata = {
  title: "WineWorld | Scopri il mondo del vino",
  description: "Scopri il meraviglioso mondo del vino con WineWorld: articoli, curiosità e approfondimenti su vini e culture enologiche.",
  keywords: ["vino", "enologia", "cantine", "wineworld", "blog vino", "degustazione", "vini italiani"],
  authors: [{ name: "WineWorld Team" }],
  metadataBase: new URL("https://www.wineworldweb.it"),
  openGraph: {
    type: "website",
    url: "https://www.wineworldweb.it",
    title: "WineWorld | Scopri il mondo del vino",
    description: "Approfondisci il meraviglioso mondo del vino con notizie e curiosità da WineWorld.",
    siteName: "WineWorld",
    locale: "it_IT",
    images: [
      {
        url: "/wineworld-preview.jpg", // 🔥 crea un’immagine 1200x630 con logo + titolo
        width: 1200,
        height: 630,
        alt: "WineWorld - il mondo del vino",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@wineworld", // se hai un account Twitter
    title: "WineWorld | Scopri il mondo del vino",
    description: "Approfondisci il meraviglioso mondo del vino con articoli e curiosità da WineWorld.",
    images: ["/wineworld-preview.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider>
          {children}
        </UserProvider>
        <Analytics />
      </body>
    </html>
  );
}
