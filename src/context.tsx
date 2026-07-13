import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type KeyframeData = {
  time: number;
  properties: {
    opacity?: number;
    scale?: number;
    x?: number;
    y?: number;
    rotate?: number;
  };
};

export const VIDEO_EFFECTS = [
  { id: 'none', name: 'None', getFilter: (i: number) => 'none' },
  { id: 'blur', name: 'Blur', getFilter: (i: number) => `blur(${i / 10}px)` },
  { id: 'grayscale', name: 'Grayscale', getFilter: (i: number) => `grayscale(${i}%)` },
  { id: 'sepia', name: 'Sepia', getFilter: (i: number) => `sepia(${i}%)` },
  { id: 'invert', name: 'Invert', getFilter: (i: number) => `invert(${i}%)` },
  { id: 'brightness', name: 'Bright', getFilter: (i: number) => `brightness(${100 + i}%)` },
  { id: 'dark', name: 'Dark', getFilter: (i: number) => `brightness(${100 - i / 1.5}%)` },
  { id: 'contrast', name: 'Contrast', getFilter: (i: number) => `contrast(${100 + i}%)` },
  { id: 'saturate', name: 'Saturate', getFilter: (i: number) => `saturate(${100 + i * 2}%)` },
  { id: 'huerotate90', name: 'Hue 90', getFilter: (i: number) => `hue-rotate(${90 * (i/100)}deg)` },
  { id: 'huerotate180', name: 'Hue 180', getFilter: (i: number) => `hue-rotate(${180 * (i/100)}deg)` },
  { id: 'vintage', name: 'Vintage', getFilter: (i: number) => `sepia(${i / 2}%) hue-rotate(-${i / 3}deg) saturate(${100 + i / 2.5}%)` },
  { id: 'cinematic', name: 'Cinematic', getFilter: (i: number) => `contrast(${100 + i / 5}%) saturate(${100 + i / 5}%) brightness(${100 - i / 10}%)` },
  { id: 'bw', name: 'B&W', getFilter: (i: number) => `grayscale(${i}%) contrast(${100 + i / 5}%)` },
  { id: 'retro', name: 'Retro', getFilter: (i: number) => `sepia(${i * 0.8}%) contrast(${100 + i / 5}%) brightness(${100 - i / 10}%)` },
  { id: 'cyberpunk', name: 'Cyberpunk', getFilter: (i: number) => `hue-rotate(${180 * (i/100)}deg) saturate(${100 + i}%) contrast(${100 + i / 2}%)` },
  { id: 'dreamy', name: 'Dreamy', getFilter: (i: number) => `blur(${i / 50}px) brightness(${100 + i / 5}%) saturate(${100 + i / 2}%)` },
  { id: 'negative', name: 'Negative', getFilter: (i: number) => `invert(${i}%) hue-rotate(${180 * (i/100)}deg)` },
  { id: 'washout', name: 'Washout', getFilter: (i: number) => `brightness(${100 + i / 5}%) contrast(${100 - i / 5}%) saturate(${100 - i / 5}%)` },
  { id: 'warm', name: 'Warm', getFilter: (i: number) => `sepia(${i / 3}%) saturate(${100 + i / 2}%)` },
  { id: 'cool', name: 'Cool', getFilter: (i: number) => `hue-rotate(${180 * (i/100)}deg) sepia(${i / 5}%) saturate(${100 + i / 5}%)` }
];

export const getEffectCSS = (id?: string, intensity: number = 100) => {
  if (!id || id === 'none') return 'none';
  const effect = VIDEO_EFFECTS.find(e => e.id === id);
  return effect ? effect.getFilter(intensity) : 'none';
};

export const getCurveRate = (curve: string | undefined, progress: number, customPoints?: {x: number, y: number}[]): number => {
  if (!customPoints || customPoints.length < 2) return 1.0;
  // Cosine interpolation between points
  const sorted = [...customPoints].sort((a,b) => a.x - b.x);
  if (progress <= sorted[0].x) return sorted[0].y;
  if (progress >= sorted[sorted.length-1].x) return sorted[sorted.length-1].y;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (progress >= sorted[i].x && progress <= sorted[i+1].x) {
      const mu = (progress - sorted[i].x) / (sorted[i+1].x - sorted[i].x);
      const mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
      return sorted[i].y * (1 - mu2) + sorted[i+1].y * mu2;
    }
  }
  return 1.0;
};

// Simplified integral for static scrubbing
export const getCurveIntegratedProgress = (curve: string | undefined, progress: number, customPoints?: {x: number, y: number}[]): number => {
  if (!customPoints || customPoints.length < 2) return progress;
  // approximate integral by sampling (Riemann sum)
  const steps = 50;
  let sum = 0;
  const stepSize = progress / steps;
  for(let i=0; i<steps; i++) {
    sum += getCurveRate(curve, i * stepSize, customPoints) * stepSize;
  }
  return sum;
};

