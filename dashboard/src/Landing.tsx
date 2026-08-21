import { Link } from 'react-router-dom';

const features = [
  {
    number: '01',
    title: 'Targeting rules',
    description:
      'Evaluate users against attributes, cohorts and reusable segments. Rules are resolved deterministically, in order.',
    detail: 'equals · in · contains · inSegment',
  },
  {
    number: '02',
    title: 'Controlled rollouts',
    description:
      'Gradually expose a feature from 1% to 100% using deterministic SHA-256 bucketing. The same user gets the same result.',
    detail: '1% → 100% · deterministic',
  },
  {
    number: '03',
    title: 'Experiments',
    description:
      'Assign variants, record exposures and measure conversions without adding another analytics dependency to your application.',
    detail: 'exposure · conversion · variants',
  },
  {
    number: '04',
    title: 'Live propagation',
    description:
      'Changes move through Redis Pub/Sub and SSE to connected SDK clients. No polling loop sitting between your application and a flag.',
    detail: 'Redis Pub/Sub · SSE',
  },
  {
    number: '05',
    title: 'Reusable segments',
    description:
      'Define a cohort once and reference it from multiple flags. Keep targeting logic centralized instead of duplicating conditions.',
    detail: 'one definition · many flags',
  },
  {
    number: '06',
    title: 'Local evaluation',
    description:
      'The SDK fetches configuration once and evaluates locally. Feature checks stay fast and do not require a network request.',
    detail: 'local · cached · resilient',
  },
];

const stack = [
  { name: 'Fastify', role: 'API', description: 'HTTP + SSE' },
  { name: 'PostgreSQL', role: 'Storage', description: 'Persistent state' },
  { name: 'Redis', role: 'Realtime', description: 'Cache + Pub/Sub' },
  { name: 'React', role: 'Console', description: 'Vite dashboard' },
];

