const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

const lyricsCode = `
            {activeAudioClip?.url && (
              <audio ref={audioRef} src={activeAudioClip.url} crossOrigin="anonymous" loop />
            )}
            
            {/* Lyrics Overlay */}
            {(() => {
              const clipWithLyrics = activeVideoClips.find(c => c.lyrics) || (activeAudioClip?.lyrics ? activeAudioClip : null);
              if (clipWithLyrics?.lyrics) {
                return (
                  <div className="absolute bottom-16 w-[90%] left-1/2 -translate-x-1/2 text-center z-30 pointer-events-none">
                    <p className="text-white text-xl md:text-2xl font-bold px-4 py-2 bg-black/60 rounded-lg drop-shadow-md border border-white/10" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                      {clipWithLyrics.lyrics}
                    </p>
                  </div>
                );
              }
              return null;
            })()}
`;

code = code.replace(/\{activeAudioClip\?\.url && \(\s*<audio ref=\{audioRef\} src=\{activeAudioClip\.url\} crossOrigin="anonymous" loop \/>\s*\)/, lyricsCode);

fs.writeFileSync('src/components/Preview.tsx', code);
