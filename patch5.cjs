const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

code = code.replace(
  `                {/* Fade Section */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="font-semibold text-gray-300">Fade</div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Fade In</span>
                      <span className="text-gray-200">0.0s</span>
                    </div>
                    <input type="range" defaultValue={0} min={0} max={100} className="w-full" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Fade Out</span>
                      <span className="text-gray-200">0.0s</span>
                    </div>
                    <input type="range" defaultValue={0} min={0} max={100} className="w-full" />
                  </div>
                </div>`,
  `                {/* Fade Section */}
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
                </div>`
);

code = code.replace(
  `                {/* Noise Reduction (Basic) */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-300">Reduce Noise</div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-8 h-4 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2fe4b9]"></div>
                    </label>
                  </div>
                  <div className="flex space-x-2">
                     {['Weak', 'Standard', 'Strong'].map(level => (
                       <button key={level} className="flex-1 py-1.5 bg-[#111] border border-[#333] hover:border-[#555] rounded text-gray-400 text-xs transition-colors">
                         {level}
                       </button>
                     ))}
                  </div>
                </div>`,
  `                {/* Noise Reduction (Basic) */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-300">Reduce Noise</div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={selectedClip?.reduceNoise ?? false} onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip.id ? { ...c, reduceNoise: e.target.checked } : c));
                        }
                      }} />
                      <div className="w-8 h-4 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2fe4b9]"></div>
                    </label>
                  </div>
                  <div className="flex space-x-2">
                     {['Weak', 'Standard', 'Strong'].map(level => (
                       <button 
                         key={level} 
                         onClick={() => {
                           if (selectedClip) {
                             setClips(clips.map(c => c.id === selectedClip.id ? { ...c, noiseReductionLevel: level } : c));
                           }
                         }}
                         className={\`flex-1 py-1.5 \${selectedClip?.noiseReductionLevel === level ? 'bg-[#2fe4b9]/20 border border-[#2fe4b9] text-[#2fe4b9]' : 'bg-[#111] border border-[#333] hover:border-[#555] text-gray-400'} rounded text-xs transition-colors\`}
                       >
                         {level}
                       </button>
                     ))}
                  </div>
                </div>`
);

fs.writeFileSync('src/components/Properties.tsx', code);
