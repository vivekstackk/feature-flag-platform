import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
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

function FlagwiseMark() {
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.025] text-[#4D8DFF]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
      >
        <path
          d="M7 5.5V18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path
          d="M7.5 6.2C10.2 5.1 12.5 6.2 15.8 6.2C17.1 6.2 18 5.9 19 5.5V11.4C17.8 11.9 16.9 12.1 15.7 12.1C12.6 12.1 10.2 11 7.5 12.1"
          fill="currentColor"
          opacity="0.95"
        />
      </svg>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 8H12.5M8.5 4L12.5 8L8.5 12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

  const [parallax, setParallax] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    fetchFlags();
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const x =
        (event.clientX / window.innerWidth - 0.5) * 2;

      const y =
        (event.clientY / window.innerHeight - 0.5) * 2;

      setParallax({ x, y });
    };

    window.addEventListener(
      'pointermove',
      handlePointerMove,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        'pointermove',
        handlePointerMove
      );
    };
  }, []);

  async function fetchFlags() {
    try {
      setLoading(true);

      const response = await apiFetch('/flags');

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
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

  async function handleCreateFlag(e: FormEvent) {
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
      prev.map((item) =>
        item.id === flag.id
          ? {
              ...item,
              enabled: newEnabled,
            }
          : item
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
        prev.map((item) =>
          item.id === flag.id
            ? {
                ...item,
                enabled: !newEnabled,
              }
            : item
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
        prev.filter((item) => item.id !== flag.id)
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
    <div className="dashboard-page page-enter min-h-screen w-full overflow-x-hidden bg-[#08090B] text-[#E9EAED]">

      {/* Ambient background */}
      <div
        className="dashboard-ambient dashboard-ambient-one"
        style={{
          transform: `translate3d(${parallax.x * 18}px, ${
            parallax.y * 12
          }px, 0)`,
        }}
      />

      <div
        className="dashboard-ambient dashboard-ambient-two"
        style={{
          transform: `translate3d(${parallax.x * -12}px, ${
            parallax.y * -8
          }px, 0)`,
        }}
      />

      <div
        className="dashboard-grid"
        style={{
          transform: `translate3d(${parallax.x * 5}px, ${
            parallax.y * 3
          }px, 0)`,
        }}
      />

      {/* FULL SCREEN CONSOLE */}
      <main className="relative min-h-screen w-full">

        <section className="dashboard-shell min-h-screen w-full overflow-hidden border-0 bg-[#101216]/95 shadow-none backdrop-blur-xl">

          {/* Chrome */}
          <div className="relative flex h-[68px] items-center justify-between border-b border-white/[0.065] px-5 sm:px-7">

            <div className="flex items-center gap-2">
              <span className="chrome-dot bg-[#EF6464]" />
              <span className="chrome-dot bg-[#DDAA45]" />
              <span className="chrome-dot bg-[#3AC88D]" />
            </div>

            <div className="absolute left-1/2 hidden -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#5F646D] sm:block">
              Flagwise / Console
            </div>

            <Link
              to="/"
              className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#5F646D] transition-colors hover:text-white"
            >
              Landing

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <Arrow />
              </span>
            </Link>
          </div>

          <div className="grid min-h-[calc(100vh-68px)] lg:grid-cols-[255px_1fr]">

            {/* SIDEBAR */}
            <aside className="border-b border-white/[0.065] p-5 sm:p-7 lg:border-b-0 lg:border-r lg:p-6">

              <div className="flex items-center gap-3">
                <FlagwiseMark />

                <div>
                  <p className="text-[14px] font-semibold tracking-[-0.02em] text-white">
                    Flagwise
                  </p>

                  <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.15em] text-[#555A64]">
                    Control plane
                  </p>
                </div>
              </div>

              <nav className="mt-10 space-y-1">

                {/* CURRENT */}
                <div className="sidebar-item sidebar-item-active">
                  <span>Feature Flags</span>

                  <span className="h-1.5 w-1.5 rounded-full bg-[#4D8DFF] shadow-[0_0_12px_rgba(77,141,255,0.8)]" />
                </div>

                {/* SEGMENTS */}
                <Link
                  to="/segments"
                  className="sidebar-item"
                >
                  Segments
                </Link>

                {/* EXPERIMENTS REMOVED */}
              </nav>

              <div className="mt-10 border-t border-white/[0.065] pt-5">
                <p className="px-3 font-mono text-[9px] uppercase tracking-[0.17em] text-[#50555E]">
                  Environment
                </p>

                <div className="mt-4 flex items-center gap-2 px-3 text-xs text-[#A4A8B0]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3AC88D] shadow-[0_0_10px_rgba(58,200,141,0.8)]" />
                  Production
                </div>
              </div>

              <div className="mt-10 hidden border-t border-white/[0.065] pt-5 lg:block">
                <p className="px-3 font-mono text-[9px] uppercase tracking-[0.17em] text-[#50555E]">
                  Runtime
                </p>

                <div className="mt-4 space-y-3 px-3 font-mono text-[9px] text-[#666B74]">

                  <div className="flex justify-between">
                    <span>API</span>
                    <span className="text-[#3AC88D]">
                      ONLINE
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>REDIS</span>
                    <span className="text-[#3AC88D]">
                      READY
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>STREAM</span>
                    <span className="text-[#3AC88D]">
                      READY
                    </span>
                  </div>

                </div>
              </div>
            </aside>

            {/* MAIN */}
            <section className="min-w-0 p-5 sm:p-8 lg:p-10 xl:p-12">

              <div className="flex flex-col gap-6 border-b border-white/[0.065] pb-7 sm:flex-row sm:items-end sm:justify-between">

                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.19em] text-[#5F646D]">
                    Configuration
                  </p>

                  <h1 className="mt-2 text-[30px] font-medium tracking-[-0.055em] text-[#F3F4F5] sm:text-[34px]">
                    Feature Flags
                  </h1>

                  <p className="mt-2 max-w-[560px] text-[12px] leading-6 text-[#666B74]">
                    Control releases, targeting and gradual rollouts from one place.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowCreateModal(true)
                  }
                  className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#3F7FF5] px-5 py-2.5 text-[12px] font-semibold text-white shadow-[0_8px_30px_rgba(63,127,245,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4B89FF] hover:shadow-[0_12px_35px_rgba(63,127,245,0.3)]"
                >
                  + New flag

                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                    <Arrow />
                  </span>
                </button>
              </div>

              {error && (
                <div className="mt-5 flex items-center justify-between rounded-xl border border-[#F87171]/15 bg-[#F87171]/[0.06] px-4 py-3 text-xs text-[#F39A9A]">
                  <span>{error}</span>

                  <button
                    onClick={() => setError(null)}
                    className="text-[#8D919A] hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {loading ? (
                <div className="mt-7 space-y-3">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="dashboard-skeleton h-[94px] rounded-2xl border border-white/[0.055]"
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-7 space-y-3">

                  {flags.map((flag, index) => (
                    <article
                      key={flag.id}
                      className="flag-row group"
                      style={{
                        animationDelay: `${index * 65}ms`,
                      }}
                    >
                      <div className="min-w-0">
                        <Link
                          to={`/flags/${flag.id}`}
                          className="font-mono text-[13px] font-medium text-[#F1F2F4] transition-colors hover:text-[#5D97FF]"
                        >
                          {flag.key}
                        </Link>

                        <p className="mt-1 truncate text-[10px] text-[#626771]">
                          {flag.description ||
                            'No description provided'}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleToggle(flag)
                        }
                        className={`status-pill ${
                          flag.enabled
                            ? 'status-enabled'
                            : 'status-disabled'
                        }`}
                        aria-label={`Toggle ${flag.key}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />

                        {flag.enabled
                          ? 'Enabled'
                          : 'Disabled'}
                      </button>

                      <div className="flex items-center justify-end gap-4">
                        <span className="font-mono text-[11px] text-[#7D828C]">
                          {flag.rollout
                            ? `${flag.rollout.percentage}%`
                            : '—'}
                        </span>

                        <button
                          onClick={() =>
                            handleDelete(flag)
                          }
                          className="rounded-lg px-2 py-1 text-[10px] text-[#50555E] opacity-0 transition-all hover:bg-white/[0.04] hover:text-[#F87171] group-hover:opacity-100"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}

                  {flags.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/[0.09] px-6 py-16 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-[#5D626B]">
                        +
                      </div>

                      <p className="mt-4 text-sm text-[#8D919A]">
                        No flags yet.
                      </p>

                      <button
                        onClick={() =>
                          setShowCreateModal(true)
                        }
                        className="mt-3 text-xs text-[#4D8DFF] hover:text-white"
                      >
                        Create your first flag →
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-10 flex items-center justify-between border-t border-white/[0.065] pt-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#4F545D]">
                  {flags.length}{' '}
                  {flags.length === 1
                    ? 'flag'
                    : 'flags'}{' '}
                  configured
                </p>

                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#4F545D]">
                  production / live
                </p>
              </div>

            </section>
          </div>
        </section>
      </main>

      {showCreateModal && (
        <Modal
          title="Create Flag"
          onClose={() => {
            setShowCreateModal(false);
            setCreateError(null);
          }}
        >
          <form
            onSubmit={handleCreateFlag}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-text-dim">
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
                onChange={(e) =>
                  setNewDescription(e.target.value)
                }
                placeholder="Optional"
                className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text placeholder-text-dim/50 focus:border-primary focus:outline-none"
              />
            </div>

            {createError && (
              <p className="text-sm text-danger">
                {createError}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateError(null);
                }}
                className="rounded-md px-4 py-2 text-sm text-text-dim transition-colors hover:text-text"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creating}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
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