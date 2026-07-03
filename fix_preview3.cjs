const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

code = code.replace(
  /  \}, \[currentTime, clip\.volume, clip\.fadeIn, clip\.fadeOut, clip\.start, clip\.duration\]\);/g,
  `  }, [currentTime, clip.volume, clip.fadeIn, clip.fadeOut, clip.start, clip.duration, clip.reduceNoise, clip.voiceEnhance, clip.equalizerEnabled, clip.preAmp, clip.compressorEnabled, clip.compRatio, clip.compThreshold]);`
);

code = code.replace(
  /  \}, \[currentTime, activeAudioClip\]\);/g,
  `  }, [currentTime, activeAudioClip?.volume, activeAudioClip?.fadeIn, activeAudioClip?.fadeOut, activeAudioClip?.start, activeAudioClip?.duration, activeAudioClip?.reduceNoise, activeAudioClip?.voiceEnhance, activeAudioClip?.equalizerEnabled, activeAudioClip?.preAmp, activeAudioClip?.compressorEnabled, activeAudioClip?.compRatio, activeAudioClip?.compThreshold, activeAudioClip]);`
);

fs.writeFileSync('src/components/Preview.tsx', code);
