const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

code = code.replace(
  `  const videoRef = useRef<HTMLVideoElement>(null);
  const { setIsPlaying } = useProject();`,
  `  const videoRef = useRef<HTMLVideoElement>(null);
  const { setIsPlaying } = useProject();

  useEffect(() => {
    if (videoRef.current) {
      let v = (clip.volume ?? 100) / 100;
      let clipTimeSec = Math.max(0, (currentTime - clip.start) / 20);
      let durationSec = clip.duration / 20;

      if (clip.fadeIn && clip.fadeIn > 0 && clipTimeSec < clip.fadeIn) {
        v *= (clipTimeSec / clip.fadeIn);
      } else if (clip.fadeOut && clip.fadeOut > 0 && (durationSec - clipTimeSec) < clip.fadeOut) {
        v *= Math.max(0, (durationSec - clipTimeSec) / clip.fadeOut);
      }
      
      videoRef.current.volume = Math.max(0, Math.min(1, v));
    }
  }, [currentTime, clip.volume, clip.fadeIn, clip.fadeOut, clip.start, clip.duration]);`
);

code = code.replace(
  `  const audioStart = activeAudioClip?.start || 0;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = audioPlaybackRate;
    }
  }, [audioPlaybackRate]);`,
  `  const audioStart = activeAudioClip?.start || 0;

  useEffect(() => {
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
    if (audioRef.current) {
      audioRef.current.playbackRate = audioPlaybackRate;
    }
  }, [audioPlaybackRate]);`
);

fs.writeFileSync('src/components/Preview.tsx', code);
