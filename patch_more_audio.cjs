const fs = require('fs');

let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

const NEW_AUDIO = `  // Additional SFX & Memes
  { name: 'Camera Shutter', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://cdn.pixabay.com/download/audio/2022/03/15/audio_249ae51a37.mp3') },
  { name: 'Cash Register (Cha-ching)', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://cdn.pixabay.com/download/audio/2021/08/09/audio_4dfa406080.mp3') },
  { name: 'Record Scratch', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b82ecce1.mp3') },
  { name: 'Wow! (Anime)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://cdn.pixabay.com/download/audio/2022/03/15/audio_d062e21b72.mp3') },
  { name: 'Suspense Reveal', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://cdn.pixabay.com/download/audio/2022/03/15/audio_c2ebf0c3a2.mp3') },
  { name: 'Sad Violin / Womp', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://cdn.pixabay.com/download/audio/2022/03/15/audio_1f237e108e.mp3') },
  // Music categories`;

code = code.replace("  // Music categories", NEW_AUDIO);

fs.writeFileSync('src/components/MediaBin.tsx', code);
