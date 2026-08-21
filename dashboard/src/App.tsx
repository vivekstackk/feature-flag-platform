import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Modal } from './Modal';
import { apiFetch } from './api';

interface FeatureFlag {
  id: string;
  key: string;
  description?: string;
  enabled: boolean;
  rolloutPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
}

function App() {
  const location = useLocation();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function fetchFlags() {
    try {
      setLoading(true);

      const response = await apiFetch('/flags');

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();

      setFlags(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load feature flags'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFlags();
  }, []);

  async function handleCreateFlag(e: React.FormEvent) {
    e.preventDefault();

    if (!newKey.trim()) return;

    setCreating(true);
    setCreateError(null);

    try {
      const response = await apiFetch('/flags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: newKey.trim(),
          description: newDescription.trim(),
          enabled: false,
          rolloutPercentage: 0,
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
      setShowModal(false);

      await fetchFlags();
    } catch (err) {
      setCreateError(
        err instanceof Error
          ? err.message
          : 'Failed to create feature flag'
      );
    } finally {
      setCreating(false);
    }
  }

  const isDashboard =
    location.pathname === '/' ||
    location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Full-screen dashboard shell */}
      <div className="min-h-screen">
        {/* Top bar */}
        <header className="flex h-[72px] items-center justify-between border-b border-border px-6 lg:px-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface">
              <span className="text-lg font-bold text-primary">
                ⚑
              </span>
            </div>

            <div>
              <div className="text-[16px] font-semibold tracking-[-0.02em]">
                Flagwise
              </div>

              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">
                Control plane
              </div>
            </div>
          </Link>

          <Link
            to="/"
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-text-dim transition-colors hover:text-text"
          >
            Landing →
          </Link>
        </header>

        <div className="flex min-h-[calc(100vh-72px)]">
          {/* Sidebar */}
          <aside className="hidden w-[260px] shrink-0 border-r border-border px-6 py-8 lg:block">
            <nav className="space-y-2">
              <Link
                to="/dashboard"
                className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium transition-colors ${
                  isDashboard
                    ? 'bg-surface text-text'
                    : 'text-text-dim hover:bg-surface/60 hover:text-text'
                }`}
              >
                <span>Feature Flags</span>

                {isDashboard && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </Link>

              <Link
                to="/segments"
                className="flex items-center rounded-xl px-4 py-3.5 text-[15px] text-text-dim transition-colors hover:bg-surface/60 hover:text-text"
              >
                Segments
              </Link>
            </nav>

            <div className="my-8 border-t border-border" />

            {/* Environment */}
            <div className="px-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-dim">
                Environment
              </div>

              <div className="mt-5 flex items-center gap-3 text-[14px]">
                <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_10px_rgba(52,211,153,0.45)]" />

                <span className="text-text-dim">
                  Production
                </span>
              </div>
            </div>

            <div className="my-8 border-t border-border" />

            {/* Runtime */}
            <div className="px-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-dim">
                Runtime
              </div>

              <div className="mt-5 space-y-4">
                <RuntimeItem
                  label="API"
                  value="ONLINE"
                />

                <RuntimeItem
                  label="REDIS"
                  value="READY"
                />

                <RuntimeItem
                  label="STREAM"
                  value="READY"
                />
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0 flex-1 px-6 py-10 lg:px-14 lg:py-12">
            <div className="mx-auto max-w-[1500px]">
              {/* Page heading */}
              <div className="flex flex-col gap-8 border-b border-border pb-8 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">
                    Configuration
                  </div>

                  <h1 className="text-[38px] font-semibold leading-none tracking-[-0.045em] sm:text-[42px]">
                    Feature Flags
                  </h1>

                  <p className="mt-4 max-w-[650px] text-[16px] leading-7 text-text-dim">
                    Control releases, targeting and gradual rollouts
                    from one place.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCreateError(null);
                    setShowModal(true);
                  }}
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-primary px-6 text-[14px] font-semibold text-white shadow-[0_8px_30px_rgba(59,130,246,0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(59,130,246,0.25)]"
                >
                  + New flag
                  <span className="text-base">→</span>
                </button>
              </div>

              {/* Mobile navigation */}
              <div className="flex gap-2 border-b border-border py-4 lg:hidden">
                <Link
                  to="/dashboard"
                  className={`rounded-lg px-4 py-2.5 text-[14px] ${
                    isDashboard
                      ? 'bg-surface text-text'
                      : 'text-text-dim'
                  }`}
                >
                  Feature Flags
                </Link>

                <Link
                  to="/segments"
                  className="rounded-lg px-4 py-2.5 text-[14px] text-text-dim"
                >
                  Segments
                </Link>
              </div>

              {/* Content */}
              <div className="pt-8">
                {loading && (
                  <div className="border-y border-border py-8 text-[14px] text-text-dim">
                    Loading feature flags…
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-danger/30 bg-danger/5 px-5 py-4 text-[14px] text-danger">
                    {error}
                  </div>
                )}

                {!loading && !error && (
                  <>
                    {/* Flags */}
                    <div className="space-y-4">
                      {flags.map((flag) => {
                        const rollout =
                          typeof flag.rolloutPercentage === 'number'
                            ? flag.rolloutPercentage
                            : null;

                        return (
                          <div
                            key={flag.id}
                            className="group rounded-2xl border border-border bg-surface/55 px-6 py-6 transition-all duration-200 hover:border-border/80 hover:bg-surface"
                          >
                            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1.5fr_0.8fr_100px]">
                              {/* Flag */}
                              <div className="min-w-0">
                                <div className="truncate font-mono text-[15px] font-semibold text-text">
                                  {flag.key}
                                </div>

                                <div className="mt-1.5 truncate text-[14px] leading-6 text-text-dim">
                                  {flag.description ||
                                    'No description provided'}
                                </div>
                              </div>

                              {/* Status */}
                              <div className="flex items-center gap-2">
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    flag.enabled
                                      ? 'bg-success shadow-[0_0_10px_rgba(52,211,153,0.45)]'
                                      : 'bg-text-dim/60'
                                  }`}
                                />

                                <span
                                  className={`text-[14px] font-medium ${
                                    flag.enabled
                                      ? 'text-success'
                                      : 'text-text-dim'
                                  }`}
                                >
                                  {flag.enabled
                                    ? 'Enabled'
                                    : 'Disabled'}
                                </span>
                              </div>

                              {/* Rollout */}
                              <div className="text-left md:text-right">
                                <span className="font-mono text-[14px] text-text-dim">
                                  {rollout !== null
                                    ? `${rollout}%`
                                    : '—'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Empty */}
                      {flags.length === 0 && (
                        <div className="border-y border-border py-20 text-center">
                          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-dim">
                            No flags configured
                          </div>

                          <p className="mx-auto mt-3 max-w-md text-[15px] leading-6 text-text-dim">
                            Create your first feature flag to
                            control releases and rollouts.
                          </p>

                          <button
                            onClick={() => {
                              setCreateError(null);
                              setShowModal(true);
                            }}
                            className="mt-6 rounded-full bg-primary px-5 py-2.5 text-[14px] font-medium text-white"
                          >
                            Create your first flag →
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Footer metadata */}
                    <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-dim">
                        {flags.length}{' '}
                        {flags.length === 1
                          ? 'flag'
                          : 'flags'}{' '}
                        configured
                      </span>

                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-dim">
                        Production / Live
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Create flag modal */}
      {showModal && (
        <Modal
          title="Create Feature Flag"
          onClose={() => {
            if (!creating) {
              setShowModal(false);
            }
          }}
        >
          <form
            onSubmit={handleCreateFlag}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.15em] text-text-dim">
                Key
              </label>

              <input
                type="text"
                required
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="new-checkout"
                className="w-full rounded-lg border border-border bg-bg px-4 py-3 font-mono text-[14px] text-text placeholder:text-text-dim/50 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.15em] text-text-dim">
                Description
              </label>

              <input
                type="text"
                value={newDescription}
                onChange={(e) =>
                  setNewDescription(e.target.value)
                }
                placeholder="New checkout experience"
                className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-[14px] text-text placeholder:text-text-dim/50 focus:border-primary focus:outline-none"
              />
            </div>

            {createError && (
              <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-[14px] text-danger">
                {createError}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-border pt-5">
              <button
                type="button"
                disabled={creating}
                onClick={() => setShowModal(false)}
                className="rounded-lg px-4 py-2.5 text-[14px] text-text-dim transition-colors hover:text-text disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creating}
                className="rounded-lg bg-primary px-5 py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {creating
                  ? 'Creating…'
                  : 'Create flag'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function RuntimeItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-dim">
        {label}
      </span>

      <span className="font-mono text-[11px] font-medium text-success">
        {value}
      </span>
    </div>
  );
}

export default App;