const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// The bad block:
//         } else {
//           vocalPeakRef.current.connect(compRef.current);
//         }
//         
//         currentNode = compRef.current;
//       }
//       
//       if (activeAudioClip.voiceEnhance) {

const badBlockRegex = /\s*\} else \{\s*vocalPeakRef\.current\.connect\(compRef\.current\);\s*\}\s*currentNode = compRef\.current;\s*\}\s*if \(activeAudioClip\.voiceEnhance\) \{/g;

const replacement = `
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
`;

code = code.replace(badBlockRegex, replacement);
fs.writeFileSync('src/components/Preview.tsx', code);
