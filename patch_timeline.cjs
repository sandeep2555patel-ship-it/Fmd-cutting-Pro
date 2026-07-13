const fs = require('fs');

let code = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

code = code.replace(
  `setClips(prev => [...prev.map(c => ({...c, selected: false})), {
                          id: \`text_\${Date.now()}\`, name: 'Default Text', type: 'text',
                          start: state.currentTime, duration: 50, trackId: 't1', selected: true, color: '#fff', content: 'Default Text'
                        }]);`,
  "window.dispatchEvent(new CustomEvent('open-media-bin', { detail: 'text' }));"
);

code = code.replace(
  `setClips(prev => [...prev.map(c => ({...c, selected: false})), {
                          id: \`sticker_\${Date.now()}\`, name: '😀', type: 'sticker',
                          start: state.currentTime, duration: 50, trackId: 'v1', selected: true, content: '😀'
                        }]);`,
  "window.dispatchEvent(new CustomEvent('open-media-bin', { detail: 'stickers' }));"
);

code = code.replace(
  `setClips(prev => [...prev.map(c => ({...c, selected: false})), {
                          id: \`audio_\${Date.now()}\`, name: 'Default Audio', type: 'audio',
                          start: state.currentTime, duration: 100, trackId: 'a1', selected: true
                        }]);`,
  "window.dispatchEvent(new CustomEvent('open-media-bin', { detail: 'audio' }));"
);

fs.writeFileSync('src/components/Timeline.tsx', code);
