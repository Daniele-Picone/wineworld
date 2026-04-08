import { createClient } from "@supabase/supabase-js";
import docgData from "@/data/docg_list.json";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Forza il server a NON cachare MAI la sitemap
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getArticles() {
  const { data, error } = await supabase
    .from("posts")
    .select("slug, created_at, category")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

export default async function sitemap() {
  const baseUrl = "https://www.wineworldweb.it";

  const staticPages = [
    { url: baseUrl,                      lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${baseUrl}/blog`,            lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/docg`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/wine`,            lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${baseUrl}/wineworld`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`,         lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  const articles = await getArticles();
  const articleUrls = articles.map((post) => {
    let cat = (post.category || "blog").toLowerCase().trim();
    
    // CORREZIONE AGGRESSIVA: se contiene "wine" (singolare o plurale), usa "wine"
    if (cat.includes("wine") && cat !== "wineworld") {
      cat = "wine";
    }

    return {
      url: `${baseUrl}/${cat}/${post.slug}`,
      lastModified: new Date(post.created_at),
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

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
  } catch (e) {}

  return [...staticPages, ...articleUrls, ...docgUrls];
}