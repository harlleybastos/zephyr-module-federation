import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { withZephyr } from 'zephyr-rsbuild-plugin';

export default defineConfig({
  server: { port: 3000 },
  html: { title: 'Zephyr MF - Host' },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'host',
      // local URL for dev; on deploy Zephyr swaps it for the remote's deployed
      // version, resolved from "zephyr:dependencies" in package.json
      remotes: { remote: 'remote@http://localhost:3001/mf-manifest.json' },
      // version-first (default) fetches every remote at startup, so one dead remote blanks the host
      shareStrategy: 'loaded-first',
      dts: false,
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
    withZephyr(),
  ],
});
