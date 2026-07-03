const fs = require('fs');
let code = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

const targetMouseDown = `                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleClipClick(clip.id);
                      
                      const startX = e.clientX;
                      const startClipX = clip.start;
                      
                      const onMouseMove = (moveEvent: MouseEvent) => {
                        const deltaX = moveEvent.clientX - startX;
                        const newStart = Math.max(0, startClipX + deltaX);
                        setClips(prevClips => prevClips.map(c => c.id === clip.id ? { ...c, start: newStart } : c));
                      };
                      
                      const onMouseUp = () => {
                        window.removeEventListener('mousemove', onMouseMove);
                        window.removeEventListener('mouseup', onMouseUp);
                      };
                      
                      window.addEventListener('mousemove', onMouseMove);
                      window.addEventListener('mouseup', onMouseUp);
                    }}`;

const replaceMouseDown = `                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleClipClick(clip.id);
                      
                      const startX = e.clientX;
                      const startClipX = clip.start;
                      
                      let isDraggingAllowed = false;
                      const holdTimer = setTimeout(() => {
                        isDraggingAllowed = true;
                      }, 1000);
                      
                      const onMouseMove = (moveEvent: MouseEvent) => {
                        if (!isDraggingAllowed) return;
                        const deltaX = moveEvent.clientX - startX;
                        const newStart = Math.max(0, startClipX + deltaX);
                        setClips(prevClips => prevClips.map(c => c.id === clip.id ? { ...c, start: newStart } : c));
                      };
                      
                      const onMouseUp = () => {
                        clearTimeout(holdTimer);
                        window.removeEventListener('mousemove', onMouseMove);
                        window.removeEventListener('mouseup', onMouseUp);
                      };
                      
                      window.addEventListener('mousemove', onMouseMove);
                      window.addEventListener('mouseup', onMouseUp);
                    }}`;

const targetTouchStart = `                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handleClipClick(clip.id);
                      
                      const startX = e.touches[0].clientX;
                      const startClipX = clip.start;
                      
                      const onTouchMove = (moveEvent: TouchEvent) => {
                        const deltaX = moveEvent.touches[0].clientX - startX;
                        const newStart = Math.max(0, startClipX + deltaX);
                        setClips(prevClips => prevClips.map(c => c.id === clip.id ? { ...c, start: newStart } : c));
                      };
                      
                      const onTouchEnd = () => {
                        window.removeEventListener('touchmove', onTouchMove);
                        window.removeEventListener('touchend', onTouchEnd);
                      };
                      
                      window.addEventListener('touchmove', onTouchMove, { passive: false });
                      window.addEventListener('touchend', onTouchEnd);
                    }}`;

const replaceTouchStart = `                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handleClipClick(clip.id);
                      
                      const startX = e.touches[0].clientX;
                      const startClipX = clip.start;
                      
                      let isDraggingAllowed = false;
                      const holdTimer = setTimeout(() => {
                        isDraggingAllowed = true;
                      }, 1000);
                      
                      const onTouchMove = (moveEvent: TouchEvent) => {
                        if (!isDraggingAllowed) return;
                        const deltaX = moveEvent.touches[0].clientX - startX;
                        const newStart = Math.max(0, startClipX + deltaX);
                        setClips(prevClips => prevClips.map(c => c.id === clip.id ? { ...c, start: newStart } : c));
                      };
                      
                      const onTouchEnd = () => {
                        clearTimeout(holdTimer);
                        window.removeEventListener('touchmove', onTouchMove);
                        window.removeEventListener('touchend', onTouchEnd);
                      };
                      
                      window.addEventListener('touchmove', onTouchMove, { passive: false });
                      window.addEventListener('touchend', onTouchEnd);
                    }}`;

code = code.replace(targetMouseDown, replaceMouseDown);
code = code.replace(targetTouchStart, replaceTouchStart);
fs.writeFileSync('src/components/Timeline.tsx', code);
