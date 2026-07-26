import { useEffect, useState } from 'react';

interface Flag {
  id: string;
  key: string;
  description: string;
  enabled: boolean;
  defaultValue: boolean;
  rollout: { percentage: number; serveValue: boolean } | null;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = 'http://localhost:3000';

function App() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFlags();
  }, []);

  async function fetchFlags() {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/flags`);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      setFlags(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load flags');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Feature Flags</h1>
          <button className="rounded-full border border-primary px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white">
            + New Flag
          </button>
        </header>

        {loading && <p className="text-sm text-text-dim">Loading flags…</p>}
        {error && <p className="text-sm text-danger">Error: {error}</p>}

        {!loading && !error && (
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-dim">
                    Key
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-dim">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-dim">
                    Rollout
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-dim">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {flags.map((flag) => (
                  <tr
                    key={flag.id}
                    className="border-b border-border last:border-none hover:bg-surface-high"
                  >
                    <td className="px-4 py-3 font-mono text-text">{flag.key}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          flag.enabled
                            ? 'bg-success/15 text-success'
                            : 'bg-text-dim/15 text-text-dim'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            flag.enabled ? 'bg-success' : 'bg-text-dim'
                          }`}
                        />
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-text-dim">
                      {flag.rollout ? `${flag.rollout.percentage}%` : '—'}
                    </td>
                    <td className="px-4 py-3 text-text-dim">
                      {new Date(flag.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {flags.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-text-dim">
                      No flags yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;