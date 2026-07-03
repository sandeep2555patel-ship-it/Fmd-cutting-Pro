const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// For VideoLayer refs
code = code.replace(
  `  const hpFilterRef = useRef<BiquadFilterNode | null>(null);
  const lpFilterRef = useRef<BiquadFilterNode | null>(null);
  const presFilterRef = useRef<BiquadFilterNode | null>(null);`,
  `  const hpFilterRef = useRef<BiquadFilterNode | null>(null);
  const lpFilterRef = useRef<BiquadFilterNode | null>(null);
  const presFilterRef = useRef<BiquadFilterNode | null>(null);
  const clarityFilterRef = useRef<BiquadFilterNode | null>(null);
  const compRef = useRef<DynamicsCompressorNode | null>(null);`
);

// Setup Video
const setupVideo = `          const hp = ctx.createBiquadFilter();
          hp.type = 'highpass';
          hpFilterRef.current = hp;
          
          const lp = ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lpFilterRef.current = lp;
          
          const pres = ctx.createBiquadFilter();
          pres.type = 'peaking';
          pres.Q.value = 1.0;
          presFilterRef.current = pres;`;
const newSetupVideo = `          const hp = ctx.createBiquadFilter();
          hp.type = 'highpass';
          hpFilterRef.current = hp;
          
          const lp = ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lpFilterRef.current = lp;
          
          const pres = ctx.createBiquadFilter();
          pres.type = 'peaking';
          pres.Q.value = 1.0;
          presFilterRef.current = pres;
          
          const clarity = ctx.createBiquadFilter();
          clarity.type = 'peaking';
          clarity.Q.value = 1.5;
          clarityFilterRef.current = clarity;
          
          const comp = ctx.createDynamicsCompressor();
          compRef.current = comp;`;
code = code.replace(setupVideo, newSetupVideo);

// Route Video
const routeVideo = `  // Re-route based on effects
  useEffect(() => {
    if (audioCtxRef.current && sourceRef.current && hpFilterRef.current && lpFilterRef.current && presFilterRef.current && enhanceRef.current) {
      const ctx = audioCtxRef.current;
      sourceRef.current.disconnect();
      hpFilterRef.current.disconnect();
      lpFilterRef.current.disconnect();
      presFilterRef.current.disconnect();
      enhanceRef.current.disconnect();`;
const newRouteVideo = `  // Re-route based on effects
  useEffect(() => {
    if (audioCtxRef.current && sourceRef.current && hpFilterRef.current && lpFilterRef.current && presFilterRef.current && clarityFilterRef.current && compRef.current && enhanceRef.current) {
      const ctx = audioCtxRef.current;
      sourceRef.current.disconnect();
      hpFilterRef.current.disconnect();
      lpFilterRef.current.disconnect();
      presFilterRef.current.disconnect();
      clarityFilterRef.current.disconnect();
      compRef.current.disconnect();
      enhanceRef.current.disconnect();`;
code = code.replace(routeVideo, newRouteVideo);

const logicVideo = `        if (clip.noiseReductionLevel === 'Strong') {
           // Extreme: kill all low end (dogs, wind), kill all high end (birds, fans)
           hpFilterRef.current.frequency.value = 350;
           lpFilterRef.current.frequency.value = 2500;
           presFilterRef.current.frequency.value = 1500;
           presFilterRef.current.gain.value = 5; // Boost vocals
        } else if (clip.noiseReductionLevel === 'Weak') {
           hpFilterRef.current.frequency.value = 100;
           lpFilterRef.current.frequency.value = 6000;
           presFilterRef.current.frequency.value = 1500;
           presFilterRef.current.gain.value = 1;
        } else {
           hpFilterRef.current.frequency.value = 250;
           lpFilterRef.current.frequency.value = 3500;
           presFilterRef.current.frequency.value = 1500;
           presFilterRef.current.gain.value = 3;
        }
        
        currentNode.connect(hpFilterRef.current);
        hpFilterRef.current.connect(lpFilterRef.current);
        lpFilterRef.current.connect(presFilterRef.current);
        currentNode = presFilterRef.current;`;
const newLogicVideo = `        if (clip.noiseReductionLevel === 'Strong') {
           hpFilterRef.current.frequency.value = 400; // Aggressive cut of wind/rumble
           hpFilterRef.current.Q.value = 2.0;
           lpFilterRef.current.frequency.value = 3000; // Aggressive cut of hiss/birds
           lpFilterRef.current.Q.value = 2.0;
           presFilterRef.current.frequency.value = 1200; // Core vocal body
           presFilterRef.current.gain.value = 8; 
           clarityFilterRef.current.frequency.value = 2500; // Vocal clarity/presence
           clarityFilterRef.current.gain.value = 5;
           
           compRef.current.threshold.value = -30;
           compRef.current.ratio.value = 12;
           compRef.current.attack.value = 0.005;
           compRef.current.release.value = 0.1;
        } else if (clip.noiseReductionLevel === 'Weak') {
           hpFilterRef.current.frequency.value = 150;
           lpFilterRef.current.frequency.value = 6000;
           presFilterRef.current.frequency.value = 1200;
           presFilterRef.current.gain.value = 2;
           clarityFilterRef.current.frequency.value = 2500;
           clarityFilterRef.current.gain.value = 2;
           
           compRef.current.threshold.value = -20;
           compRef.current.ratio.value = 4;
        } else {
           hpFilterRef.current.frequency.value = 250;
           lpFilterRef.current.frequency.value = 4000;
           presFilterRef.current.frequency.value = 1200;
           presFilterRef.current.gain.value = 5;
           clarityFilterRef.current.frequency.value = 2500;
           clarityFilterRef.current.gain.value = 4;
           
           compRef.current.threshold.value = -24;
           compRef.current.ratio.value = 8;
        }
        
        currentNode.connect(hpFilterRef.current);
        hpFilterRef.current.connect(lpFilterRef.current);
        lpFilterRef.current.connect(presFilterRef.current);
        presFilterRef.current.connect(clarityFilterRef.current);
        clarityFilterRef.current.connect(compRef.current);
        currentNode = compRef.current;`;
