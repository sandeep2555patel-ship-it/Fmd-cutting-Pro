const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

// Insert a state for processing
const stateInject = `  const { state: { clips, currentTime }, setClips, setCurrentTime, activePropertiesTab: activeTab, setActivePropertiesTab: setActiveTab } = useProject();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceProgress, setEnhanceProgress] = useState(0);

  const handleDeepAIEnhance = async (clipId) => {
    const clip = clips.find(c => c.id === clipId);
    if (!clip || !clip.url) return;
    
    setIsEnhancing(true);
    setEnhanceProgress(10);
    
    try {
      // Fetch the file from the blob URL
      const response = await fetch(clip.url);
      const blob = await response.blob();
      
      setEnhanceProgress(30);
      
      const formData = new FormData();
      formData.append('audio', blob, 'audio.wav');
      
      // Call our python backend
      const res = await fetch('/api/enhance-audio', {
        method: 'POST',
        body: formData
      });
      
      setEnhanceProgress(80);
      
      if (!res.ok) throw new Error('AI processing failed');
      
      const enhancedBlob = await res.blob();
      const enhancedUrl = URL.createObjectURL(enhancedBlob);
      
      setEnhanceProgress(100);
      
      setClips(clips.map(c => c.id === clipId ? { ...c, url: enhancedUrl, enhanced: true } : c));
    } catch (err) {
      console.error(err);
      alert('AI Enhancement failed');
    } finally {
      setIsEnhancing(false);
      setTimeout(() => setEnhanceProgress(0), 1000);
    }
  };
`;
code = code.replace(
  '  const { state: { clips, currentTime }, setClips, setCurrentTime, activePropertiesTab: activeTab, setActivePropertiesTab: setActiveTab } = useProject();',
  stateInject
);

// Add the button above AI Semantic Isolation
const buttonInject = `                </div>

                {/* Deep AI Processing (Python Backend) */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="flex flex-col gap-2 pb-3 border-b border-[#222]">
                    <div className="flex flex-col">
                      <div className="font-semibold text-purple-400">Deep AI Enhance (Python)</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">True deep learning process. Might take a few seconds.</div>
                    </div>
                    <button 
                      onClick={() => handleDeepAIEnhance(selectedClip.id)}
                      disabled={isEnhancing || selectedClip.enhanced}
                      className={\`px-4 py-2 rounded font-semibold text-sm transition-all flex items-center justify-center \${selectedClip.enhanced ? 'bg-green-600/20 text-green-400 border border-green-500/50' : 'bg-purple-600 hover:bg-purple-500 text-white'}\`}
                    >
                      {isEnhancing ? \`Processing AI Model (\${enhanceProgress}%)...\` : selectedClip.enhanced ? 'AI Enhanced Successfully' : 'Start Deep AI Process'}
                    </button>
                    {isEnhancing && (
                      <div className="w-full bg-gray-800 rounded-full h-1 mt-1 overflow-hidden">
                        <div className="bg-purple-500 h-1 transition-all duration-300" style={{ width: \`\${enhanceProgress}%\` }}></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Noise Reduction (Basic) */}`;
code = code.replace(
  '                </div>\n                {/* Noise Reduction (Basic) */}',
  buttonInject
);

fs.writeFileSync('src/components/Properties.tsx', code);
