const fs = require('fs');
let code = fs.readFileSync('src/components/Properties.tsx', 'utf8');

const targetUI = `<div className="font-semibold text-gray-300">Reduce Noise</div>`;
const replaceUI = `<div className="flex flex-col">
                      <div className="font-semibold text-gray-300">Vocal Isolation</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">Eliminate fans, wind, birds, and dogs to enhance human voice</div>
                    </div>`;

code = code.replace(targetUI, replaceUI);
fs.writeFileSync('src/components/Properties.tsx', code);
