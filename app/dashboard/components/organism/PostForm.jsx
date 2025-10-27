"use client";
import { useState } from "react";
import { useUser } from "@/app/context/UserContext";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function PostForm({ category }) {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Devi essere loggato!");

    setLoading(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, category, author_id: user.id }),
    });
    if (res.ok) {
      setTitle("");
      setContent("");
      alert("Post pubblicato!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titolo"
        required
      />
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
  );
}
