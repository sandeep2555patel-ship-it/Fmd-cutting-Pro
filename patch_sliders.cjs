const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

if (!code.includes("import { Slider }")) {
  code = code.replace(
    "import { Plus, Minus, Type, Music, Zap, Image as ImageIcon, Volume2, Maximize, Scissors, AlignLeft, AlignCenter, AlignRight, Play, Pause, Square, Circle, Triangle, Layers, Trash2, SplitSquareHorizontal, Move, VolumeX, Sparkles, Wand2 } from 'lucide-react';",
    "import { Plus, Minus, Type, Music, Zap, Image as ImageIcon, Volume2, Maximize, Scissors, AlignLeft, AlignCenter, AlignRight, Play, Pause, Square, Circle, Triangle, Layers, Trash2, SplitSquareHorizontal, Move, VolumeX, Sparkles, Wand2 } from 'lucide-react';\nimport { Slider } from './Slider';"
  );
}

// Replace all <input type="range" with <Slider
code = code.replace(/<input\s+type="range"/g, '<Slider');
code = code.replace(/<input\n\s+type="range"/g, '<Slider');

// We also need to fix self-closing issues if any, but <input ... /> translates to <Slider ... /> perfectly.
// Let's add normalValue properties to sliders where the center or default is not the middle.
// Actually, Slider already defaults to middle! (min+max)/2.
// For opacity, min 0 max 100, so middle is 50. But opacity default is 100.
// Let's specify normalValue for opacity to be 100.
// And for scale, min 10 max 200, default is 100. So we should set normalValue={100}.

fs.writeFileSync('src/components/Properties.tsx', code);
