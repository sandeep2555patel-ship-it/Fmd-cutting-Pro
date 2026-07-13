import { useState, useMemo, useRef, useEffect } from 'react';
import { Sparkles, Mic2, Waves, Diamond, Trash2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProject, KeyframeData, VIDEO_EFFECTS, getEffectCSS, getCurveRate, Clip } from '../context';
import { Slider } from './Slider';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer';

interface PropertiesProps {
  isMobile?: boolean;
}

const SPEED_PRESETS: Record<string, {x: number, y: number}[]> = {
  'None': [
    { x: 0, y: 1 }, { x: 0.25, y: 1 }, { x: 0.5, y: 1 }, { x: 0.75, y: 1 }, { x: 1, y: 1 }
  ],
  'Custom': [
    { x: 0, y: 1 }, { x: 0.25, y: 1 }, { x: 0.5, y: 1 }, { x: 0.75, y: 1 }, { x: 1, y: 1 }
  ],
  'Montage': [
    { x: 0, y: 2 }, { x: 0.2, y: 1.2 }, { x: 0.5, y: 0.5 }, { x: 0.8, y: 1.2 }, { x: 1, y: 2 }
  ],
  'Hero': [
    { x: 0, y: 1.2 }, { x: 0.3, y: 1.2 }, { x: 0.4, y: 0.4 }, { x: 0.6, y: 0.4 }, { x: 0.7, y: 1.2 }, { x: 1, y: 1.2 }
  ],
  'Bullet': [
    { x: 0, y: 3 }, { x: 0.4, y: 0.2 }, { x: 0.6, y: 0.2 }, { x: 1, y: 3 }
  ],
  'Jump Cut': [
    { x: 0, y: 0.5 }, { x: 0.1, y: 2.0 }, { x: 0.3, y: 0.5 }, { x: 0.5, y: 2.0 }, { x: 0.7, y: 0.5 }, { x: 0.9, y: 2.0 }, { x: 1, y: 0.5 }
  ]
};

