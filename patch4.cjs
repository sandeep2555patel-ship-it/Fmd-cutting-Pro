const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

const target1 = `  useEffect(() => {
    if (isPlaying) {
      if (videoRef.current) {
        let clipLocalTime = Math.max(0, (currentTime - clip.start) / 20);`;

const replacement1 = `  useEffect(() => {
    if (videoRef.current) {
      let v = (clip.volume ?? 100) / 100;
      let clipTimeSec = Math.max(0, (currentTime - clip.start) / 20);
      let durationSec = clip.duration / 20;

      if (clip.fadeIn && clip.fadeIn > 0 && clipTimeSec < clip.fadeIn) {
        v *= (clipTimeSec / clip.fadeIn);
      } else if (clip.fadeOut && clip.fadeOut > 0 && (durationSec - clipTimeSec) < clip.fadeOut) {
        v *= Math.max(0, (durationSec - clipTimeSec) / clip.fadeOut);
      }
      
      // Mute completely if Reduce Noise is checked for now to show "some" effect, 
      // or actually we don't have WebAudio so just set volume
      videoRef.current.volume = Math.max(0, Math.min(1, v));
    }
  }, [currentTime, clip.volume, clip.fadeIn, clip.fadeOut, clip.start, clip.duration]);

  useEffect(() => {
    if (isPlaying) {
      if (videoRef.current) {
        let clipLocalTime = Math.max(0, (currentTime - clip.start) / 20);`;

code = code.replace(target1, replacement1);

const target2 = `  useEffect(() => {
    if (isPlaying) {
      const a = audioRef.current;`;

const replacement2 = `  useEffect(() => {
    if (audioRef.current && activeAudioClip) {
      let v = (activeAudioClip.volume ?? 100) / 100;
      let clipTimeSec = Math.max(0, (currentTime - activeAudioClip.start) / 20);
      let durationSec = activeAudioClip.duration / 20;

      if (activeAudioClip.fadeIn && activeAudioClip.fadeIn > 0 && clipTimeSec < activeAudioClip.fadeIn) {
        v *= (clipTimeSec / activeAudioClip.fadeIn);
      } else if (activeAudioClip.fadeOut && activeAudioClip.fadeOut > 0 && (durationSec - clipTimeSec) < activeAudioClip.fadeOut) {
        v *= Math.max(0, (durationSec - clipTimeSec) / activeAudioClip.fadeOut);
      }
      
      audioRef.current.volume = Math.max(0, Math.min(1, v));
    }
  }, [currentTime, activeAudioClip]);

  useEffect(() => {
    if (isPlaying) {
      const a = audioRef.current;`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/components/Preview.tsx', code);
