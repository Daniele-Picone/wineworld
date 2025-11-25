# 🍷 WineWorld – Discover & Share the World of Wine

WineWorld è una piattaforma dedicata agli appassionati di vino: articoli, approfondimenti, recensioni, curiosità e una dashboard privata per gestire i contenuti.  
Il progetto è realizzato con **Next.js 14**, **React**, **Supabase** e **Vercel**.

---

## 🚀 Tech Stack

**Frontend**
- Next.js 14 (App Router)
- React
- ReactQuill (Editor ricco per gli articoli)
- CSS custom + Tailwind (opzionale)
- Client Components + Server Components

**Backend**
- API Routes di Next.js
- Supabase (Database Postgres + Auth + Storage)
- Middleware per protezione dashboard

**Deploy**
- Vercel
- Vercel Analytics

---

## 📌 Funzionalità principali

### 📰 Gestione Articoli
- Creazione, modifica, eliminazione dei post
- Editor avanzato con formattazione (ReactQuill)
- Upload immagini con compressione client-side
- Categorie: *wines*, *wineworld*, *blog*
- SEO personalizzato per ogni articolo
- Slug automatico

### 🔐 Dashboard con autenticazione
- Login / Logout con Supabase Auth
- Ruolo admin con funzionalità avanzate
- Dashboard privata per gestire i contenuti

### 📸 Gestione immagini ottimizzata
- Compressione automatica delle immagini prima dell’upload
- Storage su Supabase Bucket

### 📊 Analytics integrato
- Vercel Analytics integrato globalmente

### 👍 Sistema di Like / Dislike anonimo
- Salvataggio reazioni anonime su Supabase
- Protezione anti-spam tramite hash IP + localStorage
- Conteggio like/dislike visibile sotto ogni articolo

---

## 📂 Struttura del progetto

