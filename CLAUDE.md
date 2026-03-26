# Growth Content Essay System

This project converts long-form growth content (YouTube talks, podcast interviews, blog posts) into detailed written essays. The user reads better than she watches — the goal is to produce comprehensive, practitioner-grade essays that let her internalize the material without sitting through hour-long videos.

## Workflow

1. **User sends input**: A YouTube link, blog URL, Maven Lightning Lesson link, or pasted text from any growth operator (Lenny Rachitsky, a16z partners, Reforge instructors, Figma leaders, Anthropic folks, etc.)
2. **Claude fetches the content**:
   - **YouTube links**: Use `ytsearch` (installed at `tools/ytsearch/`) to extract the full transcript with timestamps in a single command:
     ```
     cd D:/Claude Code Projects/Lenny/tools/ytsearch && "C:\Users\Jolene Fernandes\.local\bin\uv" run ytsearch.py "YOUTUBE_URL" > ../../transcripts/speaker-name-topic.txt
     ```
     This pulls captions directly from YouTube's endpoint over HTTP. No browser, no API keys, instant results. If ytsearch fails (rare cases where captions are disabled), fall back to opening the video in the browser and using youtube-transcript.io.
   - **Maven Lightning Lessons**: Open the lesson page in the browser. The video is hosted on Mux. Enable the hidden English CC subtitle track on the mux-player element via JavaScript (`textTracks[subtitles].mode = 'showing'`), seek through the video at 25%/50%/75%/end to force all cues to load, then extract all cue text. There is no visible CC button but the track data is there.
   - **Blog URLs**: Fetch via WebFetch and extract the article content. Only process blogs where the full content is accessible. If a blog is paywalled, ask the user to copy-paste the full text instead.
   - **Pasted text**: Process directly.
3. **Claude runs contextual web research** (see Research Phase below).
4. **Claude writes a detailed essay** following the template below, enriched by the research.
5. **Claude saves the essay as a PDF** in `essays/` using the PDF skill, named `YYYY-MM-DD - Title.pdf`.

## Research Phase

After ingesting the source material but **before writing**, run targeted web searches using WebSearch to deeply contextualize the content. This is what transforms a transcript dump into a practitioner-grade essay. Run searches across these four dimensions:

### A. Bridge to Growth Engineering & Marketing
Search for how the concepts discussed connect to growth work. The speaker may not frame their ideas in growth terms — that's your job.
- If the speaker discusses AI platform shifts → search for how growth teams are adapting acquisition and experimentation to AI
- If the speaker discusses product-market fit → search for growth engineering approaches to measuring and accelerating PMF
- If the speaker discusses pricing → search for growth experiments around pricing, monetization loops, paywall optimization

### B. Speaker's Extended Thinking
Search for the speaker's own writing, tweets, or other interviews on the same topic. Often they've written a companion blog post, published slides, or done a tweetstorm that adds depth.
- Search: `"[Speaker Name]" [key topic]`
- Check their personal blog, Substack, company blog, and X/Twitter

### C. Supporting & Contrasting Evidence
Search for real-world case studies, data, or counterarguments related to the claims being made. Present both sides where relevant.
- If the speaker claims "PLG is dead" → find recent PLG wins and losses
- If the speaker cites a metric → find corroborating or conflicting data

### D. Framework Lineage
When the speaker references established frameworks (crossing the chasm, jobs to be done, growth loops, AARRR, etc.), search for the canonical source and — critically — how the framework has been applied in growth contexts specifically.

### Source Quality Rules

**Preferred sources** (search these first):

