import { Play, Pause, SkipBack, SkipForward, Maximize, Minus, Plus, Music } from 'lucide-react';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useProject, KeyframeData, Clip, getEffectCSS, getCurveRate, getCurveIntegratedProgress } from '../context';

const VideoLayer: React.FC<{ clip: Clip, isPlaying: boolean, currentTime: number }> = ({ clip, isPlaying, currentTime }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setIsPlaying } = useProject();
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const aiNodeRef = useRef<AudioWorkletNode | null>(null);
  const vocalHpRef = useRef<BiquadFilterNode | null>(null);
  const vocalLpRef = useRef<BiquadFilterNode | null>(null);
  const vocalPeakRef = useRef<BiquadFilterNode | null>(null);
  const vocalGainRef = useRef<GainNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);
  const compRef = useRef<DynamicsCompressorNode | null>(null);
  const enhanceRef = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    if (videoRef.current && !audioCtxRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;
          
          const source = ctx.createMediaElementSource(videoRef.current);
          sourceRef.current = source;
          
          ctx.audioWorklet.addModule('./ai-noise-gate.js').then(() => {
            const aiNode = new AudioWorkletNode(ctx, 'ai-noise-gate');
            aiNodeRef.current = aiNode;
          }).catch(console.error);
          
          const hp = ctx.createBiquadFilter();
          hp.type = 'highpass';
          hp.frequency.value = 180; 
          vocalHpRef.current = hp;
          
          const lp = ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lp.frequency.value = 6500;
          vocalLpRef.current = lp;
          
          const peak = ctx.createBiquadFilter();
          peak.type = 'peaking';
          peak.frequency.value = 2500;
          peak.Q.value = 1.2;
          peak.gain.value = 4;
          vocalPeakRef.current = peak;
          
          vocalGainRef.current = ctx.createGain();
          noiseGainRef.current = ctx.createGain();
          
          const comp = ctx.createDynamicsCompressor();
          comp.threshold.value = -3;
          comp.knee.value = 5;
          comp.ratio.value = 20;
          comp.attack.value = 0.001;
          comp.release.value = 0.05;
          comp.attack.value = 0.003;
          comp.release.value = 0.25;
          compRef.current = comp;
          
          const enhance = ctx.createBiquadFilter();
          enhance.type = 'highshelf';
          enhance.frequency.value = 2000;
          enhance.gain.value = 10;
          enhanceRef.current = enhance;
          
          source.connect(ctx.destination); // Default
        }
      } catch (e) {
        console.warn('WebAudio setup failed:', e);
      }
    }
  }, []);
  
  // Re-route based on effects
  useEffect(() => {
    if (audioCtxRef.current && sourceRef.current && vocalHpRef.current && vocalLpRef.current && vocalPeakRef.current && vocalGainRef.current && noiseGainRef.current && compRef.current && enhanceRef.current) {
      const ctx = audioCtxRef.current;
      
      // Safe disconnect
      try { sourceRef.current.disconnect(); } catch(e){}
      try { if(aiNodeRef.current) aiNodeRef.current.disconnect(); } catch(e){}
      try { vocalHpRef.current.disconnect(); } catch(e){}
      try { vocalLpRef.current.disconnect(); } catch(e){}
      try { vocalPeakRef.current.disconnect(); } catch(e){}
      try { vocalGainRef.current.disconnect(); } catch(e){}
      try { noiseGainRef.current.disconnect(); } catch(e){}
      try { compRef.current.disconnect(); } catch(e){}
      try { enhanceRef.current.disconnect(); } catch(e){}
      
      let currentNode = sourceRef.current;
      
      if (clip.reduceNoise) {
        const vVol = clip.vocalVolume ?? 100;
        const nVol = clip.backgroundVolume ?? 0;
        
        if (aiNodeRef.current) {
          const vParam = aiNodeRef.current.parameters.get('vocalVolume');
          if (vParam) vParam.value = vVol / 100;
          const nParam = aiNodeRef.current.parameters.get('backgroundVolume');
          if (nParam) nParam.value = nVol / 100;
          const aiIsoParam = aiNodeRef.current.parameters.get('aiIsolation');
          if (aiIsoParam) aiIsoParam.value = clip.aiIsolation ? 1.0 : 0.0;
        }

        vocalGainRef.current.gain.value = 1.0; // Let worklet handle gain
        
        // 1. HPF to remove rumble "bhbhbh"
        currentNode.connect(vocalHpRef.current);
        vocalHpRef.current.connect(vocalLpRef.current);
        vocalLpRef.current.connect(vocalPeakRef.current);
        
        // 2. AI Noise Gate (if loaded)
        if (aiNodeRef.current) {
          vocalPeakRef.current.connect(aiNodeRef.current);
          aiNodeRef.current.connect(compRef.current);
        } else {
          vocalPeakRef.current.connect(compRef.current);
        }
        
        currentNode = compRef.current;
      }
      
      if (clip.voiceEnhance) {
        currentNode.connect(enhanceRef.current);
        currentNode = enhanceRef.current;
      }
      
      currentNode.connect(ctx.destination);
    }
  }, [clip?.reduceNoise, clip?.voiceEnhance, clip?.vocalVolume, clip?.backgroundVolume]);

  const playbackRate = clip?.playbackRate || 1;
  const startOffset = clip?.start || 0;

  useEffect(() => {
    if (videoRef.current && clip) {
      let v = (clip.volume ?? 100) / 100;
      let clipTimeSec = Math.max(0, (currentTime - clip.start) / 20);
      let durationSec = clip.duration / 20;

      if (clip.customSpeedPoints && clip.customSpeedPoints.length > 0) {
        const points = [...clip.customSpeedPoints].sort((a, b) => a.x - b.x);
        const progress = clipTimeSec / durationSec;
        
        let mappedProgress = progress;
        for (let i = 0; i < points.length - 1; i++) {
          if (progress >= points[i].x && progress <= points[i+1].x) {
            const t = (progress - points[i].x) / (points[i+1].x - points[i].x);
            mappedProgress = points[i].y + t * (points[i+1].y - points[i].y);
            break;
          }
        }
        clipTimeSec = mappedProgress * durationSec;
      } else {
        clipTimeSec *= playbackRate;
      }

      if (isPlaying) {
        if (videoRef.current.paused) {
          videoRef.current.currentTime = clipTimeSec;
          videoRef.current.play().catch(e => console.log('Video play error:', e));
        }
        videoRef.current.volume = Math.max(0, Math.min(1, v));
      } else {
        if (!videoRef.current.paused) {
          videoRef.current.pause();
        }
        if (Math.abs(videoRef.current.currentTime - clipTimeSec) > 0.1) {
          videoRef.current.currentTime = clipTimeSec;
        }
        videoRef.current.volume = Math.max(0, Math.min(1, v));
      }
    }
  }, [currentTime, isPlaying, clip]);

  return (
    <video
      ref={videoRef}
      src={clip.url}
      crossOrigin="anonymous"
      className="absolute top-0 left-0 w-full h-full"
      style={{
        objectFit: clip.fit ? 'contain' : 'cover',
        transform: `${clip.flipX ? 'scaleX(-1)' : ''} ${clip.flipY ? 'scaleY(-1)' : ''} rotate(${clip.baseRotate || 0}deg)`,
        filter: getEffectCSS(clip.filter, clip.filterIntensity),
      }}
    />
  );
};

