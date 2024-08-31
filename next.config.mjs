import CopyPlugin from 'copy-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/node-unrar-js/esm/js/*.wasm',
            to: 'static/chunks/[name][ext]',
          },
        ],
      })
    );
    
    return config;
  },
};

export default nextConfig
