import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/app/context/UserContext";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WineWorld | Guide vino, DOCG, vitigni e sommelier digitale",
  description: "Guide complete su vini, DOCG, vitigni e territori. Scopri tecniche di vinificazione e WeWino, il sommelier digitale per scegliere sempre il vino giusto.",
  metadataBase: new URL("https://www.wineworldweb.it"), 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     <head>
<link rel="icon" href="/favicon.ico" type="image/x-icon" />
  <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

  {/* <!-- PNG Icons per vari dispositivi --> */}
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />

  {/* <!-- Icona per dispositivi Apple --> */}
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

  {/* <!-- Web App Manifest --> */}
  <link rel="manifest" href="/site.webmanifest" />

</head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider>
          {children}
          </UserProvider>
        <Analytics />
      </body>
    </html>
  );
}