export type Clip = {
  id: string;
  trackId: string;
  start: number;
  duration: number;
  name: string;
  bg?: string;
  selected: boolean;
  type: string;
  url?: string;
  keyframes?: KeyframeData[];
  flipX?: boolean;
  flipY?: boolean;
  fit?: boolean;
  baseRotate?: number;
  filter?: string;
  filterIntensity?: number;
  playbackRate?: number;
  speedCurve?: string;
  customSpeedPoints?: { x: number, y: number }[];
  volume?: number; // 0 to 100 or similar
  fadeIn?: number; // duration in ticks or seconds
  fadeOut?: number;
  reduceNoise?: boolean;
  vocalVolume?: number;
  backgroundVolume?: number;
  lyrics?: string;
  audioEffect?: string;
  voiceEnhance?: boolean;
  enhanced?: boolean;
  enhanceIntensity?: number;
  equalizerEnabled?: boolean;
  preAmp?: number;
  eqBands?: number[];
  compressorEnabled?: boolean;
  compThreshold?: number;
  compRatio?: number;
  compAttack?: number;
  compRelease?: number;
  pitch?: number;
  aiIsolation?: boolean;
};

export type State = {
  clips: Clip[];
  keyframes: Record<string, boolean>;
  mediaLibrary: { id: string, name: string, url: string, type: 'video' | 'audio' | 'image', duration?: number }[];
  currentTime: number;
  isPlaying: boolean;
};

export const INITIAL_CLIPS: Clip[] = [];

interface ProjectContextType {
  state: State;
  setClips: (clips: Clip[] | ((prev: Clip[]) => Clip[])) => void;
  setKeyframes: (keyframes: Record<string, boolean>) => void;
  setMediaLibrary: (media: State['mediaLibrary'] | ((prev: State['mediaLibrary']) => State['mediaLibrary'])) => void;
  setCurrentTime: (time: number | ((prev: number) => number)) => void;
  setIsPlaying: (playing: boolean | ((prev: boolean) => boolean)) => void;
  showProperties: boolean;
  setShowProperties: (show: boolean) => void;
  activePropertiesTab: string;
  setActivePropertiesTab: (tab: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<{ past: State[], present: State, future: State[] }>({
    past: [],
    present: {
      clips: INITIAL_CLIPS, keyframes: {}, currentTime: 0, isPlaying: false, mediaLibrary: [
        { id: 'm1', name: 'For Bigger Blazes', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', type: 'video', duration: 15 },
        { id: 'm2', name: 'Big Buck Bunny', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type: 'video', duration: 60 },
        { id: 'm3', name: 'Elephants Dream', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', type: 'video', duration: 100 }
      ]
    },
    future: []
  });

  const [currentTime, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlayingState] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [activePropertiesTab, setActivePropertiesTab] = useState('video');

  const state = { ...history.present, currentTime, isPlaying };

  const setClips = useCallback((newClipsOrUpdater: Clip[] | ((prev: Clip[]) => Clip[])) => {
    setHistory(prev => {
      const currentClips = prev.present.clips;
      const newClips = typeof newClipsOrUpdater === 'function' ? newClipsOrUpdater(currentClips) : newClipsOrUpdater;
      
      return {
        past: [...prev.past, prev.present],
        present: { ...prev.present, clips: newClips },
        future: []
      };
    });
  }, []);

  const setKeyframes = useCallback((newKeyframes: Record<string, boolean>) => {
    setHistory(prev => {
      return {
        past: [...prev.past, prev.present],
        present: { ...prev.present, keyframes: newKeyframes },
        future: []
      };
    });
  }, []);

  const setMediaLibrary = useCallback((newLibraryOrUpdater: State['mediaLibrary'] | ((prev: State['mediaLibrary']) => State['mediaLibrary'])) => {
    setHistory(prev => {
      const currentLibrary = prev.present.mediaLibrary;
      const newLibrary = typeof newLibraryOrUpdater === 'function' ? newLibraryOrUpdater(currentLibrary) : newLibraryOrUpdater;
      
      return {
        past: [...prev.past, prev.present],
        present: { ...prev.present, mediaLibrary: newLibrary },
        future: []
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  return (
    <ProjectContext.Provider value={{ state, setClips, setKeyframes, setMediaLibrary, setCurrentTime: setCurrentTimeState, setIsPlaying: setIsPlayingState, showProperties, setShowProperties, activePropertiesTab, setActivePropertiesTab, undo, redo, canUndo: history.past.length > 0, canRedo: history.future.length > 0 }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within ProjectProvider');
  return context;
}
