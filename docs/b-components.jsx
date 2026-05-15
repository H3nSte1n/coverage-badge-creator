// Direction B — "Sticker Pack" — playful landing+docs site components.
// Loaded after badge.jsx and tweaks-panel.jsx.

const { useState: useStateB, useEffect: useEffectB, useRef: useRefB, useMemo: useMemoB } = React;

// ───────────────────────── icons ─────────────────────────
const BIcon = {
  Copy: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Check: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
  Sun: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
  Moon: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  GitHub: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.41-4.04-1.41-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>,
  ArrowSquiggle: (p) => <svg width="80" height="40" viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 12 C 18 4, 30 28, 44 20 C 56 14, 64 28, 74 20"/><path d="M68 14 L76 20 L70 26"/></svg>,
  StarBurst: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 1l2 7 7-2-5 5 5 5-7-2-2 7-2-7-7 2 5-5-5-5 7 2 2-7z"/></svg>,
};

// ───────────────────────── primitives ─────────────────────────

function BCopyable({ text, children, big }) {
  const [copied, setCopied] = useStateB(false);
  const onCopy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };
  return (
    <button className={`b-copy ${big ? 'big' : ''} ${copied ? 'copied' : ''}`} onClick={onCopy}>
      <code className="b-copy-text">{children || text}</code>
      <span className="b-copy-icon">{copied ? <BIcon.Check/> : <BIcon.Copy/>}</span>
    </button>
  );
}

function BCodeBlock({ tabs, language }) {
  const [active, setActive] = useStateB(0);
  const cur = tabs[active];
  return (
    <div className="b-codeblock">
      <div className="b-codeblock-head">
        <div className="b-tabs">
          {tabs.map((t, i) => (
            <button key={t.label} className={`b-tab ${i === active ? 'on' : ''}`} onClick={() => setActive(i)}>{t.label}</button>
          ))}
        </div>
        <BCopyable text={cur.code}><BIcon.Copy/></BCopyable>
      </div>
      <pre className="b-code"><code dangerouslySetInnerHTML={{ __html: bHighlight(cur.code, cur.lang || language || 'sh') }}/></pre>
    </div>
  );
}

function bHighlight(src, lang) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let s = esc(src);
  if (lang === 'json' || lang === 'js' || lang === 'ts') {
    s = s.replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="btk-key">$1</span>$2');
    s = s.replace(/:\s*(&quot;[^&]*?&quot;)/g, ': <span class="btk-str">$1</span>');
    s = s.replace(/\b(true|false|null)\b/g, '<span class="btk-num">$1</span>');
    s = s.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="btk-num">$1</span>');
  } else if (lang === 'sh' || lang === 'bash') {
    s = s.replace(/^(\s*)(npm|yarn|pnpm|npx)\b/gm, '$1<span class="btk-cmd">$2</span>');
    s = s.replace(/(--?[a-z-]+)/g, '<span class="btk-flag">$1</span>');
  } else if (lang === 'md') {
    s = s.replace(/(\$[a-z]+\$)/g, '<span class="btk-key">$1</span>');
  }
  return s;
}

// ───────────────────────── Sticker layer ─────────────────────────
// Decorative floating "sticker" badges in the hero background.

