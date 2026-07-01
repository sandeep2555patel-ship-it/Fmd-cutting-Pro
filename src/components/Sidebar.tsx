import { TabType } from '../types';
import { Image, Music, Type, Sticker, Wand2, Sparkles, Layers, SlidersHorizontal } from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType | null) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'media', label: 'Media', icon: Image },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'stickers', label: 'Stickers', icon: Sticker },
    { id: 'effects', label: 'Effects', icon: Wand2 },
    { id: 'transitions', label: 'Transitions', icon: Sparkles },
    { id: 'filters', label: 'Filters', icon: Layers },
    { id: 'adjustment', label: 'Adjust', icon: SlidersHorizontal },
  ];

  return (
    <div className="w-full md:w-[72px] h-[60px] md:h-auto flex-shrink-0 bg-[#121212] flex flex-row md:flex-col items-center md:py-4 md:space-y-2 border-t md:border-t-0 md:border-r border-[#222] overflow-x-auto no-scrollbar">
      <div className="flex md:flex-col w-full px-2 md:px-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(isActive ? null : tab.id)}
              className={`flex-shrink-0 w-16 md:w-full flex flex-col items-center justify-center py-2 md:py-3 px-1 transition-colors ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={20} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
