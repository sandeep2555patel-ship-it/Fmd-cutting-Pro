const fs = require('fs');
let code = fs.readFileSync('src/components/Preview.tsx', 'utf8');

const OLD = `              <h2 className="text-2xl font-bold text-center whitespace-pre-wrap">{textClip.content}</h2>`;

const NEW = `              <h2 
                className="text-2xl font-bold text-center whitespace-pre-wrap outline-none"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newContent = e.currentTarget.innerText;
                  setClips(prevClips => prevClips.map(c => c.id === textClip.id ? { ...c, content: newContent } : c));
                }}
              >{textClip.content}</h2>`;

code = code.replace(OLD, NEW);
fs.writeFileSync('src/components/Preview.tsx', code);
