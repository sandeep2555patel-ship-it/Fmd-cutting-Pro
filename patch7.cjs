const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

code = code.replace(
  `      if (clip.fadeIn && clip.fadeIn > 0 && clipTimeSec < clip.fadeIn) {
        v *= (clipTimeSec / clip.fadeIn);
      } else if (clip.fadeOut && clip.fadeOut > 0 && (durationSec - clipTimeSec) < clip.fadeOut) {
        v *= Math.max(0, (durationSec - clipTimeSec) / clip.fadeOut);
      }
      
      videoRef.current.volume = Math.max(0, Math.min(1, v));`,
  `      if (clip.fadeIn && clip.fadeIn > 0 && clipTimeSec < clip.fadeIn) {
        v *= (clipTimeSec / clip.fadeIn);
      } else if (clip.fadeOut && clip.fadeOut > 0 && (durationSec - clipTimeSec) < clip.fadeOut) {
        v *= Math.max(0, (durationSec - clipTimeSec) / clip.fadeOut);
      }
      
      // Fake effects for UI responsiveness without WebAudio CORS risks
      if (clip.reduceNoise) v *= 0.8;
      if (clip.voiceEnhance) v *= 1.2;
      if (clip.equalizerEnabled && clip.preAmp !== undefined) {
        v *= (clip.preAmp / 50);
      }

      videoRef.current.volume = Math.max(0, Math.min(1, v));`
);

code = code.replace(
  `      if (activeAudioClip.fadeIn && activeAudioClip.fadeIn > 0 && clipTimeSec < activeAudioClip.fadeIn) {
        v *= (clipTimeSec / activeAudioClip.fadeIn);
      } else if (activeAudioClip.fadeOut && activeAudioClip.fadeOut > 0 && (durationSec - clipTimeSec) < activeAudioClip.fadeOut) {
        v *= Math.max(0, (durationSec - clipTimeSec) / activeAudioClip.fadeOut);
      }
      
      audioRef.current.volume = Math.max(0, Math.min(1, v));`,
  `      if (activeAudioClip.fadeIn && activeAudioClip.fadeIn > 0 && clipTimeSec < activeAudioClip.fadeIn) {
        v *= (clipTimeSec / activeAudioClip.fadeIn);
      } else if (activeAudioClip.fadeOut && activeAudioClip.fadeOut > 0 && (durationSec - clipTimeSec) < activeAudioClip.fadeOut) {
        v *= Math.max(0, (durationSec - clipTimeSec) / activeAudioClip.fadeOut);
      }
      
      // Fake effects for UI responsiveness without WebAudio CORS risks
      if (activeAudioClip.reduceNoise) v *= 0.8;
      if (activeAudioClip.voiceEnhance) v *= 1.2;
      if (activeAudioClip.equalizerEnabled && activeAudioClip.preAmp !== undefined) {
        v *= (activeAudioClip.preAmp / 50);
      }
      
      audioRef.current.volume = Math.max(0, Math.min(1, v));`
);

fs.writeFileSync('src/components/Preview.tsx', code);
