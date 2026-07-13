const fs = require('fs');
let code = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

code = code.replace(
  `{trackClips.length === 0 && track.id === 'v2' && (
                    <label 
                      onPointerDown={(e) => e.stopPropagation()}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 px-3 bg-zinc-800/80 rounded flex items-center text-[10px] font-medium text-gray-400 cursor-pointer border border-white/5 hover:bg-zinc-800 z-10 transition-colors"
                    >
                      <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center mr-2 text-white text-xs">+</span>
                      Tap to add video
                      <input 
                        type="file" 
                        accept="video/*,image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            const isVideo = file.type.startsWith('video/');
                            
                            if (isVideo) {
                              const video = document.createElement('video');
                              video.preload = 'metadata';
                              video.onloadedmetadata = () => {
                                setClips(prev => [...prev.map(c => ({...c, selected: false})), {
                                  id: \`video_\${Date.now()}\`, name: file.name, type: 'video',
                                  start: state.currentTime, duration: video.duration * 10 || 100, trackId: 'v2', selected: true, url
                                }]);
                              };
                              video.src = url;
                            } else {
                              setClips(prev => [...prev.map(c => ({...c, selected: false})), {
                                id: \`image_\${Date.now()}\`, name: file.name, type: 'image',
                                start: state.currentTime, duration: 50, trackId: 'v2', selected: true, url
                              }]);
                            }
                          }
                        }}
                      />
                    </label>
                  )}`,
  `{trackClips.length === 0 && track.id === 'v2' && (
                    <div 
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        window.dispatchEvent(new CustomEvent('open-media-bin', { detail: 'media' }));
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 px-3 bg-zinc-800/80 rounded flex items-center text-[10px] font-medium text-gray-400 cursor-pointer border border-white/5 hover:bg-zinc-800 z-10 transition-colors"
                    >
                      <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center mr-2 text-white text-xs">+</span>
                      Tap to add video
                    </div>
                  )}`
);

fs.writeFileSync('src/components/Timeline.tsx', code);
