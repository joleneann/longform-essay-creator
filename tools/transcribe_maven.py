"""
Maven Lightning Lesson Transcriber

Extracts audio from a Mux-hosted video URL and transcribes it using faster-whisper.

Usage:
  python transcribe_maven.py <mux_playback_url> <output_file>

Example:
  python transcribe_maven.py "https://stream.mux.com/PLAYBACK_ID.m3u8" transcripts/lesson.txt

The Mux playback URL can be extracted from a Maven lesson page by running
this JavaScript in the browser console:
  document.querySelector('mux-player').getAttribute('playback-id')
Then construct the URL: https://stream.mux.com/{PLAYBACK_ID}.m3u8
"""

import sys
import os
import subprocess
import tempfile
from faster_whisper import WhisperModel

def extract_audio(mux_url, audio_path):
    """Download audio from Mux stream URL using ffmpeg."""
    cmd = [
        "ffmpeg", "-y",
        "-protocol_whitelist", "file,http,https,tcp,tls,crypto",
        "-headers", "Referer: https://maven.com/\r\nOrigin: https://maven.com\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36\r\n",
        "-i", mux_url,
        "-vn",           # no video
        "-acodec", "mp3",
        "-q:a", "2",     # good quality
        audio_path
    ]
    print(f"Downloading audio from {mux_url}...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"ffmpeg error: {result.stderr}")
        sys.exit(1)
    print(f"Audio saved to {audio_path}")

def transcribe(audio_path, output_path, model_size="small"):
    """Transcribe audio file using faster-whisper."""
    print(f"Loading {model_size} model (first run downloads ~1.5GB)...")
    model = WhisperModel(model_size, device="cpu", compute_type="int8")

    print("Transcribing...")
    segments, info = model.transcribe(audio_path, language="en", beam_size=5)

    print(f"Detected language: {info.language} (probability {info.language_probability:.2f})")

    lines = []
    for segment in segments:
        timestamp = format_timestamp(segment.start)
        lines.append(f"[{timestamp}] {segment.text.strip()}")

    transcript = "\n".join(lines)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(transcript)

    print(f"Transcript saved to {output_path} ({len(lines)} segments, {len(transcript)} chars)")

def format_timestamp(seconds):
    """Convert seconds to MM:SS format."""
    m = int(seconds) // 60
    s = int(seconds) % 60
    return f"{m:02d}:{s:02d}"

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python transcribe_maven.py <mux_playback_url_or_audio_file> <output_file>")
        print("       python transcribe_maven.py <audio_file.mp3> <output_file>")
        sys.exit(1)

    source = sys.argv[1]
    output = sys.argv[2]

    # If source is already a local audio file, skip download
    if os.path.isfile(source):
        transcribe(source, output)
    else:
        # Download audio first, then transcribe
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
            audio_path = tmp.name
        try:
            extract_audio(source, audio_path)
            transcribe(audio_path, output)
        finally:
            if os.path.exists(audio_path):
                os.unlink(audio_path)
