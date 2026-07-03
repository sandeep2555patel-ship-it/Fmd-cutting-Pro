const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

code = code.replace(
  `            {activeSubTab === 'effects' && (
              <div className="space-y-6">
                {/* Equalizer & Amplifier */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="font-semibold text-gray-300">Equalizer / Amplifier</div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" defaultChecked />
                       <div className="w-8 h-4 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2fe4b9]"></div>
                     </label>
                  </div>
                  
                  {/* Pre-amp */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400 text-[10px]">
                      <span>Pre-amplifier</span>
                      <span className="text-gray-200">0 dB</span>
                    </div>
                    <input type="range" defaultValue={50} min={0} max={100} className="w-full" />
                  </div>
                  {/* 10-band EQ */}
                  <div className="flex justify-between items-end h-24 pt-2 px-1">
                    {['32', '64', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'].map((freq, i) => (
                      <div key={freq} className="flex flex-col items-center justify-end h-full">
                         <div className="relative w-[14px] md:w-4 h-20 bg-[#111] rounded-full border border-[#333] flex items-end p-[1px]">
                           <div className="w-full bg-[#2fe4b9] rounded-full" style={{ height: \`\${[40, 50, 60, 45, 50, 55, 70, 65, 55, 45][i]}%\` }}></div>
                           <div className="absolute w-full h-3 bg-white rounded-full shadow cursor-pointer hover:scale-110 transition-transform left-0" style={{ bottom: \`calc(\${[40, 50, 60, 45, 50, 55, 70, 65, 55, 45][i]}% - 6px)\` }}></div>
                         </div>
                         <span className="text-[8px] text-gray-500 mt-2">{freq}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Compressor */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="flex items-center justify-between">
                     <div className="font-semibold text-gray-300">Compressor</div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" />
                       <div className="w-8 h-4 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2fe4b9]"></div>
                     </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Threshold</span><span>-20 dB</span>
                      </div>
                      <input type="range" defaultValue={30} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Ratio</span><span>4.0:1</span>
                      </div>
                      <input type="range" defaultValue={40} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Attack</span><span>10 ms</span>
                      </div>
                      <input type="range" defaultValue={10} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Release</span><span>200 ms</span>
                      </div>
                      <input type="range" defaultValue={50} min={0} max={100} className="w-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}`,
  `            {activeSubTab === 'effects' && (
              <div className="space-y-6">
                {/* Equalizer & Amplifier */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="font-semibold text-gray-300">Equalizer / Amplifier</div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" checked={selectedClip?.equalizerEnabled ?? true} onChange={(e) => {
                         if (selectedClip) {
                           setClips(clips.map(c => c.id === selectedClip.id ? { ...c, equalizerEnabled: e.target.checked } : c));
                         }
                       }} />
                       <div className="w-8 h-4 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2fe4b9]"></div>
                     </label>
                  </div>
                  
                  {/* Pre-amp */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400 text-[10px]">
                      <span>Pre-amplifier</span>
                      <span className="text-gray-200">{((selectedClip?.preAmp ?? 50) - 50).toFixed(1)} dB</span>
                    </div>
                    <input type="range" 
                      value={selectedClip?.preAmp ?? 50} 
                      onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip.id ? { ...c, preAmp: Number(e.target.value) } : c));
                        }
                      }}
                      min={0} max={100} className="w-full" />
                  </div>
                  {/* 10-band EQ */}
                  <div className="flex justify-between items-end h-24 pt-2 px-1">
                    {['32', '64', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'].map((freq, i) => {
                      const eqBands = selectedClip?.eqBands || [40, 50, 60, 45, 50, 55, 70, 65, 55, 45];
                      const val = eqBands[i];
                      return (
                      <div key={freq} className="flex flex-col items-center justify-end h-full">
                         <div className="relative w-[14px] md:w-4 h-20 bg-[#111] rounded-full border border-[#333] flex items-end p-[1px]">
                           <div className="w-full bg-[#2fe4b9] rounded-full" style={{ height: \`\${val}%\` }}></div>
                           <div className="absolute w-full h-3 bg-white rounded-full shadow cursor-pointer hover:scale-110 transition-transform left-0" style={{ bottom: \`calc(\${val}% - 6px)\` }}>
                              <input 
                                type="range" 
                                min={0} max={100} 
                                value={val} 
                                onChange={(e) => {
                                  if (selectedClip) {
                                    const newBands = [...eqBands];
                                    newBands[i] = Number(e.target.value);
                                    setClips(clips.map(c => c.id === selectedClip.id ? { ...c, eqBands: newBands } : c));
                                  }
                                }} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer -rotate-90 origin-center" 
                              />
                           </div>
                         </div>
                         <span className="text-[8px] text-gray-500 mt-2">{freq}</span>
                      </div>
                    )})}
                  </div>
                </div>
                {/* Compressor */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="flex items-center justify-between">
                     <div className="font-semibold text-gray-300">Compressor</div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" checked={selectedClip?.compressorEnabled ?? false} onChange={(e) => {
                         if (selectedClip) {
                           setClips(clips.map(c => c.id === selectedClip.id ? { ...c, compressorEnabled: e.target.checked } : c));
                         }
                       }} />
                       <div className="w-8 h-4 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2fe4b9]"></div>
                     </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Threshold</span><span>-{100 - (selectedClip?.compThreshold ?? 30)} dB</span>
                      </div>
                      <input type="range" value={selectedClip?.compThreshold ?? 30} onChange={e => {
                         if (selectedClip) setClips(clips.map(c => c.id === selectedClip.id ? { ...c, compThreshold: Number(e.target.value) } : c));
                      }} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Ratio</span><span>{((selectedClip?.compRatio ?? 40)/10).toFixed(1)}:1</span>
                      </div>
                      <input type="range" value={selectedClip?.compRatio ?? 40} onChange={e => {
                         if (selectedClip) setClips(clips.map(c => c.id === selectedClip.id ? { ...c, compRatio: Number(e.target.value) } : c));
                      }} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Attack</span><span>{selectedClip?.compAttack ?? 10} ms</span>
                      </div>
                      <input type="range" value={selectedClip?.compAttack ?? 10} onChange={e => {
                         if (selectedClip) setClips(clips.map(c => c.id === selectedClip.id ? { ...c, compAttack: Number(e.target.value) } : c));
                      }} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Release</span><span>{(selectedClip?.compRelease ?? 50) * 4} ms</span>
                      </div>
                      <input type="range" value={selectedClip?.compRelease ?? 50} onChange={e => {
                         if (selectedClip) setClips(clips.map(c => c.id === selectedClip.id ? { ...c, compRelease: Number(e.target.value) } : c));
                      }} min={0} max={100} className="w-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}`
);

fs.writeFileSync('src/components/Properties.tsx', code);
