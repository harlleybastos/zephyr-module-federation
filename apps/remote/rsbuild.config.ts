import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { withZephyr } from 'zephyr-rsbuild-plugin';

export default defineConfig({
  server: { port: 3001 },
  // remote chunks must resolve relative to wherever remoteEntry.js is served from
  output: { assetPrefix: 'auto' },
  html: { title: 'Zephyr MF - Remote' },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'remote',
      filename: 'remoteEntry.js',
      exposes: { './Counter': './src/Counter.tsx' },
      dts: false,
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
    withZephyr(),
  ],
});
