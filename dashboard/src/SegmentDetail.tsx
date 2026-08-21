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

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();

      setSegment(data);
      setConditions(data.conditions ?? []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load segment'
      );
    } finally {
      setLoading(false);
    }
  }

  function addCondition() {
    setConditions((prev) => [
      ...prev,
      {
        attribute: '',
        operator: 'equals',
        value: '',
      },
    ]);

    setConditionsSaved(false);
  }

  function updateCondition(
    index: number,
    changes: Partial<SegmentCondition>
  ) {
    setConditions((prev) =>
      prev.map((condition, i) =>
        i === index
          ? { ...condition, ...changes }
          : condition
      )
    );

    setConditionsSaved(false);
  }

  function removeCondition(index: number) {
    setConditions((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setConditionsSaved(false);
  }

  async function handleSaveConditions() {
    if (!segment) return;

    setSavingConditions(true);
    setError(null);

    try {
      const response = await apiFetch(
        `/segments/${segment.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conditions }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      const updated = await response.json();

      setSegment(updated);
      setConditions(updated.conditions ?? conditions);
      setConditionsSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save conditions'
      );
    } finally {
      setSavingConditions(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <div className="mx-auto max-w-[1020px] px-6 py-10 lg:px-0">
          <div className="border-y border-border py-6 font-mono text-xs text-text-dim">
            Loading segment…
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <div className="mx-auto max-w-[1020px] px-6 py-10 lg:px-0">
          <div className="border border-danger/30 bg-danger/5 px-5 py-4 text-sm text-danger">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!segment) return null;

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="mx-auto max-w-[1020px] px-6 py-8 lg:px-0 lg:py-10">

        {/* Back navigation */}
        <Link
          to="/segments"
          className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim transition-colors hover:text-text"
        >
          <span>←</span>
          <span>Segments</span>
        </Link>

        {/* Header */}
        <header className="mb-10 border-b border-border pb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">
                Audience definition
              </div>

              <h1 className="font-mono text-[26px] font-medium leading-none tracking-[-0.04em]">
                {segment.name}
              </h1>
            </div>

            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-dim">
              {segment.conditions.length}{' '}
              condition
              {segment.conditions.length !== 1
                ? 's'
                : ''}

              <span className="mx-2 text-border">
                /
              </span>

              Updated{' '}
              {new Date(
                segment.updatedAt
              ).toLocaleString()}
            </div>
          </div>
        </header>

        {/* Error notification */}
        {error && (
          <div className="mb-5 border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Conditions section */}
        <section className="border border-border bg-surface/20">

          {/* Section header */}
          <div className="flex flex-col gap-5 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">
              <span className="font-mono text-[10px] text-text-dim">
                01
              </span>

              <div>
                <h2 className="text-sm font-medium tracking-[-0.01em]">
                  Conditions
                </h2>

                <p className="mt-1.5 max-w-lg text-xs leading-5 text-text-dim">
                  Define which users belong to this reusable
                  audience.
                </p>
              </div>
            </div>

            <button
              onClick={addCondition}
              className="self-start border border-border px-3 py-2 text-xs font-medium text-text-dim transition-colors hover:border-primary hover:text-primary sm:self-auto"
            >
              + Add condition
            </button>
          </div>

          {/* Conditions body */}
          <div className="p-5">

            {conditions.length === 0 && (
              <div className="border border-dashed border-border px-5 py-12 text-center">

                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
                  No conditions
                </div>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-dim/80">
                  Add a condition to define the users
                  included in this segment.
                </p>

                <button
                  onClick={addCondition}
                  className="mt-5 border border-border px-4 py-2 text-xs font-medium text-text-dim transition-colors hover:border-primary hover:text-primary"
                >
                  Add first condition
                </button>
              </div>
            )}

            {/* Condition rows */}
            <div className="space-y-3">
              {conditions.map(
                (condition, index) => (
                  <div
                    key={index}
                    className="border border-border bg-bg"
                  >

                    {/* Condition toolbar */}
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-primary">
                          {String(index + 1).padStart(
                            2,
                            '0'
                          )}
                        </span>

                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-dim">
                          Condition
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          removeCondition(index)
                        }
                        className="text-[11px] text-text-dim transition-colors hover:text-danger"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Inputs */}
                    <div className="grid gap-4 p-4 sm:grid-cols-12">

                      {/* Attribute */}
                      <div className="sm:col-span-4">
                        <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim">
                          Attribute
                        </label>

                        <input
                          type="text"
                          value={condition.attribute}
                          onChange={(e) =>
                            updateCondition(
                              index,
                              {
                                attribute:
                                  e.target.value,
                              }
                            )
                          }
                          placeholder="plan"
                          className="w-full border border-border bg-surface px-3 py-2.5 font-mono text-[13px] text-text outline-none transition-colors placeholder:text-text-dim/40 focus:border-primary"
                        />
                      </div>

                      {/* Operator */}
                      <div className="sm:col-span-3">
                        <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim">
                          Operator
                        </label>

                        <select
                          value={condition.operator}
                          onChange={(e) =>
                            updateCondition(
                              index,
                              {
                                operator:
                                  e.target.value,
                              }
                            )
                          }
                          className="w-full border border-border bg-surface px-3 py-2.5 text-[13px] text-text outline-none transition-colors focus:border-primary"
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
                        </select>
                      </div>

                      {/* Value */}
                      <div className="sm:col-span-5">
                        <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim">
                          Value
                        </label>

                        <input
                          type="text"
                          value={String(
                            condition.value
                          )}
                          onChange={(e) =>
                            updateCondition(
                              index,
                              {
                                value:
                                  e.target.value,
                              }
                            )
                          }
                          placeholder="pro"
                          className="w-full border border-border bg-surface px-3 py-2.5 font-mono text-[13px] text-text outline-none transition-colors placeholder:text-text-dim/40 focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Save footer */}
            <div className="mt-5 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-dim">
                {conditions.length} condition
                {conditions.length !== 1
                  ? 's'
                  : ''}{' '}
                configured
              </div>

              <button
                onClick={handleSaveConditions}
                disabled={
                  savingConditions ||
                  conditionsSaved
                }
                className={`border px-4 py-2.5 text-xs font-medium transition-colors disabled:cursor-default disabled:opacity-60 ${
                  conditionsSaved &&
                  !savingConditions
                    ? 'border-success/30 text-success'
                    : 'border-primary bg-primary text-white hover:bg-transparent hover:text-primary'
                }`}
              >
                {savingConditions
                  ? 'Saving…'
                  : conditionsSaved
                    ? 'Saved'
                    : 'Save conditions'}
              </button>
            </div>
          </div>
        </section>

        {/* Metadata */}
        <section className="mt-5 grid border border-border bg-surface/20 sm:grid-cols-3">

          <div className="border-b border-border p-5 sm:border-b-0 sm:border-r">
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim">
              Segment ID
            </div>

            <div className="mt-2 truncate font-mono text-[11px] text-text">
              {segment.id}
            </div>
          </div>

          <div className="border-b border-border p-5 sm:border-b-0 sm:border-r">
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim">
              Created
            </div>

            <div className="mt-2 text-xs text-text">
              {new Date(
                segment.createdAt
              ).toLocaleString()}
            </div>
          </div>

          <div className="p-5">
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim">
              Evaluation
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Local
            </div>
          </div>
        </section>

        {/* Footer metadata */}
        <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-text-dim sm:flex-row sm:items-center sm:justify-between">
          <span>
            Segment / {segment.name}
          </span>

          <span>
            Real-time configuration
          </span>
        </div>
      </div>
    </div>
  );
}

export default SegmentDetail;
