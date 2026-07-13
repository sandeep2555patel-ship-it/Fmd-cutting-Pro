const fs = require('fs');

// Patch server.ts
let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(
  'const outputFile = `${inputFile}_enhanced.wav`;',
  'const outputFile = `${inputFile}_enhanced.mp4`;'
);
serverCode = serverCode.replace(
  "res.download(outputFile, 'enhanced_audio.wav', (err) => {",
  "res.download(outputFile, 'enhanced_media.mp4', (err) => {"
);
fs.writeFileSync('server.ts', serverCode);

// Patch ai_model.py
let aiCode = fs.readFileSync('ai_model.py', 'utf8');
aiCode = aiCode.replace(
  '"-vn", "-af", filter_complex,',
  '"-c:v", "copy", "-af", filter_complex,'
);
fs.writeFileSync('ai_model.py', aiCode);
