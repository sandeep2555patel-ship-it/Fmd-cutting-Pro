const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

code = code.replace(/selectedClip\.enhanced/g, 'selectedClip?.enhanced');
// wait, we also have handleDeepAIEnhance(selectedClip.id) -> handleDeepAIEnhance(selectedClip?.id)

code = code.replace(/handleDeepAIEnhance\(selectedClip\.id\)/g, 'handleDeepAIEnhance(selectedClip?.id)');

fs.writeFileSync('src/components/Properties.tsx', code);
