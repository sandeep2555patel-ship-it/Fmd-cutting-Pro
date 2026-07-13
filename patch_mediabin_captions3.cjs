const fs = require('fs');
let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

const OLD = `  const handleGenerateCaptions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const maxEnd = Math.max(...clips.filter(c => c.type === 'video' || c.type === 'audio').map(c => c.start + c.duration), 150);
      
      const newClips = clips.map(c => ({ ...c, selected: false }));
      
      const segmentDuration = 50;
      let currentStart = 0;
      const captionClips = [];
      const hindiTexts = ['नमस्ते दोस्तों,', 'इस वीडियो में हम देखेंगे', 'कि कैसे हम आसानी से', 'शानदार वीडियो बना सकते हैं।', 'चलिए शुरू करते हैं!'];
      const englishTexts = ['Hey everyone,', 'in this quick tutorial', 'we are going to learn', 'how to create amazing edits.', 'Let\\'s get started!'];
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

const NEW = `  const handleGenerateCaptions = async () => {
    setIsGenerating(true);
    
    // Find the first video or audio clip
    const mediaClips = clips.filter(c => (c.type === 'video' || c.type === 'audio') && c.url).sort((a, b) => a.start - b.start);
    if (mediaClips.length === 0) {
      setIsGenerating(false);
      alert("No video or audio with source URL found to generate captions.");
      return;
    }
    
    const clip = mediaClips[0]; // take the first media clip

    try {
        const response = await fetch(clip.url);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append("media", blob, "media.mp4");

        const apiRes = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
        });

        if (!apiRes.ok) {
            throw new Error(\`API error: \${apiRes.statusText}\`);
        }

        const data = await apiRes.json();
        
        if (data.subtitles && data.subtitles.length > 0) {
            const newClips = clips.map(c => ({ ...c, selected: false }));
            const captionClips = data.subtitles.map((sub: any, i: number) => {
                const start = sub.start * 10;
                const end = sub.end * 10;
                const duration = Math.max(10, end - start);
                return {
                  id: \`c\${Date.now()}_\${i}\`,
                  trackId: 't1',
                  start: clip.start + start, // Relative to clip's start on timeline
                  duration: duration,
                  name: \`Caption \${i + 1}\`,
                  type: 'text',
                  content: sub.text,
                  color: '#ffffff',
                  bg: '#f59e0b',
                  selected: i === 0,
                  y: '80%' // Set near bottom
                };
            });
            
            setClips([...newClips, ...captionClips]);
        } else {
            alert("No speech detected.");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to generate captions. Check console for details.");
    } finally {
        setIsGenerating(false);
        onClose?.();
    }
  };`;

code = code.replace(OLD, NEW);
fs.writeFileSync('src/components/MediaBin.tsx', code);
