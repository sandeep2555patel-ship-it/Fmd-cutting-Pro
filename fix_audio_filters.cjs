const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// Also update the leftover audio layer setup
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

fs.writeFileSync('src/components/Preview.tsx', code);
