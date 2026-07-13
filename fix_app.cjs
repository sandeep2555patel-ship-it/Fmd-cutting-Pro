const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { useState } from 'react';",
  "import { useState, useEffect } from 'react';"
);

code = code.replace(
  "  import('react').then(({ useEffect }) => {\n    useEffect(() => {\n      const handleOpen = (e) => setActiveTab(e.detail);\n      window.addEventListener('open-media-bin', handleOpen);\n      return () => window.removeEventListener('open-media-bin', handleOpen);\n    }, []);\n  });\n  const [activeTab, setActiveTab] = useState<TabType | null>('media');",
  "  const [activeTab, setActiveTab] = useState<TabType | null>('media');\n  useEffect(() => {\n    const handleOpen = (e: any) => setActiveTab(e.detail);\n    window.addEventListener('open-media-bin', handleOpen);\n    return () => window.removeEventListener('open-media-bin', handleOpen);\n  }, []);"
);

fs.writeFileSync('src/App.tsx', code);
