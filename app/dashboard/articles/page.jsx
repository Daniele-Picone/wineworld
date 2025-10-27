"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/app/context/UserContext";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "./page.css";
import DashboardLayout from "../components/layout/dashboardLayout";
import { supabase } from "@/lib/db";
import Loader from "@/app/components/molecules/Loader";

// ✅ CRITICAL: Import dinamico per evitare errori SSR
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return RQ;
  },
  { 
    ssr: false,
    loading: () => <div>Loading...</div>
  }
);

export default function PostForm() {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("blog");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const fileInputRef = useRef(null);

  const categories = ["wines", "wineworld", "blog"];

  useEffect(() => {
    if (user?.role === "admin") {
      setIsAdmin(true);
      setCategory("wines");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!title || !content || !category) {
      setMessage("❌ Compila tutti i campi obbligatori.");
      setLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Utente non autenticato");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      if (image) {
        formData.append("image", image);
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Errore server");

      setTitle("");
      setContent("");
      setCategory(isAdmin ? "wines" : "blog");
      setImage(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setMessage(`✅ ${data.message}`);

    } catch (err) {
      console.error(err);
      setMessage(`❌ Errore durante la pubblicazione: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loader />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="post-form">
        <h2>Nuovo Post</h2>

        {message && <p className="message">{message}</p>}

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titolo"
          required
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">-- Seleziona categoria --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="Scrivi qui il tuo contenuto..."
        />

        <button type="submit" disabled={loading}>
          {loading ? "Caricamento..." : "Pubblica"}
        </button>
      </form>
    </DashboardLayout>
  );
}