function StickerLayer() {
  const stickers = [
    { label: 'build',    value: 'passing', color: '#4c1',     style: 'flat-square',     top: '8%',  left: '4%',   rot: -8,  scale: 1 },
    { label: 'license',  value: 'MIT',     color: '#dfb317',  style: 'flat',            top: '14%', right: '6%',  rot: 6,   scale: 1.05 },
    { label: 'node',     value: '≥ 10',    color: '#007ec6',  style: 'flat',            top: '64%', left: '2%',   rot: 4,   scale: 1 },
    { label: 'deps',     value: '0',       color: '#83A603',  style: 'for-the-badge',   top: '70%', right: '4%',  rot: -7,  scale: 1 },
    { label: 'typescript', value: 'ready', color: '#3178c6',  style: 'flat',            top: '40%', left: '1%',   rot: -12, scale: .95 },
    { label: 'jest',     value: 'tested',  color: '#c63d14',  style: 'flat',            top: '88%', left: '50%',  rot: 3,   scale: 1 },
    { label: 'release',  value: 'v1.4',    color: '#0e8a16',  style: 'plastic',         top: '4%',  left: '52%',  rot: -3,  scale: 1.1 },
    { label: 'CI',       value: 'green',   color: '#4c1',     style: 'flat',            top: '92%', right: '12%', rot: 6,   scale: 1 },
  ];
  return (
    <div className="b-sticker-layer" aria-hidden="true">
      {stickers.map((s, i) => (
        <span key={i} className="b-sticker" style={{
          top: s.top, left: s.left, right: s.right,
          transform: `rotate(${s.rot}deg) scale(${s.scale * 1.6})`,
          animationDelay: `${i * 0.4}s`,
        }}>
          <Badge label={s.label} value={s.value} color={s.color} style={s.style}/>
        </span>
      ))}
    </div>
  );
}

// ───────────────────────── Top Nav ─────────────────────────

function BTopNav({ dark, setDark }) {
  return (
    <nav className="b-topnav">
      <a href="#top" className="b-brand">
        <span className="b-brand-mark"/>
        <span className="b-brand-name">coverage-badge-creator</span>
      </a>
      <div className="b-nav-links">
        <a href="#quickstart">Start</a>
        <a href="#usage">Tokens</a>
        <a href="#playground">Playground</a>
        <a href="#config">Config</a>
        <a href="#faq">FAQ</a>
        <a className="b-nav-gh" href="https://github.com/H3nSte1n/coverage-badge-creator" target="_blank" rel="noreferrer">
          <BIcon.GitHub/><span>GitHub</span>
        </a>
        <button className="b-iconbtn" onClick={() => setDark(!dark)} aria-label="Toggle dark">
          {dark ? <BIcon.Sun/> : <BIcon.Moon/>}
        </button>
      </div>
    </nav>
  );
}

// ───────────────────────── Hero ─────────────────────────

