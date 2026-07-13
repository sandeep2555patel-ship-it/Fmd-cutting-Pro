const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

const OLD = `          {/* Text Clips */}
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

const NEW = `          {/* Text Clips */}
          {clips.filter(c => c.type === 'text' && currentTime >= c.start && currentTime <= c.start + c.duration).map(textClip => (
            <div 
              key={textClip.id}
              onPointerDown={(e) => {
                e.stopPropagation();
                
                // Select clip
                const newClips = clips.map(c => ({...c, selected: c.id === textClip.id}));
                setClips(newClips);
                
                const target = e.currentTarget;
                const startX = e.clientX;
                const startY = e.clientY;
                
                const xStr = (textClip as any).x || '50%';
                const yStr = (textClip as any).y || '75%';
                const startXPercent = parseFloat(xStr);
                const startYPercent = parseFloat(yStr);
                
                const rect = target.parentElement!.getBoundingClientRect();
                
                const onPointerMove = (moveEvent: PointerEvent) => {
                  const dx = moveEvent.clientX - startX;
                  const dy = moveEvent.clientY - startY;
                  
                  const dxPercent = (dx / rect.width) * 100;
                  const dyPercent = (dy / rect.height) * 100;
                  
                  setClips(prevClips => prevClips.map(c => {
                    if (c.id === textClip.id) {
                      return {
                        ...c,
                        x: \`\${startXPercent + dxPercent}%\`,
                        y: \`\${startYPercent + dyPercent}%\`
                      };
                    }
                    return c;
                  }));
                };
                
                const onPointerUp = () => {
                  window.removeEventListener('pointermove', onPointerMove);
                  window.removeEventListener('pointerup', onPointerUp);
                };
                
                window.addEventListener('pointermove', onPointerMove);
                window.addEventListener('pointerup', onPointerUp);
              }}
              className={\`absolute \${textClip.selected ? 'ring-2 ring-cyan-400' : ''} cursor-move p-2 rounded z-30\`}
              style={{
                left: (textClip as any).x || '50%',
                top: (textClip as any).y || '75%',
                transform: 'translate(-50%, -50%)',
                color: textClip.color || '#ffffff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              <h2 className="text-2xl font-bold text-center whitespace-pre-wrap">{textClip.content}</h2>
            </div>
          ))}
          
          <div className="absolute inset-0 pointer-events-none ring-1 ring-[#2fe4b9]/30 z-20"></div>`;

code = code.replace(OLD, NEW);
fs.writeFileSync('src/components/Preview.tsx', code);
