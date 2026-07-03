const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// The original logic for video
const targetLogicVideo = `      if (clip.reduceNoise) {
        if (clip.noiseReductionLevel === 'Strong') {
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
        currentNode = compRef.current;
      }`;

const newLogicVideo = `      if (clip.reduceNoise) {
        const vVol = clip.vocalVolume ?? 100;
        const nVol = clip.backgroundVolume ?? 0;
        
        // Setup vocal path
        vocalGainRef.current.gain.value = vVol / 100;
        currentNode.connect(vocalBandpassRef.current);
        vocalBandpassRef.current.connect(vocalClarityRef.current);
        vocalClarityRef.current.connect(vocalGainRef.current);
        
        // Setup noise path
        noiseGainRef.current.gain.value = nVol / 100;
        currentNode.connect(noiseNotchRef.current);
        noiseNotchRef.current.connect(noiseGainRef.current);
        
        // A temporary Gain node to sum them
        const sumNode = ctx.createGain();
        sumNode.gain.value = 1.0;
        
        vocalGainRef.current.connect(sumNode);
        noiseGainRef.current.connect(sumNode);
        
        currentNode = sumNode;
      }`;

code = code.replace(targetLogicVideo, newLogicVideo);

// The original logic for audio
const targetLogicAudio = `      if (activeAudioClip.reduceNoise) {
        if (activeAudioClip.noiseReductionLevel === 'Strong') {
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
        currentNode = compRef.current;
      }`;

const newLogicAudio = `      if (activeAudioClip.reduceNoise) {
        const vVol = activeAudioClip.vocalVolume ?? 100;
        const nVol = activeAudioClip.backgroundVolume ?? 0;
        
        vocalGainRef.current.gain.value = vVol / 100;
        currentNode.connect(vocalBandpassRef.current);
        vocalBandpassRef.current.connect(vocalClarityRef.current);
        vocalClarityRef.current.connect(vocalGainRef.current);
        
        noiseGainRef.current.gain.value = nVol / 100;
        currentNode.connect(noiseNotchRef.current);
        noiseNotchRef.current.connect(noiseGainRef.current);
        
        const sumNode = ctx.createGain();
        sumNode.gain.value = 1.0;
        
        vocalGainRef.current.connect(sumNode);
        noiseGainRef.current.connect(sumNode);
        
        currentNode = sumNode;
      }`;
code = code.replace(targetLogicAudio, newLogicAudio);

// Also update dependency arrays
code = code.replace(
  `[clip.reduceNoise, clip.voiceEnhance, clip.noiseReductionLevel]`,
  `[clip.reduceNoise, clip.voiceEnhance, clip.vocalVolume, clip.backgroundVolume]`
);

code = code.replace(
  `[activeAudioClip?.reduceNoise, activeAudioClip?.voiceEnhance, activeAudioClip?.noiseReductionLevel]`,
  `[activeAudioClip?.reduceNoise, activeAudioClip?.voiceEnhance, activeAudioClip?.vocalVolume, activeAudioClip?.backgroundVolume]`
);

fs.writeFileSync('src/components/Preview.tsx', code);
