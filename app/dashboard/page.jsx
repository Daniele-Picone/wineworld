// Dashboard.jsx
"use client";

import './page.css'
import { use, useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/lib/db";
import DashboardLayout from "./components/layout/dashboardLayout";
import Charts from "./components/molecules/Charts";
import TopCreators from './components/molecules/TopCreators';
import DataTable from './components/molecules/DataTable';
import Loader from '../components/molecules/Loader';
import { useRouter } from "next/navigation";



export default function DashboardHome() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
   const { user } = useUser();
   const router = useRouter();
  
   


  // post stats
  const categories = ["wines", "wineworld", "blog"];
  const totalPosts = posts.length;
  const wines = posts.filter(p => p.category === "wines");
  const wineworld = posts.filter(p => p.category === "wineworld");
  const blog = posts.filter(p => p.category === "blog")

const categoryData = categories.map((category) => {
  const count = posts.filter((post) => post.category === category).length;
  const percentage = ((count / totalPosts) * 100).toFixed(0);
  return { name: category, value: count, percentage };
});
  const TopCreatorsData = posts.reduce( (acc , post) =>{
    const name = post.user_name || "sconosciuto";
      if(!acc[name]) acc[name]={name, count:1};
      else acc[name].count++;
      return acc;
  }, {})
    
  const sortedCreators = Object.values(TopCreatorsData).map((creator)=>({
    ...creator,
    percentage: ((creator.count/ totalPosts)*100).toFixed(1),
  })).sort((a,b) => b.count - a.count).slice(0,5)
    
  const postColumns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Titolo" },
    { key: "category", label: "Categoria" },
    { key: "user_name", label: "Autore" }
  ];
    const postActions = [
    { label: 'Elimina', text: 'Elimina', onClick: (post) => deletePost(post.id), className: 'btn-delete' },
    {label: 'Modifica',text: '✏️ Modifica',onClick: (post) => router.push(`/dashboard/posts/edit/${post.id}`), className: 'edit-btn', },
  ];

  // user stats

  const userCategories=["user", "admin" ];
  const totalUsers = users.length;

  const userCategoryData = userCategories.map((userCategory) => {
    const count = users.filter((user) => user.role === userCategory ).length;
    const percentage = totalPosts > 0 ? ((count / totalPosts) * 100).toFixed(0) : 0;
     return { name: userCategory, value: count, percentage };
  } )
  
  const userColumns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nome" },
    { key: "email", label: "Email" },
    { key: "role", label: "Ruolo" },
    { key: "created_at", label: "Data Registrazione" },
  ];
  const userActions = [
    { label: 'Elimina', text: 'Elimina', onClick: (user) => deleteUser(user.id), className: 'btn-delete' }
  ];
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

useEffect(() => {
    if (user === null) {
      // se user è null, rimanda al login
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    // mentre il redirect avviene, mostra un loader
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }
    

    
  return (
  
    <DashboardLayout>
     
      {/* analyses */}
      <div className="dashboard">
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
      <div className="Top_Creators">
          <TopCreators creators={sortedCreators} />
      </div>
      <div className="userTable">
        <h3>Ultimi Iscritti</h3>
        <DataTable columns={userColumns} data={users} loading={loading} actions={userActions} />
      </div>
      <div className="postsTable">
        <h3>Ultimi Post</h3>
        <DataTable columns={postColumns} data={posts} loading={loading} actions={postActions} />
      </div>
      <div className="wineTable">
        <h3>Ultimi Post Wine</h3>
        <DataTable columns={postColumns} data={wines} loading={loading} actions={postActions} />
      </div>
        <div className="wineWorldTable">
          <h3>Ultimi Post WineWorld</h3>
          <DataTable columns={postColumns} data={wineworld} loading={loading} actions={postActions} />
        </div>
        <div className="blogTable">
          <h3>Ultimi Post Blog</h3>
          <DataTable columns={postColumns} data={blog} loading={loading} actions={postActions} />
        </div>
      </div>
    </DashboardLayout>
          
  );
}
