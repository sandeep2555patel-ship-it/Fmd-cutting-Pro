const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

const lyricsUI = `
                  <div className="space-y-2 pt-4 border-t border-[#222]">
                    <div className="font-semibold text-gray-300">Lyrics / Subtitles</div>
                    <textarea 
                      value={selectedClip?.lyrics || ''} 
                      onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip.id ? { ...c, lyrics: e.target.value } : c));
                        }
                      }}
                      placeholder="Enter lyrics or subtitles here..."
                      className="w-full bg-[#111] border border-[#333] rounded p-2 text-sm text-gray-200 h-24 placeholder-gray-600 focus:outline-none focus:border-[#2fe4b9]"
                    />
                  </div>
`;

code = code.replace(/\{selectedClip\?.reduceNoise && \([\s\S]*?\}\)/, (match) => {
  return match + lyricsUI;
});

fs.writeFileSync('src/components/Properties.tsx', code);
