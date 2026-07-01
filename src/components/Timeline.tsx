import { MousePointer2, Scissors, Trash2, Copy, Eye, EyeOff, Lock, Unlock, Mic, ZoomIn, ZoomOut, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { useProject } from '../context';

const TRACKS = [
  { id: 't1', name: 'Text', type: 'text', icon: 'T', color: '#A86624', isMuted: false, isLocked: false },
  { id: 'v2', name: 'Main Track', type: 'video', icon: 'V', color: '#2B547E', isMuted: false, isLocked: false },
  { id: 'v1', name: 'Overlay', type: 'video', icon: 'V', color: '#6D3A8A', isMuted: true, isLocked: false },
  { id: 'a1', name: 'Audio', type: 'audio', icon: 'A', color: '#1E6C54', isMuted: false, isLocked: true },
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
    <div className="h-[35vh] min-h-[250px] bg-[#121212] border-t border-[#222] flex flex-col flex-shrink-0 relative z-10">
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

      {/* Tracks Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Track Headers (Left sidebar) */}
        <div className="w-[80px] md:w-[140px] flex-shrink-0 bg-[#181818] border-r border-[#222] flex flex-col z-20">
          <div className="h-6 border-b border-[#333]"></div> {/* Empty space for time ruler */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {TRACKS.map(track => (
              <div key={track.id} className="h-16 border-b border-[#222] flex flex-col justify-center px-1 md:px-2 py-1 relative group">
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                  <div className="flex items-center space-x-1">
                    <span className="w-4 h-4 rounded bg-[#222] flex items-center justify-center font-bold text-[#888]">{track.icon}</span>
                    <span className="truncate w-10 md:w-16 hidden md:inline-block">{track.name}</span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    {track.isLocked ? <Lock size={12} className="text-[#2fe4b9]" /> : <Unlock size={12} />}
                    {track.isMuted ? <EyeOff size={12} className="text-red-400" /> : <Eye size={12} />}
                  </div>
                </div>
                {track.type === 'audio' && (
                  <div className="flex items-center space-x-1 text-[10px] text-gray-500">
                    <Volume2 size={10} />
                    <input type="range" className="w-12 h-1" defaultValue={100} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tracks Content (Right scrolling area) */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden bg-[#111] relative">
          
          {/* Time Ruler */}
          <div className="h-6 border-b border-[#333] sticky top-0 bg-[#111] z-10 flex items-end">
            {/* Generating mock ruler marks */}
            <div className="w-[2000px] h-full flex items-end" style={{ background: 'repeating-linear-gradient(to right, #333 0px, #333 1px, transparent 1px, transparent 100px)' }}>
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-[100px] flex-shrink-0 text-[9px] text-gray-500 pl-1 pb-0.5">
                  00:00:{i * 5 < 10 ? '0' + i * 5 : i * 5}:00
                </div>
              ))}
            </div>
          </div>

          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(to right, #222 0px, #222 1px, transparent 1px, transparent 100px)' }}></div>

          {/* Playhead */}
          <div className="absolute top-0 bottom-0 w-[1px] bg-[#2fe4b9] z-30 pointer-events-none" style={{ left: '320px' }}>
            <div className="absolute top-0 -left-[4.5px] w-2.5 h-3 bg-[#2fe4b9] pointer-events-auto cursor-ew-resize rounded-b-sm">
              <div className="absolute top-1 left-[4px] w-[1px] h-1.5 bg-[#111]"></div>
            </div>
          </div>

          {/* Tracks Wrapper */}
          <div className="w-[2000px] relative">
            {TRACKS.map((track, i) => (
              <div key={track.id} className="h-16 border-b border-[#222]/50 relative" style={{ top: `${i * 64}px`, position: 'absolute', width: '100%' }}>
                {/* Render clips for this track */}
                {clips.filter(c => c.trackId === track.id).map(clip => (
                  <div 
                    key={clip.id}
                    onClick={() => handleClipClick(clip.id)}
                    className={`absolute top-1.5 bottom-1.5 rounded flex items-center px-2 text-[10px] text-white truncate cursor-pointer select-none transition-all ${clip.bg} ${
                      clip.selected ? 'ring-1 ring-white/80 ring-offset-1 ring-offset-[#111] z-10 brightness-110' : 'opacity-90 hover:opacity-100 hover:brightness-110'
                    }`}
                    style={{ left: `${clip.start}px`, width: `${clip.duration}px` }}
                  >
                    {clip.name}
                    
                    {/* Simulated trim handles */}
                    {clip.selected && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-white/20 cursor-ew-resize rounded-l"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/20 cursor-ew-resize rounded-r"></div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
