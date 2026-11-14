import { lazy, Suspense } from 'react';

const RemoteCounter = lazy(() => import('remote/Counter'));

export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Host</h1>
      <p>The box below is fetched at runtime from a separately deployed remote.</p>
      <Suspense fallback={<p>Loading remote...</p>}>
        <RemoteCounter label="Counter from the remote" />
      </Suspense>
    </main>
  );
}