*Growth operators the user follows:*
- Lenny's Newsletter (lennysnewsletter.com)
- Andrew Chen's essays (andrewchen.com, @andrewchen on Substack)
- Brian Balfour's writing (brianbalfour.com)
- Elena Verna (Growth Scoop, elenaverna.com)
- Sean Ellis (Growth with Sean Ellis)
- Kyle Poyar's Growth Unhinged (OpenView, PLG pricing)
- Wes Kao's Newsletter (Maven co-founder)
- Marc Andreessen (Substack, a16z)
- Marily Nika (AI Product Academy)
- Emily Kramer (MKT1 Newsletter, B2B marketing)
- How They Grow (company growth teardowns)
- Julie Zhuo (The Looking Glass, product/design leadership)
- Product-led GTM
- Growth by Gaurav
- Growth Notes by Sandy Diao
- Growthmates with Kate Syuma
- The GTM Engineer
- Kieran's AI Marketing Generalist
- Ravi on Product
- Casey Winters' writing

*Publications and blogs:*
- a16z blog + a16z Growth Newsletter (a16z.com)
- Reforge blog and courses
- First Round Review (review.firstround.com)
- Y Combinator blog (ycombinator.com/blog)
- Stratechery (stratechery.com)
- Company growth/engineering blogs: Airbnb, Spotify, Figma, Notion, Amplitude, Mixpanel, HubSpot

**Acceptable** (for data and case studies):
- HBR, Wired, TechCrunch, The Information, Bloomberg

**Avoid**:
- Generic SEO content farms
- Listicles and low-authority marketing blogs
- Anything that reads like it was written for search ranking rather than practitioners

**Citation rule**: Every external source used must appear in the "Sources & Further Reading" section (Section 11) of the essay with source name and URL.

## Essay Template

Every essay must follow this structure. There is **no word cap** — write as much as the material demands. The word ranges below are rough proportionality guides, not limits. If a section needs more space, take it.

### 1. Source Info
- Title
- Speaker/Author
- Date (if known)
- Link to original content

### 2. TL;DR
3-5 sentences. What is this about and why does it matter?

### 3. Core Thesis
The central argument or insight the speaker/author is making. What is the one big idea?

### 4. Key Insights & Frameworks
The major ideas, mental models, and frameworks discussed. Each insight gets its own subheading with a clear explanation. This is the meat of the essay. Write as much as the material demands; do not artificially compress or expand.

### 5. Tactical Playbook
Concrete, actionable takeaways organized as specific things to try. Not abstract advice; real moves a growth practitioner can make Monday morning.

### 6. Growth Engineering Lens
How this content applies to experimentation, product growth, data infrastructure, A/B testing, feature flagging, growth loops, technical implementation. Written for someone who builds growth systems.

### 7. Growth Marketing Lens
How this content applies to acquisition channels, retention mechanics, engagement campaigns, lifecycle marketing, paid/organic strategy. Written for someone who runs growth campaigns.

### 8. Contrarian / Non-Obvious Takes
Surprising, counterintuitive, or against-the-grain points worth remembering. Things most people would miss or disagree with.

### 9. Quotable Moments
3-5 standout quotes (kept brief, under 15 words each) with context on why they matter.

### 10. What to Revisit
Specific sections, timestamps (for videos), or passages worth going back to for deeper study. Point the reader to exactly where to look.

### 11. Sources & Further Reading
A curated, annotated list of the best external sources found during the research phase. Each entry should include:
- Source name and URL
- One sentence on what it adds (e.g., "Andrew Chen's essay on network effects; explains the cold start problem the speaker references in the context of marketplace growth loops")

This is the reader's "go deeper" list. Quality over quantity; only include sources that genuinely add value.

## Tone & Style

- **Analytical and practical**: written for a practitioner, not an academic
- **No fluff**: every sentence should earn its place
- **Original synthesis**: don't just transcribe; analyze, connect, and contextualize
- **Growth-native language**: use the vocabulary of growth engineering and marketing naturally
- **First-person perspective where appropriate**: "Here's what matters for your work" not "One might consider"
- **NEVER use em dashes** (the long dash character). Use colons, semicolons, commas, parentheses, or restructure the sentence instead. This is a hard rule with no exceptions.

