const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// Replace refs (Video)
code = code.replace(
  /const vocalBandpassRef = useRef<BiquadFilterNode \| null>\(null\);\s*const vocalClarityRef = useRef<BiquadFilterNode \| null>\(null\);\s*const vocalGainRef = useRef<GainNode \| null>\(null\);\s*const noiseNotchRef = useRef<BiquadFilterNode \| null>\(null\);\s*const noiseGainRef = useRef<GainNode \| null>\(null\);/,
  `const aiNodeRef = useRef<AudioWorkletNode | null>(null);`
);

// Replace refs (Audio) - second occurrence
code = code.replace(
  /const vocalBandpassRef = useRef<BiquadFilterNode \| null>\(null\);\s*const vocalClarityRef = useRef<BiquadFilterNode \| null>\(null\);\s*const vocalGainRef = useRef<GainNode \| null>\(null\);\s*const noiseNotchRef = useRef<BiquadFilterNode \| null>\(null\);\s*const noiseGainRef = useRef<GainNode \| null>\(null\);/,
  `const aiNodeRef = useRef<AudioWorkletNode | null>(null);`
);

// Video Setup
const videoSetupRegex = /const vocalBandpass = ctx\.createBiquadFilter\(\);[\s\S]*?noiseGainRef\.current = noiseGain;/;
code = code.replace(videoSetupRegex, 
  `ctx.audioWorklet.addModule('/ai-noise-reduction.js').then(() => {
            const aiNode = new AudioWorkletNode(ctx, 'ai-noise-reduction');
            aiNodeRef.current = aiNode;
          }).catch(console.error);`
);

// Video Re-route
const videoRerouteRegex = /vocalBandpassRef\.current\.disconnect\(\);\s*vocalClarityRef\.current\.disconnect\(\);\s*vocalGainRef\.current\.disconnect\(\);\s*noiseNotchRef\.current\.disconnect\(\);\s*noiseGainRef\.current\.disconnect\(\);/;
code = code.replace(videoRerouteRegex, 
  `if (aiNodeRef.current) aiNodeRef.current.disconnect();`
);

// Video If Ref
const videoIfRefRegex = /vocalBandpassRef\.current && vocalClarityRef\.current && vocalGainRef\.current && noiseNotchRef\.current && noiseGainRef\.current/;
code = code.replace(videoIfRefRegex, `aiNodeRef.current`);

// Video Logic
const videoLogicRegex = /if \(clip\.reduceNoise\) \{[\s\S]*?currentNode = sumNode;\s*\}/;
code = code.replace(videoLogicRegex, 
  `if (clip.reduceNoise && aiNodeRef.current) {
        const vVol = clip.vocalVolume ?? 100;
        const nVol = clip.backgroundVolume ?? 0;
        
        const vParam = aiNodeRef.current.parameters.get('vocalVolume');
        if (vParam) vParam.value = vVol / 100;
        
        const nParam = aiNodeRef.current.parameters.get('backgroundVolume');
        if (nParam) nParam.value = nVol / 100;
        
        currentNode.connect(aiNodeRef.current);
        currentNode = aiNodeRef.current;
      }`
);

// Audio Setup
const audioSetupRegex = /const vocalBandpass = ctx\.createBiquadFilter\(\);[\s\S]*?noiseGainRef\.current = noiseGain;/;
code = code.replace(audioSetupRegex, 
  `ctx.audioWorklet.addModule('/ai-noise-reduction.js').then(() => {
            const aiNode = new AudioWorkletNode(ctx, 'ai-noise-reduction');
            aiNodeRef.current = aiNode;
          }).catch(console.error);`
);

// Audio Re-route
const audioRerouteRegex = /vocalBandpassRef\.current\.disconnect\(\);\s*vocalClarityRef\.current\.disconnect\(\);\s*vocalGainRef\.current\.disconnect\(\);\s*noiseNotchRef\.current\.disconnect\(\);\s*noiseGainRef\.current\.disconnect\(\);/;
code = code.replace(audioRerouteRegex, 
  `if (aiNodeRef.current) aiNodeRef.current.disconnect();`
);

// Audio If Ref
const audioIfRefRegex = /vocalBandpassRef\.current && vocalClarityRef\.current && vocalGainRef\.current && noiseNotchRef\.current && noiseGainRef\.current/;
code = code.replace(audioIfRefRegex, `aiNodeRef.current`);

// Audio Logic
const audioLogicRegex = /if \(activeAudioClip\.reduceNoise\) \{[\s\S]*?currentNode = sumNode;\s*\}/;
code = code.replace(audioLogicRegex, 
  `if (activeAudioClip.reduceNoise && aiNodeRef.current) {
        const vVol = activeAudioClip.vocalVolume ?? 100;
        const nVol = activeAudioClip.backgroundVolume ?? 0;
        
        const vParam = aiNodeRef.current.parameters.get('vocalVolume');
        if (vParam) vParam.value = vVol / 100;
        
        const nParam = aiNodeRef.current.parameters.get('backgroundVolume');
        if (nParam) nParam.value = nVol / 100;
        
        currentNode.connect(aiNodeRef.current);
        currentNode = aiNodeRef.current;
      }`
);

fs.writeFileSync('src/components/Preview.tsx', code);
