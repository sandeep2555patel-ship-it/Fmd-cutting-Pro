const fs = require('fs');

let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

const NEW_AUDIO = `  // Long BGM
  { name: 'SoundHelix Song 1 (6 min)', type: 'Music', cat: 'Long BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3') },
  { name: 'SoundHelix Song 2 (7 min)', type: 'Music', cat: 'Long BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3') },
  { name: 'SoundHelix Song 4 (5 min)', type: 'Music', cat: 'Long BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3') },
  { name: 'SoundHelix Song 8 (5 min)', type: 'Music', cat: 'Long BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3') },
  { name: 'SoundHelix Song 13 (6 min)', type: 'Music', cat: 'Long BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3') },
  { name: 'SoundHelix Song 15 (7 min)', type: 'Music', cat: 'Long BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3') },
  { name: 'SoundHelix Song 16 (6 min)', type: 'Music', cat: 'Long BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3') },
  
  // BGM
`;

code = code.replace("  // BGM", NEW_AUDIO);

code = code.replace(
  "{['Trending', 'BGM', 'Memes', 'SFX'].map((cat, i) => (",
  "{['Trending', 'Long BGM', 'BGM', 'Memes', 'SFX'].map((cat, i) => ("
);

fs.writeFileSync('src/components/MediaBin.tsx', code);
