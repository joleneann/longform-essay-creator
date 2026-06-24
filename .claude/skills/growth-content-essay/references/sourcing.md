# Sourcing, Full-Read, and Research

## Ingest by source type

### YouTube links
Extract the transcript via the ytsearch CLI (pulls captions over HTTP, no browser or API key):

```
cd tools/ytsearch && uv run ytsearch.py "<YOUTUBE_URL>" > "../../transcripts/speaker-name-topic.txt"
```

For a playlist, resolve the video IDs first (the playlist page is JavaScript-rendered; pull the raw HTML and extract the `playlistVideoRenderer` video IDs, or use each video's oEmbed for titles), then run ytsearch per video.

### Maven Lightning Lessons
The video is a signed (JWT-protected) Mux stream. Extract the FULL signed URL via the browser (`document.querySelector('mux-player').media.src`, which yields `https://stream.mux.com/{PID}.m3u8?token={JWT}`), then transcribe with the Groq Whisper pipeline:

```
tools/whisper-env/Scripts/python.exe tools/transcribe_groq.py "<FULL_SIGNED_URL>" "transcripts/speaker-name-topic.txt"
```

It downloads audio via ffmpeg and transcribes with Groq Whisper (auto-chunks files over 25MB). Never scrape the page or try to extract a CC track. Route the media URL through the script, not through chat (the JWT URL trips the content classifier).

### Blog URLs
Fetch with WebFetch and extract the article. If the blog is paywalled or the full text is not accessible, ask the user to paste the full text. Do not guess or fabricate content.

### Pasted text
Process directly.

## Mandatory full-read and topic inventory

Read the transcript end to end, every line, not sampling. Produce a numbered list of every distinct topic the speaker covers, with approximate timestamps (e.g., "1. [00:00-05:10] Intro, 2. [05:10-09:00] The enterprise data problem"). This list is the skeleton for Section 3. No topic on it may be omitted from the essay. Cross-check the finished essay against it before generating the PDF.

## Source fidelity (hard rule)

Never silently change proper nouns, product names, company names, or terminology from the transcript. Auto-captions mangle names. If you suspect a caption error, flag it to the user and ask before changing anything. The transcript is the source of truth for names; your assumption about what was "meant" is not.

## Research phase (before writing)

After ingesting but BEFORE writing, run targeted WebSearches to contextualize. This is what turns a transcript dump into a practitioner-grade essay. Run 4 to 8 parallel WebSearch calls, review, then a second round of 2 to 4 if gaps remain. Never start writing until research is complete.

Cover these dimensions:
- **Speaker's extended thinking:** the speaker's own writing, posts, or other interviews on the topic. Search `"[Speaker]" [key topic]`. Only fetch a specific piece if it fills a gap the transcript does not cover.
- **Supporting and contrasting evidence:** real case studies, data, or counterarguments for the claims. Present both sides.
- **Framework lineage:** when the speaker references an established framework, find the canonical source and how it has been applied in growth contexts.

### Source quality
Prefer the operators the user follows and top publications: Lenny's Newsletter, Andrew Chen, Brian Balfour, Elena Verna, Sean Ellis, Kyle Poyar (Growth Unhinged), Wes Kao, Marc Andreessen, Emily Kramer (MKT1), Casey Winters, How They Grow, Julie Zhuo, Sandy Diao (Growth Notes); a16z, Reforge, First Round Review, Y Combinator, Stratechery; company growth and engineering blogs (Airbnb, Spotify, Figma, Notion, Amplitude, HubSpot). Acceptable for data and case studies: HBR, Wired, TechCrunch, The Information, Bloomberg. Avoid SEO content farms, listicles, and low-authority marketing blogs.

### Citation rule
Every external source used must appear in Section 6 with its name and URL.

## Compute efficiency

- Never spawn multi-agent workflows (background agents, sub-agent swarms) for the essay. Run research, writing, and PDF generation in the main session. The one exception is when the user explicitly asks for a research agent.
- Use direct WebSearch calls, run in parallel, not background agents.
- No polling or sleep loops. Execute sequentially: ingest, search, write, generate PDF.
- Before any WebFetch, ask whether the transcript already covers it. If yes, skip. External fetches are for gaps, not decoration.
- Never take browser screenshots just for confirmation. Only screenshot a visual that will be embedded in the essay.
