const fs = require('fs');
let code = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

const OLD = `<span className="absolute -top-3 left-1">{i * 5}s</span>`;
const NEW = `<span className="absolute -top-3 left-1">{i * 10}s</span>`;

code = code.replace(OLD, NEW);
fs.writeFileSync('src/components/Timeline.tsx', code);