## Depth & Completeness Rules

The goal is NOT summarization. The reader is choosing this essay INSTEAD OF watching the video. Every essay must:

- **Capture the full substance and nuance of what the speaker said.** If the speaker spent 5 minutes on a topic, that topic deserves proportional depth in the essay. Do not flatten nuance or compress arguments into single sentences.
- **Preserve the speaker's qualifications and caveats.** If the speaker said "coding is largely solved, but with important exceptions," do not write "coding is solved." The qualifications are the nuance.
- **Include specific examples, anecdotes, and data points** the speaker used. If they told a story, describe the story. If they cited a number, cite the number. If they named a company, name the company.
- **Cover every major topic discussed**, not just the most quotable ones. If the video has 20 chapters, all 20 should be reflected in the essay, even if some are handled briefly.
- **Section 4 (Key Insights & Frameworks) should be the longest section.** This is where the full depth lives. Write as much as the material demands. Do not pad with repetition or filler, but do not compress either. Every subsection should fully explain the idea, not gesture at it.
- **No artificial word or paragraph limits on any section.** Let the material dictate the length. But every sentence must earn its place: no rambling, no repeating the same point in different words, no filler.

## PDF Formatting Rules

The PDF must be visually clean and easy to read. Specific requirements:

- **Body font:** Inter (TTF files in `fonts/` directory: Regular, Bold, Italic, BoldItalic). NEVER use default system fonts like Helvetica or Arial.
- **Heading font:** InterDisplay (Bold for section headers, SemiBold for subsection headers). This is the companion display face to Inter, optimized for larger sizes. TTF files in `fonts/`.
- **Color palette:** Dark navy (#1a1a2e) for body text. Dark blue (#141f52) for all headings, subheadings, bullets, and numbered markers. Muted (#59597a) for metadata and quotes. NO red or accent colors on headings.
- **Generous vertical spacing:** At least 20pt gap before each subsection header. At least 10pt gap after a subsection header before body text begins. At least 10pt between paragraphs.
- **Body text leading:** 16pt minimum (not 14 or 14.5). The text must breathe.
- **Visual separation between subsections:** Use extra whitespace (24pt+) between the end of one subsection and the start of the next. The reader should never feel like they are hitting a wall of text.
- **Section headers:** Need 28pt+ space before them, with a horizontal rule separator.
- **Text column:** Should not feel cramped. Use 70pt+ margins on both sides.

## Illustrations & Screenshots

When source content contains important diagrams, charts, framework visuals, data visualizations, or process flows, screenshot them from the browser and embed them in the essay:

- **Save screenshots to** `essays/images/` with naming: `essay-slug-description.png` (e.g., `big-ideas-2026-agentic-stack.png`)
- **Embed in markdown** using `![caption](essays/images/filename.png)`
- **Only include visuals that add genuine understanding**: framework diagrams, data charts, architecture diagrams, process flows. Skip decorative images, headshots, logos, or generic stock illustrations.
- **Add a descriptive caption** as the alt text: `![The Four Fits framework showing Product-Market, Product-Channel, Channel-Model, and Model-Market fit](essays/images/four-fits-framework.png)`
- The PDF generator will center images within the text column, scale them to fit (max width = content width, max height = 400pt), and render the caption below in italic muted text.

## Transcripts

- Save all fetched transcripts to `D:/Claude Code Projects/Lenny/transcripts/`
- Naming: `speaker-name-short-topic.txt` (e.g., `boris-cherny-claude-code.txt`)
- This avoids re-fetching from YouTube if the essay needs to be regenerated or referenced later

## Output

- Format: PDF
- Location: `D:/Claude Code Projects/Lenny/essays/`
- Naming: `YYYY-MM-DD - Title.pdf`
- Generate PDFs using the Node.js script (`essays/generate_pdf.mjs`) with pdf-lib and @pdf-lib/fontkit
