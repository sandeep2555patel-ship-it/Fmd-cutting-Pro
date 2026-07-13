const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const proxyRoute = `
app.get("/api/proxy-audio", (req, res) => {
  const url = req.query.url;
  if (!url || typeof url !== 'string') return res.status(400).send('No URL provided');
  
  const https = require('https');
  https.get(url, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  }).on('error', (err) => {
    res.status(500).send('Proxy error');
  });
});
`;

code = code.replace(
  'app.post("/api/enhance-audio",',
  proxyRoute + '\napp.post("/api/enhance-audio",'
);

fs.writeFileSync('server.ts', code);
