const fs = require('fs');

let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

// I already executed the previous script but the replace failed because the target string was wrong.
code = code.replace(
  "export default function MediaBin({ activeTab, isMobile, onClose }: MediaBinProps) {",
  `export default function MediaBin({ activeTab, isMobile, onClose }: MediaBinProps) {
  const [audioCategory, setAudioCategory] = useState('Trending');
  const [searchAudioQuery, setSearchAudioQuery] = useState('');`
);

// We need to replace the static map of categories with interactive ones
code = code.replace(
  `{['Trending', 'Pop', 'Memes', 'Vlog', 'Chill', 'Beats', 'Travel', 'SFX', 'Ambient'].map((cat, i) => (
                <button 
                  key={cat} 
                  className={\`w-full text-left px-3 py-2 hover:bg-zinc-900 transition-colors \${i === 0 ? 'text-white font-medium bg-zinc-950' : 'text-gray-500'}\`}
                >`,
  `{['Trending', 'Pop', 'Memes', 'Vlog', 'Chill', 'Beats', 'Travel', 'SFX', 'Ambient'].map((cat, i) => (
                <button 
                  key={cat} 
                  onClick={() => setAudioCategory(cat)}
                  className={\`w-full text-left px-3 py-2 hover:bg-zinc-900 transition-colors \${audioCategory === cat ? 'text-cyan-400 font-medium bg-zinc-950/50 border-r-2 border-cyan-400' : 'text-zinc-500'}\`}
                >`
);

fs.writeFileSync('src/components/MediaBin.tsx', code);
