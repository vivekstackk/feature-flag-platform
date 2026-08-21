import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8L7 12L13 4" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-semibold tracking-tight">Flagwise</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://github.com/vivekstackk/feature-flag-platform" target="_blank" rel="noreferrer" className="text-sm text-text-dim transition-colors hover:text-text">
            GitHub
          </a>
          <Link to="/dashboard" className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
            Open Dashboard →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-text-dim">Open source · Self-hosted · Production-ready</span>
          </div>

          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            Ship features
            <br />
            <span className="text-primary">without the fear.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-dim">
            A complete feature flag platform with targeting rules, percentage rollouts, A/B experiments, and real-time updates. Built from scratch, not a wrapper around someone else's SDK.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/dashboard" className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              Launch Dashboard
            </Link>
            <a href="https://github.com/vivekstackk/feature-flag-platform" target="_blank" rel="noreferrer" className="rounded-full border border-border px-8 py-3 text-sm font-medium text-text-dim transition-colors hover:border-text-dim hover:text-text">
              View Source
            </a>
          </div>
        </div>

        {/* Terminal preview */}
        <div className="mx-auto mt-16 max-w-2xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-primary/5">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-danger/60" />
            <span className="h-3 w-3 rounded-full bg-warning/60" />
            <span className="h-3 w-3 rounded-full bg-success/60" />
            <span className="ml-4 font-mono text-xs text-text-dim">evaluate.ts</span>
          </div>
          <pre className="overflow-x-auto p-6 font-mono text-sm leading-relaxed">
            <code>
              <span className="text-text-dim">{"// Evaluate in 3 lines. No network call."}</span>{"\n"}
              <span className="text-primary">{"import"}</span>{" { FeatureFlagClient } "}<span className="text-primary">from</span>{" "}<span className="text-success">{"'./sdk'"}</span>{";\n\n"}
              <span className="text-primary">{"const"}</span>{" client = "}<span className="text-primary">new</span>{" FeatureFlagClient({\n"}
              {"  baseUrl: "}<span className="text-success">{"'https://your-api.onrender.com'"}</span>{",\n"}
              {"});\n\n"}
              <span className="text-primary">{"await"}</span>{" client."}<span className="text-warning">start</span>{"();\n\n"}
              <span className="text-primary">{"const"}</span>{" show = client."}<span className="text-warning">evaluate</span>{"(\n"}
              {"  "}<span className="text-success">{"'new-checkout'"}</span>{", \n"}
              {"  { userId: "}<span className="text-success">{"'user-42'"}</span>{", attributes: { plan: "}<span className="text-success">{"'pro'"}</span>{" } }\n"}
              {");\n\n"}
              <span className="text-text-dim">{"// → true (deterministic, same user = same result)"}</span>
            </code>
          </pre>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">How it works</p>
          <h2 className="text-3xl font-bold tracking-tight">Everything you need to ship safely</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "⚡",
              title: "Targeting Rules",
              desc: "Route users by attribute — plan, country, cohort. First match wins. Operators: equals, notEquals, in, contains, inSegment."
            },
            {
              icon: "📊",
              title: "Percentage Rollouts",
              desc: "SHA-256 deterministic bucketing. Same user always gets the same variant. Roll from 1% to 100% with a slider."
            },
            {
              icon: "🔬",
              title: "A/B Experiments",
              desc: "Exposures logged automatically. Track conversions per variant. Get real conversion rates, not vibes."
            },
            {
              icon: "🔄",
              title: "Real-time Updates",
              desc: "Redis Pub/Sub → SSE. Flag changes reach connected clients in ~1 second. No polling needed."
            },
            {
              icon: "🧩",
              title: "Reusable Segments",
              desc: "Define user groups once, reference everywhere. 'beta-users' in one place, used across 50 flags."
            },
            {
              icon: "📦",
              title: "Local SDK",
              desc: "Fetches flags once, evaluates locally. Zero network calls per check. Auto-reconnects on failure."
            },
          ].map((f) => (
            <div key={f.title} className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-primary/40">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-dim">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Architecture</p>
          <h2 className="text-3xl font-bold tracking-tight">Built with production-grade tools</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Fastify", role: "API Server", detail: "Routes, auth, SSE streaming" },
            { name: "PostgreSQL", role: "Persistence", detail: "Flags, segments, experiments" },
            { name: "Redis", role: "Cache + Pub/Sub", detail: "60s TTL, real-time invalidation" },
            { name: "React", role: "Dashboard", detail: "Vite + Tailwind, dark UI" },
          ].map((t) => (
            <div key={t.name} className="rounded-xl border border-border bg-surface p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <span className="text-lg font-bold text-primary">{t.name[0]}</span>
              </div>
              <h3 className="text-base font-semibold">{t.name}</h3>
              <p className="mt-1 text-xs font-medium text-primary">{t.role}</p>
              <p className="mt-2 text-xs text-text-dim">{t.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Tests", value: "60", unit: "passing" },
            { label: "Evaluation", value: "<1ms", unit: "local" },
            { label: "Propagation", value: "~1s", unit: "via SSE" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-6 text-center">
              <p className="text-3xl font-bold tracking-tight">{s.value}</p>
              <p className="mt-1 text-sm text-text-dim">{s.label} · {s.unit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Audit */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Observability</p>
            <h2 className="text-3xl font-bold tracking-tight">Every change is tracked</h2>
            <p className="mt-4 text-text-dim leading-relaxed">
              Audit log records every flag mutation — who changed what, when, and the exact diff. 
              Health endpoint reports Postgres and Redis status. If Redis goes down, 
              the system falls through to Postgres instead of crashing.
            </p>
            <div className="mt-6 space-y-3">
              {["Audit log on every mutation", "Health check endpoint (no auth)", "Graceful Redis degradation", "Self-healing keep-alive"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4.5 7.5L8 3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="border-b border-border px-4 py-3">
              <span className="font-mono text-xs text-text-dim">GET /health</span>
            </div>
            <pre className="p-6 font-mono text-sm leading-relaxed">
              <code>
                {"{\n"}
                {"  "}<span className="text-primary">"status"</span>{": "}<span className="text-success">"healthy"</span>{",\n"}
                {"  "}<span className="text-primary">"checks"</span>{": {\n"}
                {"    "}<span className="text-primary">"postgres"</span>{": "}<span className="text-success">"ok"</span>{",\n"}
                {"    "}<span className="text-primary">"redis"</span>{": "}<span className="text-success">"ok"</span>{"\n"}
                {"  }\n"}
                {"}"}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-2xl border border-border bg-surface p-12 text-center sm:p-16">
          <h2 className="text-3xl font-bold tracking-tight">Ready to see it live?</h2>
          <p className="mx-auto mt-4 max-w-md text-text-dim">
            The dashboard is deployed and running. Create a flag, set targeting rules, watch it propagate in real-time.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to="/dashboard" className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              Open Dashboard
            </Link>
            <a href="https://github.com/vivekstackk/feature-flag-platform" target="_blank" rel="noreferrer" className="rounded-full border border-border px-8 py-3 text-sm font-medium text-text-dim transition-colors hover:border-text-dim hover:text-text">
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="text-xs text-text-dim">Built by Vivek · 2026</span>
          <a href="https://github.com/vivekstackk/feature-flag-platform" target="_blank" rel="noreferrer" className="text-xs text-text-dim transition-colors hover:text-text">
            github.com/vivekstackk
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
