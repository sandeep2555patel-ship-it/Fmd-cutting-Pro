const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// Refs replacements
code = code.replace(
  /const hpFilterRef = useRef<BiquadFilterNode \| null>\(null\);\s*const lpFilterRef = useRef<BiquadFilterNode \| null>\(null\);\s*const presFilterRef = useRef<BiquadFilterNode \| null>\(null\);\s*const clarityFilterRef = useRef<BiquadFilterNode \| null>\(null\);\s*const compRef = useRef<DynamicsCompressorNode \| null>\(null\);/g,
  `const vocalBandpassRef = useRef<BiquadFilterNode | null>(null);
  const vocalClarityRef = useRef<BiquadFilterNode | null>(null);
  const vocalGainRef = useRef<GainNode | null>(null);
  const noiseNotchRef = useRef<BiquadFilterNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);`
);

// Setup replacements
code = code.replace(
  /const hp = ctx\.createBiquadFilter\(\);\s*hp\.type = 'highpass';\s*hpFilterRef\.current = hp;\s*const lp = ctx\.createBiquadFilter\(\);\s*lp\.type = 'lowpass';\s*lpFilterRef\.current = lp;\s*const pres = ctx\.createBiquadFilter\(\);\s*pres\.type = 'peaking';\s*pres\.Q\.value = 1\.0;\s*presFilterRef\.current = pres;\s*const clarity = ctx\.createBiquadFilter\(\);\s*clarity\.type = 'peaking';\s*clarity\.Q\.value = 1\.5;\s*clarityFilterRef\.current = clarity;\s*const comp = ctx\.createDynamicsCompressor\(\);\s*compRef\.current = comp;/g,
  `const vocalBandpass = ctx.createBiquadFilter();
          vocalBandpass.type = 'bandpass';
          vocalBandpass.frequency.value = 1500;
          vocalBandpass.Q.value = 0.8;
          vocalBandpassRef.current = vocalBandpass;
          
          const vocalClarity = ctx.createBiquadFilter();
          vocalClarity.type = 'peaking';
          vocalClarity.frequency.value = 3000;
          vocalClarity.Q.value = 1.5;
          vocalClarity.gain.value = 5;
          vocalClarityRef.current = vocalClarity;
          
          const vocalGain = ctx.createGain();
          vocalGainRef.current = vocalGain;
          
          const noiseNotch = ctx.createBiquadFilter();
          noiseNotch.type = 'notch';
          noiseNotch.frequency.value = 1500;
          noiseNotch.Q.value = 0.8;
          noiseNotchRef.current = noiseNotch;
          
          const noiseGain = ctx.createGain();
          noiseGainRef.current = noiseGain;`
);

// Disconnect logic
code = code.replace(
  /hpFilterRef\.current\.disconnect\(\);\s*lpFilterRef\.current\.disconnect\(\);\s*presFilterRef\.current\.disconnect\(\);\s*clarityFilterRef\.current\.disconnect\(\);\s*compRef\.current\.disconnect\(\);/g,
  `vocalBandpassRef.current.disconnect();
      vocalClarityRef.current.disconnect();
      vocalGainRef.current.disconnect();
      noiseNotchRef.current.disconnect();
      noiseGainRef.current.disconnect();`
);

// If statements checking refs
code = code.replace(
  /hpFilterRef\.current && lpFilterRef\.current && presFilterRef\.current && clarityFilterRef\.current && compRef\.current/g,
  `vocalBandpassRef.current && vocalClarityRef.current && vocalGainRef.current && noiseNotchRef.current && noiseGainRef.current`
);

fs.writeFileSync('src/components/Preview.tsx', code);
