const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// Refs (Video)
code = code.replace(
  /const aiNodeRef = useRef<AudioWorkletNode \| null>\(null\);/,
  `const vocalBandpassRef = useRef<BiquadFilterNode | null>(null);
  const noiseNotchRef = useRef<BiquadFilterNode | null>(null);
  const vocalGainRef = useRef<GainNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);
  const compRef = useRef<DynamicsCompressorNode | null>(null);`
);

// Refs (Audio)
code = code.replace(
  /const aiNodeRef = useRef<AudioWorkletNode \| null>\(null\);/,
  `const vocalBandpassRef = useRef<BiquadFilterNode | null>(null);
  const noiseNotchRef = useRef<BiquadFilterNode | null>(null);
  const vocalGainRef = useRef<GainNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);
  const compRef = useRef<DynamicsCompressorNode | null>(null);`
);

// Setup (Video)
code = code.replace(
  /ctx\.audioWorklet\.addModule\('\.\/ai-noise-reduction\.js'\)\.then\(\(\) => \{[\s\S]*?\}\)\.catch\(console\.error\);/,
  `const vocalBandpass = ctx.createBiquadFilter();
          vocalBandpass.type = 'bandpass';
          vocalBandpass.frequency.value = 1500;
          vocalBandpass.Q.value = 0.5;
          vocalBandpassRef.current = vocalBandpass;
          
          const noiseNotch = ctx.createBiquadFilter();
          noiseNotch.type = 'notch';
          noiseNotch.frequency.value = 1500;
          noiseNotch.Q.value = 0.5;
          noiseNotchRef.current = noiseNotch;
          
          vocalGainRef.current = ctx.createGain();
          noiseGainRef.current = ctx.createGain();
          
          const comp = ctx.createDynamicsCompressor();
          comp.threshold.value = -3;
          comp.knee.value = 10;
          comp.ratio.value = 12;
          comp.attack.value = 0.003;
          comp.release.value = 0.25;
          compRef.current = comp;`
);

// Setup (Audio)
code = code.replace(
  /ctx\.audioWorklet\.addModule\('\.\/ai-noise-reduction\.js'\)\.then\(\(\) => \{[\s\S]*?\}\)\.catch\(console\.error\);/,
  `const vocalBandpass = ctx.createBiquadFilter();
          vocalBandpass.type = 'bandpass';
          vocalBandpass.frequency.value = 1500;
          vocalBandpass.Q.value = 0.5;
          vocalBandpassRef.current = vocalBandpass;
          
          const noiseNotch = ctx.createBiquadFilter();
          noiseNotch.type = 'notch';
          noiseNotch.frequency.value = 1500;
          noiseNotch.Q.value = 0.5;
          noiseNotchRef.current = noiseNotch;
          
          vocalGainRef.current = ctx.createGain();
          noiseGainRef.current = ctx.createGain();
          
          const comp = ctx.createDynamicsCompressor();
          comp.threshold.value = -3;
          comp.knee.value = 10;
          comp.ratio.value = 12;
          comp.attack.value = 0.003;
          comp.release.value = 0.25;
          compRef.current = comp;`
);

// Disconnect/Logic Video
code = code.replace(
  /if \(audioCtxRef\.current && sourceRef\.current && aiNodeRef\.current && enhanceRef\.current\) \{[\s\S]*?currentNode = enhanceRef\.current;\s*\}/,
  `if (audioCtxRef.current && sourceRef.current && vocalBandpassRef.current && noiseNotchRef.current && vocalGainRef.current && noiseGainRef.current && compRef.current && enhanceRef.current) {
      const ctx = audioCtxRef.current;
      
      // Safe disconnect
      try { sourceRef.current.disconnect(); } catch(e){}
      try { vocalBandpassRef.current.disconnect(); } catch(e){}
      try { noiseNotchRef.current.disconnect(); } catch(e){}
      try { vocalGainRef.current.disconnect(); } catch(e){}
      try { noiseGainRef.current.disconnect(); } catch(e){}
      try { compRef.current.disconnect(); } catch(e){}
      try { enhanceRef.current.disconnect(); } catch(e){}
      
      let currentNode = sourceRef.current;
      
      if (clip.reduceNoise) {
        const vVol = clip.vocalVolume ?? 100;
        const nVol = clip.backgroundVolume ?? 0;
        
        vocalGainRef.current.gain.value = vVol / 100;
        noiseGainRef.current.gain.value = nVol / 100;
        
        currentNode.connect(vocalBandpassRef.current);
        vocalBandpassRef.current.connect(vocalGainRef.current);
        
        currentNode.connect(noiseNotchRef.current);
        noiseNotchRef.current.connect(noiseGainRef.current);
        
        const sumNode = ctx.createGain();
        vocalGainRef.current.connect(sumNode);
        noiseGainRef.current.connect(sumNode);
        
        sumNode.connect(compRef.current);
        currentNode = compRef.current;
      }
      
      if (clip.voiceEnhance) {
        currentNode.connect(enhanceRef.current);
        currentNode = enhanceRef.current;
      }`
);

// Disconnect/Logic Audio
code = code.replace(
  /if \(audioCtxRef\.current && sourceRef\.current && aiNodeRef\.current && enhanceRef\.current && activeAudioClip\) \{[\s\S]*?currentNode = enhanceRef\.current;\s*\}/,
  `if (audioCtxRef.current && sourceRef.current && vocalBandpassRef.current && noiseNotchRef.current && vocalGainRef.current && noiseGainRef.current && compRef.current && enhanceRef.current && activeAudioClip) {
      const ctx = audioCtxRef.current;
      
      // Safe disconnect
      try { sourceRef.current.disconnect(); } catch(e){}
      try { vocalBandpassRef.current.disconnect(); } catch(e){}
      try { noiseNotchRef.current.disconnect(); } catch(e){}
      try { vocalGainRef.current.disconnect(); } catch(e){}
      try { noiseGainRef.current.disconnect(); } catch(e){}
      try { compRef.current.disconnect(); } catch(e){}
      try { enhanceRef.current.disconnect(); } catch(e){}
      
      let currentNode = sourceRef.current;
      
      if (activeAudioClip.reduceNoise) {
        const vVol = activeAudioClip.vocalVolume ?? 100;
        const nVol = activeAudioClip.backgroundVolume ?? 0;
        
        vocalGainRef.current.gain.value = vVol / 100;
        noiseGainRef.current.gain.value = nVol / 100;
        
        currentNode.connect(vocalBandpassRef.current);
        vocalBandpassRef.current.connect(vocalGainRef.current);
        
        currentNode.connect(noiseNotchRef.current);
        noiseNotchRef.current.connect(noiseGainRef.current);
        
        const sumNode = ctx.createGain();
        vocalGainRef.current.connect(sumNode);
        noiseGainRef.current.connect(sumNode);
        
        sumNode.connect(compRef.current);
        currentNode = compRef.current;
      }
      
      if (activeAudioClip.voiceEnhance) {
        currentNode.connect(enhanceRef.current);
        currentNode = enhanceRef.current;
      }`
);

fs.writeFileSync('src/components/Preview.tsx', code);
