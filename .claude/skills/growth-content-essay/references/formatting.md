# Formatting Rules (Markdown and PDF)

## Markdown heading hierarchy (hard rule)

The md2pdf generator relies on correct heading levels:
- `#` (H1): document title only, used exactly once, as the first heading.
- `##` (H2): section headers (Executive Summary, Key Insights & Frameworks, Tactical Playbook, Contrarian / Non-Obvious Takes, Sources & Further Reading). Do NOT number them.
- `###` (H3): subsection headers (3.1, 3.2, and so on within Key Insights).

Wrong levels break the PDF: sections render as plain text and spacing collapses.

## No em dashes (hard rule)

Never use the em dash character anywhere in the essay. Use colons, semicolons, commas, parentheses, or restructure the sentence. Before generating the PDF, grep the markdown for em dashes and fix any hits.

## The `:**` rule (hard rule, enforced by preflight)

The md2pdf parser treats any line matching `- **Label:** value` (colon INSIDE the bold, i.e. `:**`) as a Source Info metadata line and hang-indents continuation lines under the label, which looks broken for body bullets.

`essay-preflight` hard-fails on `:**` ANYWHERE in the file, including the Source Info block. So never use it:

- Source Info: `- **Source**: value`, `- **Speaker**: value`. Colon outside the bold.
- Every other bulleted list (Tactical Playbook, Contrarian, Sources, definitional lists): `- **Label**: value`, or a period, `- **Label.** value`. Both render as proper bullets.
- Bolded lead-ins inside body prose follow the same rule: `**Judgment from real experience.** ...`, never `**Judgment:**`.

## Numbers as figures (hard rule, enforced by preflight)

Write numbers as figures: `$13 billion`, `70 pages`, `26%`, `3 years`, `5 pillars`. Never spell them out, and never inherit a source's house style. Preflight hard-fails on the common spelled forms (hundred, thousand, million as bare words) and warns on small spelled numbers; clear the warnings unless the number is grammatical rather than quantitative. Never alter a number inside a direct quote.

## The preflight gate (mandatory, mechanical)

`md2pdf.mjs` runs `tools/essay-preflight.mjs` automatically before writing any PDF.

It HARD-FAILS the build (no PDF written) on: em dashes, `:**`, spelled-out numbers, and broken heading hierarchy. It PRINTS, for your review, a first-occurrence inventory of every proper noun and every quote, plus effect-without-cause flags.

You must read that inventory and confirm each first-occurrence proper noun is introduced, each quote is framed, and each effect flag has its cause on the page, before accepting the PDF. The tool cannot judge sufficiency; it only forces the review. Do not pass `--skip-preflight` to dodge a real fix.

## Generating the PDF

Run from the project root:

```
node tools/md2pdf.mjs "essays/essay md files/YYYY-MM-DD - Title.md" "essays/YYYY-MM-DD - Title.pdf"
```

The generator parses `[text](url)` into clean clickable links (no raw URLs), wraps metadata at the left margin, and embeds images.

## PDF visual rules (handled by md2pdf, do not fight them)

- Body font Inter; heading font InterDisplay (TTFs in `fonts/`). Never Helvetica or Arial.
- Palette: dark navy body text, dark blue headings and bullets, muted gray for metadata and quotes. No red or accent colors on headings.
- Generous spacing: large gaps before section and subsection headers, section headers get a horizontal rule, body leading is generous, wide side margins.

## Illustrations and screenshots

When the source has an important diagram, chart, framework visual, or process flow, screenshot it and embed it:
- Save to `essays/images/` named `essay-slug-description.png`.
- Embed with `![descriptive caption](essays/images/filename.png)`.
- Only include visuals that add genuine understanding. Skip decorative images, headshots, and logos.
- The generator centers images, scales to the content width (max height 400pt), and renders the caption below in italic muted text.

## Naming and locations

- Final PDF: `essays/YYYY-MM-DD - Title.pdf`.
- Essay markdown: `essays/essay md files/YYYY-MM-DD - Title.md`.
- Transcripts: `transcripts/speaker-name-short-topic.txt`.
