const fs = require('fs');

let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

const replacement = `
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 2; // 2 units (px) = 100ms at 20px/s
          const maxEnd = Math.max(...clips.map(c => c.start + c.duration), 0);
          if (newTime >= maxEnd && maxEnd > 0) {
            return 0; // loop back
          }
          return newTime;
        });
      }, 100); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, setCurrentTime, clips]);
`;

code = code.replace(/  useEffect\(\(\) => \{\n    let interval: NodeJS\.Timeout;\n    if \(isPlaying\) \{\n      interval = setInterval\(\(\) => \{\n        setCurrentTime\(prev => prev \+ 2\); \/\/ 2 units \(px\) = 100ms at 20px\/s\n      \}, 100\); \n    \}\n    return \(\) => clearInterval\(interval\);\n  \}, \[isPlaying, setCurrentTime\]\);/g, replacement.trim());

fs.writeFileSync('src/components/Preview.tsx', code);
