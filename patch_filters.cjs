const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// For VideoLayer
const targetVideoRouting = `      if (clip.reduceNoise) {
        if (clip.noiseReductionLevel === 'Strong') {
           filterRef.current.Q.value = 2.0;
        } else if (clip.noiseReductionLevel === 'Weak') {
           filterRef.current.Q.value = 0.2;
        } else {
           filterRef.current.Q.value = 0.8;
        }
        currentNode.connect(filterRef.current);
        currentNode = filterRef.current;
      }`;

const replacementVideoRouting = `      if (clip.reduceNoise) {
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

code = code.replace(targetVideoRouting, replacementVideoRouting);

// For AudioRef
const targetAudioRouting = `      if (activeAudioClip.reduceNoise) {
        if (activeAudioClip.noiseReductionLevel === 'Strong') {
           filterRef.current.Q.value = 2.0;
        } else if (activeAudioClip.noiseReductionLevel === 'Weak') {
           filterRef.current.Q.value = 0.2;
        } else {
           filterRef.current.Q.value = 0.8;
        }
        currentNode.connect(filterRef.current);
        currentNode = filterRef.current;
      }`;

const replacementAudioRouting = `      if (activeAudioClip.reduceNoise) {
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

code = code.replace(targetAudioRouting, replacementAudioRouting);

fs.writeFileSync('src/components/Preview.tsx', code);
