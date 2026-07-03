const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// There are probably leftover disconnect calls or logic
code = code.replace(/hpFilterRef\.current\.disconnect\(\);\s*lpFilterRef\.current\.disconnect\(\);\s*presFilterRef\.current\.disconnect\(\);/g, 
  `vocalBandpassRef.current.disconnect();
      vocalClarityRef.current.disconnect();
      vocalGainRef.current.disconnect();
      noiseNotchRef.current.disconnect();
      noiseGainRef.current.disconnect();`);

code = code.replace(/hpFilterRef\.current && lpFilterRef\.current && presFilterRef\.current/g,
  `vocalBandpassRef.current && vocalClarityRef.current && vocalGainRef.current && noiseNotchRef.current && noiseGainRef.current`);

fs.writeFileSync('src/components/Preview.tsx', code);
