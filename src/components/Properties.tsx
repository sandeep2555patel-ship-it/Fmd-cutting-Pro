import { useState } from 'react';
import { Sparkles, Mic2, Waves, Diamond } from 'lucide-react';
import { useProject } from '../context';

interface PropertiesProps {
  isMobile?: boolean;
}

export default function Properties({ isMobile }: PropertiesProps = {}) {
  const [activeTab, setActiveTab] = useState('video');
  const [activeSubTab, setActiveSubTab] = useState('basic');
  const { state: { keyframes }, setKeyframes } = useProject();

  const toggleKeyframe = (property: string) => {
    setKeyframes({ ...keyframes, [property]: !keyframes[property] });
  };

  const KeyframeButton = ({ property }: { property: string }) => {
    const isActive = keyframes[property];
    return (
      <button 
        onClick={() => toggleKeyframe(property)}
        className={`p-0.5 rounded transition-colors ${isActive ? 'text-[#2fe4b9]' : 'text-gray-600 hover:text-gray-400'}`}
        title={`Toggle animation for ${property}`}
      >
        <Diamond size={10} fill={isActive ? 'currentColor' : 'none'} />
      </button>
    );
  };

  return (
    <div className={`${isMobile ? 'w-full' : 'w-[320px] h-full'} flex-shrink-0 bg-[#181818] flex flex-col text-xs`}>
      {/* Top Tabs */}
      <div className="flex border-b border-[#222]">
        {['Video', 'Audio', 'Speed', 'Animation'].map(tab => (
          <button 
            key={tab}
            onClick={() => {
              setActiveTab(tab.toLowerCase());
              if (tab.toLowerCase() === 'animation') {
                setActiveSubTab('in');
              } else {
                setActiveSubTab('basic');
              }
            }}
            className={`flex-1 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.toLowerCase() 
                ? 'border-[#2fe4b9] text-white' 
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'video' && (
        <div className="flex-1 overflow-y-auto">
          {/* Sub Tabs */}
          <div className="flex space-x-4 px-4 pt-3 pb-2 border-b border-[#222]">
            {['Basic', 'Cutout', 'Mask', 'Enhance', 'Adjust'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveSubTab(tab.toLowerCase())}
                className={`transition-colors ${
                  activeSubTab === tab.toLowerCase() ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-6">
            {activeSubTab === 'basic' && (
              <>
                {/* Transform Section */}
                <div className="space-y-4">
                  <div className="font-semibold text-gray-300">Transform</div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <div className="flex items-center space-x-1">
                        <span>Scale</span>
                        <KeyframeButton property="scale" />
                      </div>
                      <span className="text-gray-200">100%</span>
                    </div>
                    <input type="range" defaultValue={100} min={0} max={200} className="w-full" />
                  </div>

                  <div className="flex space-x-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <span>X</span>
                        <KeyframeButton property="x" />
                      </div>
                      <div className="bg-[#111] border border-[#333] rounded p-1.5 flex items-center">
                        <input type="number" defaultValue="0" className="bg-transparent w-full outline-none text-white text-right" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <span>Y</span>
                        <KeyframeButton property="y" />
                      </div>
                      <div className="bg-[#111] border border-[#333] rounded p-1.5 flex items-center">
                        <input type="number" defaultValue="0" className="bg-transparent w-full outline-none text-white text-right" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-gray-400">
                      <div className="flex items-center space-x-1">
                        <span>Rotate</span>
                        <KeyframeButton property="rotate" />
                      </div>
                      <span className="text-gray-200">0°</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="range" defaultValue={0} min={-180} max={180} className="w-full" />
                      <div className="w-6 h-6 rounded-full border border-[#444] relative flex items-center justify-center">
                        <div className="w-0.5 h-3 bg-gray-400 absolute top-0 transform origin-bottom"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blend Section */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="font-semibold text-gray-300">Blend</div>
                  
                  <div className="space-y-2">
                    <span className="text-gray-400">Mode</span>
                    <select className="w-full bg-[#111] border border-[#333] rounded p-2 text-white outline-none">
                      <option>Normal</option>
                      <option>Screen</option>
                      <option>Multiply</option>
                      <option>Overlay</option>
                    </select>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-gray-400">
                      <div className="flex items-center space-x-1">
                        <span>Opacity</span>
                        <KeyframeButton property="opacity" />
                      </div>
                      <span className="text-gray-200">100%</span>
                    </div>
                    <input type="range" defaultValue={100} min={0} max={100} className="w-full" />
                  </div>
                </div>
                
                {/* Canvas Section */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="font-semibold text-gray-300">Canvas</div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="accent-[#2fe4b9] bg-[#111] border-[#333] cursor-pointer" />
                    <span className="text-gray-400">Fill Background</span>
                  </label>
                </div>
              </>
            )}

            {activeSubTab === 'cutout' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-300">Auto Cutout</div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-8 h-4 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2fe4b9]"></div>
                    </label>
                  </div>
                  <div className="text-xs text-gray-500">
                    Automatically remove background around humans or objects.
                  </div>
                  <button className="w-full py-2 bg-[#222] hover:bg-[#333] text-white rounded transition-colors border border-[#444]">
                    Select Subject
                  </button>
                </div>
                <div className="space-y-4 pt-4 border-t border-[#222]">
                   <div className="font-semibold text-gray-300">Chroma Key</div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-400">Color Picker</span>
                     <div className="w-6 h-6 rounded-full bg-[#00ff00] border border-white cursor-pointer ring-1 ring-offset-1 ring-offset-[#111] ring-gray-500"></div>
                   </div>
                   <div className="space-y-2">
                     <div className="flex justify-between text-gray-400">
                       <span>Intensity</span>
                       <span className="text-gray-200">0%</span>
                     </div>
                     <input type="range" defaultValue={0} min={0} max={100} className="w-full" />
                   </div>
                </div>
              </div>
            )}

            {activeSubTab === 'mask' && (
              <div className="space-y-4">
                 <div className="font-semibold text-gray-300">Mask Type</div>
                 <div className="grid grid-cols-3 gap-2">
                    {['None', 'Linear', 'Mirror', 'Circle', 'Rectangle', 'Heart'].map(mask => (
                      <button key={mask} className="p-2 bg-[#111] border border-[#333] hover:border-[#2fe4b9] text-gray-400 hover:text-white rounded text-[10px] flex flex-col items-center justify-center space-y-1">
                        <div className="w-6 h-6 border border-current rounded-sm flex items-center justify-center opacity-50">M</div>
                        <span>{mask}</span>
                      </button>
                    ))}
                 </div>
              </div>
            )}

            {activeSubTab === 'enhance' && (
              <div className="space-y-6">
                 <div className="space-y-4">
                    <div className="font-semibold text-gray-300">Video Quality</div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="accent-[#2fe4b9] bg-[#111] border-[#333] cursor-pointer" />
                      <span className="text-gray-400">Reduce Image Noise</span>
                    </label>
                 </div>
                 <div className="space-y-4 pt-4 border-t border-[#222]">
                   <div className="flex items-center justify-between">
                     <div className="font-semibold text-gray-300 text-sm flex items-center space-x-1">
                       <Sparkles size={14} className="text-[#2fe4b9]" />
                       <span>Auto Adjust</span>
                     </div>
                     <button className="px-3 py-1 bg-[#2fe4b9] text-black font-medium rounded">Apply</button>
                   </div>
                 </div>
              </div>
            )}

            {activeSubTab === 'adjust' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="font-semibold text-gray-300 flex items-center justify-between">
                    <span>Color Grading</span>
                    <div className="text-[#2fe4b9] text-[10px] uppercase font-bold tracking-wider">Pro</div>
                  </div>
                  
                  {/* Basic Adjustments */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Temperature</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <input type="range" defaultValue={0} min={-100} max={100} className="w-full accent-orange-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Tint</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <input type="range" defaultValue={0} min={-100} max={100} className="w-full accent-pink-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Saturation</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <input type="range" defaultValue={0} min={-100} max={100} className="w-full accent-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="font-semibold text-gray-300">Light</div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Brightness</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <input type="range" defaultValue={0} min={-100} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Contrast</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <input type="range" defaultValue={0} min={-100} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Highlights</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <input type="range" defaultValue={0} min={-100} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Shadows</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <input type="range" defaultValue={0} min={-100} max={100} className="w-full" />
                    </div>
                  </div>
                </div>

                {/* HSL Mock */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="font-semibold text-gray-300">HSL</div>
                  <div className="flex items-center space-x-2">
                    {['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-cyan-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500'].map((color, i) => (
                      <button key={i} className={`w-5 h-5 rounded-full ${color} ${i === 0 ? 'ring-2 ring-white ring-offset-2 ring-offset-[#181818]' : ''}`}></button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Hue</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <input type="range" defaultValue={0} min={-100} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Saturation</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <input type="range" defaultValue={0} min={-100} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Lightness</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <input type="range" defaultValue={0} min={-100} max={100} className="w-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'audio' && (
        <div className="flex-1 overflow-y-auto">
          {/* Audio Sub Tabs */}
          <div className="flex space-x-4 px-4 pt-3 pb-2 border-b border-[#222]">
            {['Basic', 'Effects', 'Enhance'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveSubTab(tab.toLowerCase())}
                className={`transition-colors ${
                  activeSubTab === tab.toLowerCase() ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-6">
            {activeSubTab === 'basic' && (
              <div className="space-y-6">
                {/* Volume Section */}
                <div className="space-y-4">
                  <div className="font-semibold text-gray-300">Volume</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Level</span>
                      <span className="text-gray-200">0.0 dB</span>
                    </div>
                    <input type="range" defaultValue={50} min={0} max={100} className="w-full" />
                  </div>
                </div>

                {/* Fade Section */}
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
                </div>

                {/* Noise Reduction (Basic) */}
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
                </div>
              </div>
            )}

            {activeSubTab === 'enhance' && (
              <div className="space-y-6">
                {/* AI Enhancement Section (Adobe Podcast Style) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-300 font-semibold">
                      <Sparkles size={14} className="text-[#2fe4b9]" />
                      <span>Enhance Voice</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-8 h-4 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2fe4b9]"></div>
                    </label>
                  </div>
                  <div className="text-xs text-gray-500 leading-relaxed mb-2">
                    AI automatically removes background noise and echoes to make your voice sound crisp and studio-quality.
                  </div>
                  <div className="bg-[#111] border border-[#2fe4b9]/30 rounded-lg p-3 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#2fe4b9]/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    
                    <div className="flex justify-between text-gray-400 text-xs">
                      <span>Intensity</span>
                      <span className="text-[#2fe4b9] font-medium">85%</span>
                    </div>
                    <input type="range" defaultValue={85} min={0} max={100} className="w-full" />
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Natural</span>
                      <span>Isolated</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'effects' && (
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
                           <div className="w-full bg-[#2fe4b9] rounded-full" style={{ height: `${[40, 50, 60, 45, 50, 55, 70, 65, 55, 45][i]}%` }}></div>
                           <div className="absolute w-full h-3 bg-white rounded-full shadow cursor-pointer hover:scale-110 transition-transform left-0" style={{ bottom: `calc(${[40, 50, 60, 45, 50, 55, 70, 65, 55, 45][i]}% - 6px)` }}></div>
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
                    <div className="space-y-1 col-span-2">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Makeup Gain</span><span>0 dB</span>
                      </div>
                      <input type="range" defaultValue={50} min={0} max={100} className="w-full" />
                    </div>
                  </div>
                </div>

                {/* Pitch & Tempo */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="font-semibold text-gray-300">Pitch & Tempo</div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Pitch (Semitones)</span><span>0</span>
                      </div>
                      <input type="range" defaultValue={50} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Tempo</span><span>1.0x</span>
                      </div>
                      <input type="range" defaultValue={50} min={0} max={100} className="w-full" />
                    </div>
                  </div>
                </div>

                {/* Reverb */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="flex items-center justify-between">
                     <div className="font-semibold text-gray-300">Reverb</div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" />
                       <div className="w-8 h-4 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2fe4b9]"></div>
                     </label>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Room Size</span><span>50%</span>
                      </div>
                      <input type="range" defaultValue={50} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Damping</span><span>30%</span>
                      </div>
                      <input type="range" defaultValue={30} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Dry / Wet</span><span>40%</span>
                      </div>
                      <input type="range" defaultValue={40} min={0} max={100} className="w-full" />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'speed' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-4">
            <div className="font-semibold text-gray-300">Normal Speed</div>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Times</span>
                <span className="text-gray-200">1.0x</span>
              </div>
              <input type="range" defaultValue={10} min={1} max={100} className="w-full" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-400">Duration</span>
              <div className="bg-[#111] border border-[#333] rounded px-2 py-1 text-white">00:05.0s</div>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer pt-2">
              <input type="checkbox" className="accent-[#2fe4b9] bg-[#111] border-[#333] cursor-pointer" />
              <span className="text-gray-400">Pitch tracking</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer pt-1">
              <input type="checkbox" className="accent-[#2fe4b9] bg-[#111] border-[#333] cursor-pointer" />
              <span className="text-gray-400">Smooth slow-mo</span>
            </label>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#222]">
            <div className="font-semibold text-gray-300">Curve Speed</div>
            <div className="grid grid-cols-3 gap-2">
              {['None', 'Custom', 'Montage', 'Hero', 'Bullet', 'Jump Cut'].map(curve => (
                <button key={curve} className="p-2 bg-[#111] border border-[#333] hover:border-[#2fe4b9] text-gray-400 hover:text-white rounded text-[10px] flex flex-col items-center justify-center space-y-1">
                  <div className="w-8 h-4 border-b border-current opacity-50 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-current to-transparent opacity-20"></div>
                  </div>
                  <span>{curve}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'animation' && (
        <div className="flex-1 overflow-y-auto">
          <div className="flex space-x-4 px-4 pt-3 pb-2 border-b border-[#222]">
            {['In', 'Out', 'Combo'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveSubTab(tab.toLowerCase())}
                className={`transition-colors ${
                  activeSubTab === tab.toLowerCase() ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-4 space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {['Fade', 'Zoom', 'Slide', 'Spin', 'Wipe', 'Shake', 'Bounce', 'Flip', 'Glitch'].map(anim => (
                <div key={anim} className="flex flex-col items-center group cursor-pointer">
                  <div className="w-full aspect-square rounded bg-[#111] border border-[#333] group-hover:border-[#2fe4b9] mb-1.5 flex items-center justify-center transition-colors">
                    <div className="w-6 h-6 bg-[#333] group-hover:bg-[#2fe4b9]/50 rounded-sm"></div>
                  </div>
                  <span className="text-[10px] text-gray-400 group-hover:text-white">{anim}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t border-[#222]">
              <div className="flex justify-between text-gray-400 text-xs">
                <span>Duration</span>
                <span className="text-gray-200">0.5s</span>
              </div>
              <input type="range" defaultValue={50} min={0} max={100} className="w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
