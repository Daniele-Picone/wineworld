/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pthbieqzrsouwutnquab.supabase.co',
        port: '',      // lascia vuoto se non usi un porto specifico
        pathname: '/**' // permette tutte le immagini sotto questo dominio
      },
    ],
  },
};

export default nextConfig;