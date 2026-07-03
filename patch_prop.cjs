const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

const fadeRegex = /\{\/\* Fade Section \*\/\}([\s\S]*?)\{\/\* Noise Reduction \(Basic\) \*\/\}/;
code = code.replace(fadeRegex, `{/* Fade Section */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="font-semibold text-gray-300">Fade</div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Fade In</span>
                      <span className="text-gray-200">{(selectedClip?.fadeIn ?? 0).toFixed(1)}s</span>
                    </div>
                    <input type="range" 
                      value={selectedClip?.fadeIn ?? 0}
                      onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip.id ? { ...c, fadeIn: Number(e.target.value) } : c));
                        }
                      }}
                      step={0.1} min={0} max={10} className="w-full" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Fade Out</span>
                      <span className="text-gray-200">{(selectedClip?.fadeOut ?? 0).toFixed(1)}s</span>
                    </div>
                    <input type="range" 
                      value={selectedClip?.fadeOut ?? 0}
                      onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip.id ? { ...c, fadeOut: Number(e.target.value) } : c));
                        }
                      }}
                      step={0.1} min={0} max={10} className="w-full" />
                  </div>
                </div>
                {/* Noise Reduction (Basic) */}`);

fs.writeFileSync('src/components/Properties.tsx', code);
