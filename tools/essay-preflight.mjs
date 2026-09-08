/**
 * essay-preflight.mjs — mechanical gate run before every essay PDF.
 *
 * Purpose: the recurring failure mode is "dropped context during compression"
 * (bare names, undefined terms, unframed quotes, effects with no stated cause).
 * A prose rule in CLAUDE.md did not stop it because it was self-applied by the
 * same pass that wrote the prose. This tool makes the check mechanical and
 * unavoidable: md2pdf.mjs runs it first and refuses to write a PDF on hard fails.
 *
 * Two tiers:
 *   HARD FAIL (exit 1) — objective, always-wrong violations.
 *   INVENTORY (printed) — a first-occurrence checklist of proper nouns, quotes,
 *   and effect-without-cause flags. The tool cannot judge whether an intro is
 *   *sufficient*; it forces the reviewer to look at each one.
 *
 * CLI:  node tools/essay-preflight.mjs "<essay.md>"      (exit 1 if hard fails)
 * Lib:  import { analyze, formatReport } from './essay-preflight.mjs'
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Numbers that, spelled out, are essentially always quantities (block these).
const NUM_HARD = ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty',
  'seventy', 'eighty', 'ninety', 'hundred', 'thousand'];
// Small spelled numbers: often quantities that should be figures, but sometimes
// pronouns/idioms ("one of them", "two-faced"). Warn, do not block.
const NUM_WARN = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const MAGNITUDES = ['million', 'billion', 'trillion'];
const NUM_IDIOMS = ['two-faced', 'one-on-one', 'one-off'];

// Words that signal a reaction / significance that may have lost its cause.
const EFFECT_TRIGGERS = ['unnerv', 'alarm', 'stunn', 'shock', 'disconcert', 'spooked',
  'rattled', 'blindsided', 'aghast', 'horrified', 'backfired', 'paid the price',
  'at risk', 'the breach', 'the incident', 'grew nervous', 'was terrified'];

// Common capitalized words that are not proper nouns worth reviewing.
const PN_STOP = new Set(['The', 'A', 'An', 'But', 'And', 'Or', 'In', 'On', 'At', 'As',
  'By', 'For', 'To', 'Of', 'With', 'Within', 'After', 'Before', 'During', 'Since',
  'So', 'Then', 'When', 'While', 'Yet', 'If', 'Because', 'Most', 'Some', 'Many',
  'Both', 'Not', 'No', 'He', 'She', 'It', 'They', 'We', 'You', 'His', 'Her', 'Their',
  'Its', 'This', 'That', 'These', 'Those', 'Here', 'There', 'Now', 'Later', 'Even',
  'Still', 'Only', 'Also', 'Instead', 'Neither', 'Meanwhile', 'Days', 'Less', 'Over',
  'Around', 'Under', 'Testifying', 'Denied', 'Exploring', 'Building', 'Employees',
  'Altman', 'OpenAI', 'Sam', 'Publicly', 'Privately', 'Others', 'Several', 'Each',
  'Every', 'Any', 'One', 'Asked', 'Given', 'Like', 'Nevertheless', 'Soon', 'Board',
  'Formula', 'Control', 'Depending', 'Eventually', 'Initially', 'Ultimately',
  'Together', 'Rather', 'Whatever', 'Four', 'Three', 'Six', 'Less', 'Days']);

const stripQuotes = (line) =>
  line.replace(/"[^"]*"/g, ' | ').replace(/“[^”]*”/g, ' | ');

const wordRe = (w) => new RegExp(`\\b${w}\\b`, 'i');

export function analyze(md) {
  const lines = md.split(/\r?\n/);
  const hardFails = [];
  const warnings = [];
  const properNouns = [];
  const seenPN = new Set();
  const quotes = [];
  const seenQuote = new Set();
  const effectFlags = [];

  const headings = [];

  lines.forEach((raw, idx) => {
    const n = idx + 1;
    const line = raw;

    // --- HARD: em dash / horizontal bar ---
    if (/[—―]/.test(line)) {
      hardFails.push({ type: 'em-dash', line: n, text: excerptAround(line, /[—―]/) });
    }
    // --- HARD: meta-bullet trap ---
    if (line.includes(':**')) {
      hardFails.push({ type: 'meta-bullet (`:**`)', line: n, text: line.trim().slice(0, 90) });
    }

    // --- headings ---
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      headings.push({ level: h[1].length, text: h[2].trim(), line: n });
      // numbered section header check
      if (h[1].length === 2 && /^\d+[.)]\s/.test(h[2])) {
        hardFails.push({ type: 'numbered section header', line: n, text: h[2].slice(0, 60) });
      }
    }

    // --- numbers (outside quotes, outside headings/metadata bullets) ---
    if (!h) {
      const bare = stripQuotes(line);
      for (const w of NUM_HARD) {
        if (wordRe(w).test(bare)) {
          hardFails.push({ type: `spelled number "${w}"`, line: n, text: bare.trim().slice(0, 90) });
        }
      }
      for (const w of NUM_WARN) {
        if (wordRe(w).test(bare) && !NUM_IDIOMS.some((idm) => new RegExp(idm, 'i').test(bare))) {
          warnings.push({ type: `possible spelled number "${w}"`, line: n, text: bare.trim().slice(0, 90) });
        }
      }
      for (const w of MAGNITUDES) {
        // magnitude not preceded by a digit -> likely a spelled figure ("a billion-dollar")
        const m = new RegExp(`(\\S+)\\s+${w}\\b|\\b${w}\\b`, 'i').exec(bare);
        if (m && new RegExp(`\\b${w}\\b`, 'i').test(bare) && !/\d[\s-]*$/.test(m[1] || '') && !new RegExp(`\\b${w}s\\b`, 'i').test(bare)) {
          // skip plural idioms ("hundreds of billions") handled by \bws\b guard above
          if (!new RegExp(`\\d[\\d,.]*\\s*${w}\\b`, 'i').test(bare) && !new RegExp(`\\d[\\d,.]*[\\s-]*${w}`, 'i').test(bare)) {
            warnings.push({ type: `spelled magnitude "${w}"`, line: n, text: bare.trim().slice(0, 90) });
          }
        }
      }
    }

    // --- effect-without-cause triggers ---
    if (!h) {
      for (const t of EFFECT_TRIGGERS) {
        if (line.toLowerCase().includes(t)) {
          effectFlags.push({ line: n, trigger: t, text: line.trim().slice(0, 120) });
          break;
        }
      }
    }

    // --- quotes: first occurrence ---
    if (!h) {
      const qmatches = [...line.matchAll(/"([^"]{6,180})"|“([^”]{6,180})”/g)];
      for (const q of qmatches) {
        const text = (q[1] || q[2] || '').trim();
        const key = text.toLowerCase().slice(0, 60);
        if (text && !seenQuote.has(key)) {
          seenQuote.add(key);
          quotes.push({ line: n, text: text.length > 90 ? text.slice(0, 87) + '...' : text });
        }
      }
    }

    // --- proper nouns: first occurrence ---
    if (!h && !/^\s*-\s+\*\*/.test(line)) {
      // drop quotes; break on sentence punctuation so names don't merge across sentences
      const cleaned = stripQuotes(line).replace(/[.!?;:]/g, ' | ');
      const pn = [...cleaned.matchAll(/[A-Z][A-Za-z'’-]+(?:\s+[A-Z][A-Za-z'’-]+)*/g)];
      for (const m of pn) {
        let toks = m[0].trim().replace(/[’']s\b/g, '').split(/\s+/).filter(Boolean);
        while (toks.length && PN_STOP.has(toks[0])) toks.shift();      // strip leading common words
        while (toks.length && PN_STOP.has(toks[toks.length - 1])) toks.pop(); // and trailing
        const phrase = toks.join(' ');
        if (!phrase || !/[a-z]/.test(phrase)) continue;       // skip empty / ALL-CAPS acronyms
        if (phrase.length < 3) continue;
        if (seenPN.has(phrase)) continue;
        seenPN.add(phrase);
        properNouns.push({ name: phrase, line: n });
      }
    }
  });

  // heading hierarchy checks
  const h1s = headings.filter((x) => x.level === 1);
  if (h1s.length !== 1) {
    hardFails.push({ type: 'heading hierarchy', line: h1s[0]?.line || 1, text: `expected exactly one H1 (#), found ${h1s.length}` });
  } else if (headings[0].level !== 1) {
    hardFails.push({ type: 'heading hierarchy', line: headings[0].line, text: 'first heading is not the H1 title' });
  }
  const badDepth = headings.find((x) => x.level >= 4);
  if (badDepth) {
    hardFails.push({ type: 'heading hierarchy', line: badDepth.line, text: `heading deeper than ### at "${badDepth.text.slice(0, 40)}"` });
  }

  return { hardFails, warnings, properNouns, quotes, effectFlags };
}

