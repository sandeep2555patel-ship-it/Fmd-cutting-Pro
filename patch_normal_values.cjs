const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

// For sliders with defaultValue={X}, add normalValue={X}
code = code.replace(/<Slider defaultValue={([0-9-]+)}/g, '<Slider normalValue={$1} defaultValue={$1}');

// Manually fix controlled sliders
code = code.replace(/<Slider\s+value=\{currentValues\.scale\}/g, '<Slider normalValue={100}\n                      value={currentValues.scale}');
code = code.replace(/<Slider\s+value=\{currentValues\.opacity\}/g, '<Slider normalValue={100}\n                      value={currentValues.opacity}');
code = code.replace(/<Slider\s+value=\{selectedClip\?\.fadeIn \?\? 0\}/g, '<Slider normalValue={0}\n                      value={selectedClip?.fadeIn ?? 0}');
code = code.replace(/<Slider\s+value=\{selectedClip\?\.fadeOut \?\? 0\}/g, '<Slider normalValue={0}\n                      value={selectedClip?.fadeOut ?? 0}');
code = code.replace(/<Slider\s+value=\{selectedClip\?\.enhanceIntensity \?\? 85\}/g, '<Slider normalValue={85}\n                      value={selectedClip?.enhanceIntensity ?? 85}');
code = code.replace(/<Slider\s+value=\{selectedClip\.filterIntensity \?\? 100\}/g, '<Slider normalValue={100}\n                  value={selectedClip.filterIntensity ?? 100}');

fs.writeFileSync('src/components/Properties.tsx', code);
