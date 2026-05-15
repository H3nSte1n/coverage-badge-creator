// Direction A — "Docs Studio" — editorial docs site components.
// Loaded after badge.jsx and tweaks-panel.jsx.

const { useState, useEffect, useRef, useMemo } = React;

// ───────────────────────── icons ─────────────────────────
const Icon = {
  Copy: (p) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Check: (p) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Sun: (p) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  Moon: (p) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  GitHub: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.41-4.04-1.41-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  Arrow: (p) => (
    <svg
      width="42"
      height="20"
      viewBox="0 0 42 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      {...p}
    >
      <path d="M2 10 C 12 4, 22 16, 38 10" />
      <path d="M34 5 L40 10 L34 15" />
    </svg>
  ),
  Bolt: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  ),
  Sparkle: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7zM19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
    </svg>
  ),
};

// ───────────────────────── primitives ─────────────────────────

function Copyable({ text, children, className }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };
  return (
    <button className={`copy-btn ${className || ''} ${copied ? 'copied' : ''}`} onClick={onCopy} aria-label="Copy">
      {copied ? <Icon.Check /> : <Icon.Copy />}
      <span className="copy-label">{copied ? 'copied' : children || 'copy'}</span>
    </button>
  );
}

function CodeBlock({ tabs, language }) {
  const [active, setActive] = useState(0);
  const cur = tabs[active];
  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <div className="codeblock-tabs">
          {tabs.map((t, i) => (
            <button key={t.label} className={`tab ${i === active ? 'on' : ''}`} onClick={() => setActive(i)}>
              {t.label}
            </button>
          ))}
        </div>
        <Copyable text={cur.code} />
      </div>
      <pre className={`code lang-${language || cur.lang || 'sh'}`}>
        <code dangerouslySetInnerHTML={{ __html: highlight(cur.code, cur.lang || language || 'sh') }} />
      </pre>
    </div>
  );
}

