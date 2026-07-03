const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

code = code.replace(
  `        videoRef.current.pause();
      }
    }
  }, [isPlaying, setIsPlaying, activeAudioClip?.url]);`,
  `        videoRef.current.pause();
      }
    }
  }, [isPlaying, setIsPlaying, clip.url]);`
);

fs.writeFileSync('src/components/Preview.tsx', code);
