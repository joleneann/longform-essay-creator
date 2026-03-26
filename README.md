# Growth Content Essay System

An AI-powered system that converts long-form growth content (YouTube talks, podcast interviews, blog posts) into detailed, practitioner-grade written essays. Built for growth engineers and marketers who read better than they watch.

## The Problem

The best growth thinking lives in hour-long YouTube talks, 90-minute podcast episodes, and dense blog posts from operators like Lenny Rachitsky, Elena Verna, Brian Balfour, Andrew Chen, and Casey Winters. Watching a 90-minute video to extract the 15 minutes that matter to your work is inefficient. Reading is faster, more retainable, and easier to reference later.

## How It Works

| Step &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | What happens |
|:------|:-------------|
| **1. Extract** | YouTube: ytsearch CLI (instant, no browser). Maven/Mux: faster-whisper local transcription. Blogs: direct HTTP fetch. |
| **2. Research** | Four targeted web searches: growth engineering bridge, speaker's extended thinking, supporting/contrasting evidence, framework lineage. |
| **3. Write** | 11-section essay template covering insights, tactical playbook, growth engineering lens, growth marketing lens, and more. |
| **4. Output** | Custom PDF with Inter/InterDisplay typography and embedded framework illustrations. |

Send a link. Get back a comprehensive essay that you can read instead of watching the video, enriched with contextual research from high-quality growth sources.

## What Makes This Different

**Not a summary.** The goal is a full replacement for watching the video. Every major topic gets proportional depth. Speaker qualifications and caveats are preserved. Specific examples, data points, and anecdotes are included. If the speaker spent 5 minutes on a topic, that topic gets proportional space in the essay.

**Contextual research.** Before writing, the system runs targeted web searches to connect the content to growth engineering and marketing practice, find the speaker's extended thinking on the topic, locate supporting or contrasting evidence, and trace framework lineage to canonical sources.

**Growth-native analysis.** Every essay includes dedicated sections on how the content applies to growth engineering (experimentation, data infrastructure, A/B testing, growth loops) and growth marketing (acquisition channels, retention mechanics, lifecycle marketing).

**Visual fidelity.** When source material contains framework diagrams, data charts, or process flows, the system screenshots them from the source and embeds them directly in the PDF.

## Essay Template

Every essay follows this 11-section structure:

1. **Source Info**: title, speaker, date, link
2. **TL;DR**: 3-5 sentence overview
3. **Core Thesis**: the central argument
4. **Key Insights & Frameworks**: the meat of the essay, as deep as the material demands
5. **Tactical Playbook**: concrete moves a practitioner can make Monday morning
6. **Growth Engineering Lens**: experimentation, product growth, data infrastructure
7. **Growth Marketing Lens**: acquisition, retention, engagement campaigns
8. **Contrarian / Non-Obvious Takes**: what most people would miss
9. **Quotable Moments**: standout lines with context
10. **What to Revisit**: specific timestamps or passages for deeper study
11. **Sources & Further Reading**: annotated external sources from the research phase

## Sample Output

See the [`samples/`](samples/) directory for a complete example essay:

