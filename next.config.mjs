/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, options) {
    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
