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

function Segments() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchSegments();
  }, []);

  async function fetchSegments() {
    try {
      setLoading(true);

      const response = await apiFetch('/segments');

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
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

  async function handleCreateSegment(e: React.FormEvent) {
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
        throw new Error(`Request failed: ${response.status}`);
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
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      setSegments((prev) =>
        prev.filter((s) => s.id !== segment.id)
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
    <div className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-[1020px] px-6 py-8 lg:px-0 lg:py-10">

        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim hover:text-text"
        >
          ← Feature Flags
        </Link>

        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">
              Audience
            </div>

            <h1 className="text-[28px] font-semibold tracking-[-0.035em]">
              Segments
            </h1>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="self-start border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white sm:self-auto"
          >
            + New Segment
          </button>
        </header>

        {loading && (
          <div className="border-y border-border py-6 font-mono text-xs text-text-dim">
            Loading segments…
          </div>
        )}

        {error && (
          <div className="border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="border border-border bg-surface/20">

            <div className="grid grid-cols-[1.5fr_1fr_1.4fr_70px] border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim">
              <span>Name</span>
              <span>Conditions</span>
              <span>Updated</span>
              <span />
            </div>

            {segments.map((segment) => (
              <div
                key={segment.id}
                className="grid grid-cols-[1.5fr_1fr_1.4fr_70px] items-center border-b border-border px-5 py-5 last:border-b-0 hover:bg-surface"
              >
                <Link
                  to={`/segments/${segment.id}`}
                  className="truncate font-mono text-[13px] hover:text-primary"
                >
                  {segment.name}
                </Link>

                <span className="font-mono text-xs text-text-dim">
                  {segment.conditions.length}
                </span>

                <span className="truncate pr-4 text-xs text-text-dim">
                  {new Date(
                    segment.updatedAt
                  ).toLocaleString()}
                </span>

                <button
                  onClick={() => handleDelete(segment)}
                  className="justify-self-end text-xs text-text-dim hover:text-danger"
                >
                  Delete
                </button>
              </div>
            ))}

            {segments.length === 0 && (
              <div className="px-5 py-20 text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-dim">
                  No segments yet
                </div>

                <p className="mt-3 text-sm text-text-dim">
                  Create a reusable audience for your targeting rules.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-text-dim">
          {segments.length} segment
          {segments.length === 1 ? '' : 's'}
        </div>
      </div>

      {showCreateModal && (
        <Modal
          title="Create Segment"
          onClose={() => setShowCreateModal(false)}
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
                onChange={(e) => setNewName(e.target.value)}
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
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-2 text-sm text-text-dim hover:text-text"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creating}
                className="border border-primary bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-primary disabled:opacity-50"
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