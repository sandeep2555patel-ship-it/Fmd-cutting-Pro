const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'const pythonProcess = spawn(\'python3\', [\'ai_model.py\', inputFile, outputFile]);',
  `let stderrData = "";
  const pythonProcess = spawn('python3', ['ai_model.py', inputFile, outputFile]);`
);

code = code.replace(
  'pythonProcess.stderr.on(\'data\', (data) => {\n    console.error(`AI Model Error: ${data}`);\n  });',
  `pythonProcess.stderr.on('data', (data) => {
    console.error(\`AI Model Error: \${data}\`);
    stderrData += data.toString();
  });`
);

code = code.replace(
  'res.status(500).json({ error: "AI processing failed" });',
  'res.status(500).json({ error: "AI processing failed", details: stderrData });'
);

fs.writeFileSync('server.ts', code);
