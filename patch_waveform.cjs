const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

if (!code.includes("AudioWaveformVisualizer")) {
  code = code.replace(
    "import { Slider } from './Slider';",
    "import { Slider } from './Slider';\nimport { AudioWaveformVisualizer } from './AudioWaveformVisualizer';"
  );
  
  const targetFade = `                {/* Fade Section */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="font-semibold text-gray-300">Fade</div>`;
                  
  const replaceFade = `                {/* Fade Section */}
                <div className="space-y-4 pt-4 border-t border-[#222]">
                  <div className="font-semibold text-gray-300">Fade</div>
                  
                  {selectedClip && <AudioWaveformVisualizer clip={selectedClip} currentTime={currentTime} />}`;

  code = code.replace(targetFade, replaceFade);
  
  // also add it for video clips that have audio properties?
  // Let's check where the Fade section is used.
  // Actually, audio has Fade In/Out, and video also has Fade In/Out if volume is enabled.
  fs.writeFileSync('src/components/Properties.tsx', code);
}
