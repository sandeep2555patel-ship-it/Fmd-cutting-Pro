const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

const TEXT_CLIP_RENDERER = `          
          {/* Text Clips */}
          {clips.filter(c => c.type === 'text' && currentTime >= c.start && currentTime <= c.start + c.duration).map(textClip => (
            <div 
              key={textClip.id}
              onClick={() => {
                const newClips = clips.map(c => ({...c, selected: c.id === textClip.id}));
                setClips(newClips);
              }}
              className={\`absolute \${textClip.selected ? 'ring-2 ring-cyan-400' : ''} cursor-pointer p-2 rounded\`}
              style={{
                left: '50%',
                top: '75%',
                transform: 'translate(-50%, -50%)',
                color: textClip.color || '#ffffff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              <h2 className="text-2xl font-bold text-center whitespace-pre-wrap">{textClip.content}</h2>
            </div>
          ))}
          
          <div className="absolute inset-0 pointer-events-none ring-1 ring-[#2fe4b9]/30 z-20"></div>`;

code = code.replace(
  '<div className="absolute inset-0 pointer-events-none ring-1 ring-[#2fe4b9]/30 z-20"></div>',
  TEXT_CLIP_RENDERER
);

// We need setClips in Preview.tsx. Let's see if it's there.
if(!code.includes("setClips")) {
    code = code.replace(
      "const { state: { clips, currentTime, isPlaying }, setCurrentTime, setIsPlaying } = useProject();",
      "const { state: { clips, currentTime, isPlaying }, setCurrentTime, setIsPlaying, setClips } = useProject();"
    );
}

fs.writeFileSync('src/components/Preview.tsx', code);
