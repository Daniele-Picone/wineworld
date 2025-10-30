"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/db";
import DashboardLayout from "../../../components/layout/dashboardLayout";
import Loader from "@/app/components/molecules/Loader";
import "react-quill-new/dist/quill.snow.css";
import "./page.css";

// ✅ Import dinamico per ReactQuill (evita errori SSR)
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return RQ;
  },
  {
    ssr: false,
    loading: () => <div>Caricamento editor...</div>,
  }
);

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [newImage, setNewImage] = useState(null);

  const categories = ["wines", "wineworld", "blog"];

  // 🔹 Carica il post esistente
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Errore caricamento:", error);
      setPost(data);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  // 🔹 Gestione salvataggio modifiche
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      const updates = {
        title: post.title,
        content: post.content,
        category: post.category,
      };

      // 🔹 Se l’utente ha caricato una nuova immagine
      if (newImage) {
        const fileName = `${Date.now()}_${newImage.name}`;
        const { error: imgError } = await supabase.storage
          .from("post-images")
          .upload(fileName, newImage);

        if (imgError) {
          setMessage(`❌ Errore upload immagine: ${imgError.message}`);
          setSaving(false);
          return;
        }

        const { data } = supabase.storage.from("post-images").getPublicUrl(fileName);
        updates.image_url = data.publicUrl;
      }

      const { error } = await supabase.from("posts").update(updates).eq("id", id);
      if (error) throw error;

      setMessage("✅ Articolo aggiornato con successo!");
      setTimeout(() => {
        router.push(`/dashboard/posts/${post.category}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage(`❌ Errore durante l'aggiornamento: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
     {message && (
  <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>
    {message}
  </div>
)}
      <form onSubmit={handleSave} className="post-form">
        <h2>✏️ Modifica Articolo</h2>

   

        <label>Titolo</label>
        <input
          type="text"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          placeholder="Titolo articolo"
          required
        />

        <label>Categoria</label>  
        <select
          value={post.category}
          onChange={(e) => setPost({ ...post, category: e.target.value })}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>Immagine principale</label>
        {post.image_url && (
          <div className="image-preview">
            <img src={post.image_url} alt="Anteprima" width="200" />
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
        />

        <label>Contenuto</label>
        <ReactQuill
          theme="snow"
          value={post.content}
          onChange={(val) => setPost({ ...post, content: val })}
          placeholder="Modifica il contenuto dell’articolo..."
        />

        <div className="form-buttons">
          <button type="submit" disabled={saving}>
            {saving ? "💾 Salvataggio..." : "💾 Salva modifiche"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => router.back()}
          >
            ↩️ Annulla
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
