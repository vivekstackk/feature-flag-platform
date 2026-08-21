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
  rollout: {
    percentage: number;
    serveValue: boolean;
  } | null;
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

      const data = await response.json();

      setFlags(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load flags'
      );
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: newKey,
          description: newDescription,
        }),
      });

      if (response.status === 409) {
        const body = await response.json();

        setCreateError(
          body.error ??
            'A flag with that key already exists'
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      setNewKey('');
      setNewDescription('');
      setShowCreateModal(false);

      await fetchFlags();
    } catch (err) {
      setCreateError(
        err instanceof Error
          ? err.message
          : 'Failed to create flag'
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
      const response = await apiFetch(
        `/flags/${flag.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            enabled: newEnabled,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
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
        err instanceof Error
          ? err.message
          : 'Failed to toggle flag'
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
      const response = await apiFetch(
        `/flags/${flag.id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      setFlags((prev) =>
        prev.filter((f) => f.id !== flag.id)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete flag'
      );
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text">

      <div className="mx-auto w-full max-w-[1180px] px-5 py-7 sm:px-7 lg:px-8 lg:py-10">

        {/* Header */}

        <header className="mb-8 flex items-center justify-between">

          <div>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
              Configuration
            </p>

            <h1 className="text-[26px] font-semibold tracking-[-0.035em] sm:text-[30px]">
              Feature Flags
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">

            <Link
              to="/segments"
              className="hidden rounded-xl px-3 py-2 text-sm text-text-dim transition-colors hover:bg-surface hover:text-text sm:block"
            >
              Segments
            </Link>

            <button
              onClick={() => setShowCreateModal(true)}
              className="dashboard-button dashboard-button-primary"
            >
              + New Flag
            </button>
          </div>
        </header>

        {/* Error */}

        {error && (
          <div className="mb-5 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Main card */}

        <div className="dashboard-card overflow-hidden">

          {/* Card header */}

          <div className="flex items-center justify-between border-b border-border-soft px-5 py-4 sm:px-6">

            <div>
              <p className="text-sm font-medium">
                All flags
              </p>

              <p className="mt-0.5 text-xs text-text-muted">
                Control releases and feature behaviour.
              </p>
            </div>

            <div className="rounded-full bg-surface-high px-3 py-1 text-[11px] text-text-dim">
              {flags.length}{' '}
              {flags.length === 1 ? 'flag' : 'flags'}
            </div>
          </div>

          {loading && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />

              <p className="mt-4 text-xs text-text-dim">
                Loading flags…
              </p>
            </div>
          )}

          {!loading && (
            <>
              {/* Desktop table */}

              <div className="hidden sm:block">

                <div className="grid grid-cols-[1.5fr_1fr_0.8fr_1.4fr_70px] border-b border-border-soft px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                  <span>Key</span>
                  <span>Status</span>
                  <span>Rollout</span>
                  <span>Updated</span>
                  <span />
                </div>

                {flags.map((flag) => (
                  <div
                    key={flag.id}
                    className="grid grid-cols-[1.5fr_1fr_0.8fr_1.4fr_70px] items-center border-b border-border-soft px-6 py-5 transition-colors last:border-b-0 hover:bg-white/[0.015]"
                  >

                    <Link
                      to={`/flags/${flag.id}`}
                      className="font-mono text-[13px] text-text transition-colors hover:text-primary"
                    >
                      {flag.key}
                    </Link>

                    <button
                      onClick={() =>
                        handleToggle(flag)
                      }
                      className="flex w-fit items-center gap-2 rounded-full bg-surface-high px-2.5 py-1 text-xs"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          flag.enabled
                            ? 'bg-success'
                            : 'bg-text-muted'
                        }`}
                      />

                      <span
                        className={
                          flag.enabled
                            ? 'text-success'
                            : 'text-text-dim'
                        }
                      >
                        {flag.enabled
                          ? 'Enabled'
                          : 'Disabled'}
                      </span>
                    </button>

                    <span className="font-mono text-xs text-text-dim">
                      {flag.rollout
                        ? `${flag.rollout.percentage}%`
                        : '—'}
                    </span>

                    <span className="text-xs text-text-muted">
                      {new Date(
                        flag.updatedAt
                      ).toLocaleString()}
                    </span>

                    <button
                      onClick={() =>
                        handleDelete(flag)
                      }
                      className="justify-self-end rounded-lg px-2 py-1 text-xs text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {flags.length === 0 && (
                  <div className="px-6 py-20 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-high text-xl text-text-muted">
                      +
                    </div>

                    <p className="mt-4 text-sm font-medium">
                      No flags yet
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Create your first feature flag.
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile cards */}

              <div className="divide-y divide-border-soft sm:hidden">

                {flags.map((flag) => (
                  <div
                    key={flag.id}
                    className="p-5"
                  >

                    <div className="flex items-start justify-between">

                      <Link
                        to={`/flags/${flag.id}`}
                        className="font-mono text-sm text-text"
                      >
                        {flag.key}
                      </Link>

                      <button
                        onClick={() =>
                          handleToggle(flag)
                        }
                        className="flex items-center gap-2 rounded-full bg-surface-high px-2.5 py-1 text-[11px]"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            flag.enabled
                              ? 'bg-success'
                              : 'bg-text-muted'
                          }`}
                        />

                        {flag.enabled
                          ? 'Enabled'
                          : 'Disabled'}
                      </button>
                    </div>

                    {flag.description && (
                      <p className="mt-2 text-xs leading-5 text-text-muted">
                        {flag.description}
                      </p>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-surface-soft p-3">
                        <p className="text-[10px] uppercase tracking-wider text-text-muted">
                          Rollout
                        </p>

                        <p className="mt-1 font-mono text-sm">
                          {flag.rollout
                            ? `${flag.rollout.percentage}%`
                            : '—'}
                        </p>
                      </div>

                      <div className="rounded-xl bg-surface-soft p-3">
                        <p className="text-[10px] uppercase tracking-wider text-text-muted">
                          Updated
                        </p>

                        <p className="mt-1 text-xs text-text-dim">
                          {new Date(
                            flag.updatedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleDelete(flag)
                      }
                      className="mt-4 text-xs text-text-muted hover:text-danger"
                    >
                      Delete flag
                    </button>
                  </div>
                ))}

                {flags.length === 0 && (
                  <div className="px-5 py-16 text-center">
                    <p className="text-sm font-medium">
                      No flags yet
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Create your first feature flag.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Bottom metadata */}

        <div className="mt-5 flex items-center justify-between px-1 text-[10px] text-text-muted">
          <span>Flagwise</span>

          <span className="hidden sm:block">
            Local evaluation · Real-time updates
          </span>
        </div>
      </div>

      {showCreateModal && (
        <Modal
          title="Create Flag"
          onClose={() =>
            setShowCreateModal(false)
          }
        >
          <form
            onSubmit={handleCreateFlag}
            className="space-y-5"
          >

            <div>
              <label className="dashboard-label">
                Key
              </label>

              <input
                type="text"
                required
                value={newKey}
                onChange={(e) =>
                  setNewKey(e.target.value)
                }
                placeholder="checkout-v2"
                className="dashboard-input font-mono text-sm"
              />
            </div>

            <div>
              <label className="dashboard-label">
                Description
              </label>

              <input
                type="text"
                value={newDescription}
                onChange={(e) =>
                  setNewDescription(
                    e.target.value
                  )
                }
                placeholder="Optional description"
                className="dashboard-input text-sm"
              />
            </div>

            {createError && (
              <p className="text-sm text-danger">
                {createError}
              </p>
            )}

            <div className="flex justify-end gap-2 border-t border-border-soft pt-5">

              <button
                type="button"
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="dashboard-button dashboard-button-secondary"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creating}
                className="dashboard-button dashboard-button-primary disabled:opacity-50"
              >
                {creating
                  ? 'Creating…'
                  : 'Create Flag'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default App;