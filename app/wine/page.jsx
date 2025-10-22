'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';
import Link from 'next/link';
import MainLayout from '../components/layouts/MainLayout';
import  './page.css';

export default function WinesPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWines = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .ilike('category', 'wines')     // ignora maiuscole/minuscole

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

  if (loading) return <p>Caricamento...</p>;

  return (
    <MainLayout> 

    <div className='winepage'>
      <h1>Vini</h1>
      {posts.length === 0 && <p>Nessun post disponibile.</p>}
      <div className="posts-wrapper">
        {posts.map((post) => (
            <div key={post.id} className="post-card">
           <div className="card-img">
             <img src={post.image_url} alt={post.title} />
           </div>
            <div className="card-content">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </div>
           <div className="card-link">
             <Link href={`/wine/${post.id}`}>Leggi articolo</Link>
           </div>
          </div>
        ))}
      </div>
    </div>
     </MainLayout>
  );
}
