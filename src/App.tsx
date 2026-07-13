import { useState, useEffect } from 'react';
import { TabType } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MediaBin from './components/MediaBin';
import Preview from './components/Preview';
import Properties from './components/Properties';
import Timeline from './components/Timeline';
import Toolbar from './components/Toolbar';
import { X, SlidersHorizontal } from 'lucide-react';
import { useProject } from './context';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType | null>('media');
  useEffect(() => {
    const handleOpen = (e: any) => setActiveTab(e.detail);
    window.addEventListener('open-media-bin', handleOpen);
    return () => window.removeEventListener('open-media-bin', handleOpen);
  }, []);
  const { showProperties, setShowProperties, state: { clips } } = useProject();
  
  const selectedClip = clips.find(c => c.selected);

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/30">
      <Header />
      
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        {/* Mobile: Bottom Tabs, Desktop: Left Sidebar */}
        <div className="order-last md:order-first z-50 bg-zinc-900 shadow-2xl z-50">
          <div className="md:hidden">
            {selectedClip ? <Toolbar /> : <Sidebar activeTab={activeTab || 'media'} setActiveTab={setActiveTab} />}
          </div>
          <div className="hidden md:block">
            <Sidebar activeTab={activeTab || 'media'} setActiveTab={setActiveTab} />
          </div>
        </div>
        
        {/* Desktop Media Bin */}
        <div className="hidden md:flex h-full">
          {activeTab && <MediaBin activeTab={activeTab} />}
        </div>
        
        {/* Mobile Media Bin Overlay */}
        <div className={`md:hidden absolute inset-0 z-40 bg-zinc-900/95 backdrop-blur-2xl border-t border-white/5 flex-col transition-transform duration-300 ease-in-out ${activeTab ? 'translate-y-0 flex' : 'translate-y-full'}`}>
           {activeTab && <MediaBin activeTab={activeTab} isMobile={true} onClose={() => setActiveTab(null)} />}
        </div>

        {/* Main Content Area (Preview + Timeline) */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative z-0">
           <Preview />
           <Timeline />
           
           <div className="hidden md:block">
             <Toolbar />
           </div>
           
           {/* Floating Mobile Properties Button */}
           <button 
             onClick={() => setShowProperties(true)}
             className="md:hidden absolute top-4 right-4 z-10 bg-zinc-950/80 p-2 rounded-full backdrop-blur border border-white/10 text-white shadow-lg"
           >
             <SlidersHorizontal size={20} />
           </button>
        </div>
        
        {/* Desktop Properties */}
        <div className="hidden xl:flex h-full min-h-0 flex-col">
          <Properties />
        </div>

        {/* Mobile Properties Overlay */}
        <div className={`xl:hidden absolute bottom-0 left-0 right-0 top-[50%] z-50 bg-zinc-900/95 backdrop-blur-2xl border-t border-white/5 flex-col transition-transform duration-300 ease-in-out ${showProperties ? 'translate-y-0 flex' : 'translate-y-full'}`}>
           <div className="flex justify-between items-center p-4 border-b border-zinc-800">
              <span className="font-semibold">Properties</span>
              <button onClick={() => setShowProperties(false)} className="p-1 bg-zinc-800/80 hover:bg-zinc-700 rounded-full text-gray-400 hover:text-white"><X size={20} /></button>
           </div>
           <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
             <Properties isMobile={true} />
           </div>
        </div>
      </div>
    </div>
  );
}
