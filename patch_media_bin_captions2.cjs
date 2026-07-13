const fs = require('fs');
let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

const oldGenCaptions = `  const handleGenerateCaptions = () => {
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

const newGenCaptions = `  const handleGenerateCaptions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const maxEnd = Math.max(...clips.filter(c => c.type === 'video' || c.type === 'audio').map(c => c.start + c.duration), 150);
      
      const newClips = clips.map(c => ({ ...c, selected: false }));
      
      const segmentDuration = 50;
      let currentStart = 0;
      const captionClips = [];
      const hindiTexts = ['नमस्ते', 'आज के वीडियो में', 'आपका स्वागत है', 'हम सीखेंगे', 'वीडियो एडिटिंग'];
      const englishTexts = ['Hello', 'In today\\'s video', 'Welcome back', 'We will learn', 'Video editing'];
      let textIdx = 0;
      
      while (currentStart < maxEnd) {
        const dur = Math.min(segmentDuration, maxEnd - currentStart);
        if (dur < 10) break;
        captionClips.push({
          id: \`c\${Date.now()}_\${textIdx}\`,
          trackId: 't1',
          start: currentStart,
          duration: dur,
          name: \`Caption \${textIdx + 1}\`,
          type: 'text',
          content: captionLanguage === 'Hindi' ? (hindiTexts[textIdx % hindiTexts.length] || 'कैप्शन') : (englishTexts[textIdx % englishTexts.length] || 'Caption'),
          color: '#ffffff',
          bg: '#f59e0b',
          selected: textIdx === 0
        });
        currentStart += dur;
        textIdx++;
      }
      
      setClips([...newClips, ...captionClips]);
      onClose?.();
    }, 2000);
  };`;

code = code.replace(oldGenCaptions, newGenCaptions);

fs.writeFileSync('src/components/MediaBin.tsx', code);
