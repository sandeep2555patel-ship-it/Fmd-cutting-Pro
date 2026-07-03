const fs = require('fs');

// 1. Create the AudioWorklet for AI Noise Gate
const workletCode = `
class AINoiseGate extends AudioWorkletProcessor {
  constructor() {
    super();
    this.envelope = 0;
    // Approximation for 48kHz sample rate
    this.attack = 0.99; 
    this.release = 0.9995; 
  }

  static get parameterDescriptors() {
    return [
      { name: 'vocalVolume', defaultValue: 1.0, minValue: 0, maxValue: 2.0 },
      { name: 'backgroundVolume', defaultValue: 0.0, minValue: 0, maxValue: 2.0 }
    ];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    if (!input || !input.length || !output || !output.length) return true;

    const vVol = parameters.vocalVolume.length > 1 ? parameters.vocalVolume[0] : parameters.vocalVolume;
    const nVol = parameters.backgroundVolume.length > 1 ? parameters.backgroundVolume[0] : parameters.backgroundVolume;

    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];
      
      for (let i = 0; i < inputChannel.length; i++) {
        const sample = inputChannel[i];
        
        const abs = Math.abs(sample);
        if (abs > this.envelope) {
          this.envelope = this.attack * this.envelope + (1 - this.attack) * abs;
        } else {
          this.envelope = this.release * this.envelope + (1 - this.release) * abs;
        }
        
        const noiseThresh = 0.002; // -54dB
        const vocalThresh = 0.015; // -36dB
        
        let mix = 0;
        if (this.envelope > vocalThresh) {
          mix = 1.0;
        } else if (this.envelope > noiseThresh) {
          mix = (this.envelope - noiseThresh) / (vocalThresh - noiseThresh);
          mix = mix * mix * (3 - 2 * mix); // smoothstep
        }
        
        const gain = mix * vVol + (1 - mix) * nVol;
        outputChannel[i] = sample * gain;
      }
    }
    
    return true;
  }
}
registerProcessor('ai-noise-gate', AINoiseGate);
`;
if (!fs.existsSync('public')) fs.mkdirSync('public');
fs.writeFileSync('public/ai-noise-gate.js', workletCode);

let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// Add aiNodeRef to the top of both useEffect hooks where refs are defined
code = code.replace(
  /const vocalHpRef = useRef<BiquadFilterNode \| null>\(null\);/g,
  `const aiNodeRef = useRef<AudioWorkletNode | null>(null);
  const vocalHpRef = useRef<BiquadFilterNode | null>(null);`
);

// Add the Worklet setup in the initialization block (Video)
code = code.replace(
  /const hp = ctx\.createBiquadFilter\(\);[\s\S]*?hp\.type = 'highpass';/g,
  `ctx.audioWorklet.addModule('./ai-noise-gate.js').then(() => {
            const aiNode = new AudioWorkletNode(ctx, 'ai-noise-gate');
            aiNodeRef.current = aiNode;
          }).catch(console.error);
          
          const hp = ctx.createBiquadFilter();
          hp.type = 'highpass';`
);

// Fix Compressor so it limits hard instead of distorting
code = code.replace(
  /comp\.threshold\.value = -12;\s*comp\.knee\.value = 15;\s*comp\.ratio\.value = 20;/g,
  `comp.threshold.value = -3;
          comp.knee.value = 5;
          comp.ratio.value = 20;
          comp.attack.value = 0.001;
          comp.release.value = 0.05;`
);

// Add aiNodeRef to dependencies and disconnect (Video)
code = code.replace(
  /if \(audioCtxRef\.current && sourceRef\.current && vocalHpRef\.current && vocalLpRef\.current && vocalPeakRef\.current\) \{/g,
  `if (audioCtxRef.current && sourceRef.current && vocalHpRef.current && vocalLpRef.current && vocalPeakRef.current) {`
);

code = code.replace(
  /try \{ vocalHpRef\.current\.disconnect\(\); \} catch\(e\)\{\}/g,
  `try { if(aiNodeRef.current) aiNodeRef.current.disconnect(); } catch(e){}
      try { vocalHpRef.current.disconnect(); } catch(e){}`
);

// Re-route the audio logic
const logicRegexVideo = /if \(clip\.reduceNoise\) \{[\s\S]*?currentNode = compRef\.current;\s*\}/;
code = code.replace(logicRegexVideo,
  `if (clip.reduceNoise) {
        const vVol = clip.vocalVolume ?? 100;
        const nVol = clip.backgroundVolume ?? 0;
        
        if (aiNodeRef.current) {
          const vParam = aiNodeRef.current.parameters.get('vocalVolume');
          if (vParam) vParam.value = vVol / 100;
          const nParam = aiNodeRef.current.parameters.get('backgroundVolume');
          if (nParam) nParam.value = nVol / 100;
        }

        vocalGainRef.current.gain.value = 1.0; // Let worklet handle gain
        
        // 1. HPF to remove rumble "bhbhbh"
        currentNode.connect(vocalHpRef.current);
        vocalHpRef.current.connect(vocalLpRef.current);
        vocalLpRef.current.connect(vocalPeakRef.current);
        
        // 2. AI Noise Gate (if loaded)
        if (aiNodeRef.current) {
          vocalPeakRef.current.connect(aiNodeRef.current);
          aiNodeRef.current.connect(compRef.current);
        } else {
          vocalPeakRef.current.connect(compRef.current);
        }
        
        currentNode = compRef.current;
      }`
);

const logicRegexAudio = /if \(activeAudioClip\.reduceNoise\) \{[\s\S]*?currentNode = compRef\.current;\s*\}/;
code = code.replace(logicRegexAudio,
  `if (activeAudioClip.reduceNoise) {
        const vVol = activeAudioClip.vocalVolume ?? 100;
        const nVol = activeAudioClip.backgroundVolume ?? 0;
        
        if (aiNodeRef.current) {
          const vParam = aiNodeRef.current.parameters.get('vocalVolume');
          if (vParam) vParam.value = vVol / 100;
          const nParam = aiNodeRef.current.parameters.get('backgroundVolume');
          if (nParam) nParam.value = nVol / 100;
        }

        vocalGainRef.current.gain.value = 1.0; // Let worklet handle gain
        
        // 1. HPF to remove rumble "bhbhbh"
        currentNode.connect(vocalHpRef.current);
        vocalHpRef.current.connect(vocalLpRef.current);
        vocalLpRef.current.connect(vocalPeakRef.current);
        
        // 2. AI Noise Gate (if loaded)
        if (aiNodeRef.current) {
          vocalPeakRef.current.connect(aiNodeRef.current);
          aiNodeRef.current.connect(compRef.current);
        } else {
          vocalPeakRef.current.connect(compRef.current);
        }
        
        currentNode = compRef.current;
      }`
);

fs.writeFileSync('src/components/Preview.tsx', code);
