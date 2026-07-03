const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// The VideoLayer block ends around `const activeAudioClip` inside Preview, or around `return (<video ...`
// So we can safely just split the file by `const Preview =`
let parts = code.split('const Preview =');
if (parts.length === 2) {
  parts[0] = parts[0].replace(/enhanceRefAudio\.current/g, 'enhanceRef.current');
  code = parts.join('const Preview =');
  fs.writeFileSync('src/components/Preview.tsx', code);
}
