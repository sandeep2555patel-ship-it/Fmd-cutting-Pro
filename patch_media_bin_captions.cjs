const fs = require('fs');
let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

// Replace handleGenerateCaptions
code = code.replace(
  `const [isGenerating, setIsGenerating] = useState(false);`,
  `const [isGenerating, setIsGenerating] = useState(false);
  const [captionLanguage, setCaptionLanguage] = useState('English');`
);

const oldGenCaptions = `  const handleGenerateCaptions = () => {
    setIsGenerating(true);
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      const newClips = clips.map(c => ({ ...c, selected: false }));
      setClips([...newClips, {
        id: \`c\${Date.now()}\`,
        trackId: 't1',
        start: 0,
        duration: 350,
        name: 'Auto Captions',
        bg: '#f59e0b',
        selected: true
      }]);
      onClose?.();
    }, 2000);
  };`;

const newGenCaptions = `  const handleGenerateCaptions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const maxEnd = Math.max(...clips.filter(c => c.type === 'video' || c.type === 'audio').map(c => c.start + c.duration), 150);
      const newClips = clips.map(c => ({ ...c, selected: false }));
      setClips([...newClips, {
        id: \`c\${Date.now()}\`,
        trackId: 't1',
        start: 0,
        duration: maxEnd,
        name: \`Auto Captions (\${captionLanguage})\`,
        type: 'text',
        content: \`[Auto Generated \${captionLanguage} Captions]\`,
        color: '#ffffff',
        bg: '#f59e0b',
        selected: true
      }]);
      onClose?.();
    }, 2000);
  };`;

code = code.replace(oldGenCaptions, newGenCaptions);

const oldAutoCaptionUI = `<div className="text-gray-400 text-[10px] leading-relaxed">
               Use AI to automatically recognize speech and generate accurate text captions for your video.
             </div>
             <button`;

const newAutoCaptionUI = `<div className="text-gray-400 text-[10px] leading-relaxed mb-2">
               Use AI to automatically recognize speech and generate accurate text captions for your video.
             </div>
             <div className="flex space-x-2 mb-2">
               <button onClick={(e) => { e.stopPropagation(); setCaptionLanguage('English'); }} className={\`flex-1 py-1 text-[10px] rounded border \${captionLanguage === 'English' ? 'border-[#2fe4b9] text-[#2fe4b9] bg-[#2fe4b9]/10' : 'border-zinc-700 text-gray-400'}\`}>English</button>
               <button onClick={(e) => { e.stopPropagation(); setCaptionLanguage('Hindi'); }} className={\`flex-1 py-1 text-[10px] rounded border \${captionLanguage === 'Hindi' ? 'border-[#2fe4b9] text-[#2fe4b9] bg-[#2fe4b9]/10' : 'border-zinc-700 text-gray-400'}\`}>Hindi</button>
             </div>
             <button`;

code = code.replace(oldAutoCaptionUI, newAutoCaptionUI);

fs.writeFileSync('src/components/MediaBin.tsx', code);
