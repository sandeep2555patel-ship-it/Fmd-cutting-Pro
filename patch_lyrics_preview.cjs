const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

const lyricsOverlay = `
      {/* Overlay lyrics */}
      {activeAudioClip?.lyrics && (
        <div className="absolute inset-x-0 bottom-10 flex justify-center pointer-events-none z-50">
          <div className="bg-black/60 px-4 py-2 rounded text-white text-xl font-medium text-center max-w-[80%] whitespace-pre-wrap">
            {activeAudioClip.lyrics}
          </div>
        </div>
      )}
      {clip?.lyrics && !activeAudioClip?.lyrics && (
        <div className="absolute inset-x-0 bottom-10 flex justify-center pointer-events-none z-50">
          <div className="bg-black/60 px-4 py-2 rounded text-white text-xl font-medium text-center max-w-[80%] whitespace-pre-wrap">
            {clip.lyrics}
          </div>
        </div>
      )}
`;

code = code.replace(/\{clip \? \(/, lyricsOverlay + '{clip ? (');
fs.writeFileSync('src/components/Preview.tsx', code);
