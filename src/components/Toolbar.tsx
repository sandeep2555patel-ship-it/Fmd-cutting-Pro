import React from 'react';
import { useProject } from '../context';
import { 
  RefreshCcw, Music, Mic, Volume2, Scissors, Wand2, Gauge, AudioWaveform, 
  Type, PlaySquare, Crop, RotateCw, FlipHorizontal, FlipVertical, Maximize, 
  Image, Square, Snowflake, History, ZoomIn, Diamond, Sliders, Lock, Copy, Trash2, Layers
, Undo2, Redo2 } from 'lucide-react';

const ToolbarButton = ({ icon: Icon, label, onClick, disabled }: { icon: any, label: string, onClick?: () => void, disabled?: boolean }) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      if (!disabled) onClick?.();
    }}
    disabled={disabled}
    className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors group flex-shrink-0 ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#2a2a2a] cursor-pointer'}`}
  >
    <Icon size={20} className="text-gray-300 group-hover:text-white mb-1" />
    <span className="text-[9px] text-gray-400 group-hover:text-gray-200">{label}</span>
  </button>
);

export default function Toolbar() {
  const { state: { clips, currentTime }, setClips, setActivePropertiesTab, setShowProperties, undo, redo, canUndo, canRedo } = useProject();
  const selectedClip = clips.find(c => c.selected);

  const handleDuplicate = () => {
    if (!selectedClip) return;
    const newClip = {
      ...selectedClip,
      id: `${selectedClip.type}_${Date.now()}`,
      start: selectedClip.start + selectedClip.duration,
      selected: true
    };
    setClips(clips => clips.map(c => ({ ...c, selected: false })));
    setClips((prev) => [...prev, newClip]);
  };

  const handleDelete = () => {
    if (!selectedClip) return;
    setClips(clips => clips.filter(c => c.id !== selectedClip.id));
  };

  const handleRotate = () => {
    if (!selectedClip) return;
    setClips(clips => clips.map(c => c.id === selectedClip.id ? { ...c, baseRotate: ((c.baseRotate || 0) + 90) % 360 } : c));
  };

  const handleMirror = () => {
    if (!selectedClip) return;
    setClips(clips => clips.map(c => c.id === selectedClip.id ? { ...c, flipX: !c.flipX } : c));
  };

  const handleFlip = () => {
    if (!selectedClip) return;
    setClips(clips => clips.map(c => c.id === selectedClip.id ? { ...c, flipY: !c.flipY } : c));
  };

  const handleFitFill = () => {
    if (!selectedClip) return;
    setClips(clips => clips.map(c => c.id === selectedClip.id ? { ...c, fit: !c.fit } : c));
  };

  const handleLayer = () => {
    if (!selectedClip) return;
    setClips(clips => clips.map(c => {
      if (c.id === selectedClip.id) {
        return { ...c, trackId: c.trackId === 'v1' ? 'v2' : 'v1' };
      }
      return c;
    }));
  };
  
  const handleFreeze = () => {
    if (!selectedClip) return;
    const freezeClip = {
      ...selectedClip,
      id: `freeze_${Date.now()}`,
      start: currentTime,
      duration: 60, // 3 seconds freeze
      selected: false
    };
    setClips(clips => [...clips, freezeClip]);
  };

  const handleReverse = () => {
    if (!selectedClip) return;
    setClips(clips => clips.map(c => c.id === selectedClip.id ? { ...c, flipX: !c.flipX } : c));
  };

  const handleZoom = () => {
    if (!selectedClip) return;
    setClips(clips => clips.map(c => {
      if (c.id === selectedClip.id) {
        const hasZoom = c.keyframes?.some(k => k.properties?.scale && k.properties.scale > 100);
        return {
          ...c,
          keyframes: hasZoom ? [] : [{ time: 0, properties: { scale: 100 } }, { time: c.duration, properties: { scale: 150 } }]
        };
      }
      return c;
    }));
  };

  const handleLock = () => {
    if (!selectedClip) return;
    // mock lock toggle
  };

  const handleSplit = () => {
    if (!selectedClip) return;
    
    // Check if playhead is within the clip
    if (currentTime > selectedClip.start && currentTime < selectedClip.start + selectedClip.duration) {
      const firstDuration = currentTime - selectedClip.start;
      const secondDuration = selectedClip.duration - firstDuration;
      
      const newClip = {
        ...selectedClip,
        id: `${selectedClip.type}_${Date.now()}`,
        start: currentTime,
        duration: secondDuration,
        selected: false
      };
      
      setClips(clips => {
        const otherClips = clips.filter(c => c.id !== selectedClip.id);
        const updatedOriginal = { ...selectedClip, duration: firstDuration };
        return [...otherClips, updatedOriginal, newClip];
      });
    }
  };
  
  const handleExtractAudio = () => {
    if (!selectedClip || selectedClip.type !== 'video') return;
    
    const newAudioClip = {
      ...selectedClip,
      id: `audio_${Date.now()}`,
      type: 'audio',
      trackId: 'a1',
      name: `Audio from ${selectedClip.name}`,
      selected: false
    };
    
    setClips(clips => [...clips, newAudioClip]);
  };
  
  const handleReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClip) return;
    
    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video/');
    
    if (isVideo) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        setClips(clips => clips.map(c => 
          c.id === selectedClip.id ? { ...c, url, name: file.name, type: 'video', duration: video.duration * 10 || 100 } : c
        ));
      };
      video.src = url;
    } else {
      setClips(clips => clips.map(c => 
        c.id === selectedClip.id ? { ...c, url, name: file.name, type: 'image' } : c
      ));
    }
    e.target.value = '';
  };

  const hasKeyframeAtCurrentTime = selectedClip?.keyframes?.some(k => k.time === currentTime - selectedClip.start);

  const handleKeyframeToggle = () => {
    if (!selectedClip) return;
    
    // Time relative to the start of the clip
    const clipTime = currentTime - selectedClip.start;
    
    if (clipTime < 0 || clipTime > selectedClip.duration) return;

    let updatedKeyframes = [...(selectedClip.keyframes || [])];
    const existingIndex = updatedKeyframes.findIndex(k => k.time === clipTime);
    
    if (existingIndex >= 0) {
      // Remove keyframe
      updatedKeyframes.splice(existingIndex, 1);
    } else {
      // Add keyframe with current empty properties (properties panel will fill it, or it serves as a position marker)
      // For a proper keyframe, we might need to capture current state if it's animated, but for now we just add an empty property object
      // wait, actually we want to store the current interpolated values if possible, but an empty property object works as an anchor
      updatedKeyframes.push({
        time: clipTime,
        properties: {} 
      });
      updatedKeyframes.sort((a, b) => a.time - b.time);
    }
    
    setClips(clips => clips.map(c => c.id === selectedClip.id ? { ...c, keyframes: updatedKeyframes } : c));
  };



  return (
    <div className="h-[60px] md:h-[70px] bg-[#1a1a1a] flex items-center overflow-x-auto no-scrollbar px-2 w-full">
      <div className="flex items-center space-x-1 min-w-max mx-auto md:mx-0">
        <ToolbarButton icon={Undo2} label="Undo" onClick={undo} disabled={!canUndo} />
        <ToolbarButton icon={Redo2} label="Redo" onClick={redo} disabled={!canRedo} />
        
        {selectedClip && (
          <>
            <label className="flex flex-col items-center justify-center w-14 h-14 hover:bg-[#2a2a2a] rounded-lg transition-colors group flex-shrink-0 cursor-pointer">
              <RefreshCcw size={20} className="text-gray-300 group-hover:text-white mb-1" />
              <span className="text-[9px] text-gray-400 group-hover:text-gray-200">Replace</span>
              <input type="file" accept="video/*,image/*" className="hidden" onChange={handleReplace} />
            </label>
          </>
        )}
        
        {selectedClip?.type === 'audio' && (
          <>
            <ToolbarButton icon={Music} label="Remix" onClick={() => { setActivePropertiesTab('remix'); setShowProperties(true); }} />
            <ToolbarButton icon={Mic} label="Podcast" onClick={() => { setActivePropertiesTab('podcast'); setShowProperties(true); }} />
            <ToolbarButton icon={Volume2} label="Amplifier" onClick={() => { setActivePropertiesTab('amplifier'); setShowProperties(true); }} />
          </>
        )}

        {selectedClip?.type === 'video' && (
          <>
            <ToolbarButton icon={Scissors} label="Split" onClick={handleSplit} />
            <ToolbarButton icon={Wand2} label="FX" onClick={() => { setActivePropertiesTab('fx'); setShowProperties(true); }} />
            <ToolbarButton icon={Gauge} label="Speed" onClick={() => { setActivePropertiesTab('speed'); setShowProperties(true); }} />
            <ToolbarButton icon={Volume2} label="Volume" onClick={() => { setActivePropertiesTab('audio'); setShowProperties(true); }} />
            <ToolbarButton icon={AudioWaveform} label="Extract Audio" onClick={handleExtractAudio} />
            <ToolbarButton icon={Type} label="Auto Caption" onClick={() => { setActivePropertiesTab('caption'); setShowProperties(true); }} />
            <ToolbarButton icon={PlaySquare} label="Motion" onClick={() => { setActivePropertiesTab('animation'); setShowProperties(true); }} />
            <ToolbarButton icon={Crop} label="Crop" onClick={() => { setActivePropertiesTab('crop'); setShowProperties(true); }} />
            <ToolbarButton icon={RotateCw} label="Rotate" onClick={handleRotate} />
            <ToolbarButton icon={FlipHorizontal} label="Mirror" onClick={handleMirror} />
            <ToolbarButton icon={FlipVertical} label="Flip" onClick={handleFlip} />
            <ToolbarButton icon={Maximize} label="Fit/Fill" onClick={handleFitFill} />
            <ToolbarButton icon={Image} label="BG" onClick={() => { setActivePropertiesTab('bg'); setShowProperties(true); }} />
            <ToolbarButton icon={Square} label="Border" onClick={() => { setActivePropertiesTab('border'); setShowProperties(true); }} />
            <ToolbarButton icon={Layers} label="Layer" onClick={handleLayer} />
            <ToolbarButton icon={Snowflake} label="Freeze" onClick={handleFreeze} />
            <ToolbarButton icon={History} label="Reverse" onClick={handleReverse} />
            <ToolbarButton icon={ZoomIn} label="Zoom" onClick={handleZoom} />
            <button 
              onClick={(e) => { e.stopPropagation(); handleKeyframeToggle(); }}
              className="flex flex-col items-center justify-center w-14 h-14 hover:bg-[#2a2a2a] rounded-lg transition-colors group flex-shrink-0"
            >
              <Diamond size={20} className={hasKeyframeAtCurrentTime ? "text-[#2fe4b9] mb-1 fill-current" : "text-gray-300 group-hover:text-white mb-1"} />
              <span className={`text-[9px] ${hasKeyframeAtCurrentTime ? "text-[#2fe4b9]" : "text-gray-400 group-hover:text-gray-200"}`}>Keyframe</span>
            </button>
          </>
        )}

        {selectedClip && (
          <>
            <ToolbarButton icon={Sliders} label="Options" onClick={() => { setActivePropertiesTab('audio'); setShowProperties(true); }} />
            <ToolbarButton icon={Lock} label="Lock" onClick={handleLock} />
            <ToolbarButton icon={Copy} label="Duplicate" onClick={handleDuplicate} />
            <ToolbarButton icon={Trash2} label="Delete" onClick={handleDelete} />
          </>
        )}
      </div>
    </div>
  );
}
