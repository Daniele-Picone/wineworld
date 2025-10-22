'use client'
import { useState } from "react";
import { useUser } from "@/app/context/UserContext";

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
      body: JSON.stringify({
        title,
        content,
        category,
        author_id: user.id
      }),
    });
    if (res.ok) {
      setTitle("");
      setContent("");
      alert("Post creato!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titolo"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Contenuto"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Caricamento..." : "Aggiungi Post"}
      </button>
    </form>
  );
}