const InteractiveSpeedGraph = ({ clip, onChange }: { clip: Clip, onChange: (points: {x: number, y: number}[]) => void }) => {
  const { state: { currentTime } } = useProject();
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const points = clip.customSpeedPoints || SPEED_PRESETS['Custom'];

  const yToPercent = (rate: number) => {
    const logVal = Math.log10(Math.max(0.1, Math.min(10, rate)));
    return 100 - ((logVal + 1) / 2) * 100;
  };

  const scrubTime = Math.max(0, currentTime - clip.start);
  const progress = clip.duration > 0 ? Math.min(1, scrubTime / (clip.duration / 20)) : 0;

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (draggingIdx === null || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const padding = 8; // p-2
      const innerWidth = rect.width - padding * 2;
      const innerHeight = rect.height - padding * 2;
      
      let x = (e.clientX - rect.left - padding) / innerWidth;
      let yRatio = 1 - (e.clientY - rect.top - padding) / innerHeight; // 0 to 1

      // constrain x
      if (draggingIdx === 0) x = 0;
      else if (draggingIdx === points.length - 1) x = 1;
      else {
        x = Math.max(points[draggingIdx - 1].x + 0.05, Math.min(points[draggingIdx + 1].x - 0.05, x));
      }
      
      // constrain y (rate: 0.1 to 10.0)
      yRatio = Math.max(0, Math.min(1, yRatio));
      let rate = Math.pow(10, yRatio * 2 - 1);
      
      // Snap to 1.0x
      if (Math.abs(rate - 1.0) < 0.15) rate = 1.0;
      if (rate < 0.11) rate = 0.1;
      if (rate > 9.9) rate = 10.0;

      const newPoints = [...points];
      newPoints[draggingIdx] = { x, y: rate };
      onChange(newPoints);
    };

    const handlePointerUp = () => setDraggingIdx(null);

    if (draggingIdx !== null) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingIdx, points, onChange]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between text-white text-xs">
        <span className="text-gray-400">Duration {clip.duration ? (clip.duration/20).toFixed(2) : '0.00'}s</span>
        <div className="flex items-center space-x-4">
          <button className="text-white hover:text-[#06b6d4] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
          <button className="bg-zinc-900 px-3 py-1.5 rounded flex items-center space-x-1 border border-zinc-700">
            <span>Preset</span>
            <ChevronRight size={14} className="rotate-90 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="px-4 pb-2">
        <div ref={containerRef} className="bg-[#181818] border border-zinc-700 rounded-lg p-0 relative h-48 w-full touch-none group select-none shadow-inner">
          <div className="absolute inset-0 pt-4 pb-4 px-4 overflow-hidden">
            <div className="relative w-full h-full">
              {/* Grid Lines */}
              <div className="absolute top-0 left-0 right-0 border-t border-dashed border-[#444]"></div>
              <div className="absolute top-[50%] left-0 right-0 border-t border-dashed border-[#555]"></div>
              <div className="absolute bottom-0 left-0 right-0 border-t border-dashed border-[#444]"></div>

              {/* Time Ticks */}
              {clip.duration > 0 && Array.from({ length: Math.ceil((clip.duration / 20) / 5) + 1 }).map((_, i) => {
                const time = i * 5;
                const totalTime = clip.duration / 20;
                if (time > totalTime) return null;
                const left = (time / totalTime) * 100;
                return (
                  <div key={i} className="absolute top-0 bottom-0 border-l border-dashed border-[#444] pointer-events-none z-0" style={{ left: `${left}%` }}>
                    <div className="absolute bottom-1 -left-2 text-[10px] text-gray-500 font-medium bg-[#181818] px-1">{time}s</div>
                  </div>
                );
              })}

              {/* Labels */}
              <div className="absolute top-1 left-1 text-[10px] text-gray-500 font-medium pointer-events-none">10x</div>
              <div className="absolute left-1 text-[10px] text-gray-500 font-medium pointer-events-none -translate-y-1/2" style={{ top: '50%' }}>1x</div>
              <div className="absolute bottom-1 left-1 text-[10px] text-gray-500 font-medium pointer-events-none">0.1x</div>

              {/* Curve */}
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 overflow-visible z-10">
                <path d={`M ${points[0].x * 100},${yToPercent(points[0].y)} ` + 
                  Array.from({ length: 100 }, (_, i) => {
                    const p = (i + 1) / 100;
                    const rate = getCurveRate('Custom', p, points);
                    return `L ${p * 100},${yToPercent(rate)}`;
                  }).join(' ')} 
                  fill="none" stroke="#fbc02d" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              </svg>

              {/* Playhead */}
              {progress > 0 && progress < 1 && (
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none z-0"
                  style={{ left: `${progress * 100}%` }}
                ></div>
              )}

              {/* Knots */}
              {points.map((p, i) => (
                <div
                  key={i}
                  onPointerDown={() => setDraggingIdx(i)}
                  className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full cursor-pointer z-20 flex items-center justify-center transition-transform ${draggingIdx === i ? 'scale-125' : 'hover:scale-110'}`}
                  style={{ left: `${p.x * 100}%`, top: `${yToPercent(p.y)}%` }}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md pointer-events-none"></div>
                  {draggingIdx === i && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[11px] font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap">
                      {p.y.toFixed(1)}x
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Properties({ isMobile }: PropertiesProps = {}) {
  const { state: { clips, currentTime }, setClips, setCurrentTime, activePropertiesTab: activeTab, setActivePropertiesTab: setActiveTab } = useProject();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceProgress, setEnhanceProgress] = useState(0);

  const handleDeepAIEnhance = async (clipId: string) => {
    const clip = clips.find(c => c.id === clipId);
    if (!clip || !clip.url) return;
    
    setIsEnhancing(true);
    setEnhanceProgress(10);
    
    try {
      // Fetch the file from the blob URL
      const response = await fetch(clip.url);
      const blob = await response.blob();
      
      setEnhanceProgress(30);
      
      const formData = new FormData();
      formData.append('audio', blob, 'media.mp4');
      
      // Call our python backend
      const res = await fetch('/api/enhance-audio', {
        method: 'POST',
        body: formData
      });
      
      setEnhanceProgress(80);
      
      if (!res.ok) throw new Error('AI processing failed');
      
      const enhancedBlob = await res.blob();
      const enhancedUrl = URL.createObjectURL(enhancedBlob);
      
      setEnhanceProgress(100);
      
      setClips(clips.map(c => c.id === clipId ? { ...c, url: enhancedUrl, enhanced: true } : c));
    } catch (err) {
      console.error(err);
      alert('AI Enhancement failed');
    } finally {
      setIsEnhancing(false);
      setTimeout(() => setEnhanceProgress(0), 1000);
    }
  };

  const [activeSubTab, setActiveSubTab] = useState('basic');
  const [activeSpeedTab, setActiveSpeedTab] = useState('normal');

  const selectedClip = useMemo(() => clips.find(c => c.selected), [clips]);
  const scrubTime = selectedClip ? Math.max(0, currentTime - selectedClip.start) : 0;

  const defaultProps = { scale: 100, x: 0, y: 0, rotate: 0, opacity: 100 };

  const currentKeyframe = useMemo(() => {
    return selectedClip?.keyframes?.find(k => k.time === scrubTime);
  }, [selectedClip, scrubTime]);

  const currentValues = useMemo(() => {
    if (currentKeyframe) return { ...defaultProps, ...currentKeyframe.properties };
    
    if (selectedClip?.keyframes && selectedClip.keyframes.length > 0) {
      const prevKeyframes = selectedClip.keyframes.filter(k => k.time <= scrubTime).sort((a,b) => b.time - a.time);
      if (prevKeyframes.length > 0) {
         return { ...defaultProps, ...prevKeyframes[0].properties };
      }
    }
    return defaultProps;
  }, [selectedClip, scrubTime, currentKeyframe]);

  const toggleKeyframe = (property: keyof KeyframeData['properties']) => {
    if (!selectedClip) return;
    
    let updatedKeyframes = [...(selectedClip.keyframes || [])];
    const existingIndex = updatedKeyframes.findIndex(k => k.time === scrubTime);
    
    if (existingIndex >= 0) {
      const kf = { ...updatedKeyframes[existingIndex] };
      kf.properties = { ...kf.properties };
      
      if (kf.properties[property] !== undefined) {
         delete kf.properties[property];
         if (Object.keys(kf.properties).length === 0) {
            updatedKeyframes.splice(existingIndex, 1);
         } else {
            updatedKeyframes[existingIndex] = kf;
         }
      } else {
         kf.properties[property] = currentValues[property];
         updatedKeyframes[existingIndex] = kf;
      }
    } else {
      updatedKeyframes.push({
         time: scrubTime,
         properties: { [property]: currentValues[property] }
      });
      updatedKeyframes.sort((a, b) => a.time - b.time);
    }
    
    setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, keyframes: updatedKeyframes } : c));
  };

  const updatePropertyValue = (property: keyof KeyframeData['properties'], value: number) => {
    if (!selectedClip) return;
    
    let updatedKeyframes = [...(selectedClip.keyframes || [])];
    const existingIndex = updatedKeyframes.findIndex(k => k.time === scrubTime);
    
    if (existingIndex >= 0) {
      const kf = { ...updatedKeyframes[existingIndex] };
      kf.properties = { ...kf.properties, [property]: value };
      updatedKeyframes[existingIndex] = kf;
      setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, keyframes: updatedKeyframes } : c));
    } else {
      updatedKeyframes.push({
         time: scrubTime,
         properties: { [property]: value }
      });
      updatedKeyframes.sort((a, b) => a.time - b.time);
      setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, keyframes: updatedKeyframes } : c));
    }
  };

  const KeyframeButton = ({ property }: { property: keyof KeyframeData['properties'] }) => {
    const isActive = currentKeyframe?.properties?.[property] !== undefined;
    return (
      <button 
        onClick={() => toggleKeyframe(property)}
        className={`p-0.5 rounded transition-colors ${isActive ? 'text-[#06b6d4]' : 'text-gray-600 hover:text-gray-400'}`}
        title={`Toggle animation keyframe for ${property}`}
      >
        <Diamond size={10} fill={isActive ? 'currentColor' : 'none'} />
      </button>
    );
  };

  const isAudio = selectedClip?.type === 'audio';
  const isText = selectedClip?.type === 'text';

  const tabs = isText ? ['Text', 'Style', 'Animation'] : (isAudio 
    ? ['Audio', 'Amplifier', 'Podcast', 'Remix'] 
    : ['Video', 'Audio', 'Speed', 'Animation']);

  useEffect(() => {
    if (selectedClip) {
      if (selectedClip.type === 'text') {
        if (!['text', 'style', 'animation'].includes(activeTab)) setActiveTab('text');
      } else if (selectedClip.type === 'audio') {
        if (!['audio', 'amplifier', 'podcast', 'remix'].includes(activeTab)) setActiveTab('audio');
      } else {
        if (!['video', 'audio', 'speed', 'animation'].includes(activeTab)) setActiveTab('video');
      }
    }
  }, [selectedClip?.type, selectedClip?.id, activeTab, setActiveTab]);

  return (
    <div className={`${isMobile ? 'w-full h-full' : 'w-[320px] h-full'} flex-shrink-0 bg-[#181818] flex flex-col text-xs min-h-0`}>
      {/* Top Tabs */}
      <div className="flex border-cyan-500 border-zinc-800">
        {tabs.map(tab => (
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
            className={`flex-1 py-3 font-medium border-cyan-500-2 transition-colors ${
              activeTab === tab.toLowerCase() 
                ? 'border-[#06b6d4] text-white' 
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'video' && (
        <div className="flex-1 overflow-y-auto min-h-0 pb-24">
          {/* Sub Tabs */}
          <div className="flex space-x-4 px-4 pt-3 pb-2 border-cyan-500 border-zinc-800">
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
                {/* Keyframe Time Scrubber */}
                <div className="space-y-4 mb-4 pb-4 border-cyan-500 border-zinc-800">
                  <div className="flex justify-between text-gray-400">
                    <div className="flex items-center space-x-2">
                       <Clock size={14} className="text-[#06b6d4]" />
                       <span className="font-semibold text-gray-300">Clip Time</span>
                    </div>
                    <span className="text-gray-200">{(scrubTime / 20).toFixed(1)}s</span>
                  </div>
                  <Slider 
                    value={scrubTime} 
                    min={0} 
                    max={selectedClip?.duration || 100} 
                    onChange={(e) => setCurrentTime((selectedClip?.start || 0) + Number(e.target.value))} 
                    className="w-full accent-[#06b6d4]" 
                  />
                  
                  {/* List of keyframes indicator */}
                  {selectedClip?.keyframes && selectedClip.keyframes.length > 0 && (
                     <div className="flex flex-col space-y-1 mt-2">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Active Keyframes</span>
                        {selectedClip.keyframes.map((kf, i) => (
                           <div key={i} className={`flex items-center justify-between p-1.5 rounded bg-zinc-950/50 border ${kf.time === scrubTime ? 'border-[#06b6d4]/50' : 'border-zinc-700'}`}>
                              <span className="text-[10px] text-gray-400 cursor-pointer hover:text-white" onClick={() => setCurrentTime((selectedClip?.start || 0) + kf.time)}>
                                 @ {(kf.time / 20).toFixed(1)}s
                              </span>
                              <div className="flex items-center space-x-2">
                                 <span className="text-[10px] text-gray-500 truncate max-w-[120px]">
                                   {Object.entries(kf.properties).map(([k,v]) => `${k}:${v}`).join(', ')}
                                 </span>
                                 <button 
                                    onClick={() => {
                                      const newKfs = [...selectedClip.keyframes!];
                                      newKfs.splice(i, 1);
                                      setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, keyframes: newKfs } : c));
                                    }}
                                    className="text-gray-600 hover:text-red-400 transition-colors"
                                 >
                                    <Trash2 size={12} />
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
                </div>

                {/* Transform Section */}
                <div className="space-y-4">
                  <div className="font-semibold text-gray-300">Transform</div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <div className="flex items-center space-x-1">
                        <span>Scale</span>
                        <KeyframeButton property="scale" />
                      </div>
                      <span className="text-gray-200">{currentValues.scale}%</span>
                    </div>
                    <Slider normalValue={100}
                      value={currentValues.scale} 
                      onChange={(e) => updatePropertyValue('scale', Number(e.target.value))}
                      min={-200} max={200} className="w-full" 
                    />
                  </div>

                  <div className="flex space-x-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <span>X</span>
                        <KeyframeButton property="x" />
                      </div>
                      <div className="bg-zinc-950/50 border border-zinc-700 rounded p-1.5 flex items-center">
                        <input 
                          type="number" 
                          value={currentValues.x}
                          onChange={(e) => updatePropertyValue('x', Number(e.target.value))}
                          className="bg-transparent w-full outline-none text-white text-right" 
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <span>Y</span>
                        <KeyframeButton property="y" />
                      </div>
                      <div className="bg-zinc-950/50 border border-zinc-700 rounded p-1.5 flex items-center">
                        <input 
                          type="number" 
                          value={currentValues.y}
                          onChange={(e) => updatePropertyValue('y', Number(e.target.value))}
                          className="bg-transparent w-full outline-none text-white text-right" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-gray-400">
                      <div className="flex items-center space-x-1">
                        <span>Rotate</span>
                        <KeyframeButton property="rotate" />
                      </div>
                      <span className="text-gray-200">{currentValues.rotate}°</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Slider 
                        value={currentValues.rotate}
                        onChange={(e) => updatePropertyValue('rotate', Number(e.target.value))}
                        min={-180} max={180} className="w-full" 
                      />
                      <div className="w-6 h-6 rounded-full border border-[#444] relative flex items-center justify-center">
                        <div className="w-0.5 h-3 bg-gray-400 absolute top-0 transform origin-bottom" style={{ transform: `rotate(${currentValues.rotate}deg)` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blend Section */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="font-semibold text-gray-300">Blend</div>
                  
                  <div className="space-y-2">
                    <span className="text-gray-400">Mode</span>
                    <select className="w-full bg-zinc-950/50 border border-zinc-700 rounded p-2 text-white outline-none">
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
                      <span className="text-gray-200">{currentValues.opacity}%</span>
                    </div>
                    <Slider normalValue={100}
                      value={currentValues.opacity}
                      onChange={(e) => updatePropertyValue('opacity', Number(e.target.value))}
                      min={0} max={100} className="w-full" 
                    />
                  </div>
                </div>
                
                {/* Canvas Section */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="font-semibold text-gray-300">Canvas</div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="accent-[#06b6d4] bg-zinc-950/50 border-zinc-700 cursor-pointer" />
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
                      <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#06b6d4]"></div>
                    </label>
                  </div>
                  <div className="text-xs text-gray-500">
                    Automatically remove background around humans or objects.
                  </div>
                  <button className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded transition-colors border border-[#444]">
                    Select Subject
                  </button>
                </div>
                <div className="space-y-4 pt-4 border-t border-zinc-800">
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
                     <Slider normalValue={0} defaultValue={0} min={0} max={100} className="w-full" />
                   </div>
                </div>
              </div>
            )}

            {activeSubTab === 'mask' && (
              <div className="space-y-4">
                 <div className="font-semibold text-gray-300">Mask Type</div>
                 <div className="grid grid-cols-3 gap-2">
                    {['None', 'Linear', 'Mirror', 'Circle', 'Rectangle', 'Heart'].map(mask => (
                      <button key={mask} className="p-2 bg-zinc-950/50 border border-zinc-700 hover:border-[#06b6d4] text-gray-400 hover:text-white rounded text-[10px] flex flex-col items-center justify-center space-y-1">
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
                      <input type="checkbox" className="accent-[#06b6d4] bg-zinc-950/50 border-zinc-700 cursor-pointer" />
                      <span className="text-gray-400">Reduce Image Noise</span>
                    </label>
                 </div>
                 <div className="space-y-4 pt-4 border-t border-zinc-800">
                   <div className="flex items-center justify-between">
                     <div className="font-semibold text-gray-300 text-sm flex items-center space-x-1">
                       <Sparkles size={14} className="text-[#06b6d4]" />
                       <span>Auto Adjust</span>
                     </div>
                     <button className="px-3 py-1 bg-[#06b6d4] text-cyan-500lack font-medium rounded">Apply</button>
                   </div>
                 </div>
              </div>
            )}

            {activeSubTab === 'adjust' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="font-semibold text-gray-300 flex items-center justify-between">
                    <span>Color Grading</span>
                    <div className="text-[#06b6d4] text-[10px] uppercase font-bold tracking-wider">Pro</div>
                  </div>
                  
                  {/* Basic Adjustments */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Temperature</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <Slider normalValue={0} defaultValue={0} min={-100} max={100} className="w-full accent-orange-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Tint</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <Slider normalValue={0} defaultValue={0} min={-100} max={100} className="w-full accent-pink-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Saturation</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <Slider normalValue={0} defaultValue={0} min={-100} max={100} className="w-full accent-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="font-semibold text-gray-300">Light</div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Brightness</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <Slider normalValue={0} defaultValue={0} min={-100} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Contrast</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <Slider normalValue={0} defaultValue={0} min={-100} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Highlights</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <Slider normalValue={0} defaultValue={0} min={-100} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Shadows</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <Slider normalValue={0} defaultValue={0} min={-100} max={100} className="w-full" />
                    </div>
                  </div>
                </div>

                {/* HSL Mock */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
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
                      <Slider normalValue={0} defaultValue={0} min={-100} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Saturation</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <Slider normalValue={0} defaultValue={0} min={-100} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Lightness</span>
                        <span className="text-gray-200">0</span>
                      </div>
                      <Slider normalValue={0} defaultValue={0} min={-100} max={100} className="w-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'audio' && (
        <div className="flex-1 overflow-y-auto min-h-0 pb-24">
          {/* Audio Sub Tabs */}
          <div className="flex space-x-4 px-4 pt-3 pb-2 border-cyan-500 border-zinc-800">
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
                      <span className="text-gray-200">{((selectedClip?.volume ?? 100) - 100).toFixed(1)} dB</span>
                    </div>
                    <Slider 
                      value={selectedClip?.volume ?? 100}
                      onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, volume: Number(e.target.value) } : c));
                        }
                      }}
                      min={-200} max={200} className="w-full" />
                  </div>
                </div>

                {/* Fade Section */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="font-semibold text-gray-300">Fade</div>
                  
                  {selectedClip && <AudioWaveformVisualizer clip={selectedClip} currentTime={currentTime} />}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Fade In</span>
                      <span className="text-gray-200">{(selectedClip?.fadeIn ?? 0).toFixed(1)}s</span>
                    </div>
                    <Slider normalValue={0}
                      value={selectedClip?.fadeIn ?? 0}
                      onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, fadeIn: Number(e.target.value) } : c));
                        }
                      }}
                      step={0.1} min={0} max={10} className="w-full" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Fade Out</span>
                      <span className="text-gray-200">{(selectedClip?.fadeOut ?? 0).toFixed(1)}s</span>
                    </div>
                    <Slider normalValue={0}
                      value={selectedClip?.fadeOut ?? 0}
                      onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, fadeOut: Number(e.target.value) } : c));
                        }
                      }}
                      step={0.1} min={0} max={10} className="w-full" />
                  </div>
                </div>

                {/* Deep AI Processing (Python Backend) */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="flex flex-col gap-2 pb-3 border-cyan-500 border-zinc-800">
                    <div className="flex flex-col">
                      <div className="font-semibold text-purple-400">Deep AI Enhance (Python)</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">True deep learning process. Might take a few seconds.</div>
                    </div>
                    <button 
                      onClick={() => handleDeepAIEnhance(selectedClip?.id)}
                      disabled={isEnhancing || selectedClip?.enhanced}
                      className={`px-4 py-2 rounded font-semibold text-sm transition-all flex items-center justify-center ${selectedClip?.enhanced ? 'bg-green-600/20 text-green-400 border border-green-500/50' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                    >
                      {isEnhancing ? `Processing AI Model (${enhanceProgress}%)...` : selectedClip?.enhanced ? 'AI Enhanced Successfully' : 'Start Deep AI Process'}
                    </button>
                    {isEnhancing && (
                      <div className="w-full bg-gray-800 rounded-full h-1 mt-1 overflow-hidden">
                        <div className="bg-purple-500 h-1 transition-all duration-300" style={{ width: `${enhanceProgress}%` }}></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Noise Reduction (Basic) */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between pb-3 border-cyan-500 border-zinc-800">
                    <div className="flex flex-col">
                      <div className="font-semibold text-[#06b6d4]">AI Semantic Isolation</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">Advanced AI to keep meaningful speech & erase all other noise</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={selectedClip?.aiIsolation ?? false} onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, aiIsolation: e.target.checked, reduceNoise: true } : c));
                        }
                      }} />
                      <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#06b6d4]"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="font-semibold text-gray-300">Vocal & Noise Control</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">Isolate human voice and reduce background noise</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={selectedClip?.reduceNoise ?? false} onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, reduceNoise: e.target.checked, vocalVolume: c.vocalVolume ?? 100, backgroundVolume: c.backgroundVolume ?? 0 } : c));
                        }
                      }} />
                      <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#06b6d4]"></div>
                    </label>
                  </div>
                  
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
                              setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, vocalVolume: Number(e.target.value), reduceNoise: true } : c));
                            }
                          }}
                          min={-200} max={200} className="w-full" />
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
                              setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, backgroundVolume: Number(e.target.value), reduceNoise: true } : c));
                            }
                          }}
                          min={-200} max={200} className="w-full" />
                      </div>
                    </div>

                  <div className="space-y-2 pt-4 border-t border-zinc-800">
                    <div className="font-semibold text-gray-300">Lyrics / Subtitles</div>
                    <textarea 
                      value={selectedClip?.lyrics || ''} 
                      onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, lyrics: e.target.value } : c));
                        }
                      }}
                      placeholder="Enter lyrics or subtitles here..."
                      className="w-full bg-zinc-950/50 border border-zinc-700 rounded p-2 text-sm text-gray-200 h-24 placeholder-gray-600 focus:outline-none focus:border-[#06b6d4]"
                    />
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
                      <Sparkles size={14} className="text-[#06b6d4]" />
                      <span>Enhance Voice</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={selectedClip?.voiceEnhance ?? false} onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, voiceEnhance: e.target.checked } : c));
                        }
                      }} />
                      <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#06b6d4]"></div>
                    </label>
                  </div>
                  <div className="text-xs text-gray-500 leading-relaxed mb-2">
                    AI automatically removes background noise and echoes to make your voice sound crisp and studio-quality.
                  </div>
                  <div className="bg-zinc-950/50 border border-[#06b6d4]/30 rounded-lg p-3 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#06b6d4]/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    
                    <div className="flex justify-between text-gray-400 text-xs">
                      <span>Intensity</span>
                      <span className="text-[#06b6d4] font-medium">{selectedClip?.enhanceIntensity ?? 85}%</span>
                    </div>
                    <Slider normalValue={85}
                      value={selectedClip?.enhanceIntensity ?? 85}
                      onChange={(e) => {
                        if (selectedClip) {
                          setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, enhanceIntensity: Number(e.target.value) } : c));
                        }
                      }}
                      min={0} max={100} className="w-full" />
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
                       <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#06b6d4]"></div>
                     </label>
                  </div>
                  
                  {/* Pre-amp */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400 text-[10px]">
                      <span>Pre-amplifier</span>
                      <span className="text-gray-200">0 dB</span>
                    </div>
                    <Slider normalValue={50} defaultValue={50} min={0} max={100} className="w-full" />
                  </div>

                  {/* 10-band EQ */}
                  <div className="flex justify-between items-end h-24 pt-2 px-1">
                    {['32', '64', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'].map((freq, i) => (
                      <div key={freq} className="flex flex-col items-center justify-end h-full">
                         <div className="relative w-[14px] md:w-4 h-20 bg-zinc-950/50 rounded-full border border-zinc-700 flex items-end p-[1px]">
                           <div className="w-full bg-[#06b6d4] rounded-full" style={{ height: `${[40, 50, 60, 45, 50, 55, 70, 65, 55, 45][i]}%` }}></div>
                           <div className="absolute w-full h-3 bg-white rounded-full shadow cursor-pointer hover:scale-110 transition-transform left-0" style={{ bottom: `calc(${[40, 50, 60, 45, 50, 55, 70, 65, 55, 45][i]}% - 6px)` }}></div>
                         </div>
                         <span className="text-[8px] text-gray-500 mt-2">{freq}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compressor */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                     <div className="font-semibold text-gray-300">Compressor</div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" />
                       <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#06b6d4]"></div>
                     </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Threshold</span><span>-20 dB</span>
                      </div>
                      <Slider normalValue={30} defaultValue={30} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Ratio</span><span>4.0:1</span>
                      </div>
                      <Slider normalValue={40} defaultValue={40} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Attack</span><span>10 ms</span>
                      </div>
                      <Slider normalValue={10} defaultValue={10} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Release</span><span>200 ms</span>
                      </div>
                      <Slider normalValue={50} defaultValue={50} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Makeup Gain</span><span>0 dB</span>
                      </div>
                      <Slider normalValue={50} defaultValue={50} min={0} max={100} className="w-full" />
                    </div>
                  </div>
                </div>

                {/* Pitch & Tempo */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="font-semibold text-gray-300">Pitch & Tempo</div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Pitch (Semitones)</span><span>0</span>
                      </div>
                      <Slider normalValue={50} defaultValue={50} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Tempo</span><span>1.0x</span>
                      </div>
                      <Slider normalValue={50} defaultValue={50} min={0} max={100} className="w-full" />
                    </div>
                  </div>
                </div>

                {/* Reverb */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                     <div className="font-semibold text-gray-300">Reverb</div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" />
                       <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#06b6d4]"></div>
                     </label>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Room Size</span><span>50%</span>
                      </div>
                      <Slider normalValue={50} defaultValue={50} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Damping</span><span>30%</span>
                      </div>
                      <Slider normalValue={30} defaultValue={30} min={0} max={100} className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Dry / Wet</span><span>40%</span>
                      </div>
                      <Slider normalValue={40} defaultValue={40} min={0} max={100} className="w-full" />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'amplifier' && (
        <div className="flex-1 overflow-y-auto min-h-0 p-4 pb-24 space-y-6">
          <div className="space-y-4">
            <div className="font-semibold text-gray-300">Amplifier</div>
            <div className="text-xs text-gray-500 mb-2">Boost audio levels without distortion.</div>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Gain</span>
                <span className="text-gray-200">+3.0 dB</span>
              </div>
              <Slider normalValue={60} defaultValue={60} min={0} max={100} className="w-full accent-[#06b6d4]" />
            </div>
            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-gray-400">
                <span>Limiter</span>
                <span className="text-gray-200">-0.5 dB</span>
              </div>
              <Slider normalValue={95} defaultValue={95} min={0} max={100} className="w-full" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'podcast' && (
        <div className="flex-1 overflow-y-auto min-h-0 p-4 pb-24 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-300 font-semibold mb-2">
              <Mic2 size={14} className="text-[#06b6d4]" />
              <span>Podcast Studio Setting</span>
            </div>
            <div className="text-xs text-gray-500 mb-4">Optimize dialogue for clear and professional voiceovers.</div>
            
            <div className="space-y-4 bg-zinc-950/50 border border-zinc-800 p-3 rounded">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Voice Isolation</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#06b6d4]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">De-esser</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#06b6d4]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'remix' && (
        <div className="flex-1 overflow-y-auto min-h-0 p-4 pb-24 space-y-6">
          <div className="space-y-4">
            <div className="font-semibold text-gray-300">Remix Editor</div>
            <div className="text-xs text-gray-500">Auto-remix track to fit the duration of your video perfectly.</div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="py-2 bg-[#06b6d4] text-cyan-500lack font-medium rounded hover:bg-[#06b6d4]/90 transition-colors">
                Auto Remix
              </button>
              <button className="py-2 bg-zinc-900 text-white font-medium rounded hover:bg-zinc-800 transition-colors border border-zinc-700">
                Extract Beats
              </button>
            </div>
            
            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-gray-400">
                <span>Pacing</span>
                <span className="text-gray-200">Standard</span>
              </div>
              <Slider normalValue={50} defaultValue={50} min={0} max={100} className="w-full" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fx' && (
        <div className="flex-1 overflow-y-auto min-h-0 p-4 pb-24 space-y-6">
          <div className="space-y-4">
            <div className="font-semibold text-gray-300">Video Effects</div>
            
            {selectedClip && selectedClip.filter && selectedClip.filter !== 'none' && (
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Intensity</span>
                  <span className="text-gray-200">{selectedClip.filterIntensity ?? 100}%</span>
                </div>
                <Slider normalValue={100}
                  value={selectedClip.filterIntensity ?? 100} 
                  min={0} 
                  max={100} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, filterIntensity: val } : c));
                  }}
                  className="w-full accent-[#06b6d4]" 
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {VIDEO_EFFECTS.map(fx => {
                const isActive = selectedClip?.filter === fx.id;
                // Preview with 100% intensity
                const previewFilter = fx.getFilter(100);
                
                return (
                  <div 
                    key={fx.id}
                    onClick={() => {
                      if (selectedClip) {
                        setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, filter: fx.id } : c));
                      }
                    }}
                    className={`aspect-video rounded relative overflow-hidden flex flex-col items-center justify-center border ${isActive ? 'border-[#06b6d4] text-[#06b6d4]' : 'border-zinc-700 text-gray-400 hover:border-[#06b6d4] hover:text-white'} cursor-pointer transition-colors text-xs font-medium`}
                  >
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=200&auto=format&fit=crop)', filter: previewFilter }}></div>
                    <span className="relative z-10 bg-black/60 px-2 py-1 rounded backdrop-blur-sm text-white">{fx.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'caption' && (
        <div className="flex-1 overflow-y-auto min-h-0 p-4 pb-24 space-y-6">
          <div className="space-y-4">
            <div className="font-semibold text-gray-300">Auto Captions</div>
            <div className="text-xs text-gray-500 mb-4">Automatically generate subtitles from the audio in your video.</div>
            <button className="w-full py-2 bg-[#06b6d4] text-cyan-500lack font-medium rounded hover:bg-[#06b6d4]/90 transition-colors">
              Generate Captions
            </button>
          </div>
        </div>
      )}

      {activeTab === 'crop' && (
        <div className="flex-1 overflow-y-auto min-h-0 p-4 pb-24 space-y-6">
          <div className="space-y-4">
            <div className="font-semibold text-gray-300">Crop & Resize</div>
            <div className="grid grid-cols-3 gap-2">
               <button className="py-2 bg-zinc-900 text-gray-400 rounded hover:text-white border border-zinc-700 hover:border-[#06b6d4]">Free</button>
               <button className="py-2 bg-zinc-900 text-gray-400 rounded hover:text-white border border-zinc-700 hover:border-[#06b6d4]">1:1</button>
               <button className="py-2 bg-zinc-900 text-gray-400 rounded hover:text-white border border-zinc-700 hover:border-[#06b6d4]">16:9</button>
               <button className="py-2 bg-zinc-900 text-gray-400 rounded hover:text-white border border-zinc-700 hover:border-[#06b6d4]">9:16</button>
               <button className="py-2 bg-zinc-900 text-gray-400 rounded hover:text-white border border-zinc-700 hover:border-[#06b6d4]">4:3</button>
               <button className="py-2 bg-zinc-900 text-gray-400 rounded hover:text-white border border-zinc-700 hover:border-[#06b6d4]">3:4</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bg' && (
        <div className="flex-1 overflow-y-auto min-h-0 p-4 pb-24 space-y-6">
          <div className="space-y-4">
            <div className="font-semibold text-gray-300">Background</div>
            <div className="grid grid-cols-4 gap-2">
               <div className="aspect-square bg-transparent rounded border border-zinc-700 flex items-center justify-center cursor-pointer text-gray-500 text-xs">None</div>
               <div className="aspect-square bg-black rounded border border-zinc-700 cursor-pointer"></div>
               <div className="aspect-square bg-white rounded border border-zinc-700 cursor-pointer"></div>
               <div className="aspect-square bg-red-500 rounded border border-zinc-700 cursor-pointer"></div>
               <div className="aspect-square bg-blue-500 rounded border border-zinc-700 cursor-pointer"></div>
               <div className="aspect-square bg-green-500 rounded border border-zinc-700 cursor-pointer"></div>
               <div className="aspect-square bg-yellow-500 rounded border border-zinc-700 cursor-pointer"></div>
               <div className="aspect-square bg-purple-500 rounded border border-zinc-700 cursor-pointer"></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'border' && (
        <div className="flex-1 overflow-y-auto min-h-0 p-4 pb-24 space-y-6">
          <div className="space-y-4">
            <div className="font-semibold text-gray-300">Border Settings</div>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Thickness</span>
                <span className="text-gray-200">0%</span>
              </div>
              <Slider normalValue={0} defaultValue={0} min={0} max={100} className="w-full accent-[#06b6d4]" />
            </div>
            <div className="pt-4 font-medium text-gray-400">Color</div>
            <div className="grid grid-cols-6 gap-2">
               <div className="aspect-square bg-white rounded-full border border-zinc-700 cursor-pointer"></div>
               <div className="aspect-square bg-black rounded-full border border-zinc-700 cursor-pointer"></div>
               <div className="aspect-square bg-red-500 rounded-full border border-zinc-700 cursor-pointer"></div>
               <div className="aspect-square bg-blue-500 rounded-full border border-zinc-700 cursor-pointer"></div>
               <div className="aspect-square bg-green-500 rounded-full border border-zinc-700 cursor-pointer"></div>
               <div className="aspect-square bg-yellow-500 rounded-full border border-zinc-700 cursor-pointer"></div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'text' && isText && (
        <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
          <div className="space-y-2">
            <span className="text-gray-400">Content</span>
            <textarea 
               value={selectedClip?.content || ''}
               onChange={(e) => {
                 setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, content: e.target.value } : c));
               }}
               className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded p-2 text-white resize-none focus:outline-none focus:border-cyan-500"
               placeholder="Enter text..."
            />
          </div>
          <div className="space-y-2">
            <span className="text-gray-400">Color</span>
            <input 
               type="color" 
               value={selectedClip?.color || '#ffffff'}
               onChange={(e) => {
                 setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, color: e.target.value } : c));
               }}
               className="w-full h-8 bg-zinc-950 border border-zinc-800 rounded cursor-pointer"
            />
          </div>
        </div>
      )}
      {activeTab === 'speed' && (
        <div className="flex-1 overflow-y-auto min-h-0 pb-24">
          <div className="flex space-x-4 px-4 pt-3 pb-2 border-cyan-500 border-zinc-800">
            {['Normal', 'Curve'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveSpeedTab(tab.toLowerCase())}
                className={`transition-colors ${
                  activeSpeedTab === tab.toLowerCase() ? 'text-white font-medium border-cyan-500-2 border-[#06b6d4] pb-1' : 'text-gray-500 hover:text-gray-300 pb-1'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-6">
            {activeSpeedTab === 'normal' && (
              <div className="space-y-4">
                {selectedClip && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Times</span>
                      <span className="text-gray-200">{(selectedClip.playbackRate || 1).toFixed(1)}x</span>
                    </div>
                    <div className="relative w-full py-2">
                      <Slider 
                        value={((Math.log10(Math.max(0.1, Math.min(10, selectedClip.playbackRate || 1))) + 1) / 2) * 100} 
                        min={0} 
                        max={100} 
                        step={1}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          const logVal = (val / 100) * 2 - 1;
                          let rate = Math.pow(10, logVal);
                          if (Math.abs(rate - 1.0) < 0.15) rate = 1.0;
                          if (rate < 0.11) rate = 0.1;
                          if (rate > 9.9) rate = 10.0;
                          
                          setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, playbackRate: rate, speedCurve: 'None' } : c));
                        }}
                        className="w-full accent-[#06b6d4] relative z-10 bg-transparent" 
                      />
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full cursor-pointer z-20 hover:scale-150 transition-transform shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                        style={{ left: `50%`, transform: 'translate(-50%, -50%)' }}
                        title="Reset to 1.0x"
                        onClick={() => {
                          setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, playbackRate: 1, speedCurve: 'None' } : c));
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-gray-400">Duration</span>
                  <div className="bg-zinc-950/50 border border-zinc-700 rounded px-2 py-1 text-white">
                    {selectedClip ? `00:${Math.floor((selectedClip.duration / 20) / (selectedClip.playbackRate || 1)).toString().padStart(2, '0')}.${Math.floor(((selectedClip.duration / 20) / (selectedClip.playbackRate || 1) % 1) * 10)}s` : '00:00.0s'}
                  </div>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer pt-2">
                  <input type="checkbox" className="accent-[#06b6d4] bg-zinc-950/50 border-zinc-700 cursor-pointer" />
                  <span className="text-gray-400">Pitch tracking</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer pt-1">
                  <input type="checkbox" className="accent-[#06b6d4] bg-zinc-950/50 border-zinc-700 cursor-pointer" />
                  <span className="text-gray-400">Smooth slow-mo</span>
                </label>
              </div>
            )}

            {activeSpeedTab === 'curve' && (
              <div className="space-y-4">
                {selectedClip && (
                  <InteractiveSpeedGraph 
                    clip={selectedClip} 
                    onChange={(points) => {
                      setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, customSpeedPoints: points, speedCurve: 'Custom' } : c));
                    }} 
                  />
                )}
                <div className="grid grid-cols-3 gap-2">
                  {['None', 'Custom', 'Montage', 'Hero', 'Bullet', 'Jump Cut'].map(curve => (
                    <button 
                      key={curve} 
                      onClick={() => {
                        if (selectedClip) {
                          const points = SPEED_PRESETS[curve] ? [...SPEED_PRESETS[curve].map(p => ({...p}))] : undefined;
                          setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, speedCurve: curve, playbackRate: 1, customSpeedPoints: points } : c));
                        }
                      }}
                      className={`p-2 bg-zinc-950/50 border ${selectedClip?.speedCurve === curve ? 'border-[#06b6d4] text-[#06b6d4]' : 'border-zinc-700 hover:border-[#06b6d4] text-gray-400 hover:text-white'} rounded text-[10px] flex flex-col items-center justify-center space-y-1`}
                    >
                      <div className="w-8 h-4 border-cyan-500 border-current opacity-50 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-current to-transparent opacity-20"></div>
                      </div>
                      <span>{curve}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'animation' && (
        <div className="flex-1 overflow-y-auto min-h-0 pb-24">
          <div className="flex space-x-4 px-4 pt-3 pb-2 border-cyan-500 border-zinc-800">
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
                  <div className="w-full aspect-square rounded bg-zinc-950/50 border border-zinc-700 group-hover:border-[#06b6d4] mb-1.5 flex items-center justify-center transition-colors">
                    <div className="w-6 h-6 bg-zinc-800 group-hover:bg-[#06b6d4]/50 rounded-sm"></div>
                  </div>
                  <span className="text-[10px] text-gray-400 group-hover:text-white">{anim}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t border-zinc-800">
              <div className="flex justify-between text-gray-400 text-xs">
                <span>Duration</span>
                <span className="text-gray-200">0.5s</span>
              </div>
              <Slider normalValue={50} defaultValue={50} min={0} max={100} className="w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
