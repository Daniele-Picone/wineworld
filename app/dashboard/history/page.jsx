'use client'

import{useState, useEffect} from 'react';
import { supabase } from '@/lib/db';
import DashboardLayout from '../components/layout/dashboardLayout';
import DataTable from '../components/molecules/DataTable';
import Loader from '@/app/components/molecules/Loader';


import './page.css';





export default function HistoryPage(){
    const [users , setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
    fetchHistoryData();
  }, []);

    async function fetchHistoryData(){
        try{
            setLoading(true)
        const { data: usersData } = await supabase
        .from("users_view")
        .select("id, name, email, role, created_at")
        .order("created_at", { ascending: false })
        .limit(10)
              // Ultimi post
       const { data: postsData } = await supabase
        .from("posts")
        .select("id, title, category, user_name, created_at")
        .order("created_at", { ascending: false })
        .limit(10);


        setUsers(usersData || []);
        setPosts(postsData || []);

        } catch (error){
            console.error("Errore caricamento cronologia:", error);
        }finally{
            setLoading(false)
        }
    }

      const userColumns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nome" },
    { key: "email", label: "Email" },
    { key: "role", label: "Ruolo" },
    { key: "created_at", label: "Data iscrizione" },
  ];

  const postColumns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Titolo" },
    { key: "category", label: "Categoria" },
    { key: "user_name", label: "Autore" },
    { key: "created_at", label: "Pubblicato il" },
  ];


    return(
     <DashboardLayout>
        <div className="history-page">
        <h1>Cronologia Attività</h1>

        {loading ? (
          <Loader></Loader>
        ) : (
          <>
            {/* Tabella Post */}
            <section className="history-section">
              <h2> Ultime Pubblicazioni</h2>
              <DataTable columns={postColumns} data={posts} loading={loading} />
            </section>

            {/* Tabella Utenti */}
            <section className="history-section">
              <h2> Ultimi Iscritti</h2>
              <DataTable columns={userColumns} data={users} loading={loading} />
            </section>
          </>
        )}
      </div>
     </DashboardLayout>
    )
}