function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-bg text-text">
      {/* Navigation */}
      <header className="border-b border-border/70">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center border border-border bg-surface">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 7.2L5.6 9.8L11 4.2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span className="text-[15px] font-semibold tracking-[-0.02em]">
              Flagwise
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/vivekstackk/feature-flag-platform"
              target="_blank"
              rel="noreferrer"
              className="hidden text-sm text-text-dim transition-colors hover:text-text sm:block"
            >
              GitHub
            </a>

            <Link
              to="/dashboard"
              className="border border-primary bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-transparent hover:text-primary"
            >
              Open dashboard
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative border-b border-border/70">
          <div className="mx-auto grid max-w-7xl grid-cols-1 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="flex min-h-[620px] flex-col justify-center py-24 lg:border-r lg:border-border/70 lg:pr-20">
              <div className="mb-8 flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-dim">
                  Open source / Self hosted
                </span>
              </div>

              <h1 className="max-w-4xl text-[clamp(3.4rem,7vw,6.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
                Ship features
                <br />
                <span className="text-primary">with confidence.</span>
              </h1>

              <p className="mt-9 max-w-xl text-[17px] leading-8 text-text-dim">
                A feature flag platform built for engineers who want
                targeting, controlled rollouts and real-time configuration
                without handing their application to another SDK.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center gap-3 border border-primary bg-primary px-5 py-3 text-sm font-medium text-white transition-all hover:bg-transparent hover:text-primary"
                >
                  Launch dashboard
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <a
                  href="https://github.com/vivekstackk/feature-flag-platform"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-border px-5 py-3 text-sm font-medium text-text-dim transition-colors hover:border-text-dim hover:text-text"
                >
                  View source
                </a>
              </div>

              <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-border/70 pt-5">
                <span className="font-mono text-[11px] text-text-dim">
                  TypeScript
                </span>
                <span className="font-mono text-[11px] text-text-dim">
                  PostgreSQL
                </span>
                <span className="font-mono text-[11px] text-text-dim">
                  Redis
                </span>
                <span className="font-mono text-[11px] text-text-dim">
                  Fastify
                </span>
                <span className="font-mono text-[11px] text-text-dim">
                  React
                </span>
              </div>
            </div>

            {/* Code panel */}
            <div className="flex items-center py-16 lg:pl-16">
              <div className="w-full border border-border bg-surface">
                <div className="flex h-11 items-center justify-between border-b border-border px-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-danger/70" />
                    <span className="h-2 w-2 rounded-full bg-warning/70" />
                    <span className="h-2 w-2 rounded-full bg-success/70" />
                  </div>

                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
                    evaluate.ts
                  </span>
                </div>

                <div className="border-b border-border/70 bg-bg px-5 py-3">
                  <span className="font-mono text-[10px] text-text-dim">
                    SDK / LOCAL EVALUATION
                  </span>
                </div>

                <pre className="overflow-x-auto p-6 font-mono text-[12px] leading-[2] sm:text-[13px]">
                  <code>
                    <span className="text-text-dim">
                      {'// no network call per evaluation'}
                    </span>
                    {'\n\n'}
                    <span className="text-primary">import</span>
                    {' { FeatureFlagClient } '}
                    <span className="text-primary">from</span>
                    {' '}
                    <span className="text-success">
                      {'"./sdk"'}
                    </span>
                    {';\n\n'}
                    <span className="text-primary">const</span>
                    {' client = '}
                    <span className="text-primary">new</span>
                    {' FeatureFlagClient({\n'}
                    {'  baseUrl: '}
                    <span className="text-success">
                      {'"https://api.flagwise.dev"'}
                    </span>
                    {',\n'}
                    {'});\n\n'}
                    <span className="text-primary">await</span>
                    {' client.'}
                    <span className="text-warning">start</span>
                    {'();\n\n'}
                    <span className="text-primary">const</span>
                    {' enabled = client.'}
                    <span className="text-warning">evaluate</span>
                    {'(\n'}
                    {'  '}
                    <span className="text-success">
                      {'"new-checkout"'}
                    </span>
                    {',\n'}
                    {'  { userId: '}
                    <span className="text-success">
                      {'"user-42"'}
                    </span>
                    {',\n'}
                    {'    attributes: { plan: '}
                    <span className="text-success">
                      {'"pro"'}
                    </span>
                    {' }\n'}
                    {'  }\n'}
                    {');\n\n'}
                    <span className="text-text-dim">
                      {'// → true'}
                    </span>
                  </code>
                </pre>

                <div className="flex items-center justify-between border-t border-border bg-bg px-5 py-3">
                  <span className="font-mono text-[10px] text-text-dim">
                    evaluation
                  </span>
                  <span className="font-mono text-[10px] text-success">
                    local · deterministic
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Positioning strip */}
        <section className="border-b border-border/70">
          <div className="mx-auto grid max-w-7xl grid-cols-1 px-6 sm:grid-cols-3 lg:px-8">
            <div className="border-b border-border/70 px-0 py-7 sm:border-b-0 sm:border-r sm:pr-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">
                Evaluate
              </p>
              <p className="mt-2 text-sm font-medium">
                Rules run where your code runs.
              </p>
            </div>

            <div className="border-b border-border/70 py-7 sm:border-b-0 sm:px-8 sm:border-r">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">
                Control
              </p>
              <p className="mt-2 text-sm font-medium">
                Roll out changes deliberately.
              </p>
            </div>

            <div className="py-7 sm:pl-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">
                Observe
              </p>
              <p className="mt-2 text-sm font-medium">
                Know exactly what changed.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[0.32fr_0.68fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                Capabilities
              </p>

              <h2 className="mt-5 max-w-xs text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                The control layer between code and release.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-text-dim">
                Keep feature delivery separate from deployment. Change
                behaviour without rebuilding the application.
              </p>
            </div>

            <div className="border-t border-border">
              {features.map((feature) => (
                <div
                  key={feature.number}
                  className="group grid gap-5 border-b border-border py-7 transition-colors hover:bg-surface/50 sm:grid-cols-[48px_0.8fr_1.2fr] sm:items-start"
                >
                  <span className="font-mono text-[11px] text-text-dim">
                    {feature.number}
                  </span>

                  <h3 className="text-base font-medium tracking-[-0.01em]">
                    {feature.title}
                  </h3>

                  <div>
                    <p className="max-w-lg text-sm leading-6 text-text-dim">
                      {feature.description}
                    </p>

                    <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-primary/80">
                      {feature.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="border-y border-border/70 bg-surface/30">
          <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
            <div className="flex flex-col justify-between gap-8 border-b border-border pb-10 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                  Architecture
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  Small system. Clear boundaries.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-6 text-text-dim">
                Each component has a narrow responsibility: persistence,
                caching, transport, evaluation and the developer console.
              </p>
            </div>

            <div className="grid border-l border-border sm:grid-cols-2 lg:grid-cols-4">
              {stack.map((item) => (
                <div
                  key={item.name}
                  className="min-h-[190px] border-b border-r border-border p-7 lg:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] text-text-dim">
                      {item.role}
                    </span>

                    <span className="font-mono text-[10px] text-text-dim">
                      /0{stack.indexOf(item) + 1}
                    </span>
                  </div>

                  <h3 className="mt-12 text-lg font-medium tracking-[-0.02em]">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-xs text-text-dim">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid border border-border sm:grid-cols-3">
              <div className="border-b border-border p-7 sm:border-b-0 sm:border-r">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
                  Test suite
                </span>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                  60
                </p>
                <p className="mt-1 text-xs text-text-dim">passing tests</p>
              </div>

              <div className="border-b border-border p-7 sm:border-b-0 sm:border-r">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
                  Evaluation
                </span>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                  &lt;1ms
                </p>
                <p className="mt-1 text-xs text-text-dim">local evaluation</p>
              </div>

              <div className="p-7">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
                  Propagation
                </span>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                  ~1s
                </p>
                <p className="mt-1 text-xs text-text-dim">via SSE</p>
              </div>
            </div>
          </div>
        </section>

        {/* Observability */}
        <section className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                Observability
              </p>

              <h2 className="mt-5 max-w-md text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                Changes should leave a trail.
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-text-dim">
                Every mutation is recorded. Health checks expose dependency
                state, while Redis failures gracefully fall back to
                PostgreSQL.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  'Audit log on every mutation',
                  'Unauthenticated health endpoint',
                  'Graceful Redis degradation',
                  'Self-healing keep-alive',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-4 w-4 items-center justify-center border border-success/40 text-success">
                      <svg
                        width="9"
                        height="9"
                        viewBox="0 0 9 9"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M1.5 4.5L3.5 6.5L7.5 2.5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>

                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
                  GET /health
                </span>

                <span className="flex items-center gap-2 font-mono text-[10px] text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  healthy
                </span>
              </div>

              <pre className="overflow-x-auto p-6 font-mono text-xs leading-7 sm:text-sm">
                <code>
                  {'{\n'}
                  {'  '}
                  <span className="text-primary">"status"</span>
                  {': '}
                  <span className="text-success">"healthy"</span>
                  {',\n'}
                  {'  '}
                  <span className="text-primary">"checks"</span>
                  {': {\n'}
                  {'    '}
                  <span className="text-primary">"postgres"</span>
                  {': '}
                  <span className="text-success">"ok"</span>
                  {',\n'}
                  {'    '}
                  <span className="text-primary">"redis"</span>
                  {': '}
                  <span className="text-success">"ok"</span>
                  {'\n'}
                  {'  }\n'}
                  {'}'}
                </code>
              </pre>

              <div className="grid border-t border-border sm:grid-cols-2">
                <div className="border-b border-border p-5 sm:border-b-0 sm:border-r">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
                    PostgreSQL
                  </p>
                  <p className="mt-2 text-sm text-success">operational</p>
                </div>

                <div className="p-5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
                    Redis
                  </p>
                  <p className="mt-2 text-sm text-success">operational</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border/70">
          <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
            <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                  Ready when you are
                </p>

                <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">
                  Put releases behind a switch.
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-text-dim">
                  Create a flag, define targeting, and watch configuration
                  propagate through the system in real time.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  to="/dashboard"
                  className="border border-primary bg-primary px-5 py-3 text-sm font-medium text-white transition-all hover:bg-transparent hover:text-primary"
                >
                  Open dashboard →
                </Link>

                <a
                  href="https://github.com/vivekstackk/feature-flag-platform"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-border px-5 py-3 text-sm font-medium text-text-dim transition-colors hover:border-text-dim hover:text-text"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
            Flagwise · 2026
          </span>

          <a
            href="https://github.com/vivekstackk/feature-flag-platform"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[10px] text-text-dim transition-colors hover:text-text"
          >
            github.com/vivekstackk/feature-flag-platform
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Landing;