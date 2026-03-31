import { createClient } from "@supabase/supabase-js";
import docgData from "@/data/docg_list.json"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getArticles() {
  const { data, error } = await supabase
    .from("posts")
    .select("slug, created_at, category")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Sitemap: errore recupero articoli", error);
    return [];
  }
  return data;
}

export default async function sitemap() {
  const baseUrl = "https://www.wineworldweb.it";

  // Pagine statiche
  const staticPages = [
    { url: baseUrl,                      lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${baseUrl}/blog`,            lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/docg`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/wine`,            lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${baseUrl}/wineworld`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`,         lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Articoli da Supabase
  let articleUrls = [];
  try {
    const articles = await getArticles();
    articleUrls = articles.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.created_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch (e) {
    console.error("Sitemap: errore articoli", e);
  }

  // DOCG da file locale
 let docgUrls = [];
try {
  docgUrls = docgData.flatMap((region) =>
    region.docg.map((docg) => ({
      url: `${baseUrl}/docg/${docg.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }))
  );
} catch (e) {
  console.error("Sitemap: errore DOCG", e);
}

  return [...staticPages, ...articleUrls, ...docgUrls];
}