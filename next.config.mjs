
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
  };
  
  export default withPWA(nextConfig);