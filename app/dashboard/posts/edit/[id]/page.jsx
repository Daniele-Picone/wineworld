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
  const [compressing, setCompressing] = useState(false);
  const [message, setMessage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  // 🧪 Test bucket all'avvio (DEBUG)
  useEffect(() => {
    const testBucket = async () => {
      try {
        // Test 1: Lista buckets
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        console.log("📦 Buckets disponibili:", buckets?.map(b => b.name || b.id));
        console.log("❌ Errore buckets:", bucketsError);
        
        // Test 2: Verifica bucket specifico 'posts'
        const { data: files, error: filesError } = await supabase.storage
          .from('posts')
          .list('images');
        console.log("📁 Files in posts/images:", files);
        console.log("❌ Errore files:", filesError);
        
        // Test 3: Verifica sessione
        const { data: { session } } = await supabase.auth.getSession();
        console.log("👤 Utente autenticato:", session?.user?.email);
        console.log("🔑 Token presente:", !!session?.access_token);
      } catch (err) {
        console.error("❌ Errore test bucket:", err);
      }
    };

    if (!loading && post) {
      testBucket();
    }
  }, [loading, post]);

  /**
   * 🗜️ Funzione di compressione lato client
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
      
      setNewImage(compressedFile);
      
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

      // 🔹 Se l'utente ha caricato una nuova immagine (già compressa)
      if (newImage) {
        console.log("🚀 Inizio upload immagine...");
        console.log("📄 File:", {
          name: newImage.name,
          type: newImage.type,
          size: `${(newImage.size / 1024 / 1024).toFixed(2)}MB`
        });

        // Verifica sessione
        const { data: { session } } = await supabase.auth.getSession();
        console.log("🔐 Sessione:", {
          user: session?.user?.email,
          hasToken: !!session?.access_token
        });

        if (!session?.access_token) {
          throw new Error("Sessione non valida. Effettua nuovamente il login.");
        }

        const fileName = `${Date.now()}_${newImage.name}`;
        console.log("📤 Upload del file in posts/images/:", fileName);

        // ✅ Upload nella cartella 'images' del bucket 'posts'
        const { data: uploadData, error: imgError } = await supabase.storage
          .from("posts")
          .upload(`images/${fileName}`, newImage, {
            cacheControl: '3600',
            upsert: false
          });

        if (imgError) {
          console.error("❌ Errore upload dettagliato:", {
            message: imgError.message,
            statusCode: imgError.statusCode,
            error: imgError
          });
          throw new Error(`Upload fallito: ${imgError.message}`);
        }

        console.log("✅ Upload completato:", uploadData);

        // ✅ Ottieni URL pubblico dalla cartella images
        const { data: urlData } = supabase.storage
          .from("posts")
          .getPublicUrl(`images/${fileName}`);
        
        updates.image_url = urlData.publicUrl;
        console.log("🔗 URL pubblico:", urlData.publicUrl);
      }

      console.log("💾 Salvataggio updates:", updates);
      const { error } = await supabase.from("posts").update(updates).eq("id", id);
      if (error) throw error;

      setMessage("✅ Articolo aggiornato con successo!");
      setTimeout(() => {
        router.push(`/dashboard/posts/${post.category}`);
      }, 1500);
    } catch (err) {
      console.error("❌ Errore completo:", err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setSaving(false);
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
        <div className="image-upload-section">
          {/* Mostra immagine corrente se non c'è preview */}
          {!imagePreview && post.image_url && (
            <div className="image-preview current-image">
              <p className="image-label">📸 Immagine attuale:</p>
              <img src={post.image_url} alt="Anteprima corrente" />
            </div>
          )}

          {/* Mostra nuova immagine compressa */}
          {imagePreview && (
            <div className="image-preview new-image">
              <p className="image-label">🆕 Nuova immagine (compressa):</p>
              <img src={imagePreview} alt="Nuova anteprima" />
              <button
                type="button"
                onClick={() => {
                  setNewImage(null);
                  setImagePreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                  setMessage("");
                }}
                className="remove-image-btn"
              >
                ❌ Rimuovi nuova immagine
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={compressing}
          />
          
          {compressing && <p className="compressing-text">🗜️ Compressione in corso...</p>}
        </div>

        <label>Contenuto</label>
        <ReactQuill
          theme="snow"
          value={post.content}
          onChange={(val) => setPost({ ...post, content: val })}
          placeholder="Modifica il contenuto dell'articolo..."
        />

        <div className="form-buttons">
          <button type="submit" disabled={saving || compressing}>
            {saving ? "💾 Salvataggio..." : compressing ? "🗜️ Compressione..." : "💾 Salva modifiche"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => router.back()}
            disabled={saving || compressing}
          >
            ↩️ Annulla
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}