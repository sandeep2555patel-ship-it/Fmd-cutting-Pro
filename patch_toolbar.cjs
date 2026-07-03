const fs = require('fs');
let code = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

code = code.replace(
  "} from 'lucide-react';",
  ", Undo2, Redo2 } from 'lucide-react';"
);

const targetToolbarButton = `const ToolbarButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className="flex flex-col items-center justify-center w-14 h-14 hover:bg-[#2a2a2a] rounded-lg transition-colors group flex-shrink-0"
  >
    <Icon size={20} className="text-gray-300 group-hover:text-white mb-1" />
    <span className="text-[9px] text-gray-400 group-hover:text-gray-200">{label}</span>
  </button>
);`;

const replacementToolbarButton = `const ToolbarButton = ({ icon: Icon, label, onClick, disabled }: { icon: any, label: string, onClick?: () => void, disabled?: boolean }) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      if (!disabled) onClick?.();
    }}
    disabled={disabled}
    className={\`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors group flex-shrink-0 \${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#2a2a2a] cursor-pointer'}\`}
  >
    <Icon size={20} className="text-gray-300 group-hover:text-white mb-1" />
    <span className="text-[9px] text-gray-400 group-hover:text-gray-200">{label}</span>
  </button>
);`;

code = code.replace(targetToolbarButton, replacementToolbarButton);

const targetContextLine = `  const { state: { clips, currentTime }, setClips, setActivePropertiesTab, setShowProperties } = useProject();`;
const replacementContextLine = `  const { state: { clips, currentTime }, setClips, setActivePropertiesTab, setShowProperties, undo, redo, canUndo, canRedo } = useProject();`;

code = code.replace(targetContextLine, replacementContextLine);

// We want to return the toolbar even if !selectedClip, so we can use Undo/Redo
const targetIfSelected = `  if (!selectedClip) return null;`;
const replacementIfSelected = ``; // Remove this

code = code.replace(targetIfSelected, replacementIfSelected);

// Let's modify the return statement to wrap clip-specific stuff in {selectedClip && (...)}
// But it's easier to just do it via regex or custom script.
fs.writeFileSync('src/components/Toolbar.tsx', code);
