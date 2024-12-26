/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: {
        bodySizeLimit: '5mb', // Adjust this value as needed (e.g., '5mb', '10mb')
      },
    },
  };
  
  export default nextConfig;
