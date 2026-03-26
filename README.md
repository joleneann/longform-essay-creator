# Growth Content Essay System

An AI-powered system that converts long-form growth content (YouTube talks, podcast interviews, blog posts) into detailed, practitioner-grade written essays. Built for growth engineers and marketers who read better than they watch.

## How It Works

| Step | What happens |
|:-----|:-------------|
| **1. Extract content** | YouTube: ytsearch CLI (instant, no browser). Maven/Mux: faster-whisper local transcription. Blogs: direct HTTP fetch. |
| **2. Research context** | Four targeted web searches: growth engineering bridge, speaker's extended thinking, supporting/contrasting evidence, framework lineage. |
| **3. Write essay** | 11-section template covering insights, tactical playbook, growth engineering lens, growth marketing lens, and more. |
| **4. Generate PDF** | Custom PDF with Inter/InterDisplay typography and embedded framework illustrations. |

Send a link. Get back a comprehensive essay you can read instead of watching the video, enriched with contextual research from high-quality growth sources.

## What Makes This Different

**Not a summary.** A full replacement for watching the video. Every major topic gets proportional depth. Speaker qualifications, caveats, examples, and data points are preserved. The growth engineering and marketing lens sections are powered by a practitioner knowledge base built from 30+ sources covering real benchmarks, tool landscapes, and current channel economics.

**Research-enriched.** Before writing, the system searches for how the content connects to growth practice, finds the speaker's extended thinking, locates supporting or contrasting evidence, and traces frameworks to canonical sources. All from a curated list of 20+ preferred growth practitioners and publications.

## Curatorial Lens

The practitioners and publications in this system are not algorithmically selected. They represent a personal, opinionated curation built from years of working in growth engineering and marketing. Every source on the preferred list has earned its place by consistently publishing practitioner-grade thinking: real frameworks, real data, real case studies. This curation is what makes the research phase useful rather than noisy.

## Sample Output

See [`samples/`](samples/) for a complete example:

- [Head of Claude Code: What Happens After Coding Is Solved](samples/2026-03-26%20-%20Head%20of%20Claude%20Code%20What%20Happens%20After%20Coding%20Is%20Solved.pdf) (Boris Cherny on Lenny's Podcast, 28 pages)

## Tech Stack

[ytsearch](https://github.com/Infatoshi/ytsearch) for YouTube transcripts | [faster-whisper](https://github.com/SYSTRAN/faster-whisper) + ffmpeg for Maven/Mux transcription | [pdf-lib](https://github.com/Hopding/pdf-lib) + [fontkit](https://github.com/nicolo-ribaudo/fontkit) for PDF generation | [Inter](https://rsms.me/inter/) + InterDisplay typography | Claude Code for orchestration

## Setup

```bash
# Clone and install
git clone https://github.com/joleneann/growth-content-essays.git
cd growth-content-essays
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

Built by **Jolene Fernandes**, a growth engineer and marketer who built this system to deeply study the operators she follows. The system reflects how she learns: read over watch, depth over breadth, practitioners over pundits. The source list, the essay structure, and the research priorities all come from the same place any good growth strategy does: knowing which signals to pay attention to and which to ignore.
