const fs = require('fs');

let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

// Add audio category state
code = code.replace(
  "export default function MediaBin({ activeTab, setActiveTab }: MediaBinProps) {",
  `export default function MediaBin({ activeTab, setActiveTab }: MediaBinProps) {
  const [audioCategory, setAudioCategory] = useState('Trending');`
);

// We need to make sure useState is imported. It should be, from React.
// Let's check if it is. It's used in App.tsx but MediaBin might not have it.
