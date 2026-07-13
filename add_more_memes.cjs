const fs = require('fs');

let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

const NEW_MEMES = `  // Memes
  { name: 'Spongebob 2 Hours Later', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/2-hours-later.mp3') },
  { name: 'Amogus (Among Us)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/among-us-role-reveal-sound.mp3') },
  { name: 'Minecraft Oof', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/minecraft-death-sound.mp3') },
  { name: 'Baka Mitai (Dame Da Ne)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/baka-mitai.mp3') },
  { name: 'Nokia Arabic Ringtone', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/nokia-arabic-ringtone.mp3') },
  { name: 'Aw Shit, Here we go again', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/gta-san-andreas-ah-shit-here-we-go-again.mp3') },
  { name: 'Megalovania', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/megalovania.mp3') },
  { name: 'Curb Your Enthusiasm', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/curb-your-enthusiasm-theme-song.mp3') },
  { name: 'Roundabout (To Be Continued)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/yes-roundabout-to-be-continued.mp3') },
  { name: 'Mission Failed We\'ll Get Em Next Time', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/mission-failed-well-get-em-next-time.mp3') },
  { name: 'Coffin Dance (Astronomia)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/astronomia-coffin-dance.mp3') },
`;

code = code.replace("  // Memes", NEW_MEMES);

fs.writeFileSync('src/components/MediaBin.tsx', code);
