import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from './Modal';
import { apiFetch } from './api';

interface SegmentCondition {
  attribute: string;
  operator: string;
  value: string | number | boolean | (string | number)[];
}

interface Segment {
  id: string;
  name: string;
  conditions: SegmentCondition[];
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

function Segments() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [newName, setNewName] = useState('');
  const [createError, setCreateError] =
    useState<string | null>(null);

  const [creating, setCreating] = useState(false);

  const [parallax, setParallax] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    fetchSegments();
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

  async function fetchSegments() {
    try {
      setLoading(true);

      const response = await apiFetch('/segments');

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      setSegments(await response.json());
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load segments'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSegment(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setCreating(true);
    setCreateError(null);

    try {
      const response = await apiFetch('/segments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
          conditions: [],
        }),
      });

      if (response.status === 409) {
        const body = await response.json();

        setCreateError(
          body.error ??
            'A segment with that name already exists'
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      setNewName('');
      setShowCreateModal(false);

      await fetchSegments();
    } catch (err) {
      setCreateError(
        err instanceof Error
          ? err.message
          : 'Failed to create segment'
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(segment: Segment) {
    if (
      !confirm(
        `Delete segment "${segment.name}"? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await apiFetch(
        `/segments/${segment.id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      setSegments((prev) =>
        prev.filter(
          (item) => item.id !== segment.id
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete segment'
      );
    }
  }

  return (
    <div className="dashboard-page page-enter min-h-screen w-full overflow-x-hidden bg-[#08090B] text-[#E9EAED]">

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

            {/* Sidebar */}
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

                {/* BACK TO DASHBOARD */}
                <Link
                  to="/dashboard"
                  className="sidebar-item"
                >
                  Feature Flags
                </Link>

                {/* CURRENT */}
                <div className="sidebar-item sidebar-item-active">
                  <span>Segments</span>

                  <span className="h-1.5 w-1.5 rounded-full bg-[#4D8DFF] shadow-[0_0_12px_rgba(77,141,255,0.8)]" />
                </div>

              </nav>

              {/* Environment */}
              <div className="mt-10 border-t border-white/[0.065] pt-5">
                <p className="px-3 font-mono text-[9px] uppercase tracking-[0.17em] text-[#50555E]">
                  Environment
                </p>

                <div className="mt-4 flex items-center gap-2 px-3 text-xs text-[#A4A8B0]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3AC88D] shadow-[0_0_10px_rgba(58,200,141,0.8)]" />
                  Production
                </div>
              </div>

              {/* Runtime */}
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

            {/* Main */}
            <section className="min-w-0 p-5 sm:p-8 lg:p-10 xl:p-12">

              <div className="flex flex-col gap-6 border-b border-white/[0.065] pb-7 sm:flex-row sm:items-end sm:justify-between">

                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.19em] text-[#5F646D]">
                    Audience
                  </p>

                  <h1 className="mt-2 text-[30px] font-medium tracking-[-0.055em] text-[#F3F4F5] sm:text-[34px]">
                    Segments
                  </h1>

                  <p className="mt-2 max-w-[560px] text-[12px] leading-6 text-[#666B74]">
                    Define reusable audiences for targeting and controlled feature releases.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowCreateModal(true)
                  }
                  className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#3F7FF5] px-5 py-2.5 text-[12px] font-semibold text-white shadow-[0_8px_30px_rgba(63,127,245,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4B89FF]"
                >
                  + New segment

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
                <>
                  <div className="mt-7 overflow-hidden rounded-2xl border border-white/[0.075] bg-[#111317]">

                    {/* Header */}
                    <div className="hidden grid-cols-[1.5fr_0.8fr_1.2fr_90px] border-b border-white/[0.065] px-6 py-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[#555A64] sm:grid">
                      <span>Name</span>
                      <span>Conditions</span>
                      <span>Updated</span>
                      <span />
                    </div>

                    {segments.map((segment) => (
                      <article
                        key={segment.id}
                        className="group grid gap-4 border-b border-white/[0.065] px-5 py-5 transition-colors duration-200 last:border-b-0 hover:bg-white/[0.018] sm:grid-cols-[1.5fr_0.8fr_1.2fr_90px] sm:items-center sm:px-6"
                      >

                        <div className="min-w-0">
                          <p className="mb-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#50555E] sm:hidden">
                            Segment
                          </p>

                          <Link
                            to={`/segments/${segment.id}`}
                            className="block truncate font-mono text-[13px] font-medium text-[#F1F2F4] transition-colors hover:text-[#5D97FF]"
                          >
                            {segment.name}
                          </Link>

                          <p className="mt-1 text-[10px] text-[#626771]">
                            Reusable audience definition
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#50555E] sm:hidden">
                            Conditions
                          </p>

                          <span className="font-mono text-[11px] text-[#858A94]">
                            {segment.conditions.length}
                          </span>
                        </div>

                        <div>
                          <p className="mb-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#50555E] sm:hidden">
                            Updated
                          </p>

                          <span className="text-[10px] text-[#666B74]">
                            {new Date(
                              segment.updatedAt
                            ).toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            handleDelete(segment)
                          }
                          className="justify-self-start rounded-lg px-2 py-1 text-[10px] text-[#50555E] transition-all hover:bg-white/[0.04] hover:text-[#F87171] sm:justify-self-end sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          Delete
                        </button>
                      </article>
                    ))}

                    {segments.length === 0 && (
                      <div className="px-6 py-20 text-center">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-[#5D626B]">
                          +
                        </div>

                        <p className="mt-4 text-sm text-[#8D919A]">
                          No segments yet.
                        </p>

                        <p className="mt-2 text-xs text-[#5D626B]">
                          Create a reusable audience for targeting.
                        </p>

                        <button
                          onClick={() =>
                            setShowCreateModal(true)
                          }
                          className="mt-4 text-xs text-[#4D8DFF] hover:text-white"
                        >
                          Create your first segment →
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-10 flex items-center justify-between border-t border-white/[0.065] pt-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#4F545D]">
                      {segments.length}{' '}
                      {segments.length === 1
                        ? 'segment'
                        : 'segments'}{' '}
                      configured
                    </p>

                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#4F545D]">
                      production / live
                    </p>
                  </div>
                </>
              )}
            </section>
          </div>
        </section>
      </main>

      {/* Modal */}
      {showCreateModal && (
        <Modal
          title="Create Segment"
          onClose={() => {
            setShowCreateModal(false);
            setCreateError(null);
          }}
        >
          <form
            onSubmit={handleCreateSegment}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim">
                Name
              </label>

              <input
                type="text"
                required
                value={newName}
                onChange={(e) =>
                  setNewName(e.target.value)
                }
                placeholder="beta-testers"
                className="w-full border border-border bg-bg px-3 py-2.5 font-mono text-sm text-text placeholder:text-text-dim/50 focus:border-primary focus:outline-none"
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
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateError(null);
                }}
                className="px-3 py-2 text-sm text-text-dim hover:text-text"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creating}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:opacity-95 disabled:opacity-50"
              >
                {creating
                  ? 'Creating…'
                  : 'Create Segment'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Segments;