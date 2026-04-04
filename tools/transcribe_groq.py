"""
Maven Lightning Lesson Transcriber (Groq Whisper API)

Extracts audio from a Mux-hosted video URL and transcribes using Groq's
Whisper API (247x real-time speed). Falls back to local faster-whisper if
Groq API key is not set.

Usage:
  python transcribe_groq.py <mux_playback_url_or_audio_file> <output_file>

Environment:
  GROQ_API_KEY  - Your Groq API key (get one free at console.groq.com)

The Mux playback URL should include the JWT token:
  https://stream.mux.com/{PLAYBACK_ID}.m3u8?token={JWT}
Extract the full signed URL from a Maven lesson page by running:
  document.querySelector('mux-player').media.src
"""

import sys
import os
import subprocess
import tempfile
import time
import math

def extract_audio(mux_url, audio_path):
    """Download audio from Mux stream URL using ffmpeg."""
    cmd = [
        "ffmpeg", "-y",
        "-protocol_whitelist", "file,http,https,tcp,tls,crypto",
        "-headers", "Referer: https://maven.com/\r\nOrigin: https://maven.com\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36\r\n",
        "-i", mux_url,
        "-vn",
        "-acodec", "mp3",
        "-ar", "16000",    # 16kHz mono for optimal Whisper performance
        "-ac", "1",
        "-q:a", "4",       # smaller file size for API upload
        audio_path
    ]
    print(f"Downloading audio from {mux_url[:80]}...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"ffmpeg error: {result.stderr}")
        sys.exit(1)
    size_mb = os.path.getsize(audio_path) / (1024 * 1024)
    print(f"Audio saved to {audio_path} ({size_mb:.1f} MB)")


def get_audio_duration(audio_path):
    """Get duration of audio file in seconds using ffprobe."""
    cmd = [
        "ffprobe", "-v", "quiet", "-print_format", "json",
        "-show_format", audio_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        import json
        data = json.loads(result.stdout)
        return float(data["format"]["duration"])
    return None


def split_audio(audio_path, max_size_mb=24, chunk_dir=None):
    """Split audio file into chunks under max_size_mb.
    Returns list of chunk file paths.
    """
    file_size_mb = os.path.getsize(audio_path) / (1024 * 1024)
    if file_size_mb <= max_size_mb:
        return [audio_path]

    duration = get_audio_duration(audio_path)
    if not duration:
        print("Warning: Could not determine audio duration, trying full file")
        return [audio_path]

    # Calculate chunk duration to stay under size limit
    num_chunks = math.ceil(file_size_mb / max_size_mb)
    chunk_duration = duration / num_chunks
    # Add a small buffer to ensure chunks are under limit
    chunk_duration = chunk_duration * 0.95

    if chunk_dir is None:
        chunk_dir = tempfile.mkdtemp()

    chunks = []
    start = 0
    chunk_idx = 0
    while start < duration:
        chunk_path = os.path.join(chunk_dir, f"chunk_{chunk_idx:03d}.mp3")
        cmd = [
            "ffmpeg", "-y", "-ss", str(start),
            "-i", audio_path,
            "-t", str(chunk_duration),
            "-acodec", "mp3", "-ar", "16000", "-ac", "1", "-q:a", "4",
            chunk_path
        ]
        subprocess.run(cmd, capture_output=True, text=True)
        if os.path.exists(chunk_path) and os.path.getsize(chunk_path) > 0:
            chunks.append(chunk_path)
        start += chunk_duration
        chunk_idx += 1

    print(f"Split audio into {len(chunks)} chunks (each ~{chunk_duration:.0f}s)")
    return chunks


def transcribe_groq(audio_path, output_path):
    """Transcribe using Groq Whisper API with chunking for large files."""
    from groq import Groq

    client = Groq()
    chunks = split_audio(audio_path)

    all_segments = []
    time_offset = 0.0

    for idx, chunk_path in enumerate(chunks):
        chunk_size_mb = os.path.getsize(chunk_path) / (1024 * 1024)
        print(f"  Transcribing chunk {idx + 1}/{len(chunks)} ({chunk_size_mb:.1f} MB)...")
        start_time = time.time()

        with open(chunk_path, "rb") as f:
            response = client.audio.transcriptions.create(
                file=f,
                model="whisper-large-v3-turbo",
                response_format="verbose_json",
                language="en",
                timestamp_granularities=["segment"],
            )

        elapsed = time.time() - start_time
        print(f"    Done in {elapsed:.1f}s")

        # Extract segments with timestamps
        if hasattr(response, 'segments') and response.segments:
            for seg in response.segments:
                ts = seg.get('start', 0) if isinstance(seg, dict) else getattr(seg, 'start', 0)
                text = seg.get('text', '') if isinstance(seg, dict) else getattr(seg, 'text', '')
                adjusted_ts = ts + time_offset
                all_segments.append((adjusted_ts, text.strip()))
        elif hasattr(response, 'text') and response.text:
            # Fallback: no segment-level timestamps
            all_segments.append((time_offset, response.text.strip()))

        # Update time offset for next chunk
        chunk_duration = get_audio_duration(chunk_path)
        if chunk_duration:
            time_offset += chunk_duration

        # Clean up chunk if it's a split file (not the original)
        if chunk_path != audio_path:
            os.unlink(chunk_path)

    # Format output
    lines = []
    for ts, text in all_segments:
        if text:
            m = int(ts) // 60
            s = int(ts) % 60
            lines.append(f"[{m:02d}:{s:02d}] {text}")

    transcript = "\n".join(lines)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(transcript)

    print(f"Transcript saved to {output_path} ({len(lines)} segments, {len(transcript)} chars)")


def transcribe_local(audio_path, output_path, model_size="small"):
    """Fallback: transcribe using local faster-whisper."""
    from faster_whisper import WhisperModel

    print(f"Loading {model_size} model...")
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    print("Transcribing...")
    segments, info = model.transcribe(audio_path, language="en", beam_size=5)
    print(f"Detected language: {info.language} (probability {info.language_probability:.2f})")

    lines = []
    for segment in segments:
        m = int(segment.start) // 60
        s = int(segment.start) % 60
        lines.append(f"[{m:02d}:{s:02d}] {segment.text.strip()}")

    transcript = "\n".join(lines)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(transcript)

    print(f"Transcript saved to {output_path} ({len(lines)} segments, {len(transcript)} chars)")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python transcribe_groq.py <mux_url_or_audio_file> <output_file>")
        sys.exit(1)

    source = sys.argv[1]
    output = sys.argv[2]

    use_groq = bool(os.environ.get("GROQ_API_KEY"))
    if not use_groq:
        print("WARNING: GROQ_API_KEY not set. Falling back to local faster-whisper (slow).")
        print("Get a free key at https://console.groq.com")

    if os.path.isfile(source):
        # Source is a local audio file
        if use_groq:
            transcribe_groq(source, output)
        else:
            transcribe_local(source, output)
    else:
        # Source is a Mux URL, download first
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
            audio_path = tmp.name
        try:
            extract_audio(source, audio_path)
            total_start = time.time()
            if use_groq:
                transcribe_groq(audio_path, output)
            else:
                transcribe_local(audio_path, output)
            total_elapsed = time.time() - total_start
            print(f"Total transcription time: {total_elapsed:.1f}s")
        finally:
            if os.path.exists(audio_path):
                os.unlink(audio_path)
