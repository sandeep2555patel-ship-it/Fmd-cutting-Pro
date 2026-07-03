import React, { useMemo, useEffect, useRef } from 'react';
import { Clip } from '../context';

interface AudioWaveformVisualizerProps {
  clip: Clip;
  currentTime?: number;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({ clip, currentTime }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Create a deterministic mock waveform based on clip ID
  const waveform = useMemo(() => {
    const points = [];
    let seed = clip.id.charCodeAt(0) || 1;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    
    let currentAmp = 0.3;
    // 150 points for dense look
    for (let i = 0; i < 150; i++) {
      if (i % 8 === 0) currentAmp = 0.2 + random() * 0.8;
      const targetAmp = 0.1 + random() * 0.9;
      currentAmp = currentAmp * 0.6 + targetAmp * 0.4;
      points.push(currentAmp);
    }
    return points;
  }, [clip.id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const rulerHeight = 16;
    const graphHeight = height - rulerHeight;
    
    ctx.clearRect(0, 0, width, height);
    
    const durationSec = clip.duration / 20; // 20px per second
    
    // 1. Draw bottom-aligned waveform
    const barWidth = width / waveform.length;
    
    ctx.fillStyle = '#C8A951'; // Yellowish gold
    
    for (let i = 0; i < waveform.length; i++) {
      const amp = waveform[i];
      const barHeight = amp * (graphHeight * 0.9); // max 90% of height
      const x = i * barWidth;
      
      // Bottom aligned to graphHeight
      const actualBarWidth = Math.max(1, barWidth - 1); // 1px gap
      ctx.fillRect(x, graphHeight - barHeight, actualBarWidth, barHeight);
    }
    
    // 2. Draw Fade Overlays
    if (durationSec > 0) {
      const fadeInSec = clip.fadeIn || 0;
      const fadeOutSec = clip.fadeOut || 0;
      
      const fadeInRatio = Math.min(1, fadeInSec / durationSec);
      const fadeOutRatio = Math.min(1, fadeOutSec / durationSec);
      
      const fadeInPx = fadeInRatio * width;
      const fadeOutPx = fadeOutRatio * width;
      
      // Fade In
      if (fadeInPx > 0) {
        // Darken the area left/above the fade line
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(fadeInPx, 0);
        ctx.lineTo(0, graphHeight);
        ctx.fill();
        
        // Draw the white line
        ctx.beginPath();
        ctx.moveTo(0, graphHeight);
        ctx.lineTo(fadeInPx, 0);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Draw small handle dot at the top of the line
        ctx.beginPath();
        ctx.arc(fadeInPx, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
      
      // Fade Out
      if (fadeOutPx > 0) {
        const startOutPx = width - fadeOutPx;
        
        // Darken the area right/above the fade line
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.moveTo(width, 0);
        ctx.lineTo(startOutPx, 0);
        ctx.lineTo(width, graphHeight);
        ctx.fill();
        
        // Draw the white line
        ctx.beginPath();
        ctx.moveTo(width, graphHeight);
        ctx.lineTo(startOutPx, 0);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Draw small handle dot at the top
        ctx.beginPath();
        ctx.arc(startOutPx, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
    }
    
    // 3. Draw Ruler
    ctx.fillStyle = '#666';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    // Draw tick marks every 1 second if possible
    let tickInterval = 1;
    if (durationSec > 20) tickInterval = 5;
    else if (durationSec > 10) tickInterval = 2;
    else if (durationSec < 2) tickInterval = 0.5;
    
    for (let t = 0; t <= durationSec; t += tickInterval) {
      if (t === 0 && durationSec > 0) continue; // skip 0 if we want
      
      const x = (t / durationSec) * width;
      
      // Tick line
      ctx.fillStyle = '#444';
      ctx.fillRect(x, graphHeight, 1, 4);
      
      // Text
      ctx.fillStyle = '#888';
      let label = t + 's';
      if (tickInterval < 1 && t % 1 !== 0) label = t.toFixed(1) + 's';
      
      // Prevent drawing text out of bounds
      if (x > 10 && x < width - 10) {
        ctx.fillText(label, x, height - 2);
      }
    }
    
  }, [waveform, clip.fadeIn, clip.fadeOut, clip.duration]);

  return (
    <div className="w-full mt-4 mb-2">
      <div className="w-full bg-[#161616] rounded-md overflow-hidden relative border border-[#333]">
        <canvas 
          ref={canvasRef} 
          style={{ width: '100%', height: '80px' }}
        />
        
        {/* Current Time Playhead Overlay */}
        {currentTime !== undefined && (
          <div 
            className="absolute top-0 bottom-[16px] w-[2px] bg-white z-10 shadow-[0_0_4px_rgba(0,0,0,0.8)] pointer-events-none"
            style={{ 
              left: `${Math.max(0, Math.min(100, ((currentTime - clip.start) / clip.duration) * 100))}%`,
              display: (currentTime >= clip.start && currentTime <= clip.start + clip.duration) ? 'block' : 'none'
            }}
          />
        )}
      </div>
    </div>
  );
};
