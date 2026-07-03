const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// Add refs to audio layer
const targetAudioRefs = `  const presFilterRef = useRef<BiquadFilterNode | null>(null);
  const enhanceRef = useRef<BiquadFilterNode | null>(null);`;
const replaceAudioRefs = `  const presFilterRef = useRef<BiquadFilterNode | null>(null);
  const clarityFilterRef = useRef<BiquadFilterNode | null>(null);
  const compRef = useRef<DynamicsCompressorNode | null>(null);
  const enhanceRef = useRef<BiquadFilterNode | null>(null);`;

code = code.replace(targetAudioRefs, replaceAudioRefs);

fs.writeFileSync('src/components/Preview.tsx', code);
