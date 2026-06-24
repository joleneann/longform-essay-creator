---
name: growth-content-essay
description: >
  Turn long-form growth content into a comprehensive, practitioner-grade PDF essay.
  Use this skill WHENEVER the user shares a YouTube link, podcast or video link, a blog URL,
  a Maven Lightning Lesson, or pastes a transcript from a growth operator (Lenny Rachitsky,
  a16z, Reforge, Figma, Anthropic, Sandy Diao, Elena Verna, Kyle Poyar, etc.) and wants it
  written up, summarized, taught, turned into an essay, study guide, notes, or PDF. Also use
  for "make an essay from this", "write this up", "take notes on this talk", "combine these
  talks into one essay", or any request to convert growth talks, interviews, or posts into
  long-form written notes. Prefer this skill over ad-hoc summarizing for any growth-content source.
---

# Growth Content Essay System

Convert long-form growth content (YouTube talks, podcasts, Maven lessons, blog posts, pasted text) into a detailed, practitioner-grade written essay saved as a PDF. The reader prefers reading to watching: the essay must let her fully internalize the source without watching it. That means comprehensive and nuanced, never a thin summary.

All paths below are relative to the project root (the folder containing this project's `tools/` and `fonts/`).

## Non-negotiables (read before writing)

1. **Read the FULL transcript end to end, then build a topic inventory.** Every distinct topic the speaker covers must appear in the essay. This is mandatory. See `references/sourcing.md`.
2. **Follow the 6-section template exactly.** See `references/essay-template.md`.
3. **Hard formatting rules:** never use em dashes; use correct markdown heading levels (`#` title once, `##` sections, `###` subsections); never use `- **Label:** value` for body bullets. See `references/formatting.md`.
4. **Write in plain, clear language**, mechanism first, defining jargon on first use. Plain does not mean shallow: keep every nuance and caveat.
5. **Never spawn multi-agent workflows for the essay itself.** Do research, writing, and PDF generation in the main session. (Exception: the user may explicitly ask for a research agent.)
6. **Every claim must be traceable to its source.** Tag major claims, quotes, and stats with a source locator (a timestamp for video or audio), attribute by source in multi-source essays, and cite external claims in Section 6. Add nothing that cannot be traced to the transcript or a cited source. See `references/essay-template.md` (Traceability and provenance).

## Workflow

1. **Ingest the source by type** (YouTube, Maven, blog, pasted text, or multiple sources). See `references/sourcing.md`.
2. **Read the full transcript** and build a numbered topic inventory with timestamps. This is the skeleton for Section 3; no topic may be dropped.
3. **Run the research phase** before writing: 4 to 8 parallel WebSearch calls across the research dimensions, then a second targeted round if gaps remain. Never start writing until research is complete. See `references/sourcing.md`.
4. **Write the essay** following `references/essay-template.md`, cross-checking every section against the topic inventory. Apply the anti-repetition and depth rules.
5. **Generate the PDF** with `tools/md2pdf.mjs` after running the pre-PDF checks. See `references/formatting.md`.

## Tools (in this project)

- **YouTube transcript:** `cd tools/ytsearch && uv run ytsearch.py "<url>"`, redirect to `transcripts/speaker-name-topic.txt`.
- **Maven / Mux audio:** `tools/whisper-env/Scripts/python.exe tools/transcribe_groq.py "<full signed Mux URL>" "transcripts/speaker-name-topic.txt"` (Groq Whisper). Extract the full signed URL via the browser; never scrape the page or a CC track. Route media URLs through the file/script, not through chat.
- **Blog:** WebFetch the article. If paywalled or not fully accessible, ask the user to paste the full text.
- **PDF:** `node tools/md2pdf.mjs "<in.md>" "<out.pdf>"`. Fonts are in `fonts/`.

## Output locations

- Transcripts: `transcripts/` (named `speaker-name-short-topic.txt`).
- Essay markdown: `essays/essay md files/`.
- Final PDF: `essays/YYYY-MM-DD - Title.pdf`.

## Before generating the PDF (mandatory checks)

- Grep the markdown for em dashes and fix any hits.
- Grep the markdown for `:\*\*` and confirm every hit is an intended Source Info metadata line under the title, not a body bullet.
- Cross-check the essay against the topic inventory: every topic present, proportional depth, nuance preserved.

## Reference files

- `references/sourcing.md` - how to fetch each source type, the mandatory full-read and topic inventory, and the research phase plus source-quality rules.
- `references/essay-template.md` - the 6-section template, anti-repetition rules, and the depth and tone rules.
- `references/formatting.md` - markdown heading hierarchy, the no-em-dash rule, the `:**` bullet rule, and PDF formatting (fonts, palette, spacing, images).
