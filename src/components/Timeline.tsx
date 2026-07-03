import { MousePointer2, Scissors, Trash2, Copy, Eye, EyeOff, Lock, Unlock, Mic, ZoomIn, ZoomOut, Volume2, Music, Type, Image, Film } from 'lucide-react';
import { useState } from 'react';
import { useProject } from '../context';

const TRACKS = [
  { id: 't1', name: 'Text', type: 'text', icon: Type, color: '#A86624', isMuted: false, isLocked: false },
  { id: 'v1', name: 'Sticker/PiP', type: 'video', icon: Image, color: '#6D3A8A', isMuted: false, isLocked: false },
  { id: 'v2', name: 'Main Track', type: 'video', icon: Film, color: '#2B547E', isMuted: false, isLocked: false },
  { id: 'a1', name: 'Music', type: 'audio', icon: Music, color: '#1E6C54', isMuted: false, isLocked: false },
];

export default function Timeline() {
  const { state: { clips }, setClips } = useProject();
  const [zoom, setZoom] = useState(30);

  const handleClipClick = (clipId: string) => {
    setClips(clips.map(clip => ({
      ...clip,
      selected: clip.id === clipId
    })));
  };

  return (
    <div className="h-[40vh] min-h-[200px] bg-[#121212] border-t border-[#222] flex flex-col flex-shrink-0 relative z-10">
      {/* Timeline Toolbar */}
      <div className="h-10 bg-[#181818] border-b border-[#222] flex items-center justify-between px-2 md:px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1 md:space-x-2 md:border-r border-[#333] md:pr-4 flex-shrink-0">
          <button className="p-1.5 bg-[#2a2a2a] rounded text-[#2fe4b9]" title="Select (V)">
            <MousePointer2 size={14} />
          </button>
          <button className="p-1.5 hover:bg-[#2a2a2a] rounded text-gray-400 hover:text-white transition-colors" title="Split (B)">
            <Scissors size={14} />
          </button>
          <button className="p-1.5 hover:bg-[#2a2a2a] rounded text-gray-400 hover:text-white transition-colors" title="Delete (Del)">
            <Trash2 size={14} />
          </button>
          <button className="p-1.5 hover:bg-[#2a2a2a] rounded text-gray-400 hover:text-white transition-colors" title="Copy (Ctrl+C)">
            <Copy size={14} />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <button className="hover:text-white" onClick={() => setZoom(Math.max(10, zoom - 10))}><ZoomOut size={14} /></button>
            <input type="range" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} min={10} max={100} className="w-24" />
            <button className="hover:text-white" onClick={() => setZoom(Math.min(100, zoom + 10))}><ZoomIn size={14} /></button>
          </div>
        </div>
      </div>

      {/* Fixed Playhead (Moved outside scrolling area) */}
      <div className="absolute top-[40px] bottom-0 w-[2px] bg-white z-30 pointer-events-none left-[40px] md:left-[50px] ml-[50%] md:ml-[30%]">
        <div className="absolute top-0 -left-[5px] w-3 h-3 bg-white pointer-events-auto cursor-ew-resize rounded-b-sm flex items-center justify-center">
          <div className="w-[1px] h-1.5 bg-black"></div>
        </div>
      </div>

      {/* Tracks Area */}
      <div className="flex-1 overflow-auto relative">
        <div className="flex w-[2040px] md:w-[2050px] min-h-full">
          
          {/* Track Headers (Left sidebar) */}
          <div className="w-[40px] md:w-[50px] flex-shrink-0 bg-[#181818] border-r border-[#222] flex flex-col z-20 sticky left-0">
            <div className="h-6 border-b border-[#333] sticky top-0 bg-[#181818] z-30"></div> {/* Empty space for time ruler */}
            <div className="flex flex-col">
              {TRACKS.map(track => (
                <div key={track.id} className="h-16 border-b border-[#222] flex items-center justify-center relative flex-shrink-0">
                  <span className="w-6 h-6 rounded bg-[#222] flex items-center justify-center font-bold text-[#888] text-xs shadow-inner">
                    <track.icon size={14} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tracks Content (Right scrolling area) */}
          <div 
            className="flex-1 relative flex flex-col"
            onClick={() => setClips(clips.map(c => ({ ...c, selected: false })))}
          >
            
            {/* Time Ruler */}
            <div className="h-6 border-b border-[#333] sticky top-0 bg-[#111] z-10 flex items-end">
              {/* Generating mock ruler marks */}
              <div className="w-full h-full flex items-end" style={{ background: 'repeating-linear-gradient(to right, #333 0px, #333 1px, transparent 1px, transparent 100px)' }}>
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-[100px] flex-shrink-0 text-[9px] text-gray-500 pl-1 pb-0.5">
                    00:00:{i * 5 < 10 ? '0' + i * 5 : i * 5}:00
                  </div>
                ))}
              </div>
            </div>

            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none mt-6" style={{ background: 'repeating-linear-gradient(to right, #222 0px, #222 1px, transparent 1px, transparent 100px)' }}></div>

            {/* Tracks Wrapper */}
            <div className="w-full flex flex-col relative">
            {TRACKS.map((track, i) => {
              const trackClips = clips.filter(c => c.trackId === track.id);
              
              return (
                <div key={track.id} className="h-16 border-b border-[#222]/50 relative w-full">
                  {/* Empty state placeholders for specific tracks */}
                  {trackClips.length === 0 && track.id === 't1' && (
                    <div className="absolute left-2 top-2 bottom-2 w-48 bg-[#2A2A2A] rounded-sm flex items-center px-3 text-[11px] text-[#888] cursor-pointer border border-[#333] hover:bg-[#333]">
                      Tap to add subtitle
                    </div>
                  )}
                  {trackClips.length === 0 && track.id === 'v1' && (
                    <div className="absolute left-2 top-2 bottom-2 w-48 bg-[#2A2A2A] rounded-sm flex items-center px-3 text-[11px] text-[#888] cursor-pointer border border-[#333] hover:bg-[#333]">
                      Tap to add sticker / PiP
                    </div>
                  )}
                  {trackClips.length === 0 && track.id === 'a1' && (
                    <div className="absolute left-2 top-2 bottom-2 w-48 bg-[#2A2A2A] rounded-sm flex items-center px-3 text-[11px] text-[#888] cursor-pointer border border-[#333] hover:bg-[#333]">
                      Tap to add music
                    </div>
                  )}

                  {trackClips.length === 0 && track.id === 'v2' && (
                    <div className="absolute left-2 top-2 bottom-2 w-48 bg-[#2A2A2A] rounded-sm flex items-center px-3 text-[11px] text-[#888] cursor-pointer border border-[#333] hover:bg-[#333]">
                      Tap to add video
                    </div>
                  )}

                  {/* Render clips for this track */}
                  {trackClips.map(clip => (
                  <div 
                    key={clip.id}
                    onClick={(e) => { e.stopPropagation(); handleClipClick(clip.id); }}
                    className={`absolute top-1 bottom-1 flex items-center text-[11px] font-medium text-white cursor-pointer select-none overflow-hidden ${
                      clip.selected ? 'border-y-[3px] border-[#FFC800] z-20' : 'opacity-85 hover:opacity-100 rounded-sm z-10'
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
                        <div className="absolute -left-3 top-[-3px] bottom-[-3px] w-3 bg-white cursor-ew-resize rounded-l-sm border-y-[3px] border-l-[3px] border-[#FFC800] flex items-center justify-center z-20">
                          <span className="text-black text-[14px] leading-none -ml-[1px]">+</span>
                        </div>
                        <div className="absolute -right-3 top-[-3px] bottom-[-3px] w-3 bg-white cursor-ew-resize rounded-r-sm border-y-[3px] border-r-[3px] border-[#FFC800] flex items-center justify-center z-20">
                          <span className="text-black text-[14px] leading-none -mr-[1px]">+</span>
                        </div>
                      </>
                    )}
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
