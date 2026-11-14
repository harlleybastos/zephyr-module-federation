import { useState } from 'react';

export default function Counter({ label = 'Remote counter' }: { label?: string }) {
  const [count, setCount] = useState(0);
  return (
    <section style={{ border: '2px dashed #7c3aed', borderRadius: 8, padding: 16 }}>
      <p style={{ margin: 0, fontSize: 12, color: '#7c3aed' }}>Loaded from the remote app</p>
      <h2>{label}</h2>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Clicked {count} {count === 1 ? 'time' : 'times'}
      </button>
    </section>
  );
}
