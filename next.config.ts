import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ibass-collection.s3.ap-south-1.amazonaws.com",
        pathname: "/",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/",
      },
      {
        protocol: "https",
        hostname: "storage.example.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;