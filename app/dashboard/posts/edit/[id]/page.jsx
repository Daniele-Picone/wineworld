"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import DOMPurify from "isomorphic-dompurify";
import { supabase } from "@/lib/db";
import DashboardLayout from "../../../components/layout/dashboardLayout";
import Loader from "@/app/components/molecules/Loader";
import "react-quill-new/dist/quill.snow.css";
import "./page.css";

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

  // ✅ Modules con pulizia clipboard da Word/Google Docs
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
      matchers: typeof window !== "undefined"
        ? [
            [
              Node.ELEMENT_NODE,
              (node, delta) => {
                delta.ops = delta.ops.map((op) => {
                  if (op.attributes) {
                    delete op.attributes.color;
                    delete op.attributes.background;
                    delete op.attributes.font;
                    delete op.attributes.size;
                    delete op.attributes.width;
                  }
                  return op;
                });
                return delta;
              },
            ],
          ]
        : [],
    },
  };

  const formats = [
    "header", "bold", "italic", "underline", "strike",
    "list", "bullet", "link", "image", "video",
  ];

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
      if (error) console.error("Errore caricamento:", error);
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

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
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.\w+$/, ".jpg"),
                  { type: "image/jpeg", lastModified: Date.now() }
                );
                resolve(compressedFile);
              } else reject(new Error("Errore nella compressione"));
            },
            "image/jpeg",
            0.8
          );
        };
        img.onerror = () => reject(new Error("Errore nel caricamento immagine"));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Errore nella lettura del file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("❌ Seleziona un file immagine valido");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage("❌ L'immagine è troppo grande (max 10MB)");
      return;
    }

    try {
      setCompressing(true);
      const originalSize = file.size;
      const compressedFile = await compressImage(file);
      const compressedSize = compressedFile.size;
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      setNewImage(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
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

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      // ✅ Sanitizza e rimuove soft hyphens
   const sanitized = DOMPurify.sanitize(post.content, {
  ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "strike", "ol", "ul", "li", "a", "img"],
  ALLOWED_ATTR: ["href", "src", "alt", "title", "data-list", "class"],  // ✅ aggiunto class
});

     const cleanContent = sanitized
        .replace(/&shy;/g, '')
        .replace(/\u00AD/g, '')
        .replace(/&nbsp;/g, ' ')      // ✅ rimuove spazi non breaking da Word
        .replace(/\u00A0/g, ' ');     // ✅ rimuove &nbsp; in formato unicode
        ;

      const updates = {
        title: post.title,
        content: cleanContent,
        category: post.category,
      };

      if (newImage) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error("Sessione non valida. Effettua nuovamente il login.");
        }

        const fileName = `${Date.now()}_${newImage.name}`;

        const { data: uploadData, error: imgError } = await supabase.storage
          .from("posts")
          .upload(`images/${fileName}`, newImage, {
            cacheControl: '3600',
            upsert: false
          });

        if (imgError) throw new Error(`Upload fallito: ${imgError.message}`);

        const { data: urlData } = supabase.storage
          .from("posts")
          .getPublicUrl(`images/${fileName}`);

        updates.image_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("posts").update(updates).eq("id", id);
      if (error) throw error;

      setMessage("✅ Articolo aggiornato con successo!");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      console.error("❌ Errore:", err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
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
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label>Immagine principale</label>
        <div className="image-upload-section">
          {!imagePreview && post.image_url && (
            <div className="image-preview current-image">
              <p className="image-label">📸 Immagine attuale:</p>
              <img src={post.image_url} alt="Anteprima corrente" />
            </div>
          )}

          {imagePreview && (
            <div className="image-preview new-image">
              <p className="image-label">🆕 Nuova immagine (compressa):</p>
              <img src={imagePreview} alt="Nuova anteprima" />
              <button
                type="button"
                onClick={() => {
                  setNewImage(null);
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
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
          modules={modules}
          formats={formats}
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