function excerptAround(line, re) {
  const i = line.search(re);
  const start = Math.max(0, i - 40);
  return (start > 0 ? '...' : '') + line.slice(start, i + 40).trim();
}

export function formatReport(r) {
  const out = [];
  out.push('');
  out.push('======================= ESSAY PREFLIGHT =======================');

  if (r.hardFails.length) {
    out.push('');
    out.push(`  HARD FAILS (${r.hardFails.length}) — these BLOCK the PDF:`);
    for (const f of r.hardFails) out.push(`    ✗ L${f.line}  [${f.type}]  ${f.text}`);
  } else {
    out.push('  ✓ No blocking violations (em dash / meta-bullet / spelled number / headings).');
  }

  if (r.warnings.length) {
    out.push('');
    out.push(`  WARNINGS (${r.warnings.length}) — verify each is intended:`);
    for (const w of r.warnings.slice(0, 40)) out.push(`    · L${w.line}  [${w.type}]  ${w.text}`);
    if (r.warnings.length > 40) out.push(`    · ...and ${r.warnings.length - 40} more`);
  }

  out.push('');
  out.push('  --- NOTHING-COLD REVIEW (not auto-checkable; confirm each) ---');

  out.push('');
  out.push(`  PROPER NOUNS — first occurrence (${r.properNouns.length}). Each must be introduced HERE:`);
  for (const p of r.properNouns) out.push(`    L${String(p.line).padEnd(4)} ${p.name}`);

  out.push('');
  out.push(`  QUOTES — first occurrence (${r.quotes.length}). Each needs a who/to-whom/why frame:`);
  for (const q of r.quotes) out.push(`    L${String(q.line).padEnd(4)} "${q.text}"`);

  if (r.effectFlags.length) {
    out.push('');
    out.push(`  EFFECT-WITHOUT-CAUSE flags (${r.effectFlags.length}). Confirm the cause is on the page:`);
    for (const e of r.effectFlags) out.push(`    L${e.line}  (${e.trigger})  ${e.text}`);
  }

  out.push('');
  out.push('===============================================================');
  return out.join('\n');
}

// --- CLI ---
const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node tools/essay-preflight.mjs "<essay.md>"');
    process.exit(2);
  }
  const md = readFileSync(resolve(file), 'utf-8');
  const report = analyze(md);
  console.log(formatReport(report));
  if (report.hardFails.length) {
    console.error(`\nPREFLIGHT FAILED: ${report.hardFails.length} blocking issue(s).`);
    process.exit(1);
  }
  console.log('\nPreflight passed (blocking checks).');
  process.exit(0);
}
