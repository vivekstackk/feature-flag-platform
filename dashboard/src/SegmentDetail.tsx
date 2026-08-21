import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

function SegmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [segment, setSegment] = useState<Segment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [conditions, setConditions] = useState<SegmentCondition[]>([]);
  const [conditionsSaved, setConditionsSaved] = useState(true);
  const [savingConditions, setSavingConditions] = useState(false);

  useEffect(() => {
    fetchSegment();
  }, [id]);

  async function fetchSegment() {
    try {
      setLoading(true);
      const response = await apiFetch(`/segments/${id}`);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      setSegment(data);
      setConditions(data.conditions ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load segment');
    } finally {
      setLoading(false);
    }
  }

  function addCondition() {
    setConditions((prev) => [...prev, { attribute: '', operator: 'equals', value: '' }]);
    setConditionsSaved(false);
  }

  function updateCondition(index: number, changes: Partial<SegmentCondition>) {
    setConditions((prev) =>
      prev.map((cond, i) => (i === index ? { ...cond, ...changes } : cond))
    );
    setConditionsSaved(false);
  }

  function removeCondition(index: number) {
    setConditions((prev) => prev.filter((_, i) => i !== index));
    setConditionsSaved(false);
  }

  async function handleSaveConditions() {
    if (!segment) return;
    setSavingConditions(true);

    try {
      const response = await apiFetch(`/segments/${segment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conditions }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const updated = await response.json();
      setSegment(updated);
      setConditionsSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save conditions');
    } finally {
      setSavingConditions(false);
    }
  }

  if (loading) return <div className="p-10 text-text-dim">Loading…</div>;
  if (error) return <div className="p-10 text-danger">Error: {error}</div>;
  if (!segment) return null;

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link to="/segments" className="mb-6 inline-block text-sm text-text-dim hover:text-text">
          ← Back to segments
        </Link>

        <header className="mb-8">
          <h1 className="font-mono text-2xl font-semibold">{segment.name}</h1>
          <p className="mt-1 text-sm text-text-dim">
            {segment.conditions.length} condition{segment.conditions.length !== 1 ? 's' : ''} ·
            Updated {new Date(segment.updatedAt).toLocaleString()}
          </p>
        </header>

        <section className="rounded-lg border border-border bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Conditions</h2>
            <button
              onClick={addCondition}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-text-dim transition-colors hover:border-primary hover:text-text"
            >
              + Add Condition
            </button>
          </div>

          {conditions.length === 0 && (
            <p className="text-sm text-text-dim">
              No conditions yet. Add conditions to define which users belong to this segment.
            </p>
          )}

          <div className="space-y-3">
            {conditions.map((condition, index) => (
              <div key={index} className="rounded-md border border-border bg-bg p-4">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-4">
                    <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-text-dim">
                      Attribute
                    </label>
                    <input
                      type="text"
                      value={condition.attribute}
                      onChange={(e) => updateCondition(index, { attribute: e.target.value })}
                      placeholder="plan"
                      className="w-full rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-sm text-text focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-text-dim">
                      Operator
                    </label>
                    <select
                      value={condition.operator}
                      onChange={(e) => updateCondition(index, { operator: e.target.value })}
                      className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-text focus:border-primary focus:outline-none"
                    >
                      <option value="equals">equals</option>
                      <option value="notEquals">not equals</option>
                      <option value="in">in</option>
                      <option value="contains">contains</option>
                    </select>
                  </div>
                  <div className="col-span-5">
                    <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-text-dim">
                      Value
                    </label>
                    <input
                      type="text"
                      value={String(condition.value)}
                      onChange={(e) => updateCondition(index, { value: e.target.value })}
                      placeholder="pro"
                      className="w-full rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-sm text-text focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end border-t border-border pt-3">
                  <button
                    onClick={() => removeCondition(index)}
                    className="text-sm text-text-dim transition-colors hover:text-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveConditions}
            disabled={savingConditions || conditionsSaved}
            className={`mt-4 rounded-md px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-50 ${
              conditionsSaved && !savingConditions
                ? 'bg-success/15 text-success'
                : 'bg-primary text-white hover:opacity-90'
            }`}
          >
            {savingConditions ? 'Saving…' : conditionsSaved ? 'Saved ✓' : 'Save Conditions'}
          </button>
        </section>
      </div>
    </div>
  );
}

export default SegmentDetail;
