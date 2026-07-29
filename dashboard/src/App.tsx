import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Modal } from './Modal';

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

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

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

  async function handleCreateFlag(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);

    try {
      const response = await fetch(`${API_BASE}/flags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: newKey, description: newDescription }),
      });

      if (response.status === 409) {
        const body = await response.json();
        setCreateError(body.error ?? 'A flag with that key already exists');
        return;
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      setNewKey('');
      setNewDescription('');
      setShowCreateModal(false);
      await fetchFlags();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create flag');
    } finally {
      setCreating(false);
    }
  }

  async function handleToggle(flag: Flag) {
    const newEnabled = !flag.enabled;

    setFlags((prev) =>
      prev.map((f) => (f.id === flag.id ? { ...f, enabled: newEnabled } : f))
    );

    try {
      const response = await fetch(`${API_BASE}/flags/${flag.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newEnabled }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
    } catch (err) {
      setFlags((prev) =>
        prev.map((f) => (f.id === flag.id ? { ...f, enabled: !newEnabled } : f))
      );
      setError(err instanceof Error ? err.message : 'Failed to toggle flag');
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Feature Flags</h1>
          <div className="flex items-center gap-3">
            <Link
              to="/segments"
              className="text-sm text-text-dim transition-colors hover:text-text"
            >
              Segments
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-full border border-primary px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
            >
              + New Flag
            </button>
          </div>
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
                    <td className="px-4 py-3 font-mono text-text">
                      <Link to={`/flags/${flag.id}`} className="hover:text-primary hover:underline">
                        {flag.key}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(flag)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80 ${
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
                      </button>
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

      {showCreateModal && (
        <Modal title="Create Flag" onClose={() => setShowCreateModal(false)}>
          <form onSubmit={handleCreateFlag} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-text-dim">
                Key
              </label>
              <input
                type="text"
                required
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="checkout-v2"
                className="w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-sm text-text placeholder-text-dim/50 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-text-dim">
                Description
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Optional"
                className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder-text-dim/50 focus:border-primary focus:outline-none"
              />
            </div>

            {createError && <p className="text-sm text-danger">{createError}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-md px-4 py-2 text-sm text-text-dim transition-colors hover:text-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {creating ? 'Creating…' : 'Create Flag'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default App;