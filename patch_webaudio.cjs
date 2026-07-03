const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// We will inject WebAudio initialization into VideoLayer and Preview

const targetVideoLayerStart = `const VideoLayer: React.FC<{ clip: Clip, isPlaying: boolean, currentTime: number }> = ({ clip, isPlaying, currentTime }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setIsPlaying } = useProject();`;

const replacementVideoLayerStart = `const VideoLayer: React.FC<{ clip: Clip, isPlaying: boolean, currentTime: number }> = ({ clip, isPlaying, currentTime }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setIsPlaying } = useProject();
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
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
          
          source.connect(ctx.destination); // Default
        }
      } catch (e) {
        console.warn('WebAudio setup failed:', e);
      }
    }
  }, []);
  
  // Re-route based on effects
  useEffect(() => {
    if (audioCtxRef.current && sourceRef.current && filterRef.current && enhanceRef.current) {
      const ctx = audioCtxRef.current;
      sourceRef.current.disconnect();
      filterRef.current.disconnect();
      enhanceRef.current.disconnect();
      
      let currentNode = sourceRef.current as AudioNode;
      
      // Extremely aggressive Noise Reduction (bandpass filter)
      if (clip.reduceNoise) {
        if (clip.noiseReductionLevel === 'Strong') {
           filterRef.current.Q.value = 2.0;
        } else if (clip.noiseReductionLevel === 'Weak') {
           filterRef.current.Q.value = 0.2;
        } else {
           filterRef.current.Q.value = 0.8;
        }
        currentNode.connect(filterRef.current);
        currentNode = filterRef.current;
      }
      
      if (clip.voiceEnhance) {
        currentNode.connect(enhanceRef.current);
        currentNode = enhanceRef.current;
      }
      
      currentNode.connect(ctx.destination);
    }
  }, [clip.reduceNoise, clip.voiceEnhance, clip.noiseReductionLevel]);`;

code = code.replace(targetVideoLayerStart, replacementVideoLayerStart);

fs.writeFileSync('src/components/Preview.tsx', code);
