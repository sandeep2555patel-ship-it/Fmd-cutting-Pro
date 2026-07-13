const fs = require('fs');

let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

const OLD_ONCLICK = `                  onClick={() => {
                    const newClips = clips.map(c => ({ ...c, selected: false }));
                    setClips([...newClips, {
                      id: \`c\${Date.now()}\`,
                      trackId: 'a1', 
                      start: clips.length * 20,
                      duration: audio.cat === 'Long BGM' ? 7200 : (audio.type === 'Music' ? 3600 : (audio.type === 'SFX' ? 60 : 150)),
                      name: audio.name,
                      bg: '#10b981',
                      selected: true,
                      type: 'audio',
                      url: audio.url
                    }]);
                    onClose?.();
                  }}`;

const NEW_ONCLICK = `                  onClick={() => {
                    const newClips = clips.map(c => ({ ...c, selected: false }));
                    const audioEl = new Audio(audio.url);
                    const addAudio = (dur) => {
                      setClips([...newClips, {
                        id: \`c\${Date.now()}\`, trackId: 'a1', start: state.currentTime, 
                        duration: dur, name: audio.name, bg: '#10b981', 
                        selected: true, type: 'audio', url: audio.url
                      }]);
                      onClose?.();
                    };
                    
                    audioEl.onloadedmetadata = () => {
                      if (audioEl.duration && audioEl.duration !== Infinity) {
                        addAudio(audioEl.duration * 20);
                      } else {
                        addAudio(audio.cat === 'Long BGM' ? 7200 : (audio.type === 'Music' ? 3600 : 150));
                      }
                    };
                    audioEl.onerror = () => addAudio(audio.cat === 'Long BGM' ? 7200 : (audio.type === 'Music' ? 3600 : 150));
                  }}`;

code = code.replace(OLD_ONCLICK, NEW_ONCLICK);
fs.writeFileSync('src/components/MediaBin.tsx', code);
