# Growth Content Essay System

This project converts long-form growth content (YouTube talks, podcast interviews, blog posts) into detailed written essays. The user reads better than she watches — the goal is to produce comprehensive, practitioner-grade essays that let her internalize the material without sitting through hour-long videos.

## Workflow

1. **User sends input**: A YouTube link, blog URL, Maven Lightning Lesson link, or pasted text from any growth operator (Lenny Rachitsky, a16z partners, Reforge instructors, Figma leaders, Anthropic folks, etc.)
2. **Claude fetches the content**:
   - **YouTube links**: Use `ytsearch` (`tools/ytsearch/`) to extract transcripts instantly via CLI:
     ```
     cd tools/ytsearch && uv run ytsearch.py "YOUTUBE_URL" > ../../transcripts/speaker-name-topic.txt
     ```
     Pulls captions directly from YouTube over HTTP. No browser, no API keys. Fallback: youtube-transcript.io via browser.
   - **Maven Lightning Lessons**: Video is hosted on Mux with signed (JWT-protected) streams. Use the Groq Whisper API pipeline (fast, cheap, accurate):
     1. Extract the **full signed URL** (not just the playback ID) from the lesson page via browser JS: `document.querySelector('mux-player').media.src`
        This returns `https://stream.mux.com/{PID}.m3u8?token={JWT}`. The `.media.src` is only populated after the video starts loading; on some pages you may need to click play first.
     2. Run: `GROQ_API_KEY=your_key tools/whisper-env/Scripts/python.exe tools/transcribe_groq.py "FULL_SIGNED_URL" "transcripts/speaker-name-topic.txt"`

     Downloads audio via ffmpeg, transcribes via Groq's Whisper API (whisper-large-v3-turbo, 247x real-time). ~15-30 seconds per 45-min lesson. Cost: ~$0.03/lesson. Auto-chunks files over 25MB for the API size limit. Falls back to local faster-whisper if GROQ_API_KEY is not set.

     **Three types of Maven lesson pages:**
     - **Accessible (video visible):** Mux player is on the page, extract src directly.
     - **Registration wall ("Watch this lesson for free"):** No mux-player until registered. May need to click the signup button first.
     - **Upcoming live events:** No recording exists yet. Check for "LIVE" badge + future date.

     **Legacy fallback:** `tools/transcribe_maven.py` uses local faster-whisper (CPU, int8). Much slower (~20-50 min per lesson). Only use if Groq API is unavailable.
   - **Blog URLs**: Fetch via WebFetch and extract the article content. Only process blogs where the full content is accessible. If a blog is paywalled, ask the user to copy-paste the full text instead.
   - **Pasted text**: Process directly.
3. **Claude runs contextual web research** (see Research Phase below).
4. **Claude writes a detailed essay** following the template below, enriched by the research.
5. **Claude saves the essay as a PDF** in `essays/` using the PDF skill, named `YYYY-MM-DD - Title.pdf`.

## Research Phase

After ingesting the source material but **before writing**, run targeted web searches using WebSearch to deeply contextualize the content. This is what transforms a transcript dump into a practitioner-grade essay. Run searches across these four dimensions:

### A. Speaker's Extended Thinking
Search for the speaker's own writing, tweets, or other interviews on the same topic. Often they've written a companion blog post, published slides, or done a tweetstorm that adds depth.
- Search: `"[Speaker Name]" [key topic]`
- Check their personal blog, Substack, company blog, and X/Twitter

### B. Supporting & Contrasting Evidence
Search for real-world case studies, data, or counterarguments related to the claims being made. Present both sides where relevant.
- If the speaker claims "PLG is dead" → find recent PLG wins and losses
- If the speaker cites a metric → find corroborating or conflicting data

### C. Framework Lineage
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

**Citation rule**: Every external source used must appear in the "Sources & Further Reading" section (Section 7) of the essay with source name and URL.

## Essay Template

Every essay must follow this structure. There is **no word cap** — write as much as the material demands. The word ranges below are rough proportionality guides, not limits. If a section needs more space, take it.

### 1. Source Info
- Title
- Speaker/Author
- Date (if known)
- Link to original content

### 2. Executive Summary
4-6 sentences max. Merges what was previously TL;DR and Core Thesis into a single opener. State (a) what this source is about and who the speaker is, (b) the central argument or big idea, and (c) why a growth practitioner should care. This is a map, not the territory; every claim here gets developed in Section 3. Do not elaborate beyond setup.

### 3. Key Insights & Frameworks
The major ideas, mental models, and frameworks discussed. Each insight gets its own subheading with a clear explanation. This is the meat of the essay. Write as much as the material demands; do not artificially compress or expand.

### 4. Tactical Playbook
Concrete, actionable takeaways organized as specific things to try. Not abstract advice; real moves a growth practitioner can make Monday morning. Each tactic should cite which Section 3 subsection it derives from (e.g., "From 3.6:") but must NOT re-explain the underlying insight.

### 5. Contrarian / Non-Obvious Takes
3-5 items max. Surprising, counterintuitive, or against-the-grain points worth remembering. Each item: one-sentence statement of the take, then 1-2 sentences of supporting reasoning that adds something NOT already covered in Section 3. If a contrarian take was fully developed in Section 3, it stays there and should not be duplicated here.

### 6. What to Revisit
Specific sections, timestamps (for videos), or passages worth going back to for deeper study. Point the reader to exactly where to look.

### 7. Sources & Further Reading
A curated, annotated list of the best external sources found during the research phase. Each entry should include:
- Source name and URL
- One sentence on what it adds (e.g., "Andrew Chen's essay on network effects; explains the cold start problem the speaker references in the context of marketplace growth loops")

This is the reader's "go deeper" list. Quality over quantity; only include sources that genuinely add value.

## Anti-Repetition Rules

These rules are mandatory for every essay. The goal is zero redundancy across sections.

1. **Single point of residence.** Every distinct idea, fact, statistic, quote, or anecdote must have exactly ONE home section. Other sections may cross-reference by subsection number (e.g., "see 3.4") but must not restate the idea.
2. **Quote once.** Every direct quote from the speaker may appear at most once in the entire essay. Choose the most impactful placement.
3. **Stat once.** Every statistic or data point may appear at most once. If a stat is used in the Executive Summary as a hook, it must not reappear in Section 3.
4. **Cross-reference, don't restate.** When a later section needs to build on an earlier idea, use a parenthetical cross-reference: "(see 3.4)" or "Building on the underfunding paradox (3.6)..." followed by NEW analysis only. Never restate what was already said.
5. **Self-check before finalizing.** Before producing the final essay, scan for any idea, quote, stat, or anecdote that appears more than once. Eliminate all duplicates by keeping the instance in the most appropriate section and replacing other instances with cross-references or removing them entirely.

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
- **Section 3 (Key Insights & Frameworks) should be the longest section.** This is where the full depth lives. Write as much as the material demands. Do not pad with repetition or filler, but do not compress either. Every subsection should fully explain the idea, not gesture at it.
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
- Generate PDFs using the Node.js script (`essays/md2pdf.mjs`) with pdf-lib and @pdf-lib/fontkit
