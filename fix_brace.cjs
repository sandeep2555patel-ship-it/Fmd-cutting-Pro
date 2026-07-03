const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

const target = '})()}}';
if (code.includes(target)) {
  code = code.replace(target, '})()}');
  fs.writeFileSync('src/components/Preview.tsx', code);
  console.log("Replaced target");
} else {
  console.log("Target not found");
}
