import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ⚠️ NON la public key
)

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://www.wineworldweb.it',
  generateRobotsTxt: true,
  sitemapSize: 7000,

  exclude: [
    '/admin/*',
    '/register',
    '/register/*',
    '/login',
    '/login/*',
    '/dashboard',
    '/dashboard/*',
    '/profile',
    '/api/*'
  ],

  additionalPaths: async () => {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('slug, updated_at')

    if (error || !posts) return []

    return posts.map((post) => ({
      loc: `/wine/${post.slug}`,
      lastmod: post.updated_at,
      changefreq: 'weekly',
      priority: 0.8,
    }))
  },
}

export default config