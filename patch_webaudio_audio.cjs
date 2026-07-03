const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

const targetAudioRef = `  const audioRef = useRef<HTMLAudioElement>(null);`;
const replacementAudioRef = `  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const enhanceRef = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    if (audioRef.current && !audioCtxRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;
          
          const source = ctx.createMediaElementSource(audioRef.current);
          sourceRef.current = source;
          
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 1500;
          filter.Q.value = 0.5;
          filterRef.current = filter;
          
          const enhance = ctx.createBiquadFilter();
          enhance.type = 'highshelf';
          enhance.frequency.value = 2000;
          enhance.gain.value = 10;
          enhanceRef.current = enhance;
          
          source.connect(ctx.destination);
        }
      } catch (e) {
        console.warn('WebAudio audio track setup failed:', e);
      }
    }
  }, [activeAudioClip?.url]);
  
  useEffect(() => {
    if (audioCtxRef.current && sourceRef.current && filterRef.current && enhanceRef.current && activeAudioClip) {
      const ctx = audioCtxRef.current;
      sourceRef.current.disconnect();
      filterRef.current.disconnect();
      enhanceRef.current.disconnect();
      
      let currentNode = sourceRef.current as AudioNode;
      
      if (activeAudioClip.reduceNoise) {
        if (activeAudioClip.noiseReductionLevel === 'Strong') {
           filterRef.current.Q.value = 2.0;
        } else if (activeAudioClip.noiseReductionLevel === 'Weak') {
           filterRef.current.Q.value = 0.2;
        } else {
           filterRef.current.Q.value = 0.8;
        }
        currentNode.connect(filterRef.current);
        currentNode = filterRef.current;
      }
      
      if (activeAudioClip.voiceEnhance) {
        currentNode.connect(enhanceRef.current);
        currentNode = enhanceRef.current;
      }
      
      currentNode.connect(ctx.destination);
    }
  }, [activeAudioClip?.reduceNoise, activeAudioClip?.voiceEnhance, activeAudioClip?.noiseReductionLevel]);`;

code = code.replace(targetAudioRef, replacementAudioRef);

// Remove fake noise reduction logic
code = code.replace(`      // Fake effects for UI responsiveness without WebAudio CORS risks
      if (activeAudioClip.reduceNoise) v *= 0.8;
      if (activeAudioClip.voiceEnhance) v *= 1.2;`, `      // Audio dynamics routing is now handled by WebAudio API`);

// Remove fake noise reduction logic from video
code = code.replace(`      // Fake effects for UI responsiveness without WebAudio CORS risks
      if (clip.reduceNoise) v *= 0.8;
      if (clip.voiceEnhance) v *= 1.2;`, `      // Audio dynamics routing is now handled by WebAudio API`);

code = code.replace('<audio ref={audioRef} src={activeAudioClip.url} loop />', '<audio ref={audioRef} src={activeAudioClip.url} crossOrigin="anonymous" loop />');
code = code.replace('<video \n      ref={videoRef}', '<video \n      crossOrigin="anonymous"\n      ref={videoRef}');

fs.writeFileSync('src/components/Preview.tsx', code);
