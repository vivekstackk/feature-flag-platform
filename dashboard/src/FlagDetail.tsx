import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from './api';

interface TargetingRule {
  attribute: string;
  operator: string;
  value: string | number | boolean | (string | number)[];
  serveValue: boolean;
}

interface VariantStats {
  variant: boolean;
  exposures: number;
  conversions: number;
  conversionRate: number;
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

function FlagDetail() {
  const { id } = useParams<{ id: string }>();
  const [flag, setFlag] = useState<Flag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rolloutPercentage, setRolloutPercentage] = useState(0);
  const [savingRollout, setSavingRollout] = useState(false);
  const [rolloutSaved, setRolloutSaved] = useState(true);

  const [rules, setRules] = useState<TargetingRule[]>([]);
  const [rulesSaved, setRulesSaved] = useState(true);
  const [savingRules, setSavingRules] = useState(false);

  const [eventName, setEventName] = useState('');
  const [stats, setStats] = useState<VariantStats[] | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    fetchFlag();
  }, [id]);

  async function fetchFlag() {
    try {
      setLoading(true);
      const response = await apiFetch(`/flags/${id}`);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      setFlag(data);
      setRolloutPercentage(data.rollout?.percentage ?? 0);
      setRules(data.rules ?? []);
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
      const response = await apiFetch(`/flags/${flag.id}/rollout`, {
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

  function addRule() {
    setRules((prev) => [
      ...prev,
      { attribute: '', operator: 'equals', value: '', serveValue: true },
    ]);
    setRulesSaved(false);
  }

  function updateRule(index: number, changes: Partial<TargetingRule>) {
    setRules((prev) => prev.map((rule, i) => (i === index ? { ...rule, ...changes } : rule)));
    setRulesSaved(false);
  }

  function removeRule(index: number) {
    setRules((prev) => prev.filter((_, i) => i !== index));
    setRulesSaved(false);
  }

  async function handleSaveRules() {
    if (!flag) return;
    setSavingRules(true);

    try {
      const response = await apiFetch(`/flags/${flag.id}/rules`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const updated = await response.json();
      setFlag(updated);
      setRulesSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save rules');
    } finally {
      setSavingRules(false);
    }
  }

  async function handleLoadStats() {
    if (!flag || !eventName.trim()) return;
    setLoadingStats(true);
    setStatsError(null);

    try {
      const response = await apiFetch(
        `/experiments/${flag.key}/stats?event=${encodeURIComponent(eventName)}`
      );
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      setStats(data.variants);
    } catch (err) {
      setStatsError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoadingStats(false);
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

        <section className="mt-6 rounded-lg border border-border bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Targeting Rules</h2>
            <button
              onClick={addRule}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-text-dim transition-colors hover:border-primary hover:text-text"
            >
              + Add Rule
            </button>
          </div>

          {rules.length === 0 && (
            <p className="text-sm text-text-dim">No rules yet. Add one to target specific users.</p>
          )}

          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div key={index} className="rounded-md border border-border bg-bg p-4">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-4">
                    <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-text-dim">
                      Attribute
                    </label>
                    <input
                      type="text"
                      value={rule.attribute}
                      onChange={(e) => updateRule(index, { attribute: e.target.value })}
                      placeholder="plan"
                      className="w-full rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-sm text-text focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-text-dim">
                      Operator
                    </label>
                    <select
                      value={rule.operator}
                      onChange={(e) => updateRule(index, { operator: e.target.value })}
                      className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-text focus:border-primary focus:outline-none"
                    >
                      <option value="equals">equals</option>
                      <option value="notEquals">not equals</option>
                      <option value="in">in</option>
                      <option value="contains">contains</option>
                      <option value="inSegment">in segment</option>
                    </select>
                  </div>
                  <div className="col-span-5">
                    <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-text-dim">
                      Value
                    </label>
                    <input
                      type="text"
                      value={String(rule.value)}
                      onChange={(e) => updateRule(index, { value: e.target.value })}
                      placeholder="pro"
                      className="w-full rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-sm text-text focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-2 text-sm text-text-dim">
                    Then serve:
                    <button
                      onClick={() => updateRule(index, { serveValue: true })}
                      className={`rounded-md px-3 py-1 text-xs font-medium ${
                        rule.serveValue ? 'bg-surface-high text-text' : 'text-text-dim'
                      }`}
                    >
                      True
                    </button>
                    <button
                      onClick={() => updateRule(index, { serveValue: false })}
                      className={`rounded-md px-3 py-1 text-xs font-medium ${
                        !rule.serveValue ? 'bg-surface-high text-text' : 'text-text-dim'
                      }`}
                    >
                      False
                    </button>
                  </div>
                  <button
                    onClick={() => removeRule(index)}
                    className="text-sm text-text-dim transition-colors hover:text-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveRules}
            disabled={savingRules || rulesSaved}
            className={`mt-4 rounded-md px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-50 ${
              rulesSaved && !savingRules
                ? 'bg-success/15 text-success'
                : 'bg-primary text-white hover:opacity-90'
            }`}
          >
            {savingRules ? 'Saving…' : rulesSaved ? 'Saved ✓' : 'Save Rules'}
          </button>
        </section>

        <section className="mt-6 rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold">Experiment Stats</h2>
          <div className="mb-4 flex items-center gap-3">
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="purchase"
              className="flex-1 rounded-md border border-border bg-bg px-3 py-2 font-mono text-sm text-text placeholder-text-dim/50 focus:border-primary focus:outline-none"
            />
            <button
              onClick={handleLoadStats}
              disabled={loadingStats || !eventName.trim()}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loadingStats ? 'Loading…' : 'Load Stats'}
            </button>
          </div>

          {statsError && <p className="text-sm text-danger">{statsError}</p>}

          {stats && stats.length === 0 && (
            <p className="text-sm text-text-dim">No exposure data yet for this event.</p>
          )}

          {stats && stats.length > 0 && (
            <div className="space-y-3">
              {stats.map((variant) => (
                <div
                  key={String(variant.variant)}
                  className="flex items-center justify-between rounded-md border border-border bg-bg p-4"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${variant.variant ? 'bg-success' : 'bg-text-dim'}`}
                    />
                    <span className="font-mono text-sm">{variant.variant ? 'true' : 'false'}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-text-dim">
                      Exposures: <span className="font-mono text-text">{variant.exposures}</span>
                    </span>
                    <span className="text-text-dim">
                      Conversions: <span className="font-mono text-text">{variant.conversions}</span>
                    </span>
                    <span className="text-text-dim">
                      Rate:{' '}
                      <span className="font-mono text-text">
                        {(variant.conversionRate * 100).toFixed(1)}%
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default FlagDetail;