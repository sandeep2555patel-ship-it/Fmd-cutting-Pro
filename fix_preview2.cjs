const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

code = code.replace(
  `      // Fake effects for UI responsiveness without WebAudio CORS risks
      if (clip.reduceNoise) v *= 0.8;
      if (clip.voiceEnhance) v *= 1.2;
      if (clip.equalizerEnabled && clip.preAmp !== undefined) {
        v *= (clip.preAmp / 50);
      }

      videoRef.current.volume = Math.max(0, Math.min(1, v));`,
  `      // Fake effects for UI responsiveness without WebAudio CORS risks
      if (clip.reduceNoise) v *= 0.8;
      if (clip.voiceEnhance) v *= 1.2;
      if (clip.equalizerEnabled && clip.preAmp !== undefined) {
        v *= (clip.preAmp / 50);
      }
      if (clip.compressorEnabled) {
        const ratio = (clip.compRatio || 40) / 10;
        if (v > 0.5) v = 0.5 + (v - 0.5) / ratio;
      }

      videoRef.current.volume = Math.max(0, Math.min(1, v));`
);

code = code.replace(
  `      // Fake effects for UI responsiveness without WebAudio CORS risks
      if (activeAudioClip.reduceNoise) v *= 0.8;
      if (activeAudioClip.voiceEnhance) v *= 1.2;
      if (activeAudioClip.equalizerEnabled && activeAudioClip.preAmp !== undefined) {
        v *= (activeAudioClip.preAmp / 50);
      }
      
      audioRef.current.volume = Math.max(0, Math.min(1, v));`,
  `      // Fake effects for UI responsiveness without WebAudio CORS risks
      if (activeAudioClip.reduceNoise) v *= 0.8;
      if (activeAudioClip.voiceEnhance) v *= 1.2;
      if (activeAudioClip.equalizerEnabled && activeAudioClip.preAmp !== undefined) {
        v *= (activeAudioClip.preAmp / 50);
      }
      if (activeAudioClip.compressorEnabled) {
        const ratio = (activeAudioClip.compRatio || 40) / 10;
        if (v > 0.5) v = 0.5 + (v - 0.5) / ratio;
      }
      
      audioRef.current.volume = Math.max(0, Math.min(1, v));`
);

fs.writeFileSync('src/components/Preview.tsx', code);
