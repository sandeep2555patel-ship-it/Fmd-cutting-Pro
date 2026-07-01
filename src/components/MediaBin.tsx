import { TabType } from '../types';
import { Plus, Folder, Search, X, Sparkles, Type } from 'lucide-react';
import { useState } from 'react';
import { useProject } from '../context';

interface MediaBinProps {
  activeTab: TabType;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function MediaBin({ activeTab, isMobile, onClose }: MediaBinProps) {
  const { state: { clips }, setClips } = useProject();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCaptions = () => {
    setIsGenerating(true);
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      setClips([...clips, {
        id: `c${Date.now()}`,
        trackId: 't1',
        start: 0,
        duration: 350,
        name: 'Auto Captions',
        bg: '#A86624',
        selected: true
      }]);
    }, 2000);
  };

  const handleAddSticker = (emoji: string) => {
    setClips([...clips, {
      id: `c${Date.now()}`,
      trackId: 't1', // text track
      start: 50,
      duration: 100,
      name: `Sticker ${emoji}`,
      bg: '#A86624',
      selected: true
    }]);
  };

  const handleAddFilter = (name: string) => {
    setClips([...clips, {
      id: `c${Date.now()}`,
      trackId: 'v1', 
      start: 0,
      duration: 200,
      name: `Filter: ${name}`,
      bg: '#6D3A8A',
      selected: true
    }]);
  };

  const handleAddTransition = (name: string) => {
    setClips([...clips, {
      id: `c${Date.now()}`,
      trackId: 'v2', 
      start: 130,
      duration: 40,
      name: `Trans: ${name}`,
      bg: '#2B547E',
      selected: true
    }]);
  };

  const handleAddText = (name: string) => {
    setClips([...clips, {
      id: `c${Date.now()}`,
      trackId: 't1', 
      start: 0,
      duration: 150,
      name: `Text: ${name}`,
      bg: '#A86624',
      selected: true
    }]);
  };

  return (
    <div className={`${isMobile ? 'w-full flex-1' : 'w-[320px]'} flex-shrink-0 bg-[#181818] md:border-r border-[#222] flex flex-col`}>
      <div className="h-12 border-b border-[#222] flex items-center justify-between px-4 flex-shrink-0">
        <h2 className="font-semibold text-sm capitalize">{activeTab}</h2>
        {isMobile && (
          <button onClick={onClose} className="p-1 bg-[#222] rounded-full text-gray-400 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>
      
      {activeTab === 'media' && (
        <>
          <div className="flex border-b border-[#222] text-xs">
            <button className="flex-1 py-2 font-medium border-b-2 border-[#2fe4b9] text-white">Local</button>
            <button className="flex-1 py-2 font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-300">Space</button>
            <button className="flex-1 py-2 font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-300">Library</button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <button className="w-full flex flex-col items-center justify-center py-8 border border-dashed border-[#444] rounded-lg text-gray-400 hover:bg-[#222] hover:text-white transition-all mb-4">
              <Plus size={24} className="mb-2 text-[#2fe4b9]" />
              <span className="text-xs">Import</span>
            </button>

            <div className="flex items-center justify-between text-xs text-gray-400 mb-3 px-1">
              <span>Project Media (5)</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'For Bigger Blazes', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
                { name: 'Big Buck Bunny', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
                { name: 'Elephants Dream', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
                { name: 'Tears of Steel', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
                { name: 'Sintel', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' }
              ].map((video, i) => (
                <div key={i} onClick={() => {
                  setClips([...clips, {
                    id: `c${Date.now()}`,
                    trackId: 'v2', 
                    start: clips.length * 50,
                    duration: 120,
                    name: video.name,
                    bg: '#2B547E',
                    selected: true,
                    type: 'video',
                    url: video.url
                  }]);
                }} className="group relative aspect-video bg-[#222] rounded overflow-hidden border border-[#333] hover:border-[#444] cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1a365d] to-[#0f172a] opacity-80" />
                  <div className="absolute top-1 left-1 bg-black/60 px-1 py-0.5 rounded text-[8px] text-white truncate max-w-[90%]">
                    {video.name}
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black/70 px-1 rounded text-[10px]">
                    00:0{i + 3}:12
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                    <Plus size={20} className="text-white drop-shadow" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'filters' && (
        <div className="flex-1 flex flex-col text-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-[#222] flex-shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search filters..." 
                className="w-full bg-[#111] border border-[#333] rounded px-8 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            {/* Filter Categories Sidebar */}
            <div className="w-20 border-r border-[#222] overflow-y-auto no-scrollbar py-2">
              {['Trending', 'Instagram', 'Snapchat', 'Portrait', 'Retro', 'Cinema', 'Vlog', 'Food', 'Nature', 'B&W'].map((cat, i) => (
                <button 
                  key={cat} 
                  className={`w-full text-left px-3 py-2 hover:bg-[#222] transition-colors ${i === 0 ? 'text-white font-medium bg-[#111]' : 'text-gray-500'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Filter Items */}
            <div className="flex-1 p-3 overflow-y-auto grid grid-cols-3 gap-2 align-baseline content-start">
              {[
                { name: 'Paris', app: 'Insta', color: 'from-pink-300 to-orange-300' },
                { name: 'Clarendon', app: 'Insta', color: 'from-blue-400 to-cyan-300' },
                { name: 'Gingham', app: 'Insta', color: 'from-yellow-100 to-amber-200' },
                { name: 'Puppy Dog', app: 'Snap', color: 'from-amber-700 to-orange-900' },
                { name: 'Flower Crown', app: 'Snap', color: 'from-pink-400 to-purple-400' },
                { name: 'Anime Style', app: 'CapCut', color: 'from-blue-500 to-purple-600' },
                { name: 'Glitch', app: 'CapCut', color: 'from-green-400 to-blue-500' },
                { name: 'Cyberpunk', app: 'CapCut', color: 'from-fuchsia-600 to-cyan-500' },
                { name: 'Vintage', app: 'CapCut', color: 'from-yellow-700 to-orange-800' },
                { name: 'Film 35mm', app: 'Retro', color: 'from-gray-600 to-gray-800' },
                { name: 'Monochrome', app: 'B&W', color: 'from-gray-300 to-gray-500' },
                { name: 'Clear', app: 'Vlog', color: 'from-sky-200 to-blue-300' }
              ].map((filter, i) => (
                <div key={i} onClick={() => handleAddFilter(filter.name)} className="flex flex-col items-center group cursor-pointer">
                  <div className={`w-full aspect-square rounded-lg bg-gradient-to-br ${filter.color} mb-1.5 relative overflow-hidden ring-1 ring-[#333] group-hover:ring-[#2fe4b9] transition-all`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute top-1 left-1 bg-black/60 px-1 py-0.5 rounded text-[8px] text-white">
                      {filter.app}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 group-hover:text-white truncate w-full text-center">{filter.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transitions' && (
        <div className="flex-1 flex flex-col text-xs overflow-hidden">
          <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto">
             {['Fade', 'Slide', 'Dissolve', 'Wipe', 'Zoom', 'Blur', 'Push', 'Spin', 'Iris', 'Cross Zoom'].map(transition => (
                <div key={transition} onClick={() => handleAddTransition(transition)} className="flex flex-col items-center group cursor-pointer bg-[#111] p-2 border border-[#333] rounded hover:border-[#2fe4b9] transition-colors">
                  <div className="w-full aspect-video rounded bg-[#222] border border-[#333] group-hover:border-transparent flex items-center justify-center mb-2 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#333] to-[#111] opacity-50 group-hover:animate-pulse"></div>
                    <Sparkles className="text-gray-500 group-hover:text-[#2fe4b9] z-10" size={16} />
                  </div>
                  <span className="text-gray-400 group-hover:text-white text-[10px] font-medium">{transition}</span>
                </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'text' && (
        <div className="flex-1 flex flex-col text-xs p-4 space-y-4 overflow-y-auto">
           <button onClick={() => handleAddText('Default Text')} className="w-full py-3 bg-[#2fe4b9] hover:bg-[#28cba5] text-black font-semibold rounded transition-colors flex items-center justify-center space-x-2">
             <Plus size={16} />
             <span>Add Default Text</span>
           </button>
           
           <div className="border border-[#2fe4b9]/50 rounded-lg p-4 bg-[#111]/80 space-y-2 cursor-pointer hover:border-[#2fe4b9] transition-all relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#2fe4b9]/10 rounded-full blur-xl group-hover:bg-[#2fe4b9]/20 transition-all pointer-events-none"></div>
             <div className="font-semibold text-sm text-white flex items-center space-x-2">
               <Sparkles size={14} className="text-[#2fe4b9]" />
               <span>Auto Captions</span>
             </div>
             <div className="text-gray-400 text-[10px] leading-relaxed">
               Use AI to automatically recognize speech and generate accurate text captions for your video.
             </div>
             <button 
               onClick={handleGenerateCaptions}
               disabled={isGenerating}
               className="mt-2 text-black bg-[#2fe4b9] hover:bg-[#28cba5] disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full py-2 rounded flex items-center justify-center space-x-1 transition-colors"
             >
               {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                    <span>Generating...</span>
                  </>
               ) : (
                  <span>Generate Now</span>
               )}
             </button>
           </div>
           
           <div className="space-y-2 pt-2 border-t border-[#222]">
             <div className="font-semibold text-gray-400 mb-2">Presets</div>
             {['Title', 'Subtitle', 'Lower Third', 'Credit'].map(preset => (
                <div key={preset} onClick={() => handleAddText(preset)} className="p-3 bg-[#222] hover:bg-[#2a2a2a] border border-[#333] hover:border-[#444] rounded cursor-pointer transition-all flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 rounded bg-[#111] flex items-center justify-center font-bold text-gray-500">
                    <Type size={14} />
                  </div>
                  <span>{preset}</span>
                </div>
             ))}
           </div>
        </div>
      )}

      {activeTab === 'stickers' && (
        <div className="flex-1 flex flex-col text-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-[#222] flex-shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search stickers..." 
                className="w-full bg-[#111] border border-[#333] rounded px-8 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            {/* Sticker Categories Sidebar */}
            <div className="w-20 border-r border-[#222] overflow-y-auto no-scrollbar py-2">
              {['Trending', 'Emojis', 'Vlog', 'Reaction', 'Arrow', 'Shape', 'Subscribe', 'Love', 'Festival'].map((cat, i) => (
                <button 
                  key={cat} 
                  className={`w-full text-left px-3 py-2 hover:bg-[#222] transition-colors ${i === 0 ? 'text-white font-medium bg-[#111]' : 'text-gray-500'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Sticker Items */}
            <div className="flex-1 p-3 overflow-y-auto grid grid-cols-3 gap-2 align-baseline content-start">
              {['🔥', '✨', '❤️', '😂', '👍', '🎉', '💯', '🚀', '😍', '⭐', '🙌', '😎', '💡', '🏆', '🎵', '💥', '👻', '👀'].map((emoji, i) => (
                <div key={i} onClick={() => handleAddSticker(emoji)} className="flex flex-col items-center group cursor-pointer">
                  <div className="w-full aspect-square rounded bg-[#111] border border-[#333] group-hover:border-[#2fe4b9] mb-1.5 flex items-center justify-center transition-colors text-3xl">
                    {emoji}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audio' && (
        <div className="flex-1 flex flex-col text-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-[#222] flex-shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search audio..." 
                className="w-full bg-[#111] border border-[#333] rounded px-8 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            {/* Audio Categories Sidebar */}
            <div className="w-20 border-r border-[#222] overflow-y-auto no-scrollbar py-2">
              {['Trending', 'Pop', 'Memes', 'Vlog', 'Chill', 'Beats', 'Travel', 'SFX', 'Ambient'].map((cat, i) => (
                <button 
                  key={cat} 
                  className={`w-full text-left px-3 py-2 hover:bg-[#222] transition-colors ${i === 0 ? 'text-white font-medium bg-[#111]' : 'text-gray-500'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Audio Items */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {[
                { name: 'Enthusiast', type: 'Music', url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3' },
                { name: 'Piano Loop', type: 'Music', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=piano-loop-1-97217.mp3' },
                { name: 'Electronic Future', type: 'Music', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf589.mp3?filename=electronic-future-beats-117997.mp3' },
                { name: 'Cinematic Whoosh', type: 'SFX', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_249ae51a37.mp3?filename=cinematic-whoosh-1-71172.mp3' },
                { name: 'Nature Forest', type: 'SFX', url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_3d1f3b0e35.mp3?filename=forest-nature-sounds-87621.mp3' },
                { name: 'Meme Click', type: 'SFX', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_b200b2e8cd.mp3?filename=click-button-140881.mp3' },
                { name: 'Bruh Meme', type: 'Memes', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b82ecce1.mp3?filename=error-126627.mp3' },
                { name: 'Oh No Meme', type: 'Memes', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c2ebf0c3a2.mp3?filename=fail-144746.mp3' }
              ].map((audio, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    setClips([...clips, {
                      id: `c${Date.now()}`,
                      trackId: 'a1', 
                      start: clips.length * 20,
                      duration: 300,
                      name: audio.name,
                      bg: '#1E6C54',
                      selected: true,
                      type: 'audio',
                      url: audio.url
                    }]);
                  }}
                  className="flex items-center space-x-3 p-2 bg-[#111] border border-[#333] hover:border-[#2fe4b9] rounded group cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-[#222] flex items-center justify-center flex-shrink-0 text-[#2fe4b9]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-200 font-medium truncate group-hover:text-white">{audio.name}</div>
                    <div className="text-gray-500 text-[10px]">00:0{i + 1}:30 • {audio.type}</div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 p-1 text-[#2fe4b9] transition-opacity">
                    <Plus size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'effects' && (
        <div className="flex-1 flex flex-col text-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-[#222] flex-shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search effects..." 
                className="w-full bg-[#111] border border-[#333] rounded px-8 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            {/* Effect Categories Sidebar */}
            <div className="w-20 border-r border-[#222] overflow-y-auto no-scrollbar py-2">
              {['Trending', 'Video', 'Body', 'Photo', 'Lens', 'Distortion', 'Retro', 'Color'].map((cat, i) => (
                <button 
                  key={cat} 
                  className={`w-full text-left px-3 py-2 hover:bg-[#222] transition-colors ${i === 0 ? 'text-white font-medium bg-[#111]' : 'text-gray-500'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Effect Items */}
            <div className="flex-1 p-3 overflow-y-auto grid grid-cols-3 gap-2 align-baseline content-start">
              {[
                { name: 'Shake', icon: '〰️' },
                { name: 'Halo Blur', icon: '✨' },
                { name: 'Flash', icon: '⚡' },
                { name: 'Edge Glow', icon: '🌟' },
                { name: 'Glitch', icon: '📺' },
                { name: 'VHS', icon: '📼' },
                { name: 'Chromatic', icon: '🌈' },
                { name: 'Fisheye', icon: '👁️' },
                { name: 'Zoom', icon: '🔍' },
                { name: 'Ripple', icon: '💧' },
                { name: 'Mirror', icon: '🪞' },
                { name: 'Pixelate', icon: '👾' },
              ].map((effect, i) => (
                <div key={i} onClick={() => handleAddFilter(effect.name)} className="flex flex-col items-center group cursor-pointer">
                  <div className={`w-full aspect-square rounded-lg bg-[#111] mb-1.5 flex items-center justify-center relative overflow-hidden ring-1 ring-[#333] group-hover:ring-[#2fe4b9] transition-all`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2fe4b9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">{effect.icon}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 group-hover:text-white truncate w-full text-center">{effect.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'media' && activeTab !== 'filters' && activeTab !== 'transitions' && activeTab !== 'text' && activeTab !== 'stickers' && activeTab !== 'audio' && activeTab !== 'effects' && (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
          <div className="text-xs mb-4 w-full px-4">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2 text-gray-500" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                className="w-full bg-[#111] border border-[#333] rounded px-8 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center opacity-50">
            <Folder size={32} className="mb-2" />
            <span className="text-xs">Select resources to preview</span>
          </div>
        </div>
      )}
    </div>
  );
}
