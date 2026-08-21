import { Link } from 'react-router-dom';

const features = [
  {
    number: '01',
    title: 'Targeting',
    description:
      'Control who receives a feature using flexible targeting rules and reusable segments.',
  },
  {
    number: '02',
    title: 'Rollouts',
    description:
      'Release changes gradually with deterministic percentage rollouts.',
  },
  {
    number: '03',
    title: 'Experiments',
    description:
      'Run controlled A/B experiments with variants, exposures and conversions.',
  },
  {
    number: '04',
    title: 'Real-time updates',
    description:
      'Push configuration changes to connected applications without polling.',
  },
];

const stack = [
  {
    name: 'Fastify',
    description: 'API layer',
  },
  {
    name: 'PostgreSQL',
    description: 'Persistent storage',
  },
  {
    name: 'Redis',
    description: 'Cache + realtime',
  },
  {
    name: 'React',
    description: 'Developer console',
  },
];

function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-bg text-text">

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/[0.045] bg-bg/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-5 sm:px-7 lg:px-8">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-surface-high shadow-[inset_0_1px_rgba(255,255,255,0.05)]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3.5 8.2L6.4 11L12.5 4.8"
                  stroke="#4F8CFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span className="text-[15px] font-semibold tracking-[-0.02em]">
              Flagwise
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-5">

            <a
              href="https://github.com/vivekstackk/feature-flag-platform"
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-xl px-3 py-2 text-sm text-text-dim transition-colors hover:bg-surface hover:text-text sm:block"
            >
              GitHub
            </a>

            <Link
              to="/dashboard"
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_5px_20px_rgba(63,134,255,0.18)] transition-all hover:bg-[#4a8dff] active:scale-[0.98]"
            >
              Open dashboard
            </Link>
          </div>
        </nav>
      </header>

      <main>

        {/* Hero */}
        <section className="relative">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[650px] w-[900px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(63,134,255,0.075),transparent_65%)]" />

          <div className="relative mx-auto max-w-[1180px] px-5 pb-24 pt-20 sm:px-7 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-32">

            <div className="mx-auto max-w-[850px] text-center">

              <div className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-white/[0.06] bg-surface/80 px-3.5 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(53,201,139,0.5)]" />

                <span className="text-[11px] font-medium text-text-dim">
                  Open source · Self hosted · Production ready
                </span>
              </div>

              <h1 className="text-[clamp(3.2rem,8vw,6.8rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
                Ship features
                <br />
                <span className="text-primary">
                  without the fear.
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-[650px] text-[16px] leading-7 text-text-dim sm:text-[18px] sm:leading-8">
                A complete feature flag platform for targeting,
                controlled rollouts, experiments and real-time
                configuration. Built from scratch for developers.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3">

                <Link
                  to="/dashboard"
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_7px_25px_rgba(63,134,255,0.2)] transition-all hover:bg-[#4a8dff] active:scale-[0.98]"
                >
                  Launch dashboard →
                </Link>

                <a
                  href="https://github.com/vivekstackk/feature-flag-platform"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/[0.07] bg-surface px-5 py-3 text-sm font-medium text-text-dim transition-all hover:bg-surface-high hover:text-text"
                >
                  View source
                </a>
              </div>
            </div>

            {/* Product preview */}
            <div className="relative mx-auto mt-20 max-w-[1030px]">

              <div className="absolute -inset-10 -z-10 bg-[radial-gradient(circle_at_center,rgba(63,134,255,0.10),transparent_60%)] blur-2xl" />

              <div className="overflow-hidden rounded-[22px] border border-white/[0.07] bg-surface shadow-[0_30px_100px_rgba(0,0,0,0.45)]">

                {/* Window top */}
                <div className="flex h-12 items-center justify-between border-b border-white/[0.055] px-5">

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#ef6262]" />
                    <span className="h-2 w-2 rounded-full bg-[#d9a441]" />
                    <span className="h-2 w-2 rounded-full bg-[#35c98b]" />
                  </div>

                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
                    evaluate.ts
                  </span>

                  <div className="w-12" />
                </div>

                <div className="grid min-h-[430px] lg:grid-cols-[0.7fr_1.3fr]">

                  {/* Mini dashboard */}
                  <div className="hidden border-r border-white/[0.055] bg-[#101114] p-7 lg:block">

                    <div className="mb-7 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-text-muted">
                          Project
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          Production
                        </p>
                      </div>

                      <span className="h-2 w-2 rounded-full bg-success" />
                    </div>

                    <div className="rounded-[15px] bg-surface p-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-text-muted">
                          FEATURE
                        </span>

                        <span className="rounded-full bg-success/10 px-2 py-1 text-[9px] text-success">
                          ENABLED
                        </span>
                      </div>

                      <p className="mt-4 font-mono text-sm">
                        new-checkout
                      </p>

                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface-high">
                        <div className="h-full w-[72%] rounded-full bg-primary" />
                      </div>

                      <div className="mt-2 flex justify-between text-[10px] text-text-muted">
                        <span>Rollout</span>
                        <span>72%</span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">

                      <div className="rounded-[15px] bg-surface p-4">
                        <p className="text-[10px] text-text-muted">
                          Flags
                        </p>

                        <p className="mt-2 text-xl font-semibold">
                          24
                        </p>
                      </div>

                      <div className="rounded-[15px] bg-surface p-4">
                        <p className="text-[10px] text-text-muted">
                          Segments
                        </p>

                        <p className="mt-2 text-xl font-semibold">
                          08
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Code */}
                  <div className="bg-[#101114]">

                    <div className="border-b border-white/[0.055] px-6 py-4">
                      <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-text-muted">
                        SDK / Local evaluation
                      </span>
                    </div>

                    <pre className="overflow-x-auto p-6 font-mono text-[12px] leading-[2.05] sm:p-8 sm:text-[13px]">
                      <code>
                        <span className="text-text-muted">
                          {'// Evaluate locally. No network call.'}
                        </span>
                        {'\n\n'}

                        <span className="text-primary">
                          import
                        </span>{' '}
                        {'{ FeatureFlagClient } '}
                        <span className="text-primary">
                          from
                        </span>{' '}
                        <span className="text-success">
                          '"./sdk"'
                        </span>
                        {';\n\n'}

                        <span className="text-primary">
                          const
                        </span>{' '}
                        client ={' '}
                        <span className="text-primary">
                          new
                        </span>{' '}
                        FeatureFlagClient({'{\n'}
                        {'  baseUrl: '}
                        <span className="text-success">
                          '"https://api.flagwise.dev"'
                        </span>
                        {',\n'}
                        {'});\n\n'}

                        <span className="text-primary">
                          await
                        </span>{' '}
                        client.
                        <span className="text-warning">
                          start
                        </span>
                        {'();\n\n'}

                        <span className="text-primary">
                          const
                        </span>{' '}
                        enabled = client.
                        <span className="text-warning">
                          evaluate
                        </span>
                        {'(\n'}

                        {'  '}
                        <span className="text-success">
                          '"new-checkout"'
                        </span>
                        {',\n'}

                        {'  { userId: '}
                        <span className="text-success">
                          '"user-42"'
                        </span>
                        {',\n'}

                        {'    attributes: { plan: '}
                        <span className="text-success">
                          '"pro"'
                        </span>
                        {' }\n'}

                        {'  }\n'}

                        {');\n\n'}

                        <span className="text-text-muted">
                          {'// → true'}
                        </span>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product principles */}
        <section className="mx-auto max-w-[1180px] px-5 pb-24 sm:px-7 lg:px-8 lg:pb-32">

          <div className="grid gap-4 sm:grid-cols-3">

            <div className="rounded-[20px] border border-white/[0.05] bg-surface p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
              <div className="mb-7 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                ⚡
              </div>

              <h3 className="text-base font-semibold">
                Evaluate locally
              </h3>

              <p className="mt-2 text-sm leading-6 text-text-dim">
                Feature checks happen inside your application.
                No network request on every evaluation.
              </p>
            </div>

            <div className="rounded-[20px] border border-white/[0.05] bg-surface p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
              <div className="mb-7 flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                ↗
              </div>

              <h3 className="text-base font-semibold">
                Release gradually
              </h3>

              <p className="mt-2 text-sm leading-6 text-text-dim">
                Move from internal testing to a percentage rollout
                without touching application code.
              </p>
            </div>

            <div className="rounded-[20px] border border-white/[0.05] bg-surface p-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
              <div className="mb-7 flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                ◉
              </div>

              <h3 className="text-base font-semibold">
                Stay in control
              </h3>

              <p className="mt-2 text-sm leading-6 text-text-dim">
                Self-host your configuration and keep your
                application's release controls in your hands.
              </p>
            </div>

          </div>
        </section>

        {/* Features */}
        <section className="border-y border-white/[0.045] bg-[#0c0d10]">

          <div className="mx-auto max-w-[1180px] px-5 py-24 sm:px-7 lg:px-8 lg:py-32">

            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
                Built for releases
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Everything you need to ship safely.
              </h2>

              <p className="mt-4 text-sm leading-7 text-text-dim sm:text-base">
                A focused feature management layer without the
                unnecessary complexity of a large platform.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">

              {features.map((feature) => (
                <div
                  key={feature.number}
                  className="group rounded-[20px] border border-white/[0.05] bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.08] hover:bg-surface-high"
                >

                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-high font-mono text-[10px] text-text-muted">
                      {feature.number}
                    </span>

                    <span className="text-lg text-text-muted transition-colors group-hover:text-primary">
                      →
                    </span>
                  </div>

                  <h3 className="mt-8 text-lg font-semibold tracking-[-0.02em]">
                    {feature.title}
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-text-dim">
                    {feature.description}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="mx-auto max-w-[1180px] px-5 py-24 sm:px-7 lg:px-8 lg:py-32">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
                Architecture
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Simple under the hood.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-text-dim">
              Each part of Flagwise has a focused responsibility,
              keeping the system understandable and easy to operate.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {stack.map((item, index) => (
              <div
                key={item.name}
                className="rounded-[20px] border border-white/[0.05] bg-surface p-6"
              >

                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-text-muted">
                    0{index + 1}
                  </span>

                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                </div>

                <h3 className="mt-10 text-lg font-semibold">
                  {item.name}
                </h3>

                <p className="mt-1 text-sm text-text-dim">
                  {item.description}
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-[1180px] px-5 pb-24 sm:px-7 lg:px-8 lg:pb-32">

          <div className="relative overflow-hidden rounded-[26px] border border-white/[0.06] bg-surface p-8 shadow-[0_25px_80px_rgba(0,0,0,0.25)] sm:p-12 lg:p-16">

            <div className="pointer-events-none absolute right-[-100px] top-[-150px] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />

            <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-end">

              <div className="max-w-2xl">

                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
                  Ready to ship?
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  Put your next release behind a flag.
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-text-dim sm:text-base">
                  Create a flag, define your targeting and control
                  the rollout from one place.
                </p>
              </div>

              <Link
                to="/dashboard"
                className="w-fit shrink-0 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(63,134,255,0.2)] transition-all hover:bg-[#4a8dff] active:scale-[0.98]"
              >
                Open dashboard →
              </Link>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.045]">

        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-8">

          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-surface-high">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </span>

            <span className="text-xs font-medium text-text-dim">
              Flagwise
            </span>
          </div>

          <a
            href="https://github.com/vivekstackk/feature-flag-platform"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-text-muted transition-colors hover:text-text"
          >
            GitHub
          </a>

        </div>
      </footer>
    </div>
  );
}

export default Landing;