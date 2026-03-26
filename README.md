# Growth Content Essay System

An AI-powered system that converts long-form growth content (YouTube talks, podcast interviews, blog posts) into detailed, practitioner-grade written essays. Built for growth engineers and marketers who read better than they watch.

## The Problem

The best growth thinking lives in hour-long YouTube talks, 90-minute podcast episodes, and dense blog posts from operators like Lenny Rachitsky, Elena Verna, Brian Balfour, Andrew Chen, and Casey Winters. Watching a 90-minute video to extract the 15 minutes that matter to your work is inefficient. Reading is faster, more retainable, and easier to reference later.

## How It Works

```
Input (YouTube link, blog URL, or pasted text)
    |
    v
Content Extraction
    |  YouTube: browser-based transcript extraction
    |  Blogs: direct fetch + illustration screenshots
    |  Maven: Mux player CC track extraction
    |
    v
4-Dimension Contextual Research (WebSearch)
    |  A. Bridge to growth engineering & marketing
    |  B. Speaker's extended thinking (other talks, posts, tweets)
    |  C. Supporting & contrasting evidence
    |  D. Framework lineage (canonical sources)
    |
    v
Essay Generation (11-section template)
    |
    v
PDF Output (custom generator with embedded illustrations)
```

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

- **Content extraction**: Browser automation (Chrome), youtube-transcript.io, WebFetch
- **Research**: WebSearch with source quality filtering
- **PDF generation**: Custom Node.js script using [pdf-lib](https://github.com/Hopding/pdf-lib) with [fontkit](https://github.com/nicolo-ribaudo/fontkit)
- **Typography**: [Inter](https://rsms.me/inter/) (body) + InterDisplay (headings)
- **Orchestration**: Claude Code with parallel agent execution

## Source Quality Standards

Research is filtered to high-quality growth sources:

**Preferred**: Reforge, Lenny's Newsletter, a16z, First Round Review, Y Combinator, Stratechery, Andrew Chen, Casey Winters, Brian Balfour, Elena Verna, company growth blogs (Airbnb, Spotify, Figma, Notion)

**Acceptable**: HBR, Wired, TechCrunch (for data and case studies)

**Avoided**: Generic SEO content, listicles, low-authority marketing blogs

## Project Structure

```
CLAUDE.md              # System instructions and essay template
essays/md2pdf.mjs      # Custom PDF generator with image embedding
fonts/                 # Inter and InterDisplay TTF files
samples/               # Sample essay outputs (.md + .pdf)
package.json           # Node.js dependencies (pdf-lib, fontkit)
```

## Built By

Jolene Fernandes | Growth Engineer & Marketer
