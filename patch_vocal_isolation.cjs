const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// Update refs in VideoLayer
code = code.replace(
  `  const filterRef = useRef<BiquadFilterNode | null>(null);`,
  `  const hpFilterRef = useRef<BiquadFilterNode | null>(null);
  const lpFilterRef = useRef<BiquadFilterNode | null>(null);
  const presFilterRef = useRef<BiquadFilterNode | null>(null);`
);

// Update setup in VideoLayer
const targetSetupVideo = `          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 1500;
          filter.Q.value = 0.5;
          filterRef.current = filter;`;
          
const replaceSetupVideo = `          const hp = ctx.createBiquadFilter();
          hp.type = 'highpass';
          hpFilterRef.current = hp;
          
          const lp = ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lpFilterRef.current = lp;
          
          const pres = ctx.createBiquadFilter();
          pres.type = 'peaking';
          pres.Q.value = 1.0;
          presFilterRef.current = pres;`;

code = code.replace(targetSetupVideo, replaceSetupVideo);

// Update routing in VideoLayer
const targetRouteVideo = `  // Re-route based on effects
  useEffect(() => {
    if (audioCtxRef.current && sourceRef.current && filterRef.current && enhanceRef.current) {
      const ctx = audioCtxRef.current;
      sourceRef.current.disconnect();
      filterRef.current.disconnect();
      enhanceRef.current.disconnect();
      
      let currentNode = sourceRef.current as AudioNode;
      
      // Extremely aggressive Noise Reduction (bandpass filter)
      if (clip.reduceNoise) {
        // Highpass to kill rumble, lowpass to kill hiss - simulated with strong bandpass
        if (clip.noiseReductionLevel === 'Strong') {
           filterRef.current.Q.value = 3.0; // Very tight band
           filterRef.current.frequency.value = 1000;
        } else if (clip.noiseReductionLevel === 'Weak') {
           filterRef.current.Q.value = 0.5;
           filterRef.current.frequency.value = 1500;
        } else {
           filterRef.current.Q.value = 1.0;
           filterRef.current.frequency.value = 1200;
        }
        currentNode.connect(filterRef.current);
        currentNode = filterRef.current;
      }`;
      
const replaceRouteVideo = `  // Re-route based on effects
  useEffect(() => {
    if (audioCtxRef.current && sourceRef.current && hpFilterRef.current && lpFilterRef.current && presFilterRef.current && enhanceRef.current) {
      const ctx = audioCtxRef.current;
      sourceRef.current.disconnect();
      hpFilterRef.current.disconnect();
      lpFilterRef.current.disconnect();
      presFilterRef.current.disconnect();
      enhanceRef.current.disconnect();
      
      let currentNode = sourceRef.current as AudioNode;
      
      if (clip.reduceNoise) {
        // Vocal Isolation Chain
        if (clip.noiseReductionLevel === 'Strong') {
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
        currentNode = presFilterRef.current;
      }`;

code = code.replace(targetRouteVideo, replaceRouteVideo);


// Now for Audio section
// Update refs in AudioLayer
code = code.replace(
  `  const filterRef = useRef<BiquadFilterNode | null>(null);`,
  `  const hpFilterRef = useRef<BiquadFilterNode | null>(null);
  const lpFilterRef = useRef<BiquadFilterNode | null>(null);
  const presFilterRef = useRef<BiquadFilterNode | null>(null);`
);

// Update setup in AudioLayer
const targetSetupAudio = `          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 1500;
          filter.Q.value = 0.5;
          filterRef.current = filter;`;
          
const replaceSetupAudio = `          const hp = ctx.createBiquadFilter();
          hp.type = 'highpass';
          hpFilterRef.current = hp;
          
          const lp = ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lpFilterRef.current = lp;
          
          const pres = ctx.createBiquadFilter();
          pres.type = 'peaking';
          pres.Q.value = 1.0;
          presFilterRef.current = pres;`;

code = code.replace(targetSetupAudio, replaceSetupAudio);


// Update routing in AudioLayer
const targetRouteAudio = `  useEffect(() => {
    if (audioCtxRef.current && sourceRef.current && filterRef.current && enhanceRef.current && activeAudioClip) {
      const ctx = audioCtxRef.current;
      sourceRef.current.disconnect();
      filterRef.current.disconnect();
      enhanceRef.current.disconnect();
      
      let currentNode = sourceRef.current as AudioNode;
      
      if (activeAudioClip.reduceNoise) {
        if (activeAudioClip.noiseReductionLevel === 'Strong') {
           filterRef.current.Q.value = 3.0;
           filterRef.current.frequency.value = 1000;
        } else if (activeAudioClip.noiseReductionLevel === 'Weak') {
           filterRef.current.Q.value = 0.5;
           filterRef.current.frequency.value = 1500;
        } else {
           filterRef.current.Q.value = 1.0;
           filterRef.current.frequency.value = 1200;
        }
        currentNode.connect(filterRef.current);
        currentNode = filterRef.current;
      }`;
      
const replaceRouteAudio = `  useEffect(() => {
    if (audioCtxRef.current && sourceRef.current && hpFilterRef.current && lpFilterRef.current && presFilterRef.current && enhanceRef.current && activeAudioClip) {
      const ctx = audioCtxRef.current;
      sourceRef.current.disconnect();
      hpFilterRef.current.disconnect();
      lpFilterRef.current.disconnect();
      presFilterRef.current.disconnect();
      enhanceRef.current.disconnect();
      
      let currentNode = sourceRef.current as AudioNode;
      
      if (activeAudioClip.reduceNoise) {
        if (activeAudioClip.noiseReductionLevel === 'Strong') {
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
        currentNode = presFilterRef.current;
      }`;
      
code = code.replace(targetRouteAudio, replaceRouteAudio);


fs.writeFileSync('src/components/Preview.tsx', code);
