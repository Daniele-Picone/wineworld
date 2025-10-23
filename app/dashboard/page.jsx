// Dashboard.jsx
"use client";

import './page.css'
import { useEffect, useState } from "react";
import { supabase } from "@/lib/db";
import DataTable from './components/molecules/DataTable';
import DashboardLayout from "./components/layout/dashboardLayout";

export default function DashboardHome() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtraggio posts per categoria
  const wines = posts.filter(p => p.category === "wines");
  const wineworld = posts.filter(p => p.category === "wineworld");
  const blog = posts.filter(p => p.category === "blog");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);

      // Ultimi utenti
      const { data: usersData } = await supabase
        .from("users_view")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      // Tutti i post recenti (filtraggio lato client)
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20); // prendi più post se vuoi più risultati per categoria

      setUsers(usersData || []);
      setPosts(postsData || []);
    } catch (error) {
      console.log('Errore caricamento dati dashboard:', error.message);
    } finally {
      setLoading(false);
    }
  }

  // Funzioni di eliminazione
  async function deleteUser(userId) {
    if (!confirm('Sei sicuro di voler eliminare questo utente?')) return;

    try {
      const response = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Errore durante l\'eliminazione');

      setUsers(users.filter(u => u.id !== userId));
      alert('Utente eliminato con successo!');
    } catch (error) {
      console.error('Errore eliminazione utente:', error);
      alert(`Errore: ${error.message}`);
    }
  }

  async function deletePost(postId) {
    if (!confirm('Sei sicuro di voler eliminare il post?')) return;

    try {
      const response = await fetch(`/api/posts?id=${postId}`, { method: 'DELETE' });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) throw new Error(data.error || 'Errore durante l\'eliminazione');

      setPosts(posts.filter(p => p.id !== postId));
      alert('Post eliminato con successo!');
    } catch (error) {
      console.error('Errore eliminazione post:', error);
      alert(`Errore: ${error.message}`);
    }
  }

  // Azioni per DataTable
  const userActions = [
    { label: 'Elimina', text: 'Elimina', onClick: (user) => deleteUser(user.id), className: 'btn-delete' }
  ];

  const postActions = [
    { label: 'Elimina', text: 'Elimina', onClick: (post) => deletePost(post.id), className: 'btn-delete' }
  ];

  // Colonne utenti
  const userColumns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nome" },
    { key: "email", label: "Email" },
    { key: "role", label: "Ruolo" },
    { key: "created_at", label: "Data Registrazione" },
  ];

  // Colonne post
  const postColumns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Titolo" },
    { key: "category", label: "Categoria" },
    { key: "user_name", label: "Autore" }
  ];

  return (
    <DashboardLayout>
      <div className="dashboard">
        <div className="dash_title">
          <h1>Dashboard</h1>
        </div>
        <div className="dash_content">

          {/* Ultimi utenti */}
          <div className="new_users">
            <h2>Ultimi utenti registrati</h2>
            <div className="table">
              <DataTable columns={userColumns} data={users} loading={loading} actions={userActions} />
            </div>
          </div>

          {/* Post vino */}
          <div className="new_post_wine">
            <h2>Ultimi post Vino</h2>
            <div className="table">
              <DataTable columns={postColumns} data={wines} loading={loading} actions={postActions} />
            </div>
          </div>

          {/* Post WineWorld */}
          <div className="new_post_wineworld">
            <h2>Ultimi post WineWorld</h2>
            <div className="table">
              <DataTable columns={postColumns} data={wineworld} loading={loading} actions={postActions} />
            </div>
          </div>

          {/* Post Blog */}
          <div className="new_post_blog">
            <h2>Ultimi post Blog</h2>
            <div className="table">
              <DataTable columns={postColumns} data={blog} loading={loading} actions={postActions} />
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
