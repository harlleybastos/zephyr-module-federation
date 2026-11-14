import Counter from './Counter';

export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Remote (standalone)</h1>
      <p>This app exposes <code>./Counter</code> through Module Federation.</p>
      <Counter />
    </main>
  );
}
