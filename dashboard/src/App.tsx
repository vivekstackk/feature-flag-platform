import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { apiFetch } from './api';

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

      const response = await apiFetch('/flags');

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      setFlags(await response.json());
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
      const response = await apiFetch('/flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: newKey,
          description: newDescription,
        }),
      });

      if (response.status === 409) {
        const body = await response.json();
        setCreateError(
          body.error ?? 'A flag with that key already exists'
        );
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
      setCreateError(
        err instanceof Error ? err.message : 'Failed to create flag'
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleToggle(flag: Flag) {
    const newEnabled = !flag.enabled;

    setFlags((prev) =>
      prev.map((f) =>
        f.id === flag.id
          ? { ...f, enabled: newEnabled }
          : f
      )
    );

    try {
      const response = await apiFetch(`/flags/${flag.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newEnabled }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
    } catch (err) {
      setFlags((prev) =>
        prev.map((f) =>
          f.id === flag.id
            ? { ...f, enabled: !newEnabled }
            : f
        )
      );

      setError(
        err instanceof Error ? err.message : 'Failed to toggle flag'
      );
    }
  }

  async function handleDelete(flag: Flag) {
    if (
      !confirm(
        `Delete flag "${flag.key}"? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await apiFetch(`/flags/${flag.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      setFlags((prev) =>
        prev.filter((f) => f.id !== flag.id)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete flag'
      );
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-[1020px] px-6 py-8 lg:px-0 lg:py-10">

        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">
              Configuration
            </div>

            <h1 className="text-[28px] font-semibold tracking-[-0.035em]">
              Feature Flags
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/segments"
              className="text-sm text-text-dim transition-colors hover:text-text"
            >
              Segments
            </Link>

            <button
              onClick={() => setShowCreateModal(true)}
              className="border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
            >
              + New Flag
            </button>
          </div>
        </header>

        {loading && (
          <div className="border-y border-border py-6 font-mono text-xs text-text-dim">
            Loading flags…
          </div>
        )}

        {error && (
          <div className="border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="border border-border bg-surface/20">

            <div className="grid grid-cols-[1.35fr_1fr_1fr_1.2fr_70px] border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim">
              <span>Key</span>
              <span>Status</span>
              <span>Rollout</span>
              <span>Updated</span>
              <span />
            </div>

            {flags.map((flag) => (
              <div
                key={flag.id}
                className="grid grid-cols-[1.35fr_1fr_1fr_1.2fr_70px] items-center border-b border-border px-5 py-5 transition-colors last:border-b-0 hover:bg-surface"
              >
                <Link
                  to={`/flags/${flag.id}`}
                  className="min-w-0 truncate font-mono text-[13px] text-text transition-colors hover:text-primary"
                >
                  {flag.key}
                </Link>

                <div>
                  <button
                    onClick={() => handleToggle(flag)}
                    className="group inline-flex items-center gap-2 text-xs"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        flag.enabled
                          ? 'bg-success'
                          : 'bg-text-dim'
                      }`}
                    />

                    <span
                      className={
                        flag.enabled
                          ? 'text-success'
                          : 'text-text-dim'
                      }
                    >
                      {flag.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </button>
                </div>

                <span className="font-mono text-xs text-text-dim">
                  {flag.rollout
                    ? `${flag.rollout.percentage}%`
                    : '—'}
                </span>

                <span className="truncate pr-4 text-xs text-text-dim">
                  {new Date(flag.updatedAt).toLocaleString()}
                </span>

                <button
                  onClick={() => handleDelete(flag)}
                  className="justify-self-end text-xs text-text-dim transition-colors hover:text-danger"
                >
                  Delete
                </button>
              </div>
            ))}

            {flags.length === 0 && (
              <div className="px-5 py-20 text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-dim">
                  No flags yet
                </div>

                <p className="mt-3 text-sm text-text-dim">
                  Create your first flag to start controlling a release.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-text-dim">
          <span>
            {flags.length} flag{flags.length === 1 ? '' : 's'}
          </span>

          <span>
            Local evaluation · Real-time updates
          </span>
        </div>
      </div>

      {showCreateModal && (
        <Modal
          title="Create Flag"
          onClose={() => setShowCreateModal(false)}
        >
          <form
            onSubmit={handleCreateFlag}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim">
                Key
              </label>

              <input
                type="text"
                required
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="checkout-v2"
                className="w-full border border-border bg-bg px-3 py-2.5 font-mono text-sm text-text placeholder:text-text-dim/50 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim">
                Description
              </label>

              <input
                type="text"
                value={newDescription}
                onChange={(e) =>
                  setNewDescription(e.target.value)
                }
                placeholder="Optional"
                className="w-full border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-dim/50 focus:border-primary focus:outline-none"
              />
            </div>

            {createError && (
              <p className="text-sm text-danger">
                {createError}
              </p>
            )}

            <div className="flex justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-2 text-sm text-text-dim hover:text-text"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creating}
                className="border border-primary bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-primary disabled:opacity-50"
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