- [Head of Claude Code: What Happens After Coding Is Solved](samples/2026-03-26%20-%20Head%20of%20Claude%20Code%20What%20Happens%20After%20Coding%20Is%20Solved.pdf) (Boris Cherny on Lenny's Podcast, 19 pages)

## Tech Stack

- **Content extraction**: [ytsearch](https://github.com/Infatoshi/ytsearch) for YouTube transcripts, [faster-whisper](https://github.com/SYSTRAN/faster-whisper) + ffmpeg for Maven/Mux video transcription, WebFetch for blogs
- **Research**: WebSearch with source quality filtering
- **PDF generation**: Custom Node.js script using [pdf-lib](https://github.com/Hopding/pdf-lib) with [fontkit](https://github.com/nicolo-ribaudo/fontkit)
- **Typography**: [Inter](https://rsms.me/inter/) (body) + InterDisplay (headings)
- **Orchestration**: Claude Code with parallel agent execution

## Source Quality Standards

Research is filtered to high-quality growth sources:

**Preferred**: 20 curated growth practitioners including Lenny Rachitsky, Andrew Chen, Brian Balfour, Elena Verna, Sean Ellis, Kyle Poyar, Emily Kramer (MKT1), Wes Kao, Marc Andreessen, Julie Zhuo, How They Grow, Marily Nika, and others. Plus publications: Reforge, a16z, First Round Review, Y Combinator, Stratechery, and company growth blogs (Airbnb, Spotify, Figma, Notion)

**Acceptable**: HBR, Wired, TechCrunch (for data and case studies)

**Avoided**: Generic SEO content, listicles, low-authority marketing blogs

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Claude Code](https://claude.ai/claude-code) (orchestrates the full pipeline)
- [uv](https://docs.astral.sh/uv/) (Python package manager, for ytsearch)
- [ffmpeg](https://ffmpeg.org/) (for Maven audio extraction)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/joleneann/growth-content-essays.git
cd growth-content-essays

# 2. Install Node.js dependencies (PDF generator)
npm install

# 3. Install uv (Python package manager)
# Windows:
powershell -Command "irm https://astral.sh/uv/install.ps1 | iex"
# macOS/Linux:
curl -LsSf https://astral.sh/uv/install.sh | sh

# 4. Set up ytsearch (YouTube transcript extraction)
git clone https://github.com/Infatoshi/ytsearch.git tools/ytsearch

# 5. Set up faster-whisper (Maven/Mux video transcription)
uv venv tools/whisper-env
uv pip install faster-whisper yt-dlp --python tools/whisper-env/Scripts/python.exe

# 6. Install ffmpeg
# Windows: winget install Gyan.FFmpeg
# macOS: brew install ffmpeg
# Linux: sudo apt install ffmpeg
```

### Verify Installation

```bash
# Test YouTube transcript extraction
cd tools/ytsearch && uv run ytsearch.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ" | head -5

# Test PDF generation
node essays/md2pdf.mjs samples/essay_v1_boris_cherny.md test-output.pdf

# Test faster-whisper
tools/whisper-env/Scripts/python.exe -c "from faster_whisper import WhisperModel; print('OK')"
```

### Updating

```bash
git pull origin main
npm install  # in case dependencies changed
```

### Usage

Open Claude Code in the project directory and send a link. For example:

- *YouTube video:* "Process this: https://www.youtube.com/watch?v=VIDEO_ID"
- *Blog post:* "Process this: https://a16z.com/some-article/"
- *Maven lesson:* "Process this: https://maven.com/p/LESSON_ID/lesson-name"
- *Pasted text:* "Process this: [paste full article text]"

Claude Code handles everything: extraction, research, essay writing, and PDF generation.

## Project Structure

**In the repo:**

| File | Purpose |
|------|---------|
| `CLAUDE.md` | System instructions, essay template, and research rules |
| `essays/md2pdf.mjs` | Custom PDF generator with image embedding |
| `tools/transcribe_maven.py` | Maven/Mux video transcription script |
| `fonts/` | Inter and InterDisplay TTF files (6 TTFs) |
| `samples/` | Sample essay outputs (.md + .pdf) |
| `package.json` | Node.js dependencies (pdf-lib, fontkit) |

**Local only (generated, not committed):**

| Directory | Contents |
|-----------|----------|
| `transcripts/` | Saved transcripts for re-use |
| `essays/*.pdf` | Generated essay PDFs |
| `essays/images/` | Screenshotted illustrations |
| `tools/ytsearch/` | Cloned ytsearch repo |
| `tools/whisper-env/` | Python venv with faster-whisper |

## Built By

Jolene Fernandes | Growth Engineer & Marketer
