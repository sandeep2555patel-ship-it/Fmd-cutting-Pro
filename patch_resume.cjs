const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// For VideoLayer
code = code.replace(`    if (isPlaying) {
      if (videoRef.current) {`, `    if (isPlaying) {
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (videoRef.current) {`);

// For Preview Audio
code = code.replace(`    if (isPlaying) {
      const a = audioRef.current;
      if (a) {`, `    if (isPlaying) {
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const a = audioRef.current;
      if (a) {`);

fs.writeFileSync('src/components/Preview.tsx', code);
