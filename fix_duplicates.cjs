const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

// Fix duplicates in VideoLayer
code = code.replace(/const clarityFilterRef = useRef<BiquadFilterNode \| null>\(null\);\s*const compRef = useRef<DynamicsCompressorNode \| null>\(null\);\s*const clarityFilterRef = useRef<BiquadFilterNode \| null>\(null\);\s*const compRef = useRef<DynamicsCompressorNode \| null>\(null\);/g, 
  `const clarityFilterRef = useRef<BiquadFilterNode | null>(null);\n  const compRef = useRef<DynamicsCompressorNode | null>(null);`);

code = code.replace(/const clarity = ctx\.createBiquadFilter\(\);\s*clarity\.type = 'peaking';\s*clarity\.Q\.value = 1\.5;\s*clarityFilterRef\.current = clarity;\s*const comp = ctx\.createDynamicsCompressor\(\);\s*compRef\.current = comp;\s*const clarity = ctx\.createBiquadFilter\(\);\s*clarity\.type = 'peaking';\s*clarity\.Q\.value = 1\.5;\s*clarityFilterRef\.current = clarity;\s*const comp = ctx\.createDynamicsCompressor\(\);\s*compRef\.current = comp;/g,
  `const clarity = ctx.createBiquadFilter();
          clarity.type = 'peaking';
          clarity.Q.value = 1.5;
          clarityFilterRef.current = clarity;
          
          const comp = ctx.createDynamicsCompressor();
          compRef.current = comp;`);
          
fs.writeFileSync('src/components/Preview.tsx', code);
