const { PHASE_PRODUCTION_BUILD } = require('next/constants');

/** @type {import('next').NextConfig} */
const nextConfig = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_BUILD || process.env.NEXT_PUBLIC_ENV == '1') {
    // Apply production-only configurations here

    return {
      // To enable a static export
      output: 'export',
      // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
      trailingSlash: true,
      swcMinify: true,
      // prevent double rerendering
      reactStrictMode: false,
      // remove logs, enable this on prod
      compiler: {
        removeConsole: {
          exclude: ['error'],
        },
      },
    };
  }

  return {
    // To enable a static export
    output: 'export',
    // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
    trailingSlash: true,
    swcMinify: true,
    // prevent double rerendering
    reactStrictMode: false,
    eslint: {
      dirs: ["src"],
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
  
      // PLEASE GET BACK THIS TO FALSE ONCE THE TEST BUILD IS UP
      ignoreDuringBuilds: true,
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
  
      /// PLEASE FOR GODSEIK REMOVE THIS
      ignoreBuildErrors: true,
    },
  };
};

module.exports = nextConfig;
