const fs = require('fs');

let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

code = code.replace(
  `{['Trending', 'Long BGM', 'BGM', 'Memes', 'SFX'].map((cat, i) => (`,
  `{['Trending', 'Long BGM', 'BGM', 'Memes', 'SFX', 'My Music'].map((cat, i) => (`
);

const NEW_ITEMS = `
              {audioCategory === 'My Music' ? (
                 <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-zinc-800 rounded-lg hover:border-cyan-400 hover:bg-cyan-950/20 transition-colors cursor-pointer text-zinc-400 hover:text-cyan-400">
                    <Plus size={24} className="mb-2" />
                    <span>Upload from Device</span>
                    <input 
                       type="file" 
                       accept="audio/*" 
                       className="hidden" 
                       onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            const audio = new Audio(url);
                            audio.onloadedmetadata = () => {
                               const newClips = clips.map(c => ({ ...c, selected: false }));
                               setClips([...newClips, {
                                 id: \`c\${Date.now()}\`, trackId: 'a1', start: clips.length * 20, 
                                 duration: audio.duration * 20 || 3600, name: file.name, bg: '#10b981', 
                                 selected: true, type: 'audio', url
                               }]);
                               onClose?.();
                            };
                          }
                       }} 
                    />
                 </label>
              ) : (
                ALL_AUDIO.filter(a => a.cat === audioCategory && a.name.toLowerCase().includes(searchAudioQuery.toLowerCase())).map((audio, i) => (
`;

code = code.replace(
  `{ALL_AUDIO.filter(a => a.cat === audioCategory && a.name.toLowerCase().includes(searchAudioQuery.toLowerCase())).map((audio, i) => (`,
  NEW_ITEMS
);

code = code.replace(
  `</div>
                  <div className="opacity-0 group-hover:opacity-100 p-1 text-[#2fe4b9] transition-opacity">
                    <Plus size={16} />
                  </div>
                </div>
              ))}
            </div>`,
  `</div>
                  <div className="opacity-0 group-hover:opacity-100 p-1 text-[#2fe4b9] transition-opacity">
                    <Plus size={16} />
                  </div>
                </div>
              ))
              )}
            </div>`
);

code = code.replace(
  `className="w-20 border-r border-[#222] overflow-y-auto no-scrollbar py-2"`,
  `className="w-24 border-r border-[#222] overflow-y-auto no-scrollbar py-2 text-sm"`
);

fs.writeFileSync('src/components/MediaBin.tsx', code);
