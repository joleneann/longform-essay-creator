# Longform Essay System

An AI-powered system that synthesizes one or many pieces of long-form content (YouTube talks, podcast interviews, blog posts, news features) into detailed written essays. Built for those short on time, and read better than they watch.

## Two Modes

One toolchain, one set of quality rules, two content templates. The mode is always chosen by asking, never inferred from the source, because a wrong mode wastes the whole essay.

| Mode | For | Template |
|:-----|:----|:---------|
| **Growth** | Growth operators and growth topics (Lenny, a16z, Reforge, Figma, Anthropic) | Source Info, Executive Summary, Key Insights & Frameworks, Tactical Playbook, Contrarian Takes, Sources |
| **General** | Any topic: one long-form article, a news feature, a magazine essay, or several merged into one | Source Info, Executive Summary, thematic Breakdown chapters, optional Sources. No growth scaffolding |

## How It Works

| Step | What happens |
|:-----|:-------------|
| **1. Pick the mode** | Growth or general, asked up front. Nothing is fetched, researched, or written until the answer lands. |
| **2. Extract content** | YouTube: ytsearch CLI (instant, no browser). Maven/Mux: Groq Whisper API (~15s per 45-min lesson) with local faster-whisper fallback. Blogs and articles: direct HTTP fetch. |
| **3. Build a topic inventory** | The full transcript is read end to end and turned into a numbered, timestamped list of every topic. That list is the skeleton; nothing on it may be dropped. |
| **4. Research context** | 4 to 8 parallel web searches: the speaker's extended thinking, supporting and contrasting evidence, framework lineage. A second targeted round if gaps remain. |
| **5. Write essay** | The mode's template, with strict anti-repetition rules and the Nothing Cold reader-onboarding rule. |
| **6. Preflight, then PDF** | An automatic gate blocks the build on objective violations and prints a review checklist. Then a custom PDF with Inter/InterDisplay typography and embedded framework illustrations. |

## What Makes This Different

**Not a summary.** A full replacement for watching the video or reading many long form blogs. Every major topic gets proportional depth. Speaker qualifications, caveats, examples, and data points are preserved.

**Zero redundancy.** The essay template enforces strict anti-repetition rules: every idea, quote, and data point gets exactly one home. Cross-references replace restatements. The result is essays that are 25-35% shorter with zero loss of unique content.

**Nothing lands cold.** The reader has not seen the source, so every person, company, document, event, and quote is introduced at its first appearance in the essay's own ordering, not the source's. Stated effects carry their causes. Bare names and dropped antecedents are treated as the same class of failure as omitting a topic.

**A build gate, not a good intention.** `tools/essay-preflight.mjs` runs automatically before any PDF is written. It hard-fails the build on em dashes, meta-bullet formatting traps, spelled-out numbers, and broken heading hierarchy, and prints a first-occurrence inventory of every proper noun and quote for review. The gate exists because the old "remember to sweep at the end" step was self-applied by the same pass that wrote the prose, and so never caught anything.

**Multi-source synthesis.** Send multiple sources on the same theme and the system weaves them into a single cohesive essay, tracing where authors agree, diverge, and build on each other. The [On Taste](samples/On%20Taste.pdf) sample combines six independent voices (Paul Graham, Julie Zhuo, Gaurav Vohra, Emil Kowalski, Anu Atluru, Steve Jobs) spanning two decades into one unified argument.

**Research-enriched.** Before writing a single line, the system runs targeted web research across three dimensions: finding what the same speaker has written or said elsewhere on the same themes (companion blog posts, tweetstorms, other interviews), locating real-world case studies and data that support or contradict the claims being made, and tracing referenced frameworks back to their canonical sources. This contextual research is what turns a transcript into an essay that's actually richer than the original. Sources are drawn from a curated list of 20+ preferred practitioners and publications.

## Sample Output

See [`samples/`](samples/) for complete examples:

