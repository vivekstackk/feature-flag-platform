import {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  Link,
  useNavigate,
} from 'react-router-dom';

import { apiFetch } from './api';

interface TargetingRule {
  attribute: string;
  operator: string;
  value:
    | string
    | number
    | boolean
    | (string | number)[];
  serveValue: boolean;
}

interface AuditEntry {
  id: string;
  action: string;
  changes: Record<string, unknown>;
  createdAt: string;
}

interface Flag {
  id: string;
  key: string;
  description: string;
  enabled: boolean;
  defaultValue: boolean;
  rules: TargetingRule[];
  rollout: {
    percentage: number;
    serveValue: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
}

function FlagDetail() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const [flag, setFlag] =
    useState<Flag | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [rolloutPercentage, setRolloutPercentage] =
    useState(0);

  const [savingRollout, setSavingRollout] =
    useState(false);

  const [rolloutSaved, setRolloutSaved] =
    useState(true);

  const [rules, setRules] =
    useState<TargetingRule[]>([]);

  const [rulesSaved, setRulesSaved] =
    useState(true);

  const [savingRules, setSavingRules] =
    useState(false);

  const [auditLog, setAuditLog] =
    useState<AuditEntry[]>([]);

  useEffect(() => {
    fetchFlag();
  }, [id]);

