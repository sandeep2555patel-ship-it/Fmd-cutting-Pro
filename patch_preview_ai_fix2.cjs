const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// Fix export
if (!code.includes('export default Preview')) {
  code += '\nexport default Preview;\n';
}

// First, restore the if statements properly by finding them
// We can just use string replacement

// In the video section, we have:
// const nVol = clip.backgroundVolume ?? 0;
code = code.replace(/const nVol = clip\.backgroundVolume \?\? 0;[\s\S]*?vocalGainRef\.current\.gain\.value = 1\.0;/g,
  `const nVol = clip.backgroundVolume ?? 0;
        
        if (aiNodeRef.current) {
          const vParam = aiNodeRef.current.parameters.get('vocalVolume');
          if (vParam) vParam.value = vVol / 100;
          const nParam = aiNodeRef.current.parameters.get('backgroundVolume');
          if (nParam) nParam.value = nVol / 100;
          const aiIsoParam = aiNodeRef.current.parameters.get('aiIsolation');
          if (aiIsoParam) aiIsoParam.value = clip.aiIsolation ? 1.0 : 0.0;
        }

        vocalGainRef.current.gain.value = 1.0;`
);

// In the audio section, we have:
// const nVol = activeAudioClip.backgroundVolume ?? 0;
code = code.replace(/const nVol = activeAudioClip\.backgroundVolume \?\? 0;[\s\S]*?vocalGainRef\.current\.gain\.value = 1\.0;/g,
  `const nVol = activeAudioClip.backgroundVolume ?? 0;
        
        if (aiNodeRef.current) {
          const vParam = aiNodeRef.current.parameters.get('vocalVolume');
          if (vParam) vParam.value = vVol / 100;
          const nParam = aiNodeRef.current.parameters.get('backgroundVolume');
          if (nParam) nParam.value = nVol / 100;
          const aiIsoParam = aiNodeRef.current.parameters.get('aiIsolation');
          if (aiIsoParam) aiIsoParam.value = activeAudioClip.aiIsolation ? 1.0 : 0.0;
        }

        vocalGainRef.current.gain.value = 1.0;`
);

fs.writeFileSync('src/components/Preview.tsx', code);
