// Post-build smoke check: the remote advertises its expose and the host emitted an entry page.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('apps/remote/dist/mf-manifest.json', 'utf8'));
assert.equal(manifest.name, 'remote');
assert.ok(manifest.exposes.some((e) => e.path === './Counter'), 'remote must expose ./Counter');
assert.ok(existsSync('apps/remote/dist/remoteEntry.js'), 'remoteEntry.js missing');
assert.ok(existsSync('apps/host/dist/index.html'), 'host index.html missing');
console.log('build check passed');
