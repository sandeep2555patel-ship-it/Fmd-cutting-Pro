const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// Find the end of VideoLayer and insert the return statement, and the start of Preview
const regex = /\s*\}\s*\}, \[currentTime, isPlaying, clip\]\);\s*const activeAudioClip/g;

const replacement = `
    }
  }, [currentTime, isPlaying, clip]);

  return (
    <video
      ref={videoRef}
      src={clip.url}
      crossOrigin="anonymous"
      className="absolute top-0 left-0 w-full h-full"
      style={{
        objectFit: clip.fit ? 'contain' : 'cover',
        transform: \`\${clip.flipX ? 'scaleX(-1)' : ''} \${clip.flipY ? 'scaleY(-1)' : ''} rotate(\${clip.baseRotate || 0}deg)\`,
        filter: getEffectCSS(clip),
      }}
    />
  );
};

const Preview = () => {
  const { clips, currentTime, setCurrentTime, isPlaying, setIsPlaying } = useProject();
  const activeVideoClips = clips.filter(c => c.type === 'media' && currentTime >= c.start && currentTime <= c.start + c.duration);

  const activeAudioClip`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/Preview.tsx', code);
