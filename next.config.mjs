
import withPWAInit from "@ducanh2912/next-pwa";
const withPWA = withPWAInit({
  dest: "public",
  register: true
});


/** @type {import('next').NextConfig} */



const nextConfig = {
    images: {
      domains: ['lh3.googleusercontent.com'],
    },
    // Increase API body size limit to 10MB for AI chat with large function results
    experimental: {
      serverActions: {
        bodySizeLimit: '10mb',
      },
    },
  };
  
  export default withPWA(nextConfig);