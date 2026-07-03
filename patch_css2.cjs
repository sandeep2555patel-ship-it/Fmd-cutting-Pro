const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(
  `input[type="range"] {
  -webkit-appearance: none;
  background: #333;
  height: 4px;
  border-radius: 2px;
  background-image: radial-gradient(circle, #888 2px, transparent 2px);
  background-position: center;
  background-size: 6px 6px;
  background-repeat: no-repeat;
}`,
  `input[type="range"] {
  -webkit-appearance: none;
  background: #333;
  height: 4px;
  border-radius: 2px;
}`
);

fs.writeFileSync('src/index.css', code);
