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
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const fileInputRef = useRef(null);
  const categories = ["wines", "wineworld", "blog"];

  useEffect(() => {
    if (user?.role === "admin") {
      setIsAdmin(true);
      setCategory("wines");
    }
  }, [user]);

  /**
   * 🎯 Funzione di compressione lato client
   */
  const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          // 📐 Dimensioni massime
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          
          let width = img.width;
          let height = img.height;
          
          // Calcola proporzioni mantenendo aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Disegna l'immagine ridimensionata
          ctx.drawImage(img, 0, 0, width, height);
          
          // 📦 Converti in blob con qualità ridotta
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Crea un nuovo File object
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.\w+$/, ".jpg"),
                  {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  }
                );
                resolve(compressedFile);
              } else {
                reject(new Error("Errore nella compressione"));
              }
            },
            "image/jpeg",
            0.8 // 80% qualità
          );
        };
        
        img.onerror = () => reject(new Error("Errore nel caricamento immagine"));
        img.src = e.target.result;
      };
      
      reader.onerror = () => reject(new Error("Errore nella lettura del file"));
      reader.readAsDataURL(file);
    });
  };

  /**
   * 📁 Gestisce la selezione e compressione del file
   */
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verifica che sia un'immagine
    if (!file.type.startsWith("image/")) {
      setMessage("❌ Seleziona un file immagine valido");
      return;
    }

    // Verifica dimensione originale (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage("❌ L'immagine è troppo grande (max 10MB)");
      return;
    }

    try {
      setCompressing(true);
      const originalSize = file.size;
      
      // 🗜️ Comprimi l'immagine
      const compressedFile = await compressImage(file);
      const compressedSize = compressedFile.size;
      
      // Calcola riduzione percentuale
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      
      setImage(compressedFile);
      
      // Crea preview
      const preview = URL.createObjectURL(compressedFile);
      setImagePreview(preview);
      
      setMessage(
        `✅ Immagine ottimizzata: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB (-${reduction}%)`
      );
    } catch (err) {
      console.error(err);
      setMessage("❌ Errore durante la compressione dell'immagine");
    } finally {
      setCompressing(false);
    }
  };

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
        formData.append("image", image); // 🎯 Invia l'immagine già compressa
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
      setImagePreview(null);
      
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

  // 🧹 Cleanup preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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

        <div className="image-upload-section">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={compressing}
          />
          
          {compressing && <p className="compressing-text">🗜️ Compressione in corso...</p>}
          
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                  setMessage("");
                }}
                className="remove-image-btn"
              >
                ❌ Rimuovi immagine
              </button>
            </div>
          )}
        </div>

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

        <button type="submit" disabled={loading || compressing}>
          {loading ? "Caricamento..." : compressing ? "Compressione..." : "Pubblica"}
        </button>
      </form>
    </DashboardLayout>
  );
}