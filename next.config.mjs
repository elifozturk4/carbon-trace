/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "@stellar/stellar-sdk",
        "@stellar/freighter-api",
      ];
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, net: false, tls: false, dns: false, child_process: false,
    };
    return config;
  },
};
export default nextConfig;
