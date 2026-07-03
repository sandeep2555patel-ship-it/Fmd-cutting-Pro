const fs = require('fs');
let code = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const targetReturn = `  return (
    <div className="h-[60px] md:h-[70px] bg-[#1a1a1a] flex items-center overflow-x-auto no-scrollbar px-2 w-full">
      <div className="flex items-center space-x-1 min-w-max mx-auto md:mx-0">
        <label className="flex flex-col items-center justify-center w-14 h-14 hover:bg-[#2a2a2a] rounded-lg transition-colors group flex-shrink-0 cursor-pointer">
          <RefreshCcw size={20} className="text-gray-300 group-hover:text-white mb-1" />
          <span className="text-[9px] text-gray-400 group-hover:text-gray-200">Replace</span>
          <input type="file" accept="video/*,image/*" className="hidden" onChange={handleReplace} />
        </label>
        
        {selectedClip.type === 'audio' && (
          <>`;

const replacementReturn = `  return (
    <div className="h-[60px] md:h-[70px] bg-[#1a1a1a] flex items-center overflow-x-auto no-scrollbar px-2 w-full">
      <div className="flex items-center space-x-1 min-w-max mx-auto md:mx-0">
        <ToolbarButton icon={Undo2} label="Undo" onClick={undo} disabled={!canUndo} />
        <ToolbarButton icon={Redo2} label="Redo" onClick={redo} disabled={!canRedo} />
        
        {selectedClip && (
          <>
            <label className="flex flex-col items-center justify-center w-14 h-14 hover:bg-[#2a2a2a] rounded-lg transition-colors group flex-shrink-0 cursor-pointer">
              <RefreshCcw size={20} className="text-gray-300 group-hover:text-white mb-1" />
              <span className="text-[9px] text-gray-400 group-hover:text-gray-200">Replace</span>
              <input type="file" accept="video/*,image/*" className="hidden" onChange={handleReplace} />
            </label>
          </>
        )}
        
        {selectedClip?.type === 'audio' && (
          <>`;

code = code.replace(targetReturn, replacementReturn);

// Also need to fix selectedClip.type === 'video'
code = code.replace(`{selectedClip.type === 'video' && (`, `{selectedClip?.type === 'video' && (`);

// Also need to wrap the rest of the buttons at the end that rely on selectedClip
const targetEndButtons = `        <ToolbarButton icon={Sliders} label="Options" onClick={() => { setActivePropertiesTab('audio'); setShowProperties(true); }} />
        <ToolbarButton icon={Lock} label="Lock" onClick={handleLock} />
        <ToolbarButton icon={Copy} label="Duplicate" onClick={handleDuplicate} />
        <ToolbarButton icon={Trash2} label="Delete" onClick={handleDelete} />
      </div>
    </div>
  );`;

const replacementEndButtons = `        {selectedClip && (
          <>
            <ToolbarButton icon={Sliders} label="Options" onClick={() => { setActivePropertiesTab('audio'); setShowProperties(true); }} />
            <ToolbarButton icon={Lock} label="Lock" onClick={handleLock} />
            <ToolbarButton icon={Copy} label="Duplicate" onClick={handleDuplicate} />
            <ToolbarButton icon={Trash2} label="Delete" onClick={handleDelete} />
          </>
        )}
      </div>
    </div>
  );`;

code = code.replace(targetEndButtons, replacementEndButtons);

fs.writeFileSync('src/components/Toolbar.tsx', code);
