'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';
import Link from 'next/link';
import Loader from "@/app/components/molecules/Loader";
import  './page.css';
import DashboardLayout from '../../components/layout/dashboardLayout';





export default function BlogDashboardPage() {


  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWines = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .ilike('category', 'blog')     // ignora maiuscole/minuscole

        .order('created_at', { ascending: false });

      if (error) {
        console.error('Errore fetching posts:', error);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchWines();
  }, []);

  
          if (loading) {
            return (
              <DashboardLayout>
                <Loader></Loader>
              </DashboardLayout>
            );
          }

  return (
    <DashboardLayout> 

    <div className='winepage'>
      <h1>Blog</h1>
      {posts.length === 0 && <p className='message' >Nessun post disponibile.</p>}
      <div className="posts-wrapper">
        {posts.map((post) => (
        <Link href={`/wine/${post.slug}`}>
            <div key={post.id} className="post-card">
           <div className="card-img">
             <img src={post.image_url} alt={post.title} />
           </div>
            <div className="card-content">
              <h2>{post.title}</h2>
            </div>
           <div className="card-link">
            <p>Leggi articolo</p>
           </div>
          </div>
        </Link>
        ))}
      </div>
    </div>
     </DashboardLayout>
  );
}
