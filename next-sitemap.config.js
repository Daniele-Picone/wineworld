/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://www.wineworldweb.it',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/admin/*', '/register','/login' ,'/dashboard','/dashboard/*','/api/*'],
};

export default config;
