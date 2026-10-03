const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { spawn } = require('child_process');
(async () => {
  const mode = process.argv[2] || 'video';
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + __dirname + '/ad.html', { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (const f of ['700 40px "Plus Jakarta Sans"','600 40px "Plus Jakarta Sans"','400 40px "Instrument Sans"','italic 400 40px "Instrument Serif"']) await document.fonts.load(f); await document.fonts.ready; return [...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+f.weight) }).then(console.log);
  if (mode === 'stills') {
    for (const t of [1.5, 5.5, 9.0, 13, 19.5, 23.5, 28]) {
      await p.evaluate(t => render(t), t);
      await p.screenshot({ path: `still_${t}.png` });
    }
  } else {
    const fps = 30, N = 30 * fps;
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', 'yukimeet-ad-silent.mp4'], { stdio: ['pipe', 'ignore', 'inherit'] });
    for (let i = 0; i < N; i++) {
      await p.evaluate(t => render(t), i / fps);
      const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
})();
