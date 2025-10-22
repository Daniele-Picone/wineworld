'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/app/context/UserContext';
import DashboardLayout from '../components/layout/dashboardLayout';
import { supabase } from '@/lib/db';
import './page.css';

export default function PostForm() {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('blog');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      setIsAdmin(true);
      setCategory('wines');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!title || !content || !category || !image) {
      setMessage('❌ Compila tutti i campi obbligatori.');
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Ottieni token utente dal client
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('Utente non autenticato');

      // 2️⃣ Prepara formData
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('image', image);

      // 3️⃣ Chiamata API
      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Errore server');

      setMessage(data.message);
      setTitle('');
      setContent('');
      setCategory(isAdmin ? 'wines' : 'blog');
      setImage(null);

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      console.error(err);
      setMessage(`❌ Errore: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <p>Caricamento utente...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="post-form-container">
        <form onSubmit={handleSubmit} className="post-form">
          <h2>Crea un nuovo post</h2>

          {!isAdmin && (
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '15px' }}>
              ℹ️ Come utente puoi creare solo post nella categoria Blog
            </p>
          )}

          <input
            type="text"
            placeholder="Titolo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            disabled={loading}
          />

          <textarea
            placeholder="Contenuto"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={loading}
            rows="6"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            disabled={loading || !isAdmin}
          >
            {isAdmin ? (
              <>
                <option value="wines">Vini</option>
                <option value="wineworld">Il mondo del vino</option>
                <option value="blog">Blog</option>
              </>
            ) : (
              <option value="blog">Blog</option>
            )}
          </select>

          <button type="submit" disabled={loading}>
            {loading ? 'Creazione in corso...' : 'Crea post'}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </DashboardLayout>
  );
}
