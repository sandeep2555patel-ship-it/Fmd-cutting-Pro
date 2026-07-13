import { Menu, Layout, Download, Settings, CornerUpLeft, CornerUpRight, X } from 'lucide-react';
import { useState } from 'react';
import { useProject } from '../context';

export default function Header() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { undo, redo, canUndo, canRedo } = useProject();

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowExportModal(false);
      alert('Export completed successfully!');
    }, 2000);
  };

  return (
    <>
      <header className="h-12 flex-shrink-0 bg-zinc-950 border-b border-zinc-800/50 flex items-center justify-between px-2 md:px-4 text-sm z-50">
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="p-1.5 text-zinc-400 hover:text-white transition-colors">
            <Menu size={18} />
          </button>
          <span className="font-semibold text-gray-200 truncate max-w-[120px] md:max-w-none">My First Project</span>
          <span className="hidden md:inline-block text-xs text-gray-500 bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">Auto-saved</span>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-6">
          <div className="flex items-center space-x-1 md:space-x-3 border-r border-zinc-700 pr-2 md:pr-6">
            <button 
              onClick={undo}
              disabled={!canUndo}
              className={`p-1.5 transition-colors ${canUndo ? 'text-zinc-400 hover:text-white cursor-pointer' : 'text-gray-600 cursor-not-allowed'}`}
            >
              <CornerUpLeft size={16} />
            </button>
            <button 
              onClick={redo}
              disabled={!canRedo}
              className={`p-1.5 transition-colors ${canRedo ? 'text-zinc-400 hover:text-white cursor-pointer' : 'text-gray-600 cursor-not-allowed'}`}
            >
              <CornerUpRight size={16} />
            </button>
          </div>
          
          <div className="flex items-center space-x-1 md:space-x-3">
            <button className="hidden md:block p-1.5 text-zinc-400 hover:text-white transition-colors">
              <Layout size={16} />
            </button>
            <button className="hidden md:block p-1.5 text-zinc-400 hover:text-white transition-colors">
              <Settings size={16} />
            </button>
            <button 
              onClick={() => setShowExportModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-3 py-1.5 rounded text-xs transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              Export
            </button>
          </div>
        </div>
      </header>

      {showExportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Export Video</h2>
              <button onClick={() => setShowExportModal(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Resolution</label>
                <select className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white outline-none focus:border-cyan-500">
                  <option>1080p (FHD)</option>
                  <option>4K (UHD)</option>
                  <option>720p (HD)</option>
                  <option>480p (SD)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Format</label>
                <select className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white outline-none focus:border-cyan-500">
                  <option>MP4</option>
                  <option>MOV</option>
                  <option>GIF</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400">Frame Rate</label>
                <select className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white outline-none focus:border-cyan-500">
                  <option>30 fps</option>
                  <option>60 fps</option>
                  <option>24 fps</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button 
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded text-sm transition-colors flex items-center space-x-2"
              >
                {isExporting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <span>Export</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
