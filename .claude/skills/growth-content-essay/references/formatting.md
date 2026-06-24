# Formatting Rules (Markdown and PDF)

## Markdown heading hierarchy (hard rule)

The md2pdf generator relies on correct heading levels:
- `#` (H1): document title only, used exactly once, as the first heading.
- `##` (H2): section headers (Executive Summary, Key Insights & Frameworks, Tactical Playbook, Contrarian / Non-Obvious Takes, Sources & Further Reading). Do NOT number them.
- `###` (H3): subsection headers (3.1, 3.2, and so on within Key Insights).

Wrong levels break the PDF: sections render as plain text and spacing collapses.

## No em dashes (hard rule)

Never use the em dash character anywhere in the essay. Use colons, semicolons, commas, parentheses, or restructure the sentence. Before generating the PDF, grep the markdown for em dashes and fix any hits.

## The `:**` body-bullet rule (hard rule)

The md2pdf parser treats any line matching `- **Label:** value` (colon INSIDE the bold, i.e. `:**`) as a Source Info metadata line and hang-indents continuation lines under the label, which looks broken for body bullets.

- Reserve `- **Label:** value` ONLY for the short Source Info block under the title.
- For every other bulleted list (Tactical Playbook, Contrarian, Sources, definitional lists), keep the colon OUTSIDE the bold: `- **Label**: value`, or use a period: `- **Label.** value`. Both render as proper bullets.
- Before generating the PDF, grep the markdown for `:\*\*` and confirm every hit is an intended Source Info line.

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
