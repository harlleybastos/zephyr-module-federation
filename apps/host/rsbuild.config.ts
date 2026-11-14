import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  server: { port: 3000 },
  html: { title: 'Zephyr MF - Host' },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'host',
      remotes: { remote: 'remote@http://localhost:3001/mf-manifest.json' },
      dts: false,
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
});
