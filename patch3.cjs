const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

const videoLayerRegex = /function VideoLayer\(\{\s*clip,\s*isPlaying,\s*currentTime\s*\}\s*:\s*\{\s*clip:\s*Clip;\s*isPlaying:\s*boolean;\s*currentTime:\s*number\s*\}\)\s*\{/;

code = code.replace(
  videoLayerRegex,
  `function VideoLayer({ clip, isPlaying, currentTime }: { clip: Clip; isPlaying: boolean; currentTime: number }) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
`
);

fs.writeFileSync('src/components/Preview.tsx', code);
