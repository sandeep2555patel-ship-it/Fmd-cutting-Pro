import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export const INITIAL_CLIPS = [
  { id: 'c1', trackId: 'v2', start: 0, duration: 150, name: '', bg: '#333333', selected: true, type: 'video', url: 'https://images.unsplash.com/photo-1516162596541-11d4d3d8a562?q=80&w=400&auto=format&fit=crop' },
  { id: 'c2', trackId: 'v2', start: 150, duration: 150, name: '', bg: '#333333', selected: false, type: 'video', url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=400&auto=format&fit=crop' },
  { id: 'c5', trackId: 'a1', start: 0, duration: 300, name: 'प्रेम और समर्पण का गीत', bg: '#6A4DFF', selected: false, type: 'audio', url: '' },
];

export type Clip = typeof INITIAL_CLIPS[0];

export type State = {
  clips: Clip[];
  keyframes: Record<string, boolean>;
  mediaLibrary: { id: string, name: string, url: string, type: 'video' | 'audio' | 'image' }[];
};

interface ProjectContextType {
  state: State;
  setClips: (clips: Clip[]) => void;
  setKeyframes: (keyframes: Record<string, boolean>) => void;
  setMediaLibrary: (media: State['mediaLibrary']) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<State[]>([{ clips: INITIAL_CLIPS, keyframes: {}, mediaLibrary: [
    { id: 'm1', name: 'For Bigger Blazes', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', type: 'video' },
    { id: 'm2', name: 'Big Buck Bunny', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type: 'video' },
    { id: 'm3', name: 'Elephants Dream', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', type: 'video' }
  ] }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];

  const setClips = useCallback((newClips: Clip[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, { clips: newClips, keyframes: prev[currentIndex].keyframes, mediaLibrary: prev[currentIndex].mediaLibrary }];
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const setKeyframes = useCallback((newKeyframes: Record<string, boolean>) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, { clips: prev[currentIndex].clips, keyframes: newKeyframes, mediaLibrary: prev[currentIndex].mediaLibrary }];
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const setMediaLibrary = useCallback((newLibrary: State['mediaLibrary']) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, { clips: prev[currentIndex].clips, keyframes: prev[currentIndex].keyframes, mediaLibrary: newLibrary }];
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
    <ProjectContext.Provider value={{ state, setClips, setKeyframes, setMediaLibrary, undo, redo, canUndo: currentIndex > 0, canRedo: currentIndex < history.length - 1 }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within ProjectProvider');
  return context;
}
