"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/lib/db"; // Cambiato da @/lib/db
import './page.css';
import Link from "next/link";

export default function RegisterPage() {
  const { login } = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // 1. Registrazione utente su Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name: name // Salva il nome nei metadata
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // 2. Crea il profilo manualmente (fallback se il trigger non funziona)
      if (signUpData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert([
            {
              id: signUpData.user.id,
              role: "user",
              name: name
            }
          ], { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });

        if (profileError) {
          console.error("Errore creazione profilo:", profileError);
          // Non blocchiamo la registrazione, ma logghiamo l'errore
        }
      }

      // 3. Controlla se Supabase richiede conferma email
      if (signUpData.user && !signUpData.session) {
        setMessage("Registrazione completata! Controlla la tua email per confermare l'account.");
        setLoading(false);
        // Redirect alla pagina di login dopo 3 secondi
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      // 4. Se la sessione è già attiva (conferma email disabilitata)
      if (signUpData.session && signUpData.user) {
        // Recupera il profilo appena creato
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", signUpData.user.id)
          .single();

        if (profileError) {
          console.error("Errore nel recupero del profilo:", profileError);
        }

        // 5. Prepara i dati utente
        const userData = {
          id: signUpData.user.id,
          email: signUpData.user.email,
          name: name,
          role: profileData?.role || "user"
        };

        // 6. Salva nel contesto
        login(userData, signUpData.session.access_token);

        // 7. Redirect
        setMessage("Registrazione completata con successo!");
        setTimeout(() => router.push("/profile"), 1500);
      }

    } catch (err) {
      console.error("Errore registrazione:", err);
      setError("Errore durante la registrazione. Riprova.");
      setLoading(false);
    }
  };

  return (
    <div className="login_page"> 
      <div className="login_page_img">
        <img src="/loginimg.jpg" alt="foto vigna" />
      </div>

      <div className="login_page_form">
        <Link className="form_back_hm" href="/">Torna alla home</Link>
        
        <form onSubmit={handleSubmit} className="login_form">
          <div className="login_form_title">
            <h1>Registrati</h1>
          </div>

          <div className="login_form_inputs">
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              minLength={2}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password (min 6 caratteri)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
            <Link className="form_back_hm" href="/login">Hai già un account?</Link>
          </div>

          <button className="login_btn" type="submit" disabled={loading}>
            {loading ? "Caricamento..." : "Registrati"}
          </button>
        </form>

        {error && <p className="login_error" style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
      </div>
    </div>
  );
}