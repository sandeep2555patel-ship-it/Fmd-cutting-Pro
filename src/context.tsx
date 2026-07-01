import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export const INITIAL_CLIPS = [
  { id: 'c1', trackId: 'v2', start: 0, duration: 150, name: 'Sample Video 1', bg: 'bg-[#2B547E]', selected: true, type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
  { id: 'c2', trackId: 'v2', start: 150, duration: 200, name: 'Sample Video 2', bg: 'bg-[#2B547E]', selected: false, type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: 'c3', trackId: 'v1', start: 50, duration: 80, name: 'B-Roll.mov', bg: 'bg-[#6D3A8A]', selected: false, type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  { id: 'c4', trackId: 't1', start: 20, duration: 60, name: 'Epic Title', bg: 'bg-[#A86624]', selected: false, type: 'text', url: '' },
  { id: 'c5', trackId: 'a1', start: 0, duration: 350, name: 'Background Music', bg: 'bg-[#1E6C54]', selected: false, type: 'audio', url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3' },
];

export type Clip = typeof INITIAL_CLIPS[0];

export type State = {
  clips: Clip[];
  keyframes: Record<string, boolean>;
};

interface ProjectContextType {
  state: State;
  setClips: (clips: Clip[]) => void;
  setKeyframes: (keyframes: Record<string, boolean>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<State[]>([{ clips: INITIAL_CLIPS, keyframes: {} }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];

  const setClips = useCallback((newClips: Clip[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, { clips: newClips, keyframes: prev[currentIndex].keyframes }];
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const setKeyframes = useCallback((newKeyframes: Record<string, boolean>) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, { clips: prev[currentIndex].clips, keyframes: newKeyframes }];
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const redo = useCallback(() => {
    setCurrentIndex(prev => (prev < history.length - 1 ? prev + 1 : prev));
  }, [history.length]);

  return (
    <ProjectContext.Provider value={{ state, setClips, undo, redo, canUndo: currentIndex > 0, canRedo: currentIndex < history.length - 1 }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within ProjectProvider');
  return context;
}
