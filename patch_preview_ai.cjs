const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// For Video clip logic
code = code.replace(
  /const nParam = aiNodeRef\.current\.parameters\.get\('backgroundVolume'\);\s*if \(nParam\) nParam\.value = nVol \/ 100;/g,
  `const nParam = aiNodeRef.current.parameters.get('backgroundVolume');
          if (nParam) nParam.value = nVol / 100;
          const aiIsoParam = aiNodeRef.current.parameters.get('aiIsolation');
          // For video
          if (aiIsoParam && typeof clip !== 'undefined' && clip.aiIsolation) {
            aiIsoParam.value = 1.0;
          } else if (aiIsoParam && typeof activeAudioClip !== 'undefined' && activeAudioClip.aiIsolation) {
            aiIsoParam.value = 1.0;
          } else if (aiIsoParam) {
            aiIsoParam.value = 0.0;
          }`
);

fs.writeFileSync('src/components/Preview.tsx', code);
