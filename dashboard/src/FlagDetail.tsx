import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface TargetingRule {
  attribute: string;
  operator: string;
  value: string | number | boolean | (string | number)[];
  serveValue: boolean;
}

interface Flag {
  id: string;
  key: string;
  description: string;
  enabled: boolean;
  defaultValue: boolean;
  rules: TargetingRule[];
  rollout: { percentage: number; serveValue: boolean } | null;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = 'http://localhost:3000';

function FlagDetail() {
  const { id } = useParams<{ id: string }>();
  const [flag, setFlag] = useState<Flag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rolloutPercentage, setRolloutPercentage] = useState(0);
  const [savingRollout, setSavingRollout] = useState(false);
  const [rolloutSaved, setRolloutSaved] = useState(true);

  useEffect(() => {
    fetchFlag();
  }, [id]);

  async function fetchFlag() {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/flags/${id}`);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      setFlag(data);
      setRolloutPercentage(data.rollout?.percentage ?? 0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load flag');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveRollout() {
    if (!flag) return;
    setSavingRollout(true);

    try {
      const response = await fetch(`${API_BASE}/flags/${flag.id}/rollout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rollout: rolloutPercentage > 0 ? { percentage: rolloutPercentage, serveValue: true } : null,
        }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const updated = await response.json();
      setFlag(updated);
      setRolloutSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save rollout');
    } finally {
      setSavingRollout(false);
    }
  }

  if (loading) return <div className="p-10 text-text-dim">Loading…</div>;
  if (error) return <div className="p-10 text-danger">Error: {error}</div>;
  if (!flag) return null;

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link to="/" className="mb-6 inline-block text-sm text-text-dim hover:text-text">
          ← Back to flags
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold">{flag.key}</h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                flag.enabled ? 'bg-success/15 text-success' : 'bg-text-dim/15 text-text-dim'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${flag.enabled ? 'bg-success' : 'bg-text-dim'}`}
              />
              {flag.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          {flag.description && <p className="mt-2 text-sm text-text-dim">{flag.description}</p>}
        </header>

        <section className="rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold">Rollout Percentage</h2>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={rolloutPercentage}
              onChange={(e) => {
                setRolloutPercentage(Number(e.target.value));
                setRolloutSaved(false);
              }}
              className="flex-1 accent-primary"
            />
            <div className="flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1">
              <input
                type="number"
                min="0"
                max="100"
                value={rolloutPercentage}
                onChange={(e) => {
                  setRolloutPercentage(Number(e.target.value));
                  setRolloutSaved(false);
                }}
                className="w-14 bg-transparent text-right font-mono text-sm text-text focus:outline-none"
              />
              <span className="font-mono text-sm text-text-dim">%</span>
            </div>
          </div>
          <button
            onClick={handleSaveRollout}
            disabled={savingRollout || rolloutSaved}
            className={`mt-4 rounded-md px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-50 ${
              rolloutSaved && !savingRollout
                ? 'bg-success/15 text-success'
                : 'bg-primary text-white hover:opacity-90'
            }`}
          >
            {savingRollout ? 'Saving…' : rolloutSaved ? 'Saved ✓' : 'Save Rollout'}
          </button>
        </section>
      </div>
    </div>
  );
}

export default FlagDetail;