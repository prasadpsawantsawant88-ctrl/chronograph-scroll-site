#!/usr/bin/env bash
# Extracts the scroll-scrubbed frame sequence + posters + macro plates from the source video.
# Usage: npm run frames            (uses source-video/source.mp4)
#        SRC=path/to/other.mp4 FPS=12 npm run frames
# Optional: DELOGO="x=1126:y=566:w=68:h=70" removes a corner watermark (set DELOGO="" to disable).
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="${SRC:-source-video/source.mp4}"
FPS="${FPS:-12}"
DELOGO="${DELOGO-x=1126:y=566:w=68:h=70}"
Q_DESK="${Q_DESK:-74}"
Q_MOB="${Q_MOB:-68}"
OUT=public/frames
rm -rf "$OUT"; mkdir -p "$OUT/desktop" "$OUT/mobile" public/media

PRE="fps=${FPS}"
[ -n "$DELOGO" ] && PRE="${PRE},delogo=${DELOGO}"

ffmpeg -v error -y -i "$SRC" -vf "${PRE},scale=1280:720:flags=lanczos" -c:v libwebp -quality "$Q_DESK" -compression_level 6 "$OUT/desktop/f_%03d.webp"
ffmpeg -v error -y -i "$SRC" -vf "${PRE},scale=720:405:flags=lanczos" -c:v libwebp -quality "$Q_MOB" -compression_level 6 "$OUT/mobile/f_%03d.webp"

COUNT=$(ls "$OUT/desktop" | wc -l | tr -d ' ')
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")
cat > "$OUT/manifest.json" <<JSON
{ "count": $COUNT, "fps": $FPS, "duration": $DUR, "width": 1280, "height": 720, "pattern": "f_%03d.webp", "start": 1 }
JSON

# Posters (used for first paint, reduced-motion and failure fallbacks). Times in seconds.
poster() { ffmpeg -v error -y -ss "$1" -i "$SRC" -vf "${PRE%%,*}$( [ -n "$DELOGO" ] && echo ",delogo=${DELOGO}" ),scale=1600:-1:flags=lanczos" -frames:v 1 -c:v libwebp -quality 80 "public/media/$2.webp"; }
poster 0.3 poster-assembled
poster 5.0 poster-exploded
poster 9.8 poster-final
echo "Frames: $COUNT  ($(du -sh $OUT/desktop | cut -f1) desktop, $(du -sh $OUT/mobile | cut -f1) mobile)"
