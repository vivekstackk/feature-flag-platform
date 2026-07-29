import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from './Modal';

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

const API_BASE = 'http://localhost:3000';

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
      const response = await fetch(`${API_BASE}/segments`);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      setSegments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load segments');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSegment(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);

    try {
      const response = await fetch(`${API_BASE}/segments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, conditions: [] }),
      });

      if (response.status === 409) {
        const body = await response.json();
        setCreateError(body.error ?? 'A segment with that name already exists');
        return;
      }

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      setNewName('');
      setShowCreateModal(false);
      await fetchSegments();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create segment');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(segment: Segment) {
    if (!confirm(`Delete segment "${segment.name}"? This cannot be undone.`)) return;

    try {
      const response = await fetch(`${API_BASE}/segments/${segment.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setSegments((prev) => prev.filter((s) => s.id !== segment.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete segment');
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link to="/" className="mb-6 inline-block text-sm text-text-dim hover:text-text">
          ← Back to flags
        </Link>

        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Segments</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-full border border-primary px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            + New Segment
          </button>
        </header>

        {loading && <p className="text-sm text-text-dim">Loading segments…</p>}
        {error && <p className="text-sm text-danger">Error: {error}</p>}

        {!loading && !error && (
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-dim">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-dim">
                    Conditions
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-dim">
                    Updated
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {segments.map((segment) => (
                  <tr
                    key={segment.id}
                    className="border-b border-border last:border-none hover:bg-surface-high"
                  >
                    <td className="px-4 py-3 font-mono text-text">{segment.name}</td>
                    <td className="px-4 py-3 text-text-dim">{segment.conditions.length}</td>
                    <td className="px-4 py-3 text-text-dim">
                      {new Date(segment.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(segment)}
                        className="text-sm text-text-dim transition-colors hover:text-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {segments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-text-dim">
                      No segments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <Modal title="Create Segment" onClose={() => setShowCreateModal(false)}>
          <form onSubmit={handleCreateSegment} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-text-dim">
                Name
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="beta-testers"
                className="w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-sm text-text placeholder-text-dim/50 focus:border-primary focus:outline-none"
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
                {creating ? 'Creating…' : 'Create Segment'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Segments;