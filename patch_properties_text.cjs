const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

code = code.replace(
  "const isAudio = selectedClip?.type === 'audio';",
  "const isAudio = selectedClip?.type === 'audio';\n  const isText = selectedClip?.type === 'text';"
);

code = code.replace(
  "const tabs = isAudio \n    ? ['Audio', 'Amplifier', 'Podcast', 'Remix'] \n    : ['Video', 'Audio', 'Speed', 'Animation'];",
  "const tabs = isText ? ['Text', 'Style', 'Animation'] : (isAudio \n    ? ['Audio', 'Amplifier', 'Podcast', 'Remix'] \n    : ['Video', 'Audio', 'Speed', 'Animation']);"
);

const oldTextCheck = `{activeTab === 'speed' && (`;

const newTextTab = `{activeTab === 'text' && isText && (
        <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
          <div className="space-y-2">
            <span className="text-gray-400">Content</span>
            <textarea 
               value={selectedClip?.content || ''}
               onChange={(e) => {
                 setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, content: e.target.value } : c));
               }}
               className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded p-2 text-white resize-none focus:outline-none focus:border-cyan-500"
               placeholder="Enter text..."
            />
          </div>
          <div className="space-y-2">
            <span className="text-gray-400">Color</span>
            <input 
               type="color" 
               value={selectedClip?.color || '#ffffff'}
               onChange={(e) => {
                 setClips(clips.map(c => c.id === selectedClip?.id ? { ...c, color: e.target.value } : c));
               }}
               className="w-full h-8 bg-zinc-950 border border-zinc-800 rounded cursor-pointer"
            />
          </div>
        </div>
      )}
      {activeTab === 'speed' && (`;

code = code.replace(oldTextCheck, newTextTab);

fs.writeFileSync('src/components/Properties.tsx', code);
