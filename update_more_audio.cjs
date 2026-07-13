const fs = require('fs');

let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

const ALL_AUDIO = `const ALL_AUDIO = [
  // Trending
  { name: 'Sigma Male Grindset', type: 'Music', cat: 'Trending', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/sigma-male-grindset.mp3') },
  { name: 'Monkeys Spinning Monkeys', type: 'Music', cat: 'Trending', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/monkeys-spinning-monkeys.mp3') },
  { name: 'Directed by Robert Weide', type: 'Memes', cat: 'Trending', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/directed-by-robert-b_NqaQZOV.mp3') },
  { name: 'Vine Boom', type: 'Memes', cat: 'Trending', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/vine-boom.mp3') },

  // BGM
  { name: 'Monkeys Spinning Monkeys', type: 'Music', cat: 'BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/monkeys-spinning-monkeys.mp3') },
  { name: 'Sneaky Snitch', type: 'Music', cat: 'BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/sneaky-snitch.mp3') },
  { name: 'Fluffing a Duck', type: 'Music', cat: 'BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/fluffing-a-duck.mp3') },
  { name: 'Sigma Male Grindset', type: 'Music', cat: 'BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/sigma-male-grindset.mp3') },
  { name: 'Enthusiast', type: 'Music', cat: 'BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3') },

  // SFX
  { name: 'Mouse Click', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/mouse-click.mp3') },
  { name: 'Keyboard Typing', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/keyboard-typing.mp3') },
  { name: 'Subscribe Bell', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/bell.mp3') },
  { name: 'Fast Whoosh', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/swoosh.mp3') },
  { name: 'Record Scratch', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/record-scratch.mp3') },
  { name: 'Punch Hit', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/punch.mp3') },
  { name: 'Suspense Reveal', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/suspense.mp3') },
  { name: 'Cash Register', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/cash-register.mp3') },
  { name: 'Dun Dun Dunnn', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/dun-dun-dun-dunnnnn.mp3') },

  // Memes
  { name: 'Vine Boom', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/vine-boom.mp3') },
  { name: 'Directed by Robert Weide', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/directed-by-robert-b_NqaQZOV.mp3') },
  { name: 'Bruh Meme', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/movie_1.mp3') },
  { name: 'Oh No Meme', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/oh-no-meme.mp3') },
  { name: 'Fart Sound', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/fart-meme-sound.mp3') },
  { name: 'Wow! (Anime)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/anime-wow-sound-effect.mp3') },
  { name: 'Wah Wah Wah (Fail)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/sad-trombone.mp3') },
  { name: 'Nani?', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/nani_3.mp3') },
  { name: 'FBI Open Up', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/fbi-open-up-sfx.mp3') },
  { name: 'Illuminati Confirmed', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/illuminati-confirmed.mp3') },
  { name: 'Run (AWOLNATION)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/run-vine-sound-effect_1.mp3') },
  { name: 'A Few Moments Later', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/a-few-moments-later.mp3') },
  { name: 'Nope', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/engineer_no01_1.mp3') },
  { name: 'Cricket Chirp', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/crickets.mp3') },
];`;

code = code.replace(/const ALL_AUDIO = \[[\s\S]*?\];/m, ALL_AUDIO);

code = code.replace(
  "{['Trending', 'Pop', 'Memes', 'Vlog', 'Chill', 'Beats', 'Travel', 'SFX', 'Ambient'].map((cat, i) => (",
  "{['Trending', 'BGM', 'Memes', 'SFX'].map((cat, i) => ("
);

fs.writeFileSync('src/components/MediaBin.tsx', code);
