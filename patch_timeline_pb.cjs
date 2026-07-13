const fs = require('fs');

let code = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

code = code.replace(
  '<div className="flex flex-col relative" style={{ width: timelineWidth }}>',
  '<div className="flex flex-col relative pb-8" style={{ width: timelineWidth }}>'
);

code = code.replace(
  '<div className="flex flex-col">',
  '<div className="flex flex-col pb-8">'
);

fs.writeFileSync('src/components/Timeline.tsx', code);
