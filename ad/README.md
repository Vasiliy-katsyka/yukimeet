# YukiMeet video ad

`yukimeet-ad.mp4` — 30s, 1920×1080, 30fps, with a soft ambient music bed.

Scenes: hook → brand → start a room → live call → features (whiteboard, blur, assistant) → privacy → CTA (meet.yukichat.lol).

## Re-rendering
`ad.html` is a deterministic animation driven by `render(t)`; open it in a browser to preview it live.
`node render.js stills` captures preview frames; `node render.js` renders frames through Playwright into ffmpeg (silent MP4).
Mux audio with: `ffmpeg -i yukimeet-ad-silent.mp4 -i music.wav -c:v copy -c:a aac -shortest yukimeet-ad.mp4`
