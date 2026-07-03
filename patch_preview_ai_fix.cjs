const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

code = code.replace(
  /const aiIsoParam = aiNodeRef\.current\.parameters\.get\('aiIsolation'\);[\s\S]*?aiIsoParam\.value = 0\.0;\s*\}/,
  `const aiIsoParam = aiNodeRef.current.parameters.get('aiIsolation');
          if (aiIsoParam) aiIsoParam.value = clip.aiIsolation ? 1.0 : 0.0;`
);

code = code.replace(
  /const aiIsoParam = aiNodeRef\.current\.parameters\.get\('aiIsolation'\);[\s\S]*?aiIsoParam\.value = 0\.0;\s*\}/,
  `const aiIsoParam = aiNodeRef.current.parameters.get('aiIsolation');
          if (aiIsoParam) aiIsoParam.value = activeAudioClip.aiIsolation ? 1.0 : 0.0;`
);

fs.writeFileSync('src/components/Preview.tsx', code);