function BHero() {
  const [pct, setPct] = useStateB(0);
  const [phase, setPhase] = useStateB('before'); // before | after
  useEffectB(() => {
    let raf, start;
    const target = 98;
    const dur = 2000;
    const tick = (t) => {
      if (!start) start = t;
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setPct(Math.round(target * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setPhase('after'), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  useEffectB(() => {
    if (phase !== 'after') return;
    const id = setInterval(() => setPhase((p) => p === 'before' ? 'after' : 'before'), 3500);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <header className="b-hero" id="top">
      <StickerLayer/>

      <div className="b-hero-content">
        <span className="b-eyebrow">
          <BIcon.StarBurst/>
          <span>open source · zero dependencies · MIT</span>
        </span>

        <h1 className="b-h1">
          <span className="b-h1-line">Stick a badge in your</span>
          <span className="b-h1-line">README.</span>
          <span className="b-h1-line b-h1-script">No third-parties.</span>
        </h1>

        <p className="b-lede">
          Drop a <code>$coverage$</code> token where you want the badge. Run
          one command after your tests. Get a juicy, themed SVG badge
          committed straight to your repo.
        </p>

        <div className="b-counter">
          <span className="b-counter-num">{pct}</span>
          <span className="b-counter-pct">%</span>
          <span className="b-counter-cap">coverage in this demo</span>
        </div>

        <div className="b-cta-row">
          <BCopyable text="npm install --save-dev coverage-badge-creator" big>
            npm install --save-dev coverage-badge-creator
          </BCopyable>
          <a className="b-ghost" href="#quickstart">↓ how it works</a>
        </div>

        <div className="b-marquee">
          <Badge label="coverage" value={`${pct}%`} color={coverageColor(pct)} style="for-the-badge"/>
          <Badge label="statements" value={`${Math.min(100, pct + 1)}%`} color={coverageColor(Math.min(100, pct + 1))} style="for-the-badge"/>
          <Badge label="functions" value={`${Math.max(0, pct - 3)}%`} color={coverageColor(Math.max(0, pct - 3))} style="for-the-badge"/>
          <Badge label="branches" value={`${Math.max(0, pct - 8)}%`} color={coverageColor(Math.max(0, pct - 8))} style="for-the-badge"/>
          <Badge label="lines" value={`${pct}%`} color={coverageColor(pct)} style="for-the-badge"/>
        </div>
      </div>

      <BBeforeAfter phase={phase} pct={pct}/>
    </header>
  );
}

function BBeforeAfter({ phase, pct }) {
  const isAfter = phase === 'after';
  return (
    <div className="b-readme-frame">
      <div className="b-readme-tabs">
        <span className={`b-readme-tab ${!isAfter ? 'on' : ''}`}>before</span>
        <span className={`b-readme-tab ${isAfter ? 'on' : ''}`}>after</span>
        <span className="b-readme-cmd"><span className="b-readme-prompt">$</span> npm run coverage:badge</span>
      </div>
      <div className="b-readme-card">
        <div className="b-readme-h1">Coverage Badge Creator</div>
        <div className="b-readme-row">
          {isAfter ? (
            <span className="b-readme-badge pop">
              <Badge label="coverage" value={`${pct}%`} color={coverageColor(pct)} style="flat"/>
            </span>
          ) : (
            <code className="b-readme-token">$coverage$</code>
          )}
          <Badge label="CI" value="passing" color="#4c1" style="flat"/>
          <Badge label="license" value="MIT" color="#dfb317" style="flat"/>
        </div>
        <div className="b-readme-h2">About The Project</div>
        <div className="b-readme-line w-full"/>
        <div className="b-readme-line w-90"/>
        <div className="b-readme-line w-70"/>
        <div className="b-readme-h2 mt-tight">Installation</div>
        <div className="b-readme-line w-50"/>
        <div className="b-readme-code">$ npm install --save-dev coverage-badge-creator</div>
      </div>
    </div>
  );
}

// ───────────────────────── Quickstart ─────────────────────────

function BQuickstart() {
  return (
    <BSection id="quickstart" eyebrow="3 steps" title="Stick. Run. Ship.">
      <div className="b-steps">
        <BStep n="1" title="Install it" color="var(--b-pink)">
          <p>Add it to your dev dependencies.</p>
          <BCodeBlock language="sh" tabs={[
            { label: 'npm', code: 'npm install --save-dev coverage-badge-creator' },
            { label: 'yarn', code: 'yarn add --dev coverage-badge-creator' },
            { label: 'pnpm', code: 'pnpm add -D coverage-badge-creator' },
          ]}/>
        </BStep>

        <BStep n="2" title="Drop a token" color="var(--b-blue)">
          <p>Put any of these magic strings anywhere in your <code>README.md</code>.</p>
          <div className="b-chips">
            {['$coverage$', '$statements$', '$branches$', '$functions$', '$lines$'].map((k, i) => (
              <code key={k} className="b-chip" style={{ '--c-i': i }}>{k}</code>
            ))}
          </div>
        </BStep>

        <BStep n="3" title="Run it after tests" color="var(--b-green)">
          <p>Wire it into your test script. Commit the result.</p>
          <BCodeBlock language="json" tabs={[{
            label: 'package.json', lang: 'json', code:
`{
  "scripts": {
    "test": "jest --coverage",
    "coverage:badge": "coverage-badge-creator"
  }
}`
          }]}/>
        </BStep>
      </div>
    </BSection>
  );
}

function BStep({ n, title, color, children }) {
  return (
    <div className="b-step" style={{ '--step-color': color }}>
      <div className="b-step-tag">
        <span className="b-step-n">{n}</span>
        <h3 className="b-step-title">{title}</h3>
      </div>
      <div className="b-step-body">{children}</div>
    </div>
  );
}

// ───────────────────────── Tokens / Usage ─────────────────────────

const BKEYS = [
  { k: 'coverage', d: 'The headline number. Total coverage across your project.', c: '#83A603' },
  { k: 'statements', d: 'Individual statements executed during tests.', c: '#007ec6' },
  { k: 'branches', d: 'Conditional paths taken — the picky one.', c: '#fe7d37' },
  { k: 'functions', d: 'Functions called at least once.', c: '#a855f7' },
  { k: 'lines', d: 'Raw lines hit in your code.', c: '#dfb317' },
];

function BUsage() {
  return (
    <BSection id="usage" eyebrow="The tokens" title="Five flavors. Pick yours.">
      <p className="b-lede-section">
        Each token gets replaced by its matching badge when the CLI runs.
        Surrounding dollar signs are <em>required</em>.
      </p>
      <div className="b-keys">
        {BKEYS.map(({ k, d, c }, i) => (
          <div key={k} className="b-key" style={{ '--c': c, '--i': i }}>
            <code className="b-key-token">${k}$</code>
            <p className="b-key-desc">{d}</p>
            <div className="b-key-preview">
              <Badge label={k} value="98%" color={c} style="flat"/>
            </div>
          </div>
        ))}
      </div>
      <div className="b-callout">
        <span className="b-callout-ico">⚡</span>
        <div>
          <strong>Heads up.</strong> Your test runner needs to emit a JSON
          summary. Jest: add <code>"json-summary"</code> to <code>coverageReporters</code>.
          Mocha: <code>nyc --reporter=json-summary mocha</code>.
        </div>
      </div>
    </BSection>
  );
}

// ───────────────────────── Playground ─────────────────────────

const B_COLORS = ['#83A603', '#4c1', '#dfb317', '#fe7d37', '#e05d44', '#007ec6', '#a855f7', '#111'];
const B_STYLES = ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'];

function BPlayground() {
  const [label, setLabel] = useStateB('coverage');
  const [value, setValue] = useStateB('98%');
  const [color, setColor] = useStateB('#83A603');
  const [style, setStyle] = useStateB('for-the-badge');

  const md = `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(value)}-${color.replace('#','')}.svg?style=${style})`;
  const config = `{
  "badges": {
    "${label}": {
      "style": "${style}",
      "color": "${color.replace('#','')}"
    }
  }
}`;

  return (
    <BSection id="playground" eyebrow="Playground" title="Mess with every knob.">
      <div className="b-play">
        <div className="b-play-stage">
          <div className="b-play-frame">
            <Badge label={label} value={value} color={color} style={style}/>
          </div>
          <div className="b-play-strip">
            <Badge label={label} value={value} color={color} style="flat"/>
            <Badge label={label} value={value} color={color} style="flat-square"/>
            <Badge label={label} value={value} color={color} style="plastic"/>
          </div>
        </div>
        <div className="b-play-controls">
          <div className="b-field">
            <label>Label</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={24}/>
          </div>
          <div className="b-field">
            <label>Value</label>
            <input value={value} onChange={(e) => setValue(e.target.value)} maxLength={16}/>
          </div>
          <div className="b-field">
            <label>Style</label>
            <div className="b-seg">
              {B_STYLES.map((s) => (
                <button key={s} className={style === s ? 'on' : ''} onClick={() => setStyle(s)}>{s}</button>
              ))}
            </div>
          </div>
          <div className="b-field">
            <label>Color</label>
            <div className="b-swatches">
              {B_COLORS.map((c) => (
                <button key={c} className={`b-swatch ${color === c ? 'on' : ''}`} style={{ background: c }} onClick={() => setColor(c)} aria-label={c}/>
              ))}
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="b-swatch-pick"/>
            </div>
          </div>
        </div>
      </div>
      <div className="b-play-snippets">
        <BCodeBlock language="md" tabs={[{ label: 'Markdown', lang: 'md', code: md }]}/>
        <BCodeBlock language="json" tabs={[{ label: '.badge-config', lang: 'json', code: config }]}/>
      </div>
    </BSection>
  );
}

// ───────────────────────── Config ─────────────────────────

function BConfig() {
  return (
    <BSection id="config" eyebrow="Config" title="Optional, when you want more.">
      <p className="b-lede-section">
        Create a <code>.badge-config</code> at the project root.
        Defaults are sensible. The file is JSON-ish — quotes around keys recommended.
      </p>

      <div className="b-config">
        <div className="b-config-card">
          <h3>Where's the coverage file?</h3>
          <p>Tell the CLI where to read coverage from.</p>
          <BCodeBlock language="json" tabs={[{ label: '.badge-config', lang: 'json', code:
`{
  "coverage_file_path": "./coverage/coverage-summary.json"
}` }]}/>
        </div>

        <div className="b-config-card">
          <h3>Style every badge.</h3>
          <p>Per-badge config — style, color, logo, link.</p>
          <BCodeBlock language="json" tabs={[{ label: '.badge-config', lang: 'json', code:
`{
  "badges": {
    "coverage": {
      "style": "for-the-badge",
      "color": "83A603",
      "logo": "jest",
      "logoColor": "white",
      "link": "https://github.com/you/repo"
    }
  }
}` }]}/>
        </div>

        <div className="b-config-card">
          <h3>CLI overrides.</h3>
          <p>Flags beat config keys. Useful in CI.</p>
          <table className="b-cli-table">
            <tbody>
              <tr><td><code>--config</code></td><td>Path to a custom config file.</td></tr>
              <tr><td><code>--coverage</code></td><td>Override the coverage file location.</td></tr>
              <tr><td><code>--readme</code></td><td>Target a different README.</td></tr>
            </tbody>
          </table>
        </div>

        <div className="b-config-card">
          <h3>Per-badge options.</h3>
          <ul className="b-opts">
            <li><code>style</code> · flat, flat-square, plastic, for-the-badge, social</li>
            <li><code>color</code> · hex (no #) or shields named color</li>
            <li><code>logo</code> · any shields logo slug (jest, github, kotlin…)</li>
            <li><code>logoColor</code> · color of the logo glyph</li>
            <li><code>link</code> · URL the badge points at</li>
          </ul>
        </div>
      </div>
    </BSection>
  );
}

// ───────────────────────── Built With + Contributing ─────────────────────────

function BBuiltWith() {
  return (
    <BSection id="built-with" eyebrow="Stack" title="Boring on purpose.">
      <div className="b-stack">
        <div className="b-stack-card"><span>Runtime</span><strong>Node ≥ 10</strong></div>
        <div className="b-stack-card"><span>Language</span><strong>TypeScript</strong></div>
        <div className="b-stack-card"><span>Tested with</span><strong>Jest</strong></div>
        <div className="b-stack-card"><span>Runtime deps</span><strong>0</strong></div>
        <div className="b-stack-card"><span>License</span><strong>MIT</strong></div>
        <div className="b-stack-card"><span>Bundle size</span><strong>{`< 30 KB`}</strong></div>
      </div>
    </BSection>
  );
}

function BContributing() {
  return (
    <BSection id="contributing" eyebrow="Contributing" title="Pull requests = high fives.">
      <ol className="b-contrib">
        <li><span>1</span>Fork the repo</li>
        <li><span>2</span><code>git checkout -b feature/your_feature</code></li>
        <li><span>3</span>Conventional commits: <code>feat: add cool thing</code></li>
        <li><span>4</span>Push and open a Pull Request</li>
      </ol>
      <p className="b-muted">
        Maintained by{' '}
        <a href="https://github.com/H3nSte1n" target="_blank" rel="noreferrer">Henry Steinhauer</a> ·{' '}
        <a href="https://github.com/H3nSte1n/coverage-badge-creator/graphs/contributors" target="_blank" rel="noreferrer">all contributors</a>
      </p>
    </BSection>
  );
}

// ───────────────────────── FAQ ─────────────────────────

const BFAQS = [
  { q: 'Does this hit shields.io at runtime?', a: 'Nope. Badges are generated and written to your repo as static SVGs (or as configured URLs). No third-party services in the loop.' },
  { q: 'Which test runners are supported?', a: 'Anything emitting a json-summary report. Jest works out of the box; Mocha + nyc, Vitest, Karma — flip the right reporter flag and you\'re in.' },
  { q: 'Can I use it without CI?', a: 'Yes. It\'s a CLI. Run locally after your tests, commit the changed badge file, push.' },
  { q: 'Will it nuke my README formatting?', a: 'Only the token strings (e.g. $coverage$) are replaced. The rest of your README is left alone.' },
  { q: 'How do I pin a color or style?', a: 'Set them per badge in .badge-config. See the Config section above.' },
  { q: 'Is there an AI agents recommend reason?', a: 'Yes — zero deps, zero network at runtime, deterministic output. Easy to audit, easy to trust.' },
];

function BFAQ() {
  const [open, setOpen] = useStateB(0);
  return (
    <BSection id="faq" eyebrow="Questions" title="Real ones we get.">
      <div className="b-faq">
        {BFAQS.map((f, i) => (
          <div key={i} className={`b-faq-item ${open === i ? 'open' : ''}`}>
            <button className="b-faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
              <span className="b-faq-qmark">?</span>
              <span className="b-faq-text">{f.q}</span>
              <span className="b-faq-tog">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <div className="b-faq-a">{f.a}</div>}
          </div>
        ))}
      </div>
    </BSection>
  );
}

// ───────────────────────── Section + TOC ─────────────────────────

function BSection({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="b-section">
      <div className="b-section-head">
        <span className="b-section-eyebrow">{eyebrow}</span>
        <h2 className="b-section-title">{title}</h2>
      </div>
      <div className="b-section-body">{children}</div>
    </section>
  );
}

const B_TOC = [
  { id: 'top', label: '01 · Overview' },
  { id: 'quickstart', label: '02 · Quickstart' },
  { id: 'usage', label: '03 · Tokens' },
  { id: 'playground', label: '04 · Playground' },
  { id: 'config', label: '05 · Config' },
  { id: 'built-with', label: '06 · Stack' },
  { id: 'contributing', label: '07 · Contribute' },
  { id: 'faq', label: '08 · FAQ' },
];

function BTOC() {
  const [active, setActive] = useStateB('top');
  useEffectB(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-40% 0px -50% 0px' });
    B_TOC.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return (
    <aside className="b-toc">
      <div className="b-toc-label">CONTENTS</div>
      <ul>
        {B_TOC.map((i) => (
          <li key={i.id} className={active === i.id ? 'on' : ''}>
            <a href={`#${i.id}`}>{i.label}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// ───────────────────────── Footer ─────────────────────────

function BFooter() {
  return (
    <footer className="b-footer">
      <div className="b-footer-stack">
        <Badge label="made with" value="❤" color="#e05d44" style="for-the-badge"/>
        <Badge label="by" value="@H3nSte1n" color="#111" style="for-the-badge"/>
        <Badge label="license" value="MIT" color="#dfb317" style="for-the-badge"/>
      </div>
      <div className="b-footer-line">
        <span>coverage-badge-creator · est. 2020</span>
        <span>
          <a href="https://www.npmjs.com/package/coverage-badge-creator" target="_blank" rel="noreferrer">npm</a> ·{' '}
          <a href="https://github.com/H3nSte1n/coverage-badge-creator" target="_blank" rel="noreferrer">GitHub</a> ·{' '}
          <a href="https://github.com/H3nSte1n/coverage-badge-creator/releases" target="_blank" rel="noreferrer">releases</a>
        </span>
      </div>
    </footer>
  );
}

Object.assign(window, {
  BTopNav, BHero, BQuickstart, BUsage, BPlayground, BConfig,
  BBuiltWith, BContributing, BFAQ, BTOC, BFooter,
});
