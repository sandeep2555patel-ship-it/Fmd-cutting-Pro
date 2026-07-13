const fs = require('fs');
let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

code = code.replace(
  `  const handleAddText = (name: string) => {
    const newClips = clips.map(c => ({ ...c, selected: false }));
    setClips([...newClips, {
      id: \`c\${Date.now()}\`,
      trackId: 't1', 
      start: 0,
      duration: 150,
      name: \`Text: \${name}\`,
      bg: '#f59e0b',
      selected: true
    }]);
    onClose?.();
  };`,
  `  const handleAddText = (name: string) => {
    const newClips = clips.map(c => ({ ...c, selected: false }));
    setClips([...newClips, {
      id: \`c\${Date.now()}\`,
      trackId: 't1', 
      start: state.currentTime,
      duration: 150,
      name: \`Text: \${name}\`,
      type: 'text',
      content: name,
      color: '#ffffff',
      bg: '#f59e0b',
      selected: true
    }]);
    onClose?.();
  };`
);

fs.writeFileSync('src/components/MediaBin.tsx', code);
