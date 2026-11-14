/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // 靜態匯出 → 直接部署到 Firebase Hosting
  output: "export",
  images: { unoptimized: true },
  webpack: (config) => {
    // OSMD uses some canvas-style imports in browser only
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false };
    return config;
  },
};

export default nextConfig;