code = code.replace(logicVideo, newLogicVideo);


// For AudioLayer refs
code = code.replace(
  `  const hpFilterRef = useRef<BiquadFilterNode | null>(null);
  const lpFilterRef = useRef<BiquadFilterNode | null>(null);
  const presFilterRef = useRef<BiquadFilterNode | null>(null);`,
  `  const hpFilterRef = useRef<BiquadFilterNode | null>(null);
  const lpFilterRef = useRef<BiquadFilterNode | null>(null);
  const presFilterRef = useRef<BiquadFilterNode | null>(null);
  const clarityFilterRef = useRef<BiquadFilterNode | null>(null);
  const compRef = useRef<DynamicsCompressorNode | null>(null);`
);

code = code.replace(setupVideo, newSetupVideo);

const routeAudio = `  useEffect(() => {
    if (audioCtxRef.current && sourceRef.current && hpFilterRef.current && lpFilterRef.current && presFilterRef.current && enhanceRef.current && activeAudioClip) {
      const ctx = audioCtxRef.current;
      sourceRef.current.disconnect();
      hpFilterRef.current.disconnect();
      lpFilterRef.current.disconnect();
      presFilterRef.current.disconnect();
      enhanceRef.current.disconnect();`;
const newRouteAudio = `  useEffect(() => {
    if (audioCtxRef.current && sourceRef.current && hpFilterRef.current && lpFilterRef.current && presFilterRef.current && clarityFilterRef.current && compRef.current && enhanceRef.current && activeAudioClip) {
      const ctx = audioCtxRef.current;
      sourceRef.current.disconnect();
      hpFilterRef.current.disconnect();
      lpFilterRef.current.disconnect();
      presFilterRef.current.disconnect();
      clarityFilterRef.current.disconnect();
      compRef.current.disconnect();
      enhanceRef.current.disconnect();`;
code = code.replace(routeAudio, newRouteAudio);

const logicAudio = `        if (activeAudioClip.noiseReductionLevel === 'Strong') {
           hpFilterRef.current.frequency.value = 350;
           lpFilterRef.current.frequency.value = 2500;
           presFilterRef.current.frequency.value = 1500;
           presFilterRef.current.gain.value = 5;
        } else if (activeAudioClip.noiseReductionLevel === 'Weak') {
           hpFilterRef.current.frequency.value = 100;
           lpFilterRef.current.frequency.value = 6000;
           presFilterRef.current.frequency.value = 1500;
           presFilterRef.current.gain.value = 1;
        } else {
           hpFilterRef.current.frequency.value = 250;
           lpFilterRef.current.frequency.value = 3500;
           presFilterRef.current.frequency.value = 1500;
           presFilterRef.current.gain.value = 3;
        }
        
        currentNode.connect(hpFilterRef.current);
        hpFilterRef.current.connect(lpFilterRef.current);
        lpFilterRef.current.connect(presFilterRef.current);
        currentNode = presFilterRef.current;`;
const newLogicAudio = `        if (activeAudioClip.noiseReductionLevel === 'Strong') {
           hpFilterRef.current.frequency.value = 400; // Aggressive cut of wind/rumble
           hpFilterRef.current.Q.value = 2.0;
           lpFilterRef.current.frequency.value = 3000; // Aggressive cut of hiss/birds
           lpFilterRef.current.Q.value = 2.0;
           presFilterRef.current.frequency.value = 1200; // Core vocal body
           presFilterRef.current.gain.value = 8; 
           clarityFilterRef.current.frequency.value = 2500; // Vocal clarity/presence
           clarityFilterRef.current.gain.value = 5;
           
           compRef.current.threshold.value = -30;
           compRef.current.ratio.value = 12;
           compRef.current.attack.value = 0.005;
           compRef.current.release.value = 0.1;
        } else if (activeAudioClip.noiseReductionLevel === 'Weak') {
           hpFilterRef.current.frequency.value = 150;
           lpFilterRef.current.frequency.value = 6000;
           presFilterRef.current.frequency.value = 1200;
           presFilterRef.current.gain.value = 2;
           clarityFilterRef.current.frequency.value = 2500;
           clarityFilterRef.current.gain.value = 2;
           
           compRef.current.threshold.value = -20;
           compRef.current.ratio.value = 4;
        } else {
           hpFilterRef.current.frequency.value = 250;
           lpFilterRef.current.frequency.value = 4000;
           presFilterRef.current.frequency.value = 1200;
           presFilterRef.current.gain.value = 5;
           clarityFilterRef.current.frequency.value = 2500;
           clarityFilterRef.current.gain.value = 4;
           
           compRef.current.threshold.value = -24;
           compRef.current.ratio.value = 8;
        }
        
        currentNode.connect(hpFilterRef.current);
        hpFilterRef.current.connect(lpFilterRef.current);
        hpFilterRef.current.connect(presFilterRef.current);
        presFilterRef.current.connect(clarityFilterRef.current);
        clarityFilterRef.current.connect(compRef.current);
        currentNode = compRef.current;`;
code = code.replace(logicAudio, newLogicAudio);


fs.writeFileSync('src/components/Preview.tsx', code);