- [On Taste](samples/On%20Taste.pdf) (Paul Graham, Julie Zhuo, Gaurav Vohra, Emil Kowalski, Anu Atluru, Steve Jobs; 15 pages)
- [a16z Big Ideas 2026](samples/a16z%20Big%20Ideas%202026.pdf) (40+ a16z partners; 17 pages)
- [Agents and Agentic Workflows](samples/Agents%20and%20Agentic%20Workflows.pdf) (Sara Davison & Tyler Fisk, AI Build Lab; 12 pages)

## Tech Stack

[ytsearch](https://github.com/Infatoshi/ytsearch) for YouTube transcripts | [Groq Whisper API](https://console.groq.com/docs/speech-to-text) for Maven/Mux transcription (247x real-time, ~$0.03/lesson) with [faster-whisper](https://github.com/SYSTRAN/faster-whisper) fallback | ffmpeg for audio extraction | [pdf-lib](https://github.com/Hopding/pdf-lib) + [fontkit](https://github.com/nicolo-ribaudo/fontkit) for PDF generation | [Inter](https://rsms.me/inter/) + InterDisplay typography | Claude Code for orchestration

## Setup

```bash
# Clone and install
git clone https://github.com/joleneann/longform-essay-creator.git
cd longform-essay-creator
npm install

# Install uv (Python package manager)
# Windows:
powershell -Command "irm https://astral.sh/uv/install.ps1 | iex"
# macOS/Linux:
curl -LsSf https://astral.sh/uv/install.sh | sh

# Set up ytsearch + transcription tools
git clone https://github.com/Infatoshi/ytsearch.git tools/ytsearch
uv venv tools/whisper-env
uv pip install faster-whisper yt-dlp groq --python tools/whisper-env/Scripts/python.exe

# Install ffmpeg
# Windows: winget install Gyan.FFmpeg
# macOS: brew install ffmpeg
# Linux: sudo apt install ffmpeg

# Set up Groq API key (free at console.groq.com)
export GROQ_API_KEY=your_key_here
```

**Update anytime:** `git pull origin main && npm install`

## Usage

Open Claude Code in the project directory and send a link:

- *YouTube:* "Process this: https://www.youtube.com/watch?v=VIDEO_ID"
- *Blog:* "Process this: https://a16z.com/some-article/"
- *Maven:* "Process this: https://maven.com/p/LESSON_ID/lesson-name"
- *Pasted text:* "Process this: [paste full article text]"
- *News or magazine feature:* "Process this: https://publication.com/some-feature"
- *Multi-source:* "Synthesize these into one essay: [link 1] [link 2] [link 3]"

The first question back is always which mode to use. Answer it and the rest runs unattended.

## Project Structure

| Path | Purpose |
|------|---------|
| `CLAUDE.md` | System instructions: modes, essay templates, research and quality rules |
| `.claude/skills/growth-content-essay/` | The skill that runs the workflow, plus its sourcing, template, and formatting references |
| `tools/md2pdf.mjs` | PDF generator with image embedding; runs preflight before writing |
| `tools/essay-preflight.mjs` | Quality gate: hard-fails the build on objective violations, prints the Nothing Cold review checklist |
| `tools/md2docx.mjs` | Word export, for when a PDF is not the deliverable |
| `tools/transcribe_groq.py` | Maven/Mux transcription via Groq Whisper API (primary) |
| `tools/transcribe_maven.py` | Maven/Mux transcription via local faster-whisper (fallback) |
| `fonts/` | Inter + InterDisplay TTFs |
| `samples/` | Sample essay output |
| `transcripts/`* | Saved transcripts (local only) |
| `essays/`* | Generated PDFs and images (local only) |

*\* Not committed to repo*

## About

Built by **Jolene Fernandes**, a growth engineer and marketer who built this system to deeply study the operators she follows. The system reflects how she learns: read over watch, depth over breadth, practitioners over pundits. 
