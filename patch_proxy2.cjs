const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'res.writeHead(proxyRes.statusCode, proxyRes.headers);',
  `const headers = { ...proxyRes.headers };
    headers['Access-Control-Allow-Origin'] = '*';
    res.writeHead(proxyRes.statusCode, headers);`
);

fs.writeFileSync('server.ts', code);
