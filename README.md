# Longform Essay System

An AI-powered system that synthesizes one or many pieces of long-form content (YouTube talks, podcast interviews, blog posts) into detailed written essays. Built for those short on time, and read better than they watch.

## How It Works

| Step | What happens |
|:-----|:-------------|
| **1. Extract content** | YouTube: ytsearch CLI (instant, no browser). Maven/Mux: faster-whisper local transcription. Blogs: direct HTTP fetch. |
| **2. Research context** | Three targeted web searches: speaker's extended thinking, supporting/contrasting evidence, framework lineage. |
| **3. Write essay** | 7-section template with strict anti-repetition rules and zero redundancy. |
| **4. Generate PDF** | Custom PDF with Inter/InterDisplay typography and embedded framework illustrations. |

## What Makes This Different

**Not a summary.** A full replacement for watching the video or reading many long form blogs. Every major topic gets proportional depth. Speaker qualifications, caveats, examples, and data points are preserved.

**Zero redundancy.** The essay template enforces strict anti-repetition rules: every idea, quote, and data point gets exactly one home. Cross-references replace restatements. The result is essays that are 25-35% shorter with zero loss of unique content.

**Multi-source synthesis.** Send multiple sources on the same theme and the system weaves them into a single cohesive essay, tracing where authors agree, diverge, and build on each other. The [On Taste](samples/On%20Taste.pdf) sample combines six independent voices (Paul Graham, Julie Zhuo, Gaurav Vohra, Emil Kowalski, Anu Atluru, Steve Jobs) spanning two decades into one unified argument.

**Research-enriched.** Before writing a single line, the system runs targeted web research across three dimensions: finding what the same speaker has written or said elsewhere on the same themes (companion blog posts, tweetstorms, other interviews), locating real-world case studies and data that support or contradict the claims being made, and tracing referenced frameworks back to their canonical sources. This contextual research is what turns a transcript into an essay that's actually richer than the original. Sources are drawn from a curated list of 20+ preferred practitioners and publications.

## Sample Output

See [`samples/`](samples/) for complete examples:

- [On Taste](samples/On%20Taste.pdf) (Paul Graham, Julie Zhuo, Gaurav Vohra, Emil Kowalski, Anu Atluru, Steve Jobs; 15 pages)
- [a16z Big Ideas 2026](samples/a16z%20Big%20Ideas%202026.pdf) (40+ a16z partners; 17 pages)
- [Agents and Agentic Workflows](samples/Agents%20and%20Agentic%20Workflows.pdf) (Sara Davison & Tyler Fisk, AI Build Lab; 12 pages)

## Tech Stack

[ytsearch](https://github.com/Infatoshi/ytsearch) for YouTube transcripts | [faster-whisper](https://github.com/SYSTRAN/faster-whisper) + ffmpeg for Maven/Mux transcription | [pdf-lib](https://github.com/Hopding/pdf-lib) + [fontkit](https://github.com/nicolo-ribaudo/fontkit) for PDF generation | [Inter](https://rsms.me/inter/) + InterDisplay typography | Claude Code for orchestration

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

# Set up ytsearch + faster-whisper
git clone https://github.com/Infatoshi/ytsearch.git tools/ytsearch
uv venv tools/whisper-env
uv pip install faster-whisper yt-dlp --python tools/whisper-env/Scripts/python.exe

# Install ffmpeg
# Windows: winget install Gyan.FFmpeg
# macOS: brew install ffmpeg
# Linux: sudo apt install ffmpeg
```

**Update anytime:** `git pull origin main && npm install`

## Usage

Open Claude Code in the project directory and send a link:

- *YouTube:* "Process this: https://www.youtube.com/watch?v=VIDEO_ID"
- *Blog:* "Process this: https://a16z.com/some-article/"
- *Maven:* "Process this: https://maven.com/p/LESSON_ID/lesson-name"
- *Pasted text:* "Process this: [paste full article text]"
- *Multi-source:* "Synthesize these into one essay: [link 1] [link 2] [link 3]"

## Project Structure

| Path | Purpose |
|------|---------|
| `CLAUDE.md` | System instructions, essay template, research rules |
| `research/` | Growth engineering and marketing knowledge bases |
| `essays/md2pdf.mjs` | PDF generator with image embedding |
| `tools/transcribe_maven.py` | Maven/Mux transcription script |
| `fonts/` | Inter + InterDisplay TTFs |
| `samples/` | Sample essay output |
| `transcripts/`* | Saved transcripts (local only) |
| `essays/`* | Generated PDFs and images (local only) |

*\* Not committed to repo*

## About

Built by **Jolene Fernandes**, a growth engineer and marketer who built this system to deeply study the operators she follows. The system reflects how she learns: read over watch, depth over breadth, practitioners over pundits. 
