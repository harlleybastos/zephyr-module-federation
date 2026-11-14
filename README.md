# Zephyr + Module Federation demo

Two React micro-frontends built with [Rsbuild](https://rsbuild.dev) and
[Module Federation](https://module-federation.io), deployed with
[Zephyr Cloud](https://docs.zephyr-cloud.io) on its default cloud integration.

**Live:**
- Host: https://harlleybastos-2-zephyr-mf-host-zephyr-module-fede-cd676adb2-ze.zephyrcloud.app
- Remote: https://harlleybastos-1-zephyr-mf-remote-zephyr-module-fe-58abf5e59-ze.zephyrcloud.app

These are immutable version URLs: each `pnpm build` creates new ones, and
these keep serving the build they point to.

| App | Path | Port (dev) | Role |
| --- | --- | --- | --- |
| `zephyr-mf-remote` | [apps/remote](apps/remote) | 3001 | Exposes `./Counter` |
| `zephyr-mf-host` | [apps/host](apps/host) | 3000 | Loads `remote/Counter` at runtime |

## How it works

**Module Federation.** The remote's
[rsbuild.config.ts](apps/remote/rsbuild.config.ts) builds a `remoteEntry.js`
and an `mf-manifest.json` that advertise `./Counter`. The host's
[rsbuild.config.ts](apps/host/rsbuild.config.ts) declares a remote called
`remote` and imports `remote/Counter` with `React.lazy`, so the component is
fetched from the remote's deployment when the page runs, not bundled into the
host. `react` and `react-dom` are shared singletons, so both apps use one copy
of React. Each app's `src/index.ts` only does `import('./bootstrap')`. That
async boundary lets the federation runtime agree on shared modules before any
React code runs.

**Zephyr.** Each config adds `withZephyr()` as the last Rsbuild plugin. A
normal `rsbuild build` then also deploys:

1. Zephyr authenticates you (browser login on first run, cached afterwards).
2. It reads the git remote and branch to place the build in an
   organization / project / application, named after the package.
3. It uploads only the assets that changed to Zephyr's default cloud and gives
   the build an immutable version URL. Tags and environments, such as the
   latest build on a branch, point at versions and can be moved or rolled
   back without rebuilding.
4. For the host, it reads `zephyr:dependencies` in
   [apps/host/package.json](apps/host/package.json)
   (`"remote": "zephyr-mf-remote@*"`) and replaces the local
   `http://localhost:3001` remote URL with the deployed remote's URL. The key
   `remote` must match the remote's alias in the Module Federation config
   exactly.

Because of step 4, **the remote must be deployed before the host**. The root
`pnpm build` script runs them in that order.

## Run it

Requirements: Node 20.19+ or 22.12+ and pnpm 10.

```bash
pnpm install

# Deploy (opens the Zephyr login in your browser the first time)
pnpm build          # remote first, then host; each prints its Zephyr URL
pnpm check          # smoke-checks the build output
pnpm test:e2e       # browser test: host survives an unreachable remote (no deploy)

# Local development without contacting Zephyr
ZE_DISABLED=true pnpm dev     # host: http://localhost:3000, remote: http://localhost:3001
```

`ZE_DISABLED=true` is Zephyr's own skip switch: it builds and serves normally
but never contacts Zephyr. In PowerShell, run `$env:ZE_DISABLED='true'` first.

In CI, set `ZE_CI_TOKEN` (an organization CI token) instead of logging in.

## Verify a deployment

1. Open the host URL printed by `pnpm build`. The dashed box comes from the
   remote's deployment, which you can confirm in the browser's Network tab
   (`remoteEntry.js` / `mf-manifest.json` load from the remote's Zephyr URL).
2. Change the text in [Counter.tsx](apps/remote/src/Counter.tsx) and run
   `pnpm --filter zephyr-mf-remote build` alone. Its new version shows up in
   the Zephyr dashboard. Move the host's environment or tag to it (or rebuild
   the host) and the host shows the change.
3. Roll back by pointing the tag or environment at the previous version in
   the dashboard. Nothing is rebuilt.

## Choices

- **Rsbuild** over Vite or Webpack: it is the Zephyr guide's reference stack
  for React MF monorepos, and builds take under a second.
- **Exact version pins** plus a committed `pnpm-lock.yaml`: the manifest, the
  lockfile and the installed tree can't drift apart.
- **TypeScript 6.0.3**, not 7: it is the version the Zephyr guide verifies
  with the MF tooling.
- **`dts: false`** plus a small declaration in
  [apps/host/src/remote.d.ts](apps/host/src/remote.d.ts): MF type generation
  would make the host build fetch types from a running remote. With one small
  exposed component, a hand-written type is simpler and deterministic.
- **Host survives a dead remote**: the host uses `shareStrategy: 'loaded-first'`,
  and its lazy import falls back to a "Remote unavailable. Reload to retry." message (`React.lazy` caches the result, so only a reload retries). With the
  default `version-first`, the runtime fetches every remote's manifest at
  startup, so a single unreachable remote leaves the host page blank.

## Known noise in the build log

- `Missing filename in Module Federation configuration ... React Native` (id
  `005`) is printed while the remote deploys. It comes from Zephyr's legacy
  dashboard plugin, which looks for a React Native-only `bundle_name` field on
  any config that has `exposes`. The web `filename` is set, so the warning is a
  false positive.
- The Module Federation CORS warning only affects the local dev server.
