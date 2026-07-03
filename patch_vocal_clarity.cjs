const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// Replace refs for video
code = code.replace(
  /const vocalBandpassRef = useRef<BiquadFilterNode \| null>\(null\);\s*const noiseNotchRef = useRef<BiquadFilterNode \| null>\(null\);/g,
  `const vocalHpRef = useRef<BiquadFilterNode | null>(null);
  const vocalLpRef = useRef<BiquadFilterNode | null>(null);
  const vocalPeakRef = useRef<BiquadFilterNode | null>(null);`
);

// Setup filters for video and audio
code = code.replace(
  /const vocalBandpass = ctx\.createBiquadFilter\(\);[\s\S]*?noiseNotchRef\.current = noiseNotch;/g,
  `const hp = ctx.createBiquadFilter();
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
          vocalPeakRef.current = peak;`
);

// Compressor adjustments
code = code.replace(
  /comp\.threshold\.value = -3;\s*comp\.knee\.value = 10;\s*comp\.ratio\.value = 12;/g,
  `comp.threshold.value = -12;
          comp.knee.value = 15;
          comp.ratio.value = 20;`
);

// Logic replacement for Video
code = code.replace(
  /try \{ vocalBandpassRef\.current\.disconnect\(\); \} catch\(e\)\{\}\s*try \{ noiseNotchRef\.current\.disconnect\(\); \} catch\(e\)\{\}/g,
  `try { vocalHpRef.current.disconnect(); } catch(e){}
      try { vocalLpRef.current.disconnect(); } catch(e){}
      try { vocalPeakRef.current.disconnect(); } catch(e){}`
);

// Re-routing for Video
code = code.replace(
  /currentNode\.connect\(vocalBandpassRef\.current\);\s*vocalBandpassRef\.current\.connect\(vocalGainRef\.current\);\s*currentNode\.connect\(noiseNotchRef\.current\);\s*noiseNotchRef\.current\.connect\(noiseGainRef\.current\);/g,
  `currentNode.connect(vocalHpRef.current);
        vocalHpRef.current.connect(vocalLpRef.current);
        vocalLpRef.current.connect(vocalPeakRef.current);
        vocalPeakRef.current.connect(vocalGainRef.current);
        
        currentNode.connect(noiseGainRef.current);`
);

// Fix the undefined variable check in useEffect for Video
code = code.replace(
  /if \(audioCtxRef\.current && sourceRef\.current && vocalBandpassRef\.current && noiseNotchRef\.current/g,
  `if (audioCtxRef.current && sourceRef.current && vocalHpRef.current && vocalLpRef.current && vocalPeakRef.current`
);


fs.writeFileSync('src/components/Preview.tsx', code);
