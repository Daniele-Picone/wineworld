import { supabase } from '@/lib/db';
import Link from 'next/link';
import MainLayout from '../components/layouts/MainLayout';
import './page.css';

export async function generateMetadata() {
  return {
    title: "Blog | Storie, territori e curiosità sul vino - WineWorld",
    description: "Articoli, approfondimenti e curiosità sul mondo del vino: denominazioni, territori, vitigni e tradizioni raccontate da WineWorld.",
    openGraph: {
      title: "Blog | Storie, territori e curiosità sul vino - WineWorld",
      description: "Articoli, approfondimenti e curiosità sul mondo del vino raccontate da WineWorld.",
      images: [{ url: "/wewino.png" }],
    },
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .ilike('category', 'blog')
    .order('created_at', { ascending: false });

  return (
    <MainLayout>
      <div className="winepage">
        <h1>Il blog di WineWorld</h1>
        {(!posts || posts.length === 0) && (
          <p className="message">Nessun post disponibile.</p>
        )}
        <div className="posts-wrapper">
          {posts?.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <div className="post-card">
                <div className="card-img">
                  <img src={post.image_url} alt={post.title} loading="lazy" />
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
    </MainLayout>
  );
}