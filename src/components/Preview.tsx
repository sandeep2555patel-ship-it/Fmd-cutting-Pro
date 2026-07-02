import { Play, Pause, SkipBack, SkipForward, Maximize, Minus, Plus, Music } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useProject } from '../context';

export default function Preview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { state: { clips } } = useProject();
  
  const selectedClip = clips.find(c => c.selected);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying) {
      const v = videoRef.current;
      const a = audioRef.current;
      if (v) v.play().catch(() => setIsPlaying(false));
      if (a) a.play().catch(() => setIsPlaying(false));
    } else {
      videoRef.current?.pause();
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  return (
    <div className="flex-1 bg-[#111] flex flex-col border-r border-[#222]">
      {/* Viewport */}
      <div className="flex-1 flex items-center justify-center p-4 bg-black relative">
        {/* Mock Video Container */}
        <div className="relative aspect-video w-full max-w-3xl bg-[#1e1e1e] border border-[#222] shadow-2xl flex items-center justify-center overflow-hidden">
          {selectedClip?.type === 'video' && selectedClip.url ? (
            <video 
              ref={videoRef}
              src={selectedClip.url} 
              className="w-full h-full object-contain"
              loop
              controls={false}
            />
          ) : selectedClip?.type === 'audio' && selectedClip.url ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Music size={48} className="text-[#2fe4b9] animate-pulse" />
              <div className="text-gray-300 font-medium">{selectedClip.name}</div>
              <audio ref={audioRef} src={selectedClip.url} loop />
            </div>
          ) : selectedClip?.type === 'text' ? (
            <div className="text-5xl font-bold text-white drop-shadow-lg">{selectedClip.name}</div>
          ) : (
            <img 
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200" 
              alt="Preview" 
              className="w-full h-full object-cover opacity-80"
            />
          )}
          
          <div className="absolute inset-0 pointer-events-none ring-1 ring-[#2fe4b9]/30"></div>
          
          {/* Mock Transform Box overlay */}
          <div className="absolute inset-20 border border-[#2fe4b9] pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-[#2fe4b9] rounded-full"></div>
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-[#2fe4b9] rounded-full"></div>
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-[#2fe4b9] rounded-full"></div>
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-[#2fe4b9] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-12 bg-[#181818] border-t border-[#222] flex items-center justify-between px-2 md:px-4">
        <div className="text-[10px] md:text-xs font-mono text-[#2fe4b9] hidden md:block">
          00:00:12:05 <span className="text-gray-500">/ 00:01:24:15</span>
        </div>
        
        <div className="flex items-center space-x-3 md:space-x-4 mx-auto md:mx-0">
          <button className="p-1.5 text-gray-400 hover:text-white transition-colors">
            <SkipBack size={18} fill="currentColor" />
          </button>
          <button 
            className="text-white hover:text-[#2fe4b9] transition-colors p-1"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white transition-colors">
            <SkipForward size={18} fill="currentColor" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3 text-gray-400">
          <div className="hidden md:flex items-center space-x-1 text-xs bg-[#111] px-2 py-1 rounded border border-[#333]">
            <Minus size={14} className="hover:text-white cursor-pointer" />
            <span className="w-8 text-center">Fit</span>
            <Plus size={14} className="hover:text-white cursor-pointer" />
          </div>
          <button className="p-1 hover:text-white transition-colors md:ml-2">
            <Maximize size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
