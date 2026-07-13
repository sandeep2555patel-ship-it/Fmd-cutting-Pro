import { MousePointer2, Eye, EyeOff, Lock, Unlock, Music, Type, Image, Film } from 'lucide-react';
import { useState } from 'react';
import { useProject } from '../context';

const TRACKS = [
  { id: 'a1', name: 'Music', type: 'audio', icon: Music, color: '#2a2a2a', isMuted: false, isLocked: false },
  { id: 't1', name: 'Text', type: 'text', icon: Type, color: '#2a2a2a', isMuted: false, isLocked: false },
  { id: 'v1', name: 'Sticker/PiP', type: 'video', icon: Image, color: '#2a2a2a', isMuted: false, isLocked: false },
  { id: 'v2', name: 'Main Track', type: 'video', icon: Film, color: '#2a2a2a', isMuted: false, isLocked: false },
];

export default function Timeline() {
  const { state, setClips, setCurrentTime } = useProject();
  const { clips } = state;
  const [zoom, setZoom] = useState(30);

  const maxClipEnd = Math.max(...clips.map(c => c.start + c.duration), 0);
  const minWidthPixels = 10800 * 20; // 3 hours at 20px/s
  const timelineWidth = Math.max(minWidthPixels, maxClipEnd + 1000);
  const totalMarks = Math.ceil(timelineWidth / 100);

  const selectedClip = clips.find(c => c.selected);

  const handleClipClick = (clipId: string) => {
    setClips(clips.map(clip => ({
      ...clip,
      selected: clip.id === clipId
    })));
  };

  return (
    <div className="h-[40%] min-h-[250px] md:min-h-[280px] bg-zinc-950/80 backdrop-blur-xl flex flex-col flex-shrink-0 relative z-10 border-t border-zinc-800">
      {/* Tracks Area */}
      <div className="flex-1 overflow-auto relative no-scrollbar">
        <div className="flex min-w-max min-h-full">

          
          {/* Track Headers (Left sidebar) */}
          <div className="w-[40px] md:w-[50px] flex-shrink-0 bg-zinc-900/90 border-r border-zinc-800 flex flex-col z-20 sticky left-0">
            <div className="h-6 border-b border-zinc-800 sticky top-0 bg-zinc-900/90 z-30"></div> {/* Empty space for time ruler */}
            <div className="flex flex-col pb-8">
              {TRACKS.map(track => {
                const heightClass = 'h-12';
                return (
                  <div key={track.id} className={`${heightClass} border-b border-zinc-800 flex items-center justify-center relative flex-shrink-0 bg-zinc-900/90`}>
                    <span className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center font-bold text-[#888] text-xs shadow-inner">
                      <track.icon size={16} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracks Content (Right scrolling area) */}
          <div 
            className="flex-1 relative flex flex-col min-h-max"
            onMouseDown={() => {
              setClips(clips => clips.map(c => ({ ...c, selected: false })));
            }}
            onTouchStart={() => {
              setClips(clips => clips.map(c => ({ ...c, selected: false })));
            }}
          >
            {/* Movable Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,1)] z-40 pointer-events-auto cursor-ew-resize"
              style={{ left: `${state.currentTime}px`, touchAction: 'none' }}
              onMouseDown={(e) => {
                e.stopPropagation();
                const startX = e.clientX;
                const startTime = state.currentTime;
                
                const onMouseMove = (moveEvent: MouseEvent) => {
                  const deltaX = moveEvent.clientX - startX;
                  const newTime = Math.max(0, startTime + deltaX);
                  setCurrentTime(newTime);
                };
                
                const onMouseUp = () => {
                  window.removeEventListener('mousemove', onMouseMove);
                  window.removeEventListener('mouseup', onMouseUp);
                };
                
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                const startX = e.touches[0].clientX;
                const startTime = state.currentTime;
                
                const onTouchMove = (moveEvent: TouchEvent) => {
                  const deltaX = moveEvent.touches[0].clientX - startX;
                  const newTime = Math.max(0, startTime + deltaX);
                  setCurrentTime(newTime);
                };
                
                const onTouchEnd = () => {
                  window.removeEventListener('touchmove', onTouchMove);
                  window.removeEventListener('touchend', onTouchEnd);
                };
                
                window.addEventListener('touchmove', onTouchMove, { passive: false });
                window.addEventListener('touchend', onTouchEnd);
              }}
            >
              {/* Invisible hit area for the line to make it easier to grab */}
              <div className="absolute inset-y-0 -left-[15px] w-[32px] bg-transparent"></div>
              {/* Top Handle */}
              <div className="absolute -top-[2px] -left-[6px] w-[14px] h-[16px] drop-shadow-md pointer-events-none">
                 <svg viewBox="0 0 14 16" fill="#06b6d4" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 2C0 0.895431 0.895431 0 2 0H12C13.1046 0 14 0.89543 14 2V10L7 16L0 10V2Z" />
                 </svg>
              </div>
            </div>
            
            {/* Time Ruler */}
            <div className="h-6 border-b border-zinc-800 sticky top-0 bg-zinc-950/90 z-10 flex items-end">
              {/* Generating mock ruler marks */}
              <div className="h-full flex items-end" style={{ width: timelineWidth, background: 'repeating-linear-gradient(to right, #444 0px, #444 1px, transparent 1px, transparent 10px)' }}>
                {Array.from({ length: totalMarks }).map((_, i) => (
                  <div key={i} className="w-[100px] flex-shrink-0 text-[10px] text-gray-400 pl-1 pb-[2px] font-medium leading-none border-l border-white relative -left-[1px] h-2">
                    <span className="absolute -top-3 left-1">{i * 10}s</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none mt-6" style={{ width: timelineWidth, background: 'repeating-linear-gradient(to right, #222 0px, #222 1px, transparent 1px, transparent 100px)' }}></div>

            {/* Tracks Wrapper */}
            <div className="flex flex-col relative pb-8" style={{ width: timelineWidth }}>
            {TRACKS.map((track, i) => {
              const trackClips = clips.filter(c => c.trackId === track.id);
              const heightClass = 'h-12';
              
              return (
                <div key={track.id} className={`${heightClass} border-b border-zinc-800/50 relative w-full`}>
                  {/* Empty state placeholders for specific tracks */}
                  {trackClips.length === 0 && track.id === 't1' && (
                    <div 
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        window.dispatchEvent(new CustomEvent('open-media-bin', { detail: 'text' }));
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 px-3 bg-zinc-800/80 rounded flex items-center text-[10px] font-medium text-gray-400 cursor-pointer border border-white/5 hover:bg-zinc-800 z-10 transition-colors"
                    >
                      <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center mr-2 text-white text-xs">+</span>
                      Tap to add subtitle
                    </div>
                  )}
                  {trackClips.length === 0 && track.id === 'v1' && (
                    <div 
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        window.dispatchEvent(new CustomEvent('open-media-bin', { detail: 'stickers' }));
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 px-3 bg-zinc-800/80 rounded flex items-center text-[10px] font-medium text-gray-400 cursor-pointer border border-white/5 hover:bg-zinc-800 z-10 transition-colors"
                    >
                      <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center mr-2 text-white text-xs">+</span>
                      Tap to add sticker/PIP
                    </div>
                  )}
                  {trackClips.length === 0 && track.id === 'a1' && (
                    <div 
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        window.dispatchEvent(new CustomEvent('open-media-bin', { detail: 'audio' }));
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 px-3 bg-zinc-800/80 rounded flex items-center text-[10px] font-medium text-gray-400 cursor-pointer border border-white/5 hover:bg-zinc-800 z-10 transition-colors"
                    >
                      <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center mr-2 text-white text-xs">+</span>
                      Tap to add music
                    </div>
                  )}

                  {trackClips.length === 0 && track.id === 'v2' && (
                    <label 
                      onPointerDown={(e) => e.stopPropagation()}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 px-3 bg-zinc-800/80 rounded flex items-center text-[10px] font-medium text-gray-400 cursor-pointer border border-white/5 hover:bg-zinc-800 z-10 transition-colors"
                    >
                      <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center mr-2 text-white text-xs">+</span>
                      Tap to add video
                      <input 
                        type="file" 
                        accept="video/*,image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            const isVideo = file.type.startsWith('video/');
                            
                            if (isVideo) {
                              const video = document.createElement('video');
                              video.preload = 'metadata';
                              video.onloadedmetadata = () => {
                                setClips(prev => [...prev.map(c => ({...c, selected: false})), {
                                  id: `video_${Date.now()}`, name: file.name, type: 'video',
                                  start: state.currentTime, duration: video.duration * 10 || 100, trackId: 'v2', selected: true, url
                                }]);
                              };
                              video.src = url;
                            } else {
                              setClips(prev => [...prev.map(c => ({...c, selected: false})), {
                                id: `image_${Date.now()}`, name: file.name, type: 'image',
                                start: state.currentTime, duration: 50, trackId: 'v2', selected: true, url
                              }]);
                            }
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                  )}

                  {/* Render clips for this track */}
                  {trackClips.map(clip => (
                  <div 
                    key={clip.id}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleClipClick(clip.id);
                      
                      const startX = e.clientX;
                      const startClipX = clip.start;
                      
                      let isDraggingAllowed = false;
                      const holdTimer = setTimeout(() => {
                        isDraggingAllowed = true;
                      }, 1000);
                      
                      const onMouseMove = (moveEvent: MouseEvent) => {
                        if (!isDraggingAllowed) return;
                        const deltaX = moveEvent.clientX - startX;
                        const newStart = Math.max(0, startClipX + deltaX);
                        setClips(prevClips => prevClips.map(c => c.id === clip.id ? { ...c, start: newStart } : c));
                      };
                      
                      const onMouseUp = () => {
                        clearTimeout(holdTimer);
                        window.removeEventListener('mousemove', onMouseMove);
                        window.removeEventListener('mouseup', onMouseUp);
                      };
                      
                      window.addEventListener('mousemove', onMouseMove);
                      window.addEventListener('mouseup', onMouseUp);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handleClipClick(clip.id);
                      
                      const startX = e.touches[0].clientX;
                      const startClipX = clip.start;
                      
                      let isDraggingAllowed = false;
                      const holdTimer = setTimeout(() => {
                        isDraggingAllowed = true;
                      }, 1000);
                      
                      const onTouchMove = (moveEvent: TouchEvent) => {
                        if (!isDraggingAllowed) return;
                        const deltaX = moveEvent.touches[0].clientX - startX;
                        const newStart = Math.max(0, startClipX + deltaX);
                        setClips(prevClips => prevClips.map(c => c.id === clip.id ? { ...c, start: newStart } : c));
                      };
                      
                      const onTouchEnd = () => {
                        clearTimeout(holdTimer);
                        window.removeEventListener('touchmove', onTouchMove);
                        window.removeEventListener('touchend', onTouchEnd);
                      };
                      
                      window.addEventListener('touchmove', onTouchMove, { passive: false });
                      window.addEventListener('touchend', onTouchEnd);
                    }}
                    className={`absolute top-1 bottom-1 flex items-center text-[11px] font-medium text-white cursor-pointer select-none overflow-hidden ${
                      clip.selected ? 'border-y-[3px] border-cyan-400 z-20' : 'opacity-85 hover:opacity-100 rounded-sm z-10'
                    }`}
                    style={{ left: `${clip.start}px`, width: `${clip.duration}px`, backgroundColor: clip.bg || '#333' }}
                  >
                    <span className="truncate drop-shadow-md px-2 z-10">{clip.name}</span>
                    
                    {clip.type === 'video' && clip.url && (
                      <div className="absolute inset-0 pointer-events-none flex opacity-80" style={{ backgroundImage: `url(${clip.url})`, backgroundSize: 'cover', backgroundRepeat: 'repeat-x' }}>
                         {/* Optional text or time overlay can go here */}
                         <div className="absolute bottom-0 left-0 bg-black/60 px-1 text-[8px]">{clip.duration / 10}s</div>
                      </div>
                    )}
                    
                    {clip.type === 'audio' && (
                      <div className="absolute inset-0 opacity-40 pointer-events-none flex items-center px-1 overflow-hidden">
                         <div className="w-full h-full" style={{ background: `url("data:image/svg+xml,%3Csvg width='10' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='5' width='2' height='10' fill='white' /%3E%3Crect x='4' y='2' width='2' height='16' fill='white' /%3E%3Crect x='7' y='7' width='2' height='6' fill='white' /%3E%3C/svg%3E") repeat-x center` }}></div>
                      </div>
                    )}

                    {/* VN Editor style trim handles */}
                    {clip.selected && (
                      <>
                        <div className="absolute -left-3 top-[-3px] bottom-[-3px] w-3 bg-cyan-50 cursor-ew-resize rounded-l-sm border-y-[3px] border-l-[3px] border-cyan-400 flex items-center justify-center z-20">
                          <span className="text-black text-[14px] leading-none -ml-[1px]">+</span>
                        </div>
                        <div className="absolute -right-3 top-[-3px] bottom-[-3px] w-3 bg-cyan-50 cursor-ew-resize rounded-r-sm border-y-[3px] border-r-[3px] border-cyan-400 flex items-center justify-center z-20">
                          <span className="text-black text-[14px] leading-none -mr-[1px]">+</span>
                        </div>
                      </>
                    )}

                    {/* Render keyframes */}
                    {clip.keyframes && clip.keyframes.map((kf, index) => (
                      <div 
                        key={index}
                        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border border-black bg-cyan-400 shadow-sm z-30"
                        style={{ left: `${kf.time}px`, transform: 'translate(-50%, -50%) rotate(45deg)' }}
                      />
                    ))}
                  </div>
                ))}
                {/* Render Transition Buttons */}
                {track.id === 'v2' && trackClips.map((clip, idx) => (
                  <div key={`trans-${clip.id}`} className="absolute top-[50%] -mt-[10px] w-[20px] h-[20px] bg-white rounded-sm shadow-md flex items-center justify-center cursor-pointer z-30 border border-[#ddd] hover:bg-[#eee]" style={{ left: `${clip.start + clip.duration - 10}px` }}>
                    <span className="text-black text-lg leading-none">+</span>
                  </div>
                ))}
              </div>
            );
          })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
