"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/lib/db";
import Link from "next/link";
import './page.css';

export default function LoginPage() {
  const { login } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Login con Supabase Auth
      const { data: loginData, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // 2. Recupera il profilo con il ruolo
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", loginData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Errore profilo:", profileError);
        setError("Errore nel recupero del profilo.");
        setLoading(false);
        return;
      }

      // 3. Prepara i dati utente per il contesto
      const userData = {
        id: loginData.user.id,
        email: loginData.user.email,
        name: loginData.user.user_metadata?.name || loginData.user.email,
        role: profileData?.role || "user"
      };

      // 4. Salva nel contesto (il token lo gestisce Supabase)
      login(userData, loginData.session.access_token);

      // 5. Redirect in base al ruolo
      if (userData.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/profile");
      }

    } catch (err) {
      console.error("Errore login:", err);
      setError("Errore durante il login. Riprova.");
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
            <h1>Login</h1>
          </div>

          <div className="login_form_inputs">
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <Link className="form_back_hm" href="/register">Non sei ancora registrato?</Link>
          </div>

          <button className="login_btn" type="submit" disabled={loading}>
            {loading ? "Caricamento..." : "Login"}
          </button>
        </form>

        {error && <p className="login_error">{error}</p>}
      </div>
    </div>
  );
}