const Preview = () => {
  const { state: { clips, currentTime, isPlaying }, setCurrentTime, setIsPlaying, setClips } = useProject();
  const activeVideoClips = clips.filter(c => (c.type === 'video' || c.type === 'image') && currentTime >= c.start && currentTime <= c.start + c.duration);

  const activeAudioClip = clips.find(c => c.type === 'audio' && currentTime >= c.start && currentTime <= c.start + c.duration);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRefAudio = useRef<MediaElementAudioSourceNode | null>(null);
  const aiNodeRefAudio = useRef<AudioWorkletNode | null>(null);
  const vocalHpRefAudio = useRef<BiquadFilterNode | null>(null);
  const vocalLpRefAudio = useRef<BiquadFilterNode | null>(null);
  const vocalPeakRefAudio = useRef<BiquadFilterNode | null>(null);
  const vocalGainRefAudio = useRef<GainNode | null>(null);
  const noiseGainRefAudio = useRef<GainNode | null>(null);
  const compRefAudio = useRef<DynamicsCompressorNode | null>(null);
  const enhanceRefAudio = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    if (audioRef.current && !audioCtxRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;
        
        const source = ctx.createMediaElementSource(audioRef.current);
        sourceRefAudio.current = source;
        
        ctx.audioWorklet.addModule('./ai-noise-gate.js').then(() => {
          const aiNode = new AudioWorkletNode(ctx, 'ai-noise-gate');
          aiNodeRefAudio.current = aiNode;
        }).catch(console.error);
        
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 180;
        vocalHpRefAudio.current = hp;
        
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 6500;
        vocalLpRefAudio.current = lp;
        
        const peak = ctx.createBiquadFilter();
        peak.type = 'peaking';
        peak.frequency.value = 2500;
        peak.Q.value = 1.2;
        peak.gain.value = 4;
        vocalPeakRefAudio.current = peak;
        
        vocalGainRefAudio.current = ctx.createGain();
        noiseGainRefAudio.current = ctx.createGain();
        
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -3;
        comp.knee.value = 5;
        comp.ratio.value = 20;
        comp.attack.value = 0.001;
        comp.release.value = 0.05;
        compRefAudio.current = comp;
        
        const enhance = ctx.createBiquadFilter();
        enhance.type = 'highshelf';
        enhance.frequency.value = 2000;
        enhance.gain.value = 10;
        enhanceRefAudio.current = enhance;
        
        source.connect(ctx.destination);
      } catch (e) {
        console.error('AudioContext error:', e);
      }
    }
  }, [activeAudioClip?.url]);
  
  useEffect(() => {
    if (audioCtxRef.current && sourceRefAudio.current && vocalHpRefAudio.current && vocalLpRefAudio.current && vocalPeakRefAudio.current && vocalGainRefAudio.current && noiseGainRefAudio.current && compRefAudio.current && enhanceRefAudio.current && activeAudioClip) {
      const ctx = audioCtxRef.current;
      
      try { if(aiNodeRefAudio.current) aiNodeRefAudio.current.disconnect(); } catch(e){}
      try { vocalHpRefAudio.current.disconnect(); } catch(e){}
      try { vocalLpRefAudio.current.disconnect(); } catch(e){}
      try { vocalPeakRefAudio.current.disconnect(); } catch(e){}
      try { vocalGainRefAudio.current.disconnect(); } catch(e){}
      try { noiseGainRefAudio.current.disconnect(); } catch(e){}
      try { compRefAudio.current.disconnect(); } catch(e){}
      try { enhanceRefAudio.current.disconnect(); } catch(e){}
      try { sourceRefAudio.current.disconnect(); } catch(e){}
      
      let currentNode = sourceRefAudio.current;
      
      if (activeAudioClip.reduceNoise) {
        const vVol = activeAudioClip.vocalVolume ?? 100;
        const nVol = activeAudioClip.backgroundVolume ?? 0;
        
        if (aiNodeRefAudio.current) {
          const vParam = aiNodeRefAudio.current.parameters.get('vocalVolume');
          if (vParam) vParam.value = vVol / 100;
          const nParam = aiNodeRefAudio.current.parameters.get('backgroundVolume');
          if (nParam) nParam.value = nVol / 100;
          const aiIsoParam = aiNodeRefAudio.current.parameters.get('aiIsolation');
          if (aiIsoParam) aiIsoParam.value = activeAudioClip.aiIsolation ? 1.0 : 0.0;
        }

        vocalGainRefAudio.current.gain.value = 1.0;
        
        currentNode.connect(vocalHpRefAudio.current);
        vocalHpRefAudio.current.connect(vocalLpRefAudio.current);
        vocalLpRefAudio.current.connect(vocalPeakRefAudio.current);
        
        if (aiNodeRefAudio.current) {
          vocalPeakRefAudio.current.connect(aiNodeRefAudio.current);
          aiNodeRefAudio.current.connect(compRefAudio.current);
        } else {
          vocalPeakRefAudio.current.connect(compRefAudio.current);
        }
        
        currentNode = compRefAudio.current;
      }
      
      if (activeAudioClip.voiceEnhance) {

        currentNode.connect(enhanceRefAudio.current);
        currentNode = enhanceRefAudio.current;
      }
      
      currentNode.connect(ctx.destination);
    }
  }, [activeAudioClip?.reduceNoise, activeAudioClip?.voiceEnhance, activeAudioClip?.vocalVolume, activeAudioClip?.backgroundVolume]);

  const audioPlaybackRate = activeAudioClip?.playbackRate || 1;
  const audioStart = activeAudioClip?.start || 0;

  useEffect(() => {
    if (audioRef.current && activeAudioClip) {
      let v = (activeAudioClip.volume ?? 100) / 100;
      let clipTimeSec = Math.max(0, (currentTime - activeAudioClip.start) / 20);
      let durationSec = activeAudioClip.duration / 20;

      if (activeAudioClip.fadeIn && activeAudioClip.fadeIn > 0 && clipTimeSec < activeAudioClip.fadeIn) {
        v *= (clipTimeSec / activeAudioClip.fadeIn);
      } else if (activeAudioClip.fadeOut && activeAudioClip.fadeOut > 0 && (durationSec - clipTimeSec) < activeAudioClip.fadeOut) {
        v *= Math.max(0, (durationSec - clipTimeSec) / activeAudioClip.fadeOut);
      }
      
      // Audio dynamics routing is now handled by WebAudio API
      if (activeAudioClip.equalizerEnabled && activeAudioClip.preAmp !== undefined) {
        v *= (activeAudioClip.preAmp / 50);
      }
      if (activeAudioClip.compressorEnabled) {
        const ratio = (activeAudioClip.compRatio || 40) / 10;
        if (v > 0.5) v = 0.5 + (v - 0.5) / ratio;
      }
      
      audioRef.current.volume = Math.max(0, Math.min(1, v));
    }
  }, [currentTime, activeAudioClip?.volume, activeAudioClip?.fadeIn, activeAudioClip?.fadeOut, activeAudioClip?.start, activeAudioClip?.duration, activeAudioClip?.reduceNoise, activeAudioClip?.voiceEnhance, activeAudioClip?.equalizerEnabled, activeAudioClip?.preAmp, activeAudioClip?.compressorEnabled, activeAudioClip?.compRatio, activeAudioClip?.compThreshold, activeAudioClip]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = audioPlaybackRate;
    }
  }, [audioPlaybackRate]);



  useEffect(() => {
    if (isPlaying) {
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const a = audioRef.current;
      if (a) {
        a.play().catch(() => setIsPlaying(false));
      }
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, setIsPlaying, activeAudioClip?.url]);

useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 2; // 2 units (px) = 100ms at 20px/s
          const maxEnd = Math.max(...clips.map(c => c.start + c.duration), 0);
          if (newTime >= maxEnd && maxEnd > 0) {
            return 0; // loop back
          }
          return newTime;
        });
      }, 100); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, setCurrentTime, clips]);

  // Sync audio time with global time (20px = 1s)
  useEffect(() => {
    if (!isPlaying) {
      if (audioRef.current && activeAudioClip) {
        audioRef.current.currentTime = (Math.max(0, (currentTime - audioStart)) / 20) * audioPlaybackRate;
      }
    }
  }, [currentTime, isPlaying, activeAudioClip, audioStart, audioPlaybackRate]);

  const formatTime = (timeInPx: number) => {
    const timeInSeconds = timeInPx / 20;
    const ms = Math.floor((timeInSeconds % 1) * 100);
    const s = Math.floor(timeInSeconds);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `00:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 min-h-0 bg-zinc-950 flex flex-col border-r border-zinc-800">
      {/* Viewport */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-2 bg-zinc-950 relative">
        {/* Mock Video Container */}
        <div className="relative aspect-[9/16] h-full max-h-full bg-zinc-900 border border-zinc-800 shadow-2xl flex items-center justify-center overflow-hidden">
          {activeVideoClips.length > 0 ? (
            activeVideoClips.map(clip => (
              <VideoLayer key={clip.id} clip={clip} isPlaying={isPlaying} currentTime={currentTime} />
            ))
          ) : (
            <div className="text-gray-500 font-medium">No Video</div>
          )}
          
          
            {activeAudioClip?.url && (
              <audio ref={audioRef} src={activeAudioClip.url} crossOrigin="anonymous" loop />
            )}
            
            {/* Lyrics Overlay */}
            {(() => {
              const clipWithLyrics = activeVideoClips.find(c => c.lyrics) || (activeAudioClip?.lyrics ? activeAudioClip : null);
              if (clipWithLyrics?.lyrics) {
                return (
                  <div className="absolute bottom-16 w-[90%] left-1/2 -translate-x-1/2 text-center z-30 pointer-events-none">
                    <p className="text-white text-xl md:text-cyan-400xl font-bold px-4 py-2 bg-zinc-950/60 rounded-lg drop-shadow-md border border-white/10" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                      {clipWithLyrics.lyrics}
                    </p>
                  </div>
                );
              }
              return null;
            })()}
          
                    
          {/* Text Clips */}
          {clips.filter(c => c.type === 'text' && currentTime >= c.start && currentTime <= c.start + c.duration).map(textClip => (
            <div 
              key={textClip.id}
              onPointerDown={(e) => {
                e.stopPropagation();
                
                // Select clip
                const newClips = clips.map(c => ({...c, selected: c.id === textClip.id}));
                setClips(newClips);
                
                const target = e.currentTarget;
                const startX = e.clientX;
                const startY = e.clientY;
                
                const xStr = (textClip as any).x || '50%';
                const yStr = (textClip as any).y || '75%';
                const startXPercent = parseFloat(xStr);
                const startYPercent = parseFloat(yStr);
                
                const rect = target.parentElement!.getBoundingClientRect();
                
                const onPointerMove = (moveEvent: PointerEvent) => {
                  const dx = moveEvent.clientX - startX;
                  const dy = moveEvent.clientY - startY;
                  
                  const dxPercent = (dx / rect.width) * 100;
                  const dyPercent = (dy / rect.height) * 100;
                  
                  setClips(prevClips => prevClips.map(c => {
                    if (c.id === textClip.id) {
                      return {
                        ...c,
                        x: `${startXPercent + dxPercent}%`,
                        y: `${startYPercent + dyPercent}%`
                      };
                    }
                    return c;
                  }));
                };
                
                const onPointerUp = () => {
                  window.removeEventListener('pointermove', onPointerMove);
                  window.removeEventListener('pointerup', onPointerUp);
                };
                
                window.addEventListener('pointermove', onPointerMove);
                window.addEventListener('pointerup', onPointerUp);
              }}
              className={`absolute ${textClip.selected ? 'ring-2 ring-cyan-400' : ''} cursor-move p-2 rounded z-30`}
              style={{
                left: (textClip as any).x || '50%',
                top: (textClip as any).y || '75%',
                transform: 'translate(-50%, -50%)',
                color: textClip.color || '#ffffff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              <h2 
                className="text-2xl font-bold text-center whitespace-pre-wrap outline-none"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newContent = e.currentTarget.innerText;
                  setClips(prevClips => prevClips.map(c => c.id === textClip.id ? { ...c, content: newContent } : c));
                }}
              >{textClip.content}</h2>
            </div>
          ))}
          
          <div className="absolute inset-0 pointer-events-none ring-1 ring-[#2fe4b9]/30 z-20"></div>
          
          {/* Mock Transform Box overlay */}
          <div className="absolute inset-20 border border-cyan-400 pointer-events-none opacity-0 hover:opacity-100 transition-opacity z-20">
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-cyan-400 rounded-full"></div>
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-cyan-400 rounded-full"></div>
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-cyan-400 rounded-full"></div>
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-cyan-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-12 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-2 md:px-4">
        <div className="text-[10px] md:text-xs font-mono text-[#2fe4b9] hidden md:block">
          {formatTime(currentTime)} <span className="text-gray-500">/ 00:01:24:15</span>
        </div>
        
        <div className="flex items-center space-x-3 md:space-x-4 mx-auto md:mx-0">
          <button onClick={() => setCurrentTime(0)} className="p-1.5 text-zinc-400 hover:text-cyan-400 transition-colors transition-colors">
            <SkipBack size={18} fill="currentColor" />
          </button>
          <button 
            className="text-zinc-100 hover:text-cyan-400 transition-colors transition-colors p-1"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button className="p-1.5 text-zinc-400 hover:text-cyan-400 transition-colors transition-colors">
            <SkipForward size={18} fill="currentColor" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3 text-gray-400">
          <div className="hidden md:flex items-center space-x-1 text-xs bg-zinc-950 px-2 py-1 rounded border border-zinc-700">
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

export default Preview;
