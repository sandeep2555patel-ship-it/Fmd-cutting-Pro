const fs = require('fs');
let code = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

code = code.replace(
  `{selectedClip && (
          <>
            <label className="flex flex-col items-center justify-center w-14 h-14 hover:bg-[#2a2a2a] rounded-lg transition-colors group flex-shrink-0 cursor-pointer">
              <RefreshCcw size={20} className="text-gray-300 group-hover:text-white mb-1" />
              <span className="text-[9px] text-gray-400 group-hover:text-gray-200">Replace</span>
              <input type="file" accept="video/*,image/*" className="hidden" onChange={handleReplace} />
            </label>
          </>
        )}`,
  `{selectedClip && selectedClip.type !== 'text' && (
          <>
            <label className="flex flex-col items-center justify-center w-14 h-14 hover:bg-[#2a2a2a] rounded-lg transition-colors group flex-shrink-0 cursor-pointer">
              <RefreshCcw size={20} className="text-gray-300 group-hover:text-white mb-1" />
              <span className="text-[9px] text-gray-400 group-hover:text-gray-200">Replace</span>
              <input type="file" accept="video/*,image/*" className="hidden" onChange={handleReplace} />
            </label>
          </>
        )}`
);

fs.writeFileSync('src/components/Toolbar.tsx', code);
