const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("window.addEventListener('open-media-bin'")) {
  code = code.replace(
    'export default function App() {',
    `export default function App() {\n  import('react').then(({ useEffect }) => {\n    useEffect(() => {\n      const handleOpen = (e) => setActiveTab(e.detail);\n      window.addEventListener('open-media-bin', handleOpen);\n      return () => window.removeEventListener('open-media-bin', handleOpen);\n    }, []);\n  });`
  );
  fs.writeFileSync('src/App.tsx', code);
}