function highlight(src, lang) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let s = esc(src);
  if (lang === 'json' || lang === 'js' || lang === 'ts') {
    s = s.replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="tk-key">$1</span>$2');
    s = s.replace(/:\s*(&quot;[^&]*?&quot;)/g, ': <span class="tk-str">$1</span>');
    s = s.replace(/\b(true|false|null)\b/g, '<span class="tk-num">$1</span>');
    s = s.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="tk-num">$1</span>');
  } else if (lang === 'yaml' || lang === 'yml') {
    s = s.replace(/^(\s*)([a-z][\w-]*)(:)/gm, '$1<span class="tk-key">$2</span>$3');
    s = s.replace(/(:\s*)([\w.\-/@]+)$/gm, '$1<span class="tk-str">$2</span>');
    s = s.replace(/(^|\s)(#.*)$/gm, '$1<span class="tk-comment">$2</span>');
    s = s.replace(/\b(true|false)\b/g, '<span class="tk-num">$1</span>');
  } else if (lang === 'sh' || lang === 'bash') {
    s = s.replace(/(^|\s)(#.*)$/gm, '$1<span class="tk-comment">$2</span>');
  } else if (lang === 'md') {
    s = s.replace(/(\$[a-z]+\$)/g, '<span class="tk-key">$1</span>');
    s = s.replace(/(#{1,3}\s.*)/g, '<span class="tk-heading">$1</span>');
  }
  return s;
}

// ───────────────────────── Top Nav ─────────────────────────

function TopNav({ dark, setDark }) {
  return (
    <nav className="topnav">
      <div className="topnav-inner">
        <a href="#top" className="brand">
          <span className="brand-name">coverage-badge-creator</span>
        </a>
        <div className="topnav-links">
          <a href="#quickstart">Quickstart</a>
          <a href="#languages">Languages</a>
          <a href="#config">Config</a>
          <a href="#faq">FAQ</a>
          <a
            className="topnav-gh"
            href="https://github.com/H3nSte1n/coverage-badge-creator"
            target="_blank"
            rel="noreferrer"
          >
            <Icon.GitHub /> <span>GitHub</span>
          </a>
          <button className="iconbtn" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">
            {dark ? <Icon.Sun /> : <Icon.Moon />}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ───────────────────────── Hero ─────────────────────────

const LANGS = ['Python', 'TypeScript', 'Go', 'Java', 'Ruby', 'JavaScript'];

function Hero() {
  const [pct, setPct] = useState(0);
  const [replaced, setReplaced] = useState(false);
  const [langIdx, setLangIdx] = useState(0);

  useEffect(() => {
    let raf, start;
    const target = 98;
    const dur = 1600;
    const tick = (t) => {
      if (!start) start = t;
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setPct(Math.round(target * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setReplaced(true), 200);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!replaced) return;
    const id = setInterval(() => setReplaced((v) => !v), 3400);
    return () => clearInterval(id);
  }, [replaced]);

  useEffect(() => {
    const id = setInterval(() => setLangIdx((i) => (i + 1) % LANGS.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="hero" id="top">
      <div className="hero-copy">
        <div className="eyebrow">
          <Icon.Sparkle /> <span>open source · MIT</span>
        </div>
        <h1 className="hero-title">
          Coverage badges for{' '}
          <span className="lang-rotor" aria-live="polite">
            <em key={LANGS[langIdx]}>{LANGS[langIdx]}</em>
          </span>
          .<br />
          <span className="hero-title-sub">Any language. One README token.</span>
        </h1>
        <p className="hero-sub">
          Run as a <strong>GitHub Action</strong> for any language, or as an
          <strong> npm CLI</strong> for JavaScript. Drop a <code>$coverage$</code> token in your README — it gets
          replaced with a live SVG badge after every test run.
        </p>
        <div className="hero-cta">
          <Copyable
            text={`- uses: H3nSte1n/coverage-badge-creator@v2\n  with:\n    format: istanbul\n    commit: true`}
            className="primary"
          >
            uses: H3nSte1n/coverage-badge-creator@v2
          </Copyable>
          <a className="ghost-btn" href="#quickstart">
            See the quickstart →
          </a>
        </div>
      </div>

      <div className="hero-demo">
        <ReadmeCard label="README.md · before" tone="before" highlight={!replaced}>
          <div className="md-h1">Coverage Badge Creator</div>
          <div className="md-row md-fade">
            <span className="md-img-ph">!</span>
            <code className={`md-token ${!replaced ? 'pulse' : ''}`}>$coverage$</code>
          </div>
          <div className="md-h2">About</div>
          <div className="md-line w-100" />
          <div className="md-line w-80" />
          <div className="md-line w-60" />
        </ReadmeCard>

        <div className="hero-arrow">
          <Icon.Arrow />
          <span className="arrow-label">GitHub Action runs</span>
        </div>

        <ReadmeCard label="README.md · after" tone="after" highlight={replaced}>
          <div className="md-h1">Coverage Badge Creator</div>
          <div className="md-row">
            <span className={`md-badge-wrap ${replaced ? 'pop' : ''}`}>
              <Badge label="coverage" value={`${pct}%`} color={coverageColor(pct)} style="flat" />
            </span>
          </div>
          <div className="md-h2">About</div>
          <div className="md-line w-100" />
          <div className="md-line w-80" />
          <div className="md-line w-60" />
        </ReadmeCard>
      </div>
    </header>
  );
}

function ReadmeCard({ children, label, tone, highlight }) {
  return (
    <div className={`readme-card tone-${tone} ${highlight ? 'is-on' : ''}`}>
      <div className="readme-chrome">
        <span className="chrome-dot" style={{ background: '#ff5f57' }} />
        <span className="chrome-dot" style={{ background: '#febc2e' }} />
        <span className="chrome-dot" style={{ background: '#28c840' }} />
        <span className="chrome-tab">{label}</span>
      </div>
      <div className="readme-body">{children}</div>
    </div>
  );
}

// ───────────────────────── Quickstart (Action vs npm) ─────────────────────────

function Quickstart() {
  const [path, setPath] = useState('action'); // action | npm
  return (
    <Section id="quickstart" eyebrow="Quickstart" title="Pick your path.">
      <div className="path-toggle">
        <button className={path === 'action' ? 'on' : ''} onClick={() => setPath('action')}>
          <span className="path-tag">A</span>
          <span>GitHub Action</span>
          <span className="path-sub">any language</span>
        </button>
        <button className={path === 'npm' ? 'on' : ''} onClick={() => setPath('npm')}>
          <span className="path-tag">B</span>
          <span>npm script</span>
          <span className="path-sub">JS / TS projects</span>
        </button>
      </div>

      {path === 'action' ? <QuickstartAction /> : <QuickstartNpm />}
    </Section>
  );
}

function QuickstartAction() {
  return (
    <div className="steps">
      <Step n="1" title="Generate a coverage report">
        <p>
          Use your normal test command. See the <a href="#languages">languages section</a> for every supported format.
        </p>
        <CodeBlock
          language="sh"
          tabs={[
            { label: 'Python', code: 'coverage run -m pytest && coverage json' },
            {
              label: 'Go',
              code: 'go test -coverprofile=coverage.out ./...\ngcov2lcov -infile coverage.out -outfile coverage.info',
            },
            { label: 'Java', code: './gradlew test jacocoTestReport' },
            { label: 'JS', code: 'npm test' },
          ]}
        />
      </Step>

      <Step n="2" title="Drop a token in your README">
        <p>
          Anywhere in <code>README.md</code>:
        </p>
        <div className="tokens">
          {['$coverage$', '$statements$', '$branches$', '$functions$', '$lines$'].map((k) => (
            <code key={k} className="token-chip">
              {k}
            </code>
          ))}
        </div>
        <p className="muted">The surrounding dollar signs are required.</p>
      </Step>

      <Step n="3" title="Add the Action to your workflow">
        <p>It picks up your coverage file, updates the README, and (optionally) commits the change.</p>
        <CodeBlock
          language="yaml"
          tabs={[
            {
              label: '.github/workflows/test.yml',
              lang: 'yaml',
              code: `- uses: H3nSte1n/coverage-badge-creator@v2
  with:
    format: istanbul     # istanbul · lcov · cobertura · coverage-py
    commit: true         # auto-commit the updated README`,
            },
          ]}
        />
      </Step>
    </div>
  );
}

function QuickstartNpm() {
  return (
    <div className="steps">
      <Step n="1" title="Install">
        <p>Add it to your dev dependencies.</p>
        <CodeBlock
          language="sh"
          tabs={[
            { label: 'npm', code: 'npm install --save-dev coverage-badge-creator' },
            { label: 'yarn', code: 'yarn add --dev coverage-badge-creator' },
            { label: 'pnpm', code: 'pnpm add -D coverage-badge-creator' },
          ]}
        />
      </Step>

      <Step n="2" title="Drop a token in your README">
        <p>
          Anywhere in <code>README.md</code>:
        </p>
        <div className="tokens">
          {['$coverage$', '$statements$', '$branches$', '$functions$', '$lines$'].map((k) => (
            <code key={k} className="token-chip">
              {k}
            </code>
          ))}
        </div>
      </Step>

      <Step n="3" title="Run it after your tests">
        <p>Wire it into your scripts. Run locally or in CI.</p>
        <CodeBlock
          language="json"
          tabs={[
            {
              label: 'package.json',
              lang: 'json',
              code: `{
  "scripts": {
    "test": "jest --coverage",
    "coverage:badge": "coverage-badge-creator"
  }
}`,
            },
          ]}
        />
        <CodeBlock language="sh" tabs={[{ label: 'run', code: 'npm run test && npm run coverage:badge' }]} />
      </Step>
    </div>
  );
}

function Step({ n, title, children }) {
  return (
    <div className="step">
      <div className="step-n">{n}</div>
      <div className="step-body">
        <h3 className="step-title">{title}</h3>
        {children}
      </div>
    </div>
  );
}

// ───────────────────────── Languages ─────────────────────────

const LANG_SETUP = [
  {
    label: 'Python · JSON',
    format: 'coverage-py',
    code: `coverage run -m pytest && coverage json
# → coverage.json   →  type: coverage-py`,
  },
  {
    label: 'Python · XML',
    format: 'cobertura',
    code: `coverage run -m pytest && coverage xml
# → coverage.xml    →  type: cobertura`,
  },
  {
    label: 'JS · Jest',
    format: 'istanbul',
    code: `# jest.config.js → add 'json-summary' to coverageReporters
jest --coverage
# → coverage/coverage-summary.json   →  format: istanbul`,
  },
  {
    label: 'JS · Mocha',
    format: 'istanbul',
    code: `nyc --reporter=json-summary mocha
# → coverage/coverage-summary.json   →  format: istanbul`,
  },
  {
    label: 'Go',
    format: 'lcov',
    code: `go test -coverprofile=coverage.out ./...
gcov2lcov -infile coverage.out -outfile coverage.info
# → coverage.info   →  format: lcov`,
  },
  {
    label: 'Java (JaCoCo)',
    format: 'cobertura',
    code: `# JaCoCo emits Cobertura XML via the cobertura report task
./gradlew test jacocoTestReport
# → build/reports/cobertura.xml   →  format: cobertura`,
  },
  {
    label: 'Ruby',
    format: 'lcov',
    code: `# SimpleCov with the lcov formatter
bundle exec rspec
# → coverage/lcov/project.lcov   →  format: lcov`,
  },
];

function Languages() {
  const [idx, setIdx] = useState(0);
  const cur = LANG_SETUP[idx];
  return (
    <Section id="languages" eyebrow="Languages" title="Pick the runner. We'll read the report.">
      <p className="section-lede">
        Four coverage formats cover every major test runner. Generate your usual report — the tool reads it, computes
        the number, and writes the badge.
      </p>
      <div className="lang-shell">
        <div className="lang-tabs">
          {LANG_SETUP.map((l, i) => (
            <button key={l.label} className={`lang-tab ${i === idx ? 'on' : ''}`} onClick={() => setIdx(i)}>
              <span className="lang-tab-name">{l.label}</span>
              <span className="lang-tab-fmt">type · {l.format}</span>
            </button>
          ))}
        </div>
        <div className="lang-body">
          <CodeBlock language="sh" tabs={[{ label: cur.label, code: cur.code }]} />
          <div className="lang-meta">
            <div>
              <span className="lang-meta-k">Coverage format</span>
              <code className="lang-meta-v">{cur.format}</code>
            </div>
            <div>
              <span className="lang-meta-k">Run via</span>
              <span className="lang-meta-v">
                GitHub Action <small className="muted">or npm</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ───────────────────────── Tokens (usage) ─────────────────────────

const KEYS = [
  { k: '$coverage$', d: 'Total coverage — the headline number.' },
  { k: '$statements$', d: 'Statements executed during your tests.' },
  { k: '$branches$', d: 'Conditional branches taken.' },
  { k: '$functions$', d: 'Functions called at least once.' },
  { k: '$lines$', d: 'Lines hit during the run.' },
];

function Usage() {
  return (
    <Section id="usage" eyebrow="Tokens" title="Five tokens. Pick your flavor.">
      <p className="section-lede">
        Each token is a placeholder in your README that the tool replaces with a live badge image after every run.
        Surround them with dollar signs.
      </p>
      <div className="keys-grid">
        {KEYS.map(({ k, d }) => (
          <div key={k} className="key-card">
            <code className="key-name">{k}</code>
            <p className="key-desc">{d}</p>
            <div className="key-preview">
              <Badge label={k.replace(/\$/g, '')} value="98%" color="#83A603" style="flat" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ───────────────────────── Action reference ─────────────────────────

function ActionRef() {
  return (
    <Section id="action" eyebrow="GitHub Action" title="Inputs reference.">
      <p className="section-lede">
        Configure the Action via the <code>with:</code> block, or via <code>.badge-config</code>, or both — Action
        inputs win.
      </p>
      <div className="action-table">
        <div className="action-row action-head">
          <span>Input</span>
          <span>What it does</span>
          <span>Default</span>
        </div>
        <ActionRow input="format" desc="Coverage report format" def="istanbul" />
        <ActionRow
          input="coverage-file-path"
          desc="Path to the coverage report"
          def={<span className="muted">from .badge-config</span>}
        />
        <ActionRow input="readme-file-path" desc="Path to the README to update" def="./README.md" />
        <ActionRow input="config-path" desc="Path to a .badge-config file" def="./.badge-config" />
        <ActionRow input="commit" desc="Auto-commit the updated README" def="false" />
        <ActionRow
          input="commit-message"
          desc="Commit message when commit is true"
          def={<code>chore: update coverage badges [skip ci]</code>}
        />
      </div>
      <CodeBlock
        language="yaml"
        tabs={[
          {
            label: 'Python example',
            lang: 'yaml',
            code: `- run: coverage run -m pytest && coverage json
- uses: H3nSte1n/coverage-badge-creator@v2
  with:
    format: coverage-py
    coverage-file-path: ./coverage.json
    commit: true`,
          },
          {
            label: 'Go example',
            lang: 'yaml',
            code: `- run: go test -coverprofile=coverage.out ./... && gcov2lcov -infile coverage.out -outfile coverage.info
- uses: H3nSte1n/coverage-badge-creator@v2
  with:
    format: lcov
    coverage-file-path: ./coverage.info
    commit: true`,
          },
          {
            label: 'Java example',
            lang: 'yaml',
            code: `- run: ./gradlew test jacocoTestReport
- uses: H3nSte1n/coverage-badge-creator@v2
  with:
    format: cobertura
    coverage-file-path: ./build/reports/cobertura.xml
    commit: true`,
          },
          {
            label: 'JS / TS example',
            lang: 'yaml',
            code: `- run: npm test
- uses: H3nSte1n/coverage-badge-creator@v2
  with:
    format: istanbul
    commit: true`,
          },
        ]}
      />
    </Section>
  );
}

function ActionRow({ input, desc, def }) {
  return (
    <div className="action-row">
      <span>
        <code>{input}</code>
      </span>
      <span>{desc}</span>
      <span>{typeof def === 'string' ? <code>{def}</code> : def}</span>
    </div>
  );
}

// ───────────────────────── Playground ─────────────────────────

const PLAYGROUND_STYLES = ['flat', 'flat-square', 'plastic', 'for-the-badge'];

function hslToHex(h) {
  const s = 0.75, l = 0.45;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const v = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * v).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function HueReel({ color, onChange }) {
  const ref = useRef(null);
  const pick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onChange(hslToHex(Math.round(x * 360)));
  };
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div
        ref={ref}
        onClick={pick}
        style={{
          flex: 1,
          height: 26,
          borderRadius: 999,
          background: 'linear-gradient(to right,hsl(0,75%,45%),hsl(30,75%,45%),hsl(60,75%,45%),hsl(90,75%,45%),hsl(120,75%,45%),hsl(150,75%,45%),hsl(180,75%,45%),hsl(210,75%,45%),hsl(240,75%,45%),hsl(270,75%,45%),hsl(300,75%,45%),hsl(330,75%,45%),hsl(360,75%,45%))',
          cursor: 'crosshair',
          border: '1px solid var(--rule)',
        }}
        aria-label="Hue picker"
      />
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--rule)', padding: 0, cursor: 'pointer', background: 'none' }}
        aria-label="Exact color"
      />
    </div>
  );
}

function Playground() {
  const [label, setLabel] = useState('coverage');
  const [value, setValue] = useState('98%');
  const [color, setColor] = useState('#83A603');
  const [style, setStyle] = useState('flat');
  const [more, setMore] = useState(false);
  const [logo, setLogo] = useState('');
  const [logoColor, setLogoColor] = useState('');
  const [link, setLink] = useState('');

  const extraConfig = [
    logo && `      "logo": "${logo}"`,
    logoColor && `      "logoColor": "${logoColor}"`,
    link && `      "link": "${link}"`,
  ].filter(Boolean).join(',\n');

  const config = `{
  "badges": {
    "${label}": {
      "style": "${style}",
      "color": "${color.replace('#', '')}"${extraConfig ? ',\n' + extraConfig : ''}
    }
  }
}`;

  const mdParams = ['style=' + style, logo && 'logo=' + logo, logoColor && 'logoColor=' + logoColor, link && 'link=' + encodeURIComponent(link)].filter(Boolean).join('&');
  const md = `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(value)}-${color.replace('#', '')}.svg?${mdParams})`;

  return (
    <Section id="playground" eyebrow="Playground" title="Try every knob. No install needed.">
      <div className="playground">
        <div className="play-controls">
          <label className="field">
            <span>Label</span>
            <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={24} />
          </label>
          <label className="field">
            <span>Value</span>
            <input value={value} onChange={(e) => setValue(e.target.value)} maxLength={16} />
          </label>
          <div className="field">
            <span>Style</span>
            <div className="seg">
              {PLAYGROUND_STYLES.map((s) => (
                <button key={s} className={style === s ? 'on' : ''} onClick={() => setStyle(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <span>Color</span>
            <HueReel color={color} onChange={setColor} />
          </div>
          <button
            onClick={() => setMore(!more)}
            style={{ background: 'none', border: 0, padding: '4px 0', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', cursor: 'pointer', textAlign: 'left', letterSpacing: '.04em' }}
          >
            {more ? '▲ fewer options' : '▼ more options'}
          </button>
          {more && (
            <>
              <label className="field">
                <span>Logo</span>
                <input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="jest, python, github…" maxLength={32} />
              </label>
              <label className="field">
                <span>Logo color</span>
                <input value={logoColor} onChange={(e) => setLogoColor(e.target.value)} placeholder="white, #fff…" maxLength={16} />
              </label>
              <label className="field">
                <span>Link</span>
                <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" maxLength={120} />
              </label>
            </>
          )}
        </div>

        <div className="play-preview">
          <div className="play-stage">
            <Badge label={label} value={value} color={color} style={style} />
          </div>
          <div className="play-snippets">
            <CodeBlock language="json" tabs={[{ label: '.badge-config', lang: 'json', code: config }]} />
            <CodeBlock language="md" tabs={[{ label: 'Markdown', lang: 'md', code: md }]} />
          </div>
        </div>
      </div>
    </Section>
  );
}

// ───────────────────────── Config ─────────────────────────

const FORMAT_TABLE = [
  { v: 'istanbul', tool: 'Jest, NYC, Istanbul', file: 'coverage/coverage-summary.json', def: true },
  { v: 'lcov', tool: 'Go, C/C++, Ruby, Python (lcov)', file: 'coverage/lcov.info' },
  { v: 'cobertura', tool: 'Java (JaCoCo), Python (xml), .NET', file: 'coverage.xml' },
  { v: 'coverage-py', tool: 'Python (coverage json)', file: 'coverage.json' },
];

function Config() {
  return (
    <Section id="config" eyebrow="Config" title="Optional. Powerful when you need it.">
      <p className="section-lede">
        Create a <code>.badge-config</code> at the project root. All keys are optional. Action inputs override config
        values.
      </p>

      <div className="config-grid">
        <ConfigCard title="Report type" id="config-format">
          <CodeBlock
            language="json"
            tabs={[
              {
                label: '.badge-config',
                lang: 'json',
                code: `{
  "format": "lcov"
}`,
              },
            ]}
          />
          <div className="format-table">
            <div className="format-row format-head">
              <span>Value</span>
              <span>Coverage tool</span>
              <span>Typical output</span>
            </div>
            {FORMAT_TABLE.map((f) => (
              <div key={f.v} className="format-row">
                <span>
                  <code>
                    {f.v}
                    {f.def && <em className="muted"> · default</em>}
                  </code>
                </span>
                <span>{f.tool}</span>
                <span>
                  <code>{f.file}</code>
                </span>
              </div>
            ))}
          </div>
        </ConfigCard>

        <ConfigCard title="Coverage file path" id="config-path">
          <p className="muted">If the file isn't in the conventional location, point at it.</p>
          <CodeBlock
            language="json"
            tabs={[
              {
                label: '.badge-config',
                lang: 'json',
                code: `{
  "coverage_file_path": "./coverage/json-summary.json"
}`,
              },
            ]}
          />
        </ConfigCard>

        <ConfigCard title="Badge styling" id="config-badges">
          <CodeBlock
            language="json"
            tabs={[
              {
                label: '.badge-config',
                lang: 'json',
                code: `{
  "badges": {
    "coverage": {
      "style": "for-the-badge",
      "color": "83A603",
      "logo": "jest",
      "logoColor": "white",
      "link": "https://github.com/you/repo"
    }
  }
}`,
              },
            ]}
          />
          <ul className="opt-list">
            <li>
              <code>style</code> — <span className="muted">flat, flat-square, plastic, for-the-badge, social</span>
            </li>
            <li>
              <code>color</code> — <span className="muted">hex without #, or a shields.io named color</span>
            </li>
            <li>
              <code>logo</code> — <span className="muted">any shields.io logo slug (jest, github, kotlin…)</span>
            </li>
            <li>
              <code>logoColor</code> — <span className="muted">color of the logo</span>
            </li>
            <li>
              <code>link</code> — <span className="muted">URL the badge points at</span>
            </li>
          </ul>
        </ConfigCard>

        <ConfigCard title="CLI flags" id="config-cli">
          <p className="muted">
            npm-mode only. The Action exposes the same as <code>with:</code> inputs.
          </p>
          <table className="cli-table">
            <tbody>
              <tr>
                <td>
                  <code>--config</code>
                </td>
                <td>Point at a custom config path.</td>
              </tr>
            </tbody>
          </table>
          <CodeBlock
            language="sh"
            tabs={[{ label: 'example', code: "coverage-badge-creator --config './badge-coverage-config.json'" }]}
          />
        </ConfigCard>
      </div>
    </Section>
  );
}

function ConfigCard({ title, id, children }) {
  return (
    <div className="config-card" id={id}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

// ───────────────────────── Compatibility ─────────────────────────

function Compatibility() {
  return (
    <Section id="compatibility" eyebrow="Compatibility" title="What you need. What you don't.">
      <div className="built-grid">
        <div className="built-card">
          <span className="built-k">GitHub Action</span>
          <span className="built-v">no local setup</span>
        </div>
        <div className="built-card">
          <span className="built-k">npm / yarn</span>
          <span className="built-v">Node ≥ 20</span>
        </div>
        <div className="built-card">
          <span className="built-k">Formats</span>
          <span className="built-v">4 supported</span>
        </div>
        <div className="built-card">
          <span className="built-k">Languages</span>
          <span className="built-v">any with coverage</span>
        </div>
        <div className="built-card">
          <span className="built-k">Dependencies</span>
          <span className="built-v">0 runtime</span>
        </div>
        <div className="built-card">
          <span className="built-k">License</span>
          <span className="built-v">MIT</span>
        </div>
      </div>
    </Section>
  );
}

// ───────────────────────── Contributing ─────────────────────────

function Contributing() {
  return (
    <Section id="contributing" eyebrow="Contributing" title="Send a PR. Get a high five.">
      <ol className="contrib">
        <li>
          <span className="contrib-n">1</span> Fork the repo
        </li>
        <li>
          <span className="contrib-n">2</span> <code>git checkout -b feature/new_feature</code>
        </li>
        <li>
          <span className="contrib-n">3</span> Commit with conventional messages — <code>feat: add new feature</code>
        </li>
        <li>
          <span className="contrib-n">4</span> Push and open a Pull Request
        </li>
      </ol>
      <p className="muted">
        Maintained by{' '}
        <a href="https://github.com/H3nSte1n" target="_blank" rel="noreferrer">
          Henry Steinhauer
        </a>{' '}
        ·{' '}
        <a
          href="https://github.com/H3nSte1n/coverage-badge-creator/graphs/contributors"
          target="_blank"
          rel="noreferrer"
        >
          see all contributors
        </a>
      </p>
    </Section>
  );
}

// ───────────────────────── FAQ ─────────────────────────

const FAQS = [
  {
    q: 'Does this only work for JavaScript?',
    a: 'No. The GitHub Action works for any language that emits one of four supported coverage formats: istanbul, lcov, cobertura, or coverage-py. Python, Go, Java, Ruby, .NET — they all just work.',
  },
  {
    q: 'Does it hit shields.io at runtime?',
    a: "No. Badges are written into your repo and served from there. Your README keeps working when third parties don't.",
  },
  {
    q: 'Action or npm — which should I use?',
    a: 'GitHub Action for anything non-JS, or if you want zero local setup. The npm package for JS / TS projects that want a local script you can also run in CI.',
  },
  {
    q: 'Will the Action commit to my repo?',
    a: 'Only if you set commit: true. Otherwise it just updates the README in the workflow run; you can pipe it into your own commit step.',
  },
  {
    q: 'Will it overwrite my README formatting?',
    a: 'No. Only the $coverage$ tokens (and friends) are replaced. Everything else stays put.',
  },
  {
    q: 'How do I pin a badge color or style?',
    a: 'Set them per badge in .badge-config. Action inputs win over config values, so you can override per-workflow.',
  },
  {
    q: 'Can I use it for multiple coverage tools at once?',
    a: 'Pick the format that matches your tool. Mixed setups can convert into one of the four supported formats first (e.g. gcov2lcov).',
  },
];

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <Section id="faq" eyebrow="FAQ" title="Quick answers.">
      <div className="faq">
        {FAQS.map((f, i) => (
          <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
            <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{f.q}</span>
              <span className="faq-toggle">{open === i ? '–' : '+'}</span>
            </button>
            {open === i && <div className="faq-a">{f.a}</div>}
          </div>
        ))}
      </div>
    </Section>
  );
}

// ───────────────────────── Section + TOC ─────────────────────────

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="section">
      <div className="section-head">
        <span className="section-eyebrow">{eyebrow}</span>
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="section-body">{children}</div>
    </section>
  );
}

const TOC_ITEMS = [
  { id: 'top', label: 'Overview' },
  { id: 'quickstart', label: 'Quickstart' },
  { id: 'languages', label: 'Languages' },
  { id: 'usage', label: 'Tokens' },
  { id: 'action', label: 'Action ref' },
  { id: 'playground', label: 'Playground' },
  { id: 'config', label: 'Config' },
  { id: 'compatibility', label: 'Compatibility' },
  { id: 'contributing', label: 'Contributing' },
  { id: 'faq', label: 'FAQ' },
];

function TOC() {
  const [active, setActive] = useState('top');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px' },
    );
    TOC_ITEMS.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return (
    <aside className="toc">
      <div className="toc-label">On this page</div>
      <ul>
        {TOC_ITEMS.map((i) => (
          <li key={i.id} className={active === i.id ? 'on' : ''}>
            <a href={`#${i.id}`}>{i.label}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// ───────────────────────── Footer ─────────────────────────

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span>coverage-badge-creator</span>
        </div>
        <div className="footer-cols">
          <div>
            <h4>Use it</h4>
            <a href="https://github.com/H3nSte1n/coverage-badge-creator/blob/main/action.yml" target="_blank" rel="noreferrer">
              GitHub Action
            </a>
            <a href="https://www.npmjs.com/package/coverage-badge-creator" target="_blank" rel="noreferrer">
              npm
            </a>
            <a href="https://github.com/H3nSte1n/coverage-badge-creator" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://github.com/H3nSte1n/coverage-badge-creator/releases" target="_blank" rel="noreferrer">
              Releases
            </a>
          </div>
          <div>
            <h4>Made by</h4>
            <a href="https://github.com/H3nSte1n" target="_blank" rel="noreferrer">
              @H3nSte1n
            </a>
            <a
              href="https://github.com/H3nSte1n/coverage-badge-creator/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
            >
              MIT License
            </a>
          </div>
        </div>
        <div className="footer-fine">Shipped from the README, with care.</div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  TopNav,
  Hero,
  Quickstart,
  Languages,
  Usage,
  ActionRef,
  Playground,
  Config,
  Compatibility,
  Contributing,
  FAQ,
  TOC,
  Footer,
});
