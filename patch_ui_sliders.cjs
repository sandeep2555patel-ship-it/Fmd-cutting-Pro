const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

const targetUI = `<div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="font-semibold text-gray-300">Vocal Isolation</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">Eliminate fans, wind, birds, and dogs to enhance human voice</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={selectedClip?.reduceNoise ?? false} onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip.id ? { ...c, reduceNoise: e.target.checked } : c));
                        }
                      }} />
                      <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2fe4b9]"></div>
                    </label>
                  </div>
                  
                  {selectedClip?.reduceNoise && (
                    <div className="pt-2">
                      <div className="flex space-x-2">
                        {['Weak', 'Standard', 'Strong'].map(level => (
                          <button 
                            key={level}
                            onClick={() => {
                              if (selectedClip) {
                                setClips(clips.map(c => c.id === selectedClip.id ? { ...c, noiseReductionLevel: level } : c));
                              }
                            }}
                            className={\`flex-1 py-1 text-xs rounded border \${selectedClip?.noiseReductionLevel === level ? 'bg-[#2fe4b9] text-black border-[#2fe4b9]' : 'bg-transparent text-gray-400 border-[#333] hover:border-gray-500'}\`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>`;

const replaceUI = `<div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="font-semibold text-gray-300">Vocal & Noise Control</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">Isolate human voice and reduce background noise</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={selectedClip?.reduceNoise ?? false} onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip.id ? { ...c, reduceNoise: e.target.checked, vocalVolume: c.vocalVolume ?? 100, backgroundVolume: c.backgroundVolume ?? 0 } : c));
                        }
                      }} />
                      <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2fe4b9]"></div>
                    </label>
                  </div>
                  
                  {selectedClip?.reduceNoise && (
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-400">
                          <span>Vocals / Lyrics</span>
                          <span className="text-gray-200">{selectedClip?.vocalVolume ?? 100}%</span>
                        </div>
                        <Slider normalValue={100}
                          value={selectedClip?.vocalVolume ?? 100}
                          onChange={(e) => {
                            if (selectedClip) {
                              setClips(clips.map(c => c.id === selectedClip.id ? { ...c, vocalVolume: Number(e.target.value) } : c));
                            }
                          }}
                          min={0} max={200} className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-400">
                          <span>Background Noise</span>
                          <span className="text-gray-200">{selectedClip?.backgroundVolume ?? 0}%</span>
                        </div>
                        <Slider normalValue={100}
                          value={selectedClip?.backgroundVolume ?? 0}
                          onChange={(e) => {
                            if (selectedClip) {
                              setClips(clips.map(c => c.id === selectedClip.id ? { ...c, backgroundVolume: Number(e.target.value) } : c));
                            }
                          }}
                          min={0} max={200} className="w-full" />
                      </div>
                    </div>
                  )}
                </div>`;

code = code.replace(targetUI, replaceUI);
fs.writeFileSync('src/components/Properties.tsx', code);
