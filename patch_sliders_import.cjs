const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

if (!code.includes("import { Slider }")) {
  code = code.replace(
    "import { useProject, KeyframeData, VIDEO_EFFECTS, getEffectCSS, getCurveRate, Clip } from '../context';",
    "import { useProject, KeyframeData, VIDEO_EFFECTS, getEffectCSS, getCurveRate, Clip } from '../context';\nimport { Slider } from './Slider';"
  );
}

fs.writeFileSync('src/components/Properties.tsx', code);