  async function fetchFlag() {
    try {
      setLoading(true);

      const response = await apiFetch(
        `/flags/${id}`
      );

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      const data = await response.json();

      setFlag(data);

      setRolloutPercentage(
        data.rollout?.percentage ?? 0
      );

      setRules(data.rules ?? []);

      setError(null);

      const auditResponse = await apiFetch(
        `/audit-log/flag/${id}`
      );

      if (auditResponse.ok) {
        const auditData =
          await auditResponse.json();

        setAuditLog(auditData);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load flag'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveRollout() {
    if (!flag) return;

    setSavingRollout(true);

    try {
      const response = await apiFetch(
        `/flags/${flag.id}/rollout`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rollout:
              rolloutPercentage > 0
                ? {
                    percentage:
                      rolloutPercentage,
                    serveValue: true,
                  }
                : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      const updated =
        await response.json();

      setFlag(updated);
      setRolloutSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save rollout'
      );
    } finally {
      setSavingRollout(false);
    }
  }

  function addRule() {
    setRules((prev) => [
      ...prev,
      {
        attribute: '',
        operator: 'equals',
        value: '',
        serveValue: true,
      },
    ]);

    setRulesSaved(false);
  }

  function updateRule(
    index: number,
    changes: Partial<TargetingRule>
  ) {
    setRules((prev) =>
      prev.map((rule, i) =>
        i === index
          ? {
              ...rule,
              ...changes,
            }
          : rule
      )
    );

    setRulesSaved(false);
  }

  function removeRule(index: number) {
    setRules((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setRulesSaved(false);
  }

  async function handleSaveRules() {
    if (!flag) return;

    setSavingRules(true);

    try {
      const response = await apiFetch(
        `/flags/${flag.id}/rules`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rules,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      const updated =
        await response.json();

      setFlag(updated);
      setRulesSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save rules'
      );
    } finally {
      setSavingRules(false);
    }
  }

  async function handleDeleteFlag() {
    if (!flag) return;

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

      // IMPORTANT:
      // Go back to dashboard, NOT landing.
      navigate('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete flag'
      );
    }
  }

  const hasUnsavedChanges =
    !rolloutSaved || !rulesSaved;

  const [savingAll, setSavingAll] =
    useState(false);

  async function handleSaveAll() {
    if (!flag) return;

    setSavingAll(true);
    setError(null);

    try {
      if (!rolloutSaved) {
        await handleSaveRollout();
      }

      if (!rulesSaved) {
        await handleSaveRules();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save changes'
      );
    } finally {
      setSavingAll(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090B] p-10 text-[#666B74]">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#08090B] p-10 text-[#F87171]">
        Error: {error}
      </div>
    );
  }

  if (!flag) return null;

  return (
    <div className="min-h-screen bg-[#08090B] text-[#E9EAED]">

      <div className="mx-auto w-full px-5 py-8 sm:px-8 lg:px-12">

        {/* BACK TO DASHBOARD */}
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5F646D] transition-colors hover:text-white"
        >
          ← Feature Flags
        </Link>

        {/* Header */}
        <header className="mb-8 border-b border-white/[0.065] pb-7">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-3">

              <h1 className="font-mono text-2xl font-semibold">
                {flag.key}
              </h1>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  flag.enabled
                    ? 'bg-[#3AC88D]/[0.12] text-[#3AC88D]'
                    : 'bg-white/[0.05] text-[#666B74]'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    flag.enabled
                      ? 'bg-[#3AC88D]'
                      : 'bg-[#666B74]'
                  }`}
                />

                {flag.enabled
                  ? 'Enabled'
                  : 'Disabled'}
              </span>
            </div>

            <div className="flex items-center gap-2">

              {hasUnsavedChanges && (
                <button
                  onClick={handleSaveAll}
                  disabled={savingAll}
                  className="rounded-full bg-[#3F7FF5] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {savingAll
                    ? 'Saving…'
                    : 'Save All Changes'}
                </button>
              )}

              <button
                onClick={handleDeleteFlag}
                className="rounded-full border border-[#F87171]/25 px-4 py-2 text-sm text-[#F87171] transition-colors hover:bg-[#F87171] hover:text-white"
              >
                Delete Flag
              </button>
            </div>
          </div>

          {flag.description && (
            <p className="mt-2 text-sm text-[#666B74]">
              {flag.description}
            </p>
          )}
        </header>

        {/* Rollout */}
        <section className="rounded-2xl border border-white/[0.075] bg-[#111317] p-6">

          <h2 className="mb-5 text-lg font-semibold">
            Rollout Percentage
          </h2>

          <div className="flex items-center gap-4">

            <input
              type="range"
              min="0"
              max="100"
              value={rolloutPercentage}
              onChange={(e) => {
                setRolloutPercentage(
                  Number(e.target.value)
                );

                setRolloutSaved(false);
              }}
              className="flex-1 accent-[#3F7FF5]"
            />

            <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-[#08090B] px-2 py-1">
              <input
                type="number"
                min="0"
                max="100"
                value={rolloutPercentage}
                onChange={(e) => {
                  setRolloutPercentage(
                    Number(e.target.value)
                  );

                  setRolloutSaved(false);
                }}
                className="w-14 bg-transparent text-right font-mono text-sm text-white focus:outline-none"
              />

              <span className="font-mono text-sm text-[#666B74]">
                %
              </span>
            </div>
          </div>

          <button
            onClick={handleSaveRollout}
            disabled={
              savingRollout ||
              rolloutSaved
            }
            className={`mt-5 rounded-full px-5 py-2 text-sm font-medium transition-opacity disabled:opacity-50 ${
              rolloutSaved &&
              !savingRollout
                ? 'bg-[#3AC88D]/[0.12] text-[#3AC88D]'
                : 'bg-[#3F7FF5] text-white hover:opacity-90'
            }`}
          >
            {savingRollout
              ? 'Saving…'
              : rolloutSaved
              ? 'Saved ✓'
              : 'Save Rollout'}
          </button>
        </section>

        {/* Targeting */}
        <section className="mt-6 rounded-2xl border border-white/[0.075] bg-[#111317] p-6">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Targeting Rules
            </h2>

            <button
              onClick={addRule}
              className="rounded-full border border-white/[0.1] px-4 py-2 text-sm text-[#A4A8B0] transition-colors hover:border-[#3F7FF5] hover:text-white"
            >
              + Add Rule
            </button>
          </div>

          {rules.length === 0 && (
            <p className="text-sm text-[#666B74]">
              No rules yet. Add one to target specific users.
            </p>
          )}

          <div className="space-y-3">

            {rules.map((rule, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/[0.07] bg-[#08090B] p-4"
              >

                <div className="grid gap-3 lg:grid-cols-12">

                  <div className="lg:col-span-4">
                    <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[#666B74]">
                      Attribute
                    </label>

                    <input
                      type="text"
                      value={rule.attribute}
                      onChange={(e) =>
                        updateRule(index, {
                          attribute:
                            e.target.value,
                        })
                      }
                      placeholder="plan"
                      className="w-full rounded-lg border border-white/[0.08] bg-[#111317] px-3 py-2 font-mono text-sm text-white focus:border-[#3F7FF5] focus:outline-none"
                    />
                  </div>

                  <div className="lg:col-span-3">
                    <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[#666B74]">
                      Operator
                    </label>

                    <select
                      value={rule.operator}
                      onChange={(e) =>
                        updateRule(index, {
                          operator:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-white/[0.08] bg-[#111317] px-3 py-2 text-sm text-white focus:border-[#3F7FF5] focus:outline-none"
                    >
                      <option value="equals">
                        equals
                      </option>

                      <option value="notEquals">
                        not equals
                      </option>

                      <option value="in">
                        in
                      </option>

                      <option value="contains">
                        contains
                      </option>

                      <option value="inSegment">
                        in segment
                      </option>
                    </select>
                  </div>

                  <div className="lg:col-span-5">
                    <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[#666B74]">
                      Value
                    </label>

                    <input
                      type="text"
                      value={String(
                        rule.value
                      )}
                      onChange={(e) =>
                        updateRule(index, {
                          value:
                            e.target.value,
                        })
                      }
                      placeholder="pro"
                      className="w-full rounded-lg border border-white/[0.08] bg-[#111317] px-3 py-2 font-mono text-sm text-white focus:border-[#3F7FF5] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/[0.065] pt-4">

                  <div className="flex items-center gap-2 text-sm text-[#666B74]">
                    Then serve:

                    <button
                      onClick={() =>
                        updateRule(index, {
                          serveValue: true,
                        })
                      }
                      className={`rounded-lg px-3 py-1 text-xs font-medium ${
                        rule.serveValue
                          ? 'bg-white/[0.08] text-white'
                          : 'text-[#666B74]'
                      }`}
                    >
                      True
                    </button>

                    <button
                      onClick={() =>
                        updateRule(index, {
                          serveValue: false,
                        })
                      }
                      className={`rounded-lg px-3 py-1 text-xs font-medium ${
                        !rule.serveValue
                          ? 'bg-white/[0.08] text-white'
                          : 'text-[#666B74]'
                      }`}
                    >
                      False
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      removeRule(index)
                    }
                    className="text-sm text-[#666B74] transition-colors hover:text-[#F87171]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveRules}
            disabled={
              savingRules || rulesSaved
            }
            className={`mt-5 rounded-full px-5 py-2 text-sm font-medium transition-opacity disabled:opacity-50 ${
              rulesSaved && !savingRules
                ? 'bg-[#3AC88D]/[0.12] text-[#3AC88D]'
                : 'bg-[#3F7FF5] text-white hover:opacity-90'
            }`}
          >
            {savingRules
              ? 'Saving…'
              : rulesSaved
              ? 'Saved ✓'
              : 'Save Rules'}
          </button>
        </section>

        {/* Activity */}
        <section className="mt-6 rounded-2xl border border-white/[0.075] bg-[#111317] p-6">

          <h2 className="mb-5 text-lg font-semibold">
            Activity Log
          </h2>

          {auditLog.length === 0 && (
            <p className="text-sm text-[#666B74]">
              No activity recorded yet.
            </p>
          )}

          <div className="space-y-2">

            {auditLog.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#08090B] p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <span className="text-sm font-medium text-white">
                    {entry.action}
                  </span>

                  <p className="mt-1 font-mono text-xs text-[#666B74]">
                    {JSON.stringify(
                      entry.changes,
                      null,
                      0
                    ).slice(0, 120)}
                  </p>
                </div>

                <span className="whitespace-nowrap text-xs text-[#666B74]">
                  {new Date(
                    entry.createdAt
                  ).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default FlagDetail;