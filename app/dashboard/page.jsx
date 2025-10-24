// Dashboard.jsx
"use client";

import './page.css'
import { useEffect, useState } from "react";
import { supabase } from "@/lib/db";
import DataTable from './components/molecules/DataTable';
import DashboardLayout from "./components/layout/dashboardLayout";
import Charts from "./components/molecules/Charts";


export default function DashboardHome() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // post stats
  const categories = ["wines", "wineworld", "blog"];
  const totalPosts = posts.length;

const categoryData = categories.map((category) => {
  const count = posts.filter((post) => post.category === category).length;
  const percentage = ((count / totalPosts) * 100).toFixed(0);
  return { name: category, value: count, percentage };
});

  // user stats

  const userCategories=["user", "admin" ];
  const totalUsers = users.length;

  const userCategoryData = userCategories.map((userCategory) => {
    const count = users.filter((user) => user.role === userCategory ).length;
    const percentage = ((count/totalUsers) * 100 ).toFixed(0)
     return { name: userCategory, value: count, percentage };
  } )


const stats = [
  { title: "Utenti", total: users.length, categories: userCategoryData },
  { title: "Post", total: posts.length , categories:categoryData },

  ];

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

 
  return (
    <DashboardLayout>
      {/* analyses */}
      <div className="dashborad">
      <div className="dashboard_title">
          <h1>Dashboard</h1>
      </div>
      
      <div className="analyse">
          <div className="analyse_title">
            <h3>Analitiche</h3>
          </div>
          <div className="analyse_content">
            {stats.map((stat, i) => ( 
            <Charts
              key={i}
              title={stat.title}
              total={stat.total}
              categories={stat.categories}
            />
          ))}
          </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
