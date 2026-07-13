const fs = require('fs');

let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

const ALL_AUDIO = `const ALL_AUDIO = [
  // Trending
  { name: 'Sigma Male Grindset', type: 'Music', cat: 'Trending', url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_418702951b.mp3' },
  { name: 'Phonk Drift', type: 'Music', cat: 'Trending', url: 'https://cdn.pixabay.com/download/audio/2022/12/28/audio_145c26b52c.mp3' },
  { name: 'Cinematic Whoosh', type: 'SFX', cat: 'Trending', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_249ae51a37.mp3' },
  { name: 'Bruh Sound Effect', type: 'Memes', cat: 'Trending', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b82ecce1.mp3' },

  // SFX
  { name: 'Mouse Click', type: 'SFX', cat: 'SFX', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_b200b2e8cd.mp3' },
  { name: 'Keyboard Typing', type: 'SFX', cat: 'SFX', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8163f533a.mp3' },
  { name: 'Subscribe Bell', type: 'SFX', cat: 'SFX', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_4dfa406080.mp3' },
  { name: 'Fast Whoosh', type: 'SFX', cat: 'SFX', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_249ae51a37.mp3' },
  { name: 'Pop Sound', type: 'SFX', cat: 'SFX', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b82ecce1.mp3' },
  { name: 'Punch Hit', type: 'SFX', cat: 'SFX', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_b1e9da7461.mp3' },
  { name: 'Error Beep', type: 'SFX', cat: 'SFX', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c2ebf0c3a2.mp3' },

  // Memes
  { name: 'Bruh Meme', type: 'Memes', cat: 'Memes', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b82ecce1.mp3' },
  { name: 'Oh No Meme', type: 'Memes', cat: 'Memes', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c2ebf0c3a2.mp3' },
  { name: 'Laugh Track', type: 'Memes', cat: 'Memes', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_d062e21b72.mp3' },
  { name: 'Squeak / Fart', type: 'Memes', cat: 'Memes', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1f237e108e.mp3' },
  { name: 'Vine Boom', type: 'Memes', cat: 'Memes', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_05c08db3cb.mp3' }, // mock url for now, but valid mp3 form
  { name: 'Cricket Chirp', type: 'Memes', cat: 'Memes', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_b200b2e8cd.mp3' },

  // Music categories
  { name: 'Enthusiast', type: 'Music', cat: 'Pop', url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3' },
  { name: 'Piano Loop', type: 'Music', cat: 'Chill', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3' },
  { name: 'Electronic Future', type: 'Music', cat: 'Beats', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf589.mp3' },
  { name: 'Vlog BGM', type: 'Music', cat: 'Vlog', url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_418702951b.mp3' },
  { name: 'Travel Tunes', type: 'Music', cat: 'Travel', url: 'https://cdn.pixabay.com/download/audio/2022/12/28/audio_145c26b52c.mp3' },
  { name: 'Nature Forest', type: 'Ambient', cat: 'Ambient', url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_3d1f3b0e35.mp3' }
];`;

const REPLACE_TARGET = `{[
                { name: 'Enthusiast', type: 'Music', url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3' },
                { name: 'Piano Loop', type: 'Music', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=piano-loop-1-97217.mp3' },
                { name: 'Electronic Future', type: 'Music', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf589.mp3?filename=electronic-future-beats-117997.mp3' },
                { name: 'Cinematic Whoosh', type: 'SFX', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_249ae51a37.mp3?filename=cinematic-whoosh-1-71172.mp3' },
                { name: 'Nature Forest', type: 'SFX', url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_3d1f3b0e35.mp3?filename=forest-nature-sounds-87621.mp3' },
                { name: 'Meme Click', type: 'SFX', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_b200b2e8cd.mp3?filename=click-button-140881.mp3' },
                { name: 'Bruh Meme', type: 'Memes', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b82ecce1.mp3?filename=error-126627.mp3' },
                { name: 'Oh No Meme', type: 'Memes', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c2ebf0c3a2.mp3?filename=fail-144746.mp3' }
              ].map((audio, i) => (`;

// Also I want to add ALL_AUDIO outside the component or inside it. Let's add it before `export default function MediaBin`
code = code.replace(
  "export default function MediaBin",
  `${ALL_AUDIO}\n\nexport default function MediaBin`
);

// We should also filter by search query
code = code.replace(
  REPLACE_TARGET,
  `ALL_AUDIO.filter(a => a.cat === audioCategory && a.name.toLowerCase().includes(searchAudioQuery.toLowerCase())).map((audio, i) => (`
);

// We need to bind the search input to searchAudioQuery
code = code.replace(
  `<input 
                type="text" 
                placeholder="Search audio..." 
                className="w-full bg-zinc-950 border border-[#333] rounded px-8 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />`,
  `<input 
                type="text" 
                placeholder="Search audio..." 
                value={searchAudioQuery}
                onChange={(e) => setSearchAudioQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-8 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-700"
              />`
);


fs.writeFileSync('src/components/MediaBin.tsx', code);
