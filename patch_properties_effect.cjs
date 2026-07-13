const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

const OLD = `  const isText = selectedClip?.type === 'text';

  const tabs = isText ? ['Text', 'Style', 'Animation'] : (isAudio 
    ? ['Audio', 'Amplifier', 'Podcast', 'Remix'] 
    : ['Video', 'Audio', 'Speed', 'Animation']);

  return (`;

const NEW = `  const isText = selectedClip?.type === 'text';

  const tabs = isText ? ['Text', 'Style', 'Animation'] : (isAudio 
    ? ['Audio', 'Amplifier', 'Podcast', 'Remix'] 
    : ['Video', 'Audio', 'Speed', 'Animation']);

  useEffect(() => {
    if (selectedClip) {
      if (selectedClip.type === 'text') {
        if (!['text', 'style', 'animation'].includes(activeTab)) setActiveTab('text');
      } else if (selectedClip.type === 'audio') {
        if (!['audio', 'amplifier', 'podcast', 'remix'].includes(activeTab)) setActiveTab('audio');
      } else {
        if (!['video', 'audio', 'speed', 'animation'].includes(activeTab)) setActiveTab('video');
      }
    }
  }, [selectedClip?.type, selectedClip?.id, activeTab, setActiveTab]);

  return (`;

code = code.replace(OLD, NEW);
fs.writeFileSync('src/components/Properties.tsx', code);
