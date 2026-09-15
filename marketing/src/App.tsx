const GITHUB_URL = "https://github.com/vitalikpi/webcash"

const features = [
  {
    icon: "🔒",
    title: "Fully self-hosted",
    body: "Your financial data never leaves your server. No SaaS subscriptions, no data sharing, no vendor lock-in.",
  },
  {
    icon: "⚙️",
    title: "GnuCash engine",
    body: "Powered by the battle-tested GnuCash accounting engine — full double-entry bookkeeping, running server-side.",
  },
  {
    icon: "🌐",
    title: "Browser-native",
    body: "Access your books from any device with a browser. No desktop client to install or sync.",
  },
  {
    icon: "🔌",
    title: "Open REST API",
    body: "Every operation is available over HTTP. Build scripts, integrations, or your own UI on top of a clean API.",
  },
]

const steps = [
  { n: "1", label: "Clone the repo", code: "git clone https://github.com/vitalikpi/webcash" },
  { n: "2", label: "Start the stack", code: "docker compose up" },
  { n: "3", label: "Open your browser", code: "http://localhost:5173" },
]

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="text-lg font-semibold tracking-tight text-white">webcash</span>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <GitHubIcon />
          GitHub
        </a>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-28 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-full mb-8 border border-gray-700">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          Open source · MIT license
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6" style={{ letterSpacing: "-1px" }}>
          GnuCash,<br />
          <span className="text-indigo-400">in your browser.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Webcash wraps the GnuCash accounting engine in a REST API and a modern web UI.
          Self-host it in minutes with Docker — full double-entry bookkeeping, no desktop app required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <GitHubIcon />
            View on GitHub
          </a>
          <a
            href={`${GITHUB_URL}#readme`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold px-6 py-3 rounded-lg border border-gray-700 transition-colors"
          >
            Get started →
          </a>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-28 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12" style={{ letterSpacing: "-0.5px" }}>
          Up and running in three commands
        </h2>
        <div className="flex flex-col gap-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="flex items-center gap-5 bg-gray-900 border border-gray-800 rounded-xl px-6 py-4"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                {s.n}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">{s.label}</p>
                <code className="text-sm text-indigo-300 font-mono truncate block">{s.code}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-6 pb-32 max-w-4xl mx-auto">
        <div className="bg-indigo-950 border border-indigo-800 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ letterSpacing: "-0.5px" }}>
            Own your financial data
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Star the repo, open an issue, or fork it. Webcash is built in the open — contributions welcome.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            <GitHubIcon />
            Star on GitHub
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-sm text-gray-600">
        Webcash is open source software released under the MIT license.{" "}
        <a
          href={GITHUB_URL}
          className="hover:text-gray-400 underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/vitalikpi/webcash
        </a>
      </footer>
    </div>
  )
}

function GitHubIcon() {
  return (
    <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}
