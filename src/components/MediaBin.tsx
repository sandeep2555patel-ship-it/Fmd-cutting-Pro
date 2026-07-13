import { TabType } from '../types';
import { Plus, Folder, Search, X, Sparkles, Type } from 'lucide-react';
import { useState } from 'react';
import { useProject } from '../context';

interface MediaBinProps {
  activeTab: TabType;
  isMobile?: boolean;
  onClose?: () => void;
}

const ALL_AUDIO = [
  // Trending
  { name: 'Sigma Male Grindset', type: 'Music', cat: 'Trending', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/sigma-male-grindset.mp3') },
  { name: 'Monkeys Spinning Monkeys', type: 'Music', cat: 'Trending', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/monkeys-spinning-monkeys.mp3') },
  { name: 'Directed by Robert Weide', type: 'Memes', cat: 'Trending', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/directed-by-robert-b_NqaQZOV.mp3') },
  { name: 'Vine Boom', type: 'Memes', cat: 'Trending', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/vine-boom.mp3') },

  // Long BGM
  { name: 'SoundHelix Song 1 (6 min)', type: 'Music', cat: 'Long BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3') },
  { name: 'SoundHelix Song 2 (7 min)', type: 'Music', cat: 'Long BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3') },
  { name: 'SoundHelix Song 4 (5 min)', type: 'Music', cat: 'Long BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3') },
  { name: 'SoundHelix Song 8 (5 min)', type: 'Music', cat: 'Long BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3') },
  { name: 'SoundHelix Song 13 (6 min)', type: 'Music', cat: 'Long BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3') },
  { name: 'SoundHelix Song 15 (7 min)', type: 'Music', cat: 'Long BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3') },
  { name: 'SoundHelix Song 16 (6 min)', type: 'Music', cat: 'Long BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3') },
  
  // BGM

  { name: 'Monkeys Spinning Monkeys', type: 'Music', cat: 'BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/monkeys-spinning-monkeys.mp3') },
  { name: 'Sneaky Snitch', type: 'Music', cat: 'BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/sneaky-snitch.mp3') },
  { name: 'Fluffing a Duck', type: 'Music', cat: 'BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/fluffing-a-duck.mp3') },
  { name: 'Sigma Male Grindset', type: 'Music', cat: 'BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/sigma-male-grindset.mp3') },
  { name: 'Enthusiast', type: 'Music', cat: 'BGM', url: '/api/proxy-audio?url=' + encodeURIComponent('https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3') },

  // SFX
  { name: 'Mouse Click', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/mouse-click.mp3') },
  { name: 'Keyboard Typing', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/keyboard-typing.mp3') },
  { name: 'Subscribe Bell', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/bell.mp3') },
  { name: 'Fast Whoosh', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/swoosh.mp3') },
  { name: 'Record Scratch', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/record-scratch.mp3') },
  { name: 'Punch Hit', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/punch.mp3') },
  { name: 'Suspense Reveal', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/suspense.mp3') },
  { name: 'Cash Register', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/cash-register.mp3') },
  { name: 'Dun Dun Dunnn', type: 'SFX', cat: 'SFX', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/dun-dun-dun-dunnnnn.mp3') },

  // Memes
  { name: 'Spongebob 2 Hours Later', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/2-hours-later.mp3') },
  { name: 'Amogus (Among Us)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/among-us-role-reveal-sound.mp3') },
  { name: 'Minecraft Oof', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/minecraft-death-sound.mp3') },
  { name: 'Baka Mitai (Dame Da Ne)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/baka-mitai.mp3') },
  { name: 'Nokia Arabic Ringtone', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/nokia-arabic-ringtone.mp3') },
  { name: 'Aw Shit, Here we go again', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/gta-san-andreas-ah-shit-here-we-go-again.mp3') },
  { name: 'Megalovania', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/megalovania.mp3') },
  { name: 'Curb Your Enthusiasm', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/curb-your-enthusiasm-theme-song.mp3') },
  { name: 'Roundabout (To Be Continued)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/yes-roundabout-to-be-continued.mp3') },
  { name: 'Mission Failed We will Get Em Next Time', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/mission-failed-well-get-em-next-time.mp3') },
  { name: 'Coffin Dance (Astronomia)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/astronomia-coffin-dance.mp3') },

  { name: 'Vine Boom', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/vine-boom.mp3') },
  { name: 'Directed by Robert Weide', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/directed-by-robert-b_NqaQZOV.mp3') },
  { name: 'Bruh Meme', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/movie_1.mp3') },
  { name: 'Oh No Meme', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/oh-no-meme.mp3') },
  { name: 'Fart Sound', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/fart-meme-sound.mp3') },
  { name: 'Wow! (Anime)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/anime-wow-sound-effect.mp3') },
  { name: 'Wah Wah Wah (Fail)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/sad-trombone.mp3') },
  { name: 'Nani?', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/nani_3.mp3') },
  { name: 'FBI Open Up', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/fbi-open-up-sfx.mp3') },
  { name: 'Illuminati Confirmed', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/illuminati-confirmed.mp3') },
  { name: 'Run (AWOLNATION)', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/run-vine-sound-effect_1.mp3') },
  { name: 'A Few Moments Later', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/a-few-moments-later.mp3') },
  { name: 'Nope', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/engineer_no01_1.mp3') },
  { name: 'Cricket Chirp', type: 'Memes', cat: 'Memes', url: '/api/proxy-audio?url=' + encodeURIComponent('https://www.myinstants.com/media/sounds/crickets.mp3') },
];

export default function MediaBin({ activeTab, isMobile, onClose }: MediaBinProps) {
  const [audioCategory, setAudioCategory] = useState('Trending');
  const [searchAudioQuery, setSearchAudioQuery] = useState('');
  const { state, setClips, setMediaLibrary } = useProject();
  const { clips, mediaLibrary } = state;
  const [isGenerating, setIsGenerating] = useState(false);
  const [captionLanguage, setCaptionLanguage] = useState('English');

  const handleGenerateCaptions = async () => {
    setIsGenerating(true);
    
    // Find the first video or audio clip
    const mediaClips = clips.filter(c => (c.type === 'video' || c.type === 'audio') && c.url).sort((a, b) => a.start - b.start);
    if (mediaClips.length === 0) {
      setIsGenerating(false);
      alert("No video or audio with source URL found to generate captions.");
      return;
    }
    
    const clip = mediaClips[0]; // take the first media clip

    try {
        const response = await fetch(clip.url);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append("media", blob, "media.mp4");
        formData.append("language", captionLanguage);

        const apiRes = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
        });

        if (!apiRes.ok) {
            throw new Error(`API error: ${apiRes.statusText}`);
        }

        const data = await apiRes.json();
        
        if (data.subtitles && data.subtitles.length > 0) {
            const newClips = clips.map(c => ({ ...c, selected: false }));
            const captionClips = data.subtitles.map((sub: any, i: number) => {
                const start = sub.start * 10;
                const end = sub.end * 10;
                const duration = Math.max(10, end - start);
                return {
                  id: `c${Date.now()}_${i}`,
                  trackId: 't1',
                  start: clip.start + start, // Relative to clip's start on timeline
                  duration: duration,
                  name: `Caption ${i + 1}`,
                  type: 'text',
                  content: sub.text,
                  color: '#ffffff',
                  bg: '#f59e0b',
                  selected: i === 0,
                  y: '80%' // Set near bottom
                };
            });
            
            setClips([...newClips, ...captionClips]);
        } else {
            alert("No speech detected.");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to generate captions. Check console for details.");
    } finally {
        setIsGenerating(false);
        onClose?.();
    }
  };

  const handleAddSticker = (emoji: string) => {
    const newClips = clips.map(c => ({ ...c, selected: false }));
    setClips([...newClips, {
      id: `c${Date.now()}`,
      trackId: 't1', // text track
      start: 50,
      duration: 100,
      name: `Sticker ${emoji}`,
      bg: '#f59e0b',
      selected: true
    }]);
    onClose?.();
  };

  const handleAddFilter = (name: string) => {
    const newClips = clips.map(c => ({ ...c, selected: false }));
    setClips([...newClips, {
      id: `c${Date.now()}`,
      trackId: 'v1', 
      start: 0,
      duration: 200,
      name: `Filter: ${name}`,
      bg: '#d946ef',
      selected: true
    }]);
    onClose?.();
  };

  const handleAddTransition = (name: string) => {
    const newClips = clips.map(c => ({ ...c, selected: false }));
    setClips([...newClips, {
      id: `c${Date.now()}`,
      trackId: 'v2', 
      start: 130,
      duration: 40,
      name: `Trans: ${name}`,
      bg: '#8b5cf6',
      selected: true
    }]);
    onClose?.();
  };

  const handleAddText = (name: string) => {
    const newClips = clips.map(c => ({ ...c, selected: false }));
    setClips([...newClips, {
      id: `c${Date.now()}`,
      trackId: 't1', 
      start: state.currentTime,
      duration: 150,
      name: `Text: ${name}`,
      type: 'text',
      content: name,
      color: '#ffffff',
      bg: '#f59e0b',
      selected: true
    }]);
    onClose?.();
  };

  return (
    <div className={`${isMobile ? 'w-full flex-1' : 'w-[320px]'} flex-shrink-0 bg-[#181818] md:border-r border-[#222] flex flex-col`}>
      <div className="h-12 border-b border-[#222] flex items-center justify-between px-4 flex-shrink-0">
        <h2 className="font-semibold text-sm capitalize">{activeTab}</h2>
        {isMobile && (
          <button onClick={onClose} className="p-1 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:text-cyan-400 transition-colors">
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
            <label className="w-full flex flex-col items-center justify-center py-8 border border-dashed border-[#444] rounded-lg text-gray-400 hover:bg-zinc-900 hover:text-white transition-all mb-4 cursor-pointer">
              <input type="file" className="hidden" accept="video/*,audio/*,image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                try {
                  const url = URL.createObjectURL(file);
                  const type = file.type.startsWith('video/') ? 'video' : file.type.startsWith('audio/') ? 'audio' : 'image';
                  
                  if (type === 'video' || type === 'audio') {
                    const mediaEl = document.createElement(type);
                    mediaEl.src = url;
                    mediaEl.onloadedmetadata = () => {
                      const newMedia = {
                        id: `m${Date.now()}`,
                        name: file.name,
                        url: url,
                        type: type as 'video'|'audio'|'image',
                        duration: mediaEl.duration
                      };
                      setMediaLibrary(prev => [newMedia, ...prev]);
                    };
                  } else {
                    const newMedia = {
                      id: `m${Date.now()}`,
                      name: file.name,
                      url: url,
                      type: 'image',
                      duration: 5 // Default 5s for images
                    };
                    setMediaLibrary(prev => [newMedia, ...prev]);
                  }
                  
                  e.target.value = ''; // reset file input
                } catch (err) {
                  console.error('Local import failed', err);
                  alert('Local import failed');
                }
              }} />
              <Plus size={24} className="mb-2 text-[#2fe4b9]" />
              <span className="text-xs">Import</span>
            </label>

            <div className="flex items-center justify-between text-xs text-gray-400 mb-3 px-1">
              <span>Project Media ({mediaLibrary.length})</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {mediaLibrary.map((media, i) => (
                <div key={media.id} onClick={() => {
                  const newClips = clips.map(c => ({ ...c, selected: false }));
                  const targetTrackId = media.type === 'audio' ? 'a1' : 'v2';
                  const trackClips = clips.filter(c => c.trackId === targetTrackId);
                  const lastClip = trackClips.sort((a, b) => (b.start + b.duration) - (a.start + a.duration))[0];
                  const newStart = lastClip ? lastClip.start + lastClip.duration : 0;
                  const durationPixels = media.duration ? media.duration * 10 : 100;
                  
                  setClips([...newClips, {
                    id: `c${Date.now()}`,
                    trackId: targetTrackId, 
                    start: newStart,
                    duration: durationPixels,
                    name: media.name,
                    bg: media.type === 'audio' ? '#10b981' : '#3b82f6',
                    selected: true,
                    type: media.type,
                    url: media.url
                  }]);
                  onClose?.();
                }} className="group relative aspect-video bg-zinc-900 rounded overflow-hidden border border-[#333] hover:border-[#444] cursor-pointer">
                  {media.type === 'video' ? (
                     <video src={media.url} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  ) : media.type === 'image' ? (
                     <img src={media.url} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  ) : (
                     <div className="absolute inset-0 bg-gradient-to-tr from-[#1E6C54] to-[#0f172a] opacity-80 flex items-center justify-center text-[#2fe4b9]/50"><Folder size={24} /></div>
                  )}
                  <div className="absolute top-1 left-1 bg-black/60 px-1 py-0.5 rounded text-[8px] text-white truncate max-w-[90%] z-10">
                    {media.name}
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black/70 px-1 rounded text-[10px] z-10">
                    {media.type}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity z-20">
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
                className="w-full bg-zinc-950 border border-[#333] rounded px-8 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            {/* Filter Categories Sidebar */}
            <div className="w-24 border-r border-[#222] overflow-y-auto no-scrollbar py-2 text-sm">
              {['Trending', 'Instagram', 'Snapchat', 'Portrait', 'Retro', 'Cinema', 'Vlog', 'Food', 'Nature', 'B&W'].map((cat, i) => (
                <button 
                  key={cat} 
                  className={`w-full text-left px-3 py-2 hover:bg-zinc-900 transition-colors ${i === 0 ? 'text-white font-medium bg-zinc-950' : 'text-gray-500'}`}
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
                <div key={transition} onClick={() => handleAddTransition(transition)} className="flex flex-col items-center group cursor-pointer bg-zinc-950 p-2 border border-[#333] rounded hover:border-[#2fe4b9] transition-colors">
                  <div className="w-full aspect-video rounded bg-zinc-900 border border-[#333] group-hover:border-transparent flex items-center justify-center mb-2 overflow-hidden relative">
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
           
           <div className="border border-[#2fe4b9]/50 rounded-lg p-4 bg-zinc-950/80 space-y-2 cursor-pointer hover:border-[#2fe4b9] transition-all relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#2fe4b9]/10 rounded-full blur-xl group-hover:bg-[#2fe4b9]/20 transition-all pointer-events-none"></div>
             <div className="font-semibold text-sm text-white flex items-center space-x-2">
               <Sparkles size={14} className="text-[#2fe4b9]" />
               <span>Auto Captions</span>
             </div>
             <div className="text-gray-400 text-[10px] leading-relaxed mb-2">
               Use AI to automatically recognize speech and generate accurate text captions for your video.
             </div>
             <div className="flex space-x-2 mb-2">
               <button onClick={(e) => { e.stopPropagation(); setCaptionLanguage('English'); }} className={`flex-1 py-1 text-[10px] rounded border ${captionLanguage === 'English' ? 'border-[#2fe4b9] text-[#2fe4b9] bg-[#2fe4b9]/10' : 'border-zinc-700 text-gray-400'}`}>English</button>
               <button onClick={(e) => { e.stopPropagation(); setCaptionLanguage('Hindi'); }} className={`flex-1 py-1 text-[10px] rounded border ${captionLanguage === 'Hindi' ? 'border-[#2fe4b9] text-[#2fe4b9] bg-[#2fe4b9]/10' : 'border-zinc-700 text-gray-400'}`}>Hindi</button>
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
                <div key={preset} onClick={() => handleAddText(preset)} className="p-3 bg-zinc-900 hover:bg-[#2a2a2a] border border-[#333] hover:border-[#444] rounded cursor-pointer transition-all flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 rounded bg-zinc-950 flex items-center justify-center font-bold text-gray-500">
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
                className="w-full bg-zinc-950 border border-[#333] rounded px-8 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            {/* Sticker Categories Sidebar */}
            <div className="w-20 border-r border-[#222] overflow-y-auto no-scrollbar py-2">
              {['Trending', 'Emojis', 'Vlog', 'Reaction', 'Arrow', 'Shape', 'Subscribe', 'Love', 'Festival'].map((cat, i) => (
                <button 
                  key={cat} 
                  className={`w-full text-left px-3 py-2 hover:bg-zinc-900 transition-colors ${i === 0 ? 'text-white font-medium bg-zinc-950' : 'text-gray-500'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Sticker Items */}
            <div className="flex-1 p-3 overflow-y-auto grid grid-cols-3 gap-2 align-baseline content-start">
              {['🔥', '✨', '❤️', '😂', '👍', '🎉', '💯', '🚀', '😍', '⭐', '🙌', '😎', '💡', '🏆', '🎵', '💥', '👻', '👀'].map((emoji, i) => (
                <div key={i} onClick={() => handleAddSticker(emoji)} className="flex flex-col items-center group cursor-pointer">
                  <div className="w-full aspect-square rounded bg-zinc-950 border border-[#333] group-hover:border-[#2fe4b9] mb-1.5 flex items-center justify-center transition-colors text-3xl">
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
                value={searchAudioQuery}
                onChange={(e) => setSearchAudioQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-8 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            {/* Audio Categories Sidebar */}
            <div className="w-20 border-r border-[#222] overflow-y-auto no-scrollbar py-2">
              {['Trending', 'Long BGM', 'BGM', 'Memes', 'SFX', 'My Music'].map((cat, i) => (
                <button 
                  key={cat} 
                  onClick={() => setAudioCategory(cat)}
                  className={`w-full text-left px-3 py-2 hover:bg-zinc-900 transition-colors ${audioCategory === cat ? 'text-cyan-400 font-medium bg-zinc-950/50 border-r-2 border-cyan-400' : 'text-zinc-500'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Audio Items */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              
              {audioCategory === 'My Music' ? (
                 <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-zinc-800 rounded-lg hover:border-cyan-400 hover:bg-cyan-950/20 transition-colors cursor-pointer text-zinc-400 hover:text-cyan-400">
                    <Plus size={24} className="mb-2" />
                    <span>Upload from Device</span>
                    <input 
                       type="file" 
                       accept="audio/*" 
                       className="hidden" 
                       onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            const audio = new Audio(url);
                            audio.onloadedmetadata = () => {
                               const newClips = clips.map(c => ({ ...c, selected: false }));
                               setClips([...newClips, {
                                 id: `c${Date.now()}`, trackId: 'a1', start: state.currentTime, 
                                 duration: audio.duration * 10 || 3600, name: file.name, bg: '#10b981', 
                                 selected: true, type: 'audio', url
                               }]);
                               onClose?.();
                            };
                          }
                       }} 
                    />
                 </label>
              ) : (
                ALL_AUDIO.filter(a => a.cat === audioCategory && a.name.toLowerCase().includes(searchAudioQuery.toLowerCase())).map((audio, i) => (

                <div 
                  key={i} 
                  onClick={() => {
                    const newClips = clips.map(c => ({ ...c, selected: false }));
                    const audioEl = new Audio(audio.url);
                    const addAudio = (dur) => {
                      setClips([...newClips, {
                        id: `c${Date.now()}`, trackId: 'a1', start: state.currentTime, 
                        duration: dur, name: audio.name, bg: '#10b981', 
                        selected: true, type: 'audio', url: audio.url
                      }]);
                      onClose?.();
                    };
                    
                    audioEl.onloadedmetadata = () => {
                      if (audioEl.duration && audioEl.duration !== Infinity) {
                        addAudio(audioEl.duration * 10);
                      } else {
                        addAudio(audio.cat === 'Long BGM' ? 7200 : (audio.type === 'Music' ? 3600 : 150));
                      }
                    };
                    audioEl.onerror = () => addAudio(audio.cat === 'Long BGM' ? 7200 : (audio.type === 'Music' ? 3600 : 150));
                  }}
                  className="flex items-center space-x-3 p-2 bg-zinc-950 border border-[#333] hover:border-[#2fe4b9] rounded group cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center flex-shrink-0 text-[#2fe4b9]">
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
              ))
              )}
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
                className="w-full bg-zinc-950 border border-[#333] rounded px-8 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
              />
            </div>
          </div>
          <div className="flex flex-1 overflow-hidden">
            {/* Effect Categories Sidebar */}
            <div className="w-20 border-r border-[#222] overflow-y-auto no-scrollbar py-2">
              {['Trending', 'Video', 'Body', 'Photo', 'Lens', 'Distortion', 'Retro', 'Color'].map((cat, i) => (
                <button 
                  key={cat} 
                  className={`w-full text-left px-3 py-2 hover:bg-zinc-900 transition-colors ${i === 0 ? 'text-white font-medium bg-zinc-950' : 'text-gray-500'}`}
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
                  <div className={`w-full aspect-square rounded-lg bg-zinc-950 mb-1.5 flex items-center justify-center relative overflow-hidden ring-1 ring-[#333] group-hover:ring-[#2fe4b9] transition-all`}>
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
                className="w-full bg-zinc-950 border border-[#333] rounded px-8 py-1.5 text-xs text-white focus:outline-none focus:border-[#444]"
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
