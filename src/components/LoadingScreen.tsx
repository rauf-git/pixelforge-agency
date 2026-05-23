'use client';

import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Only show loading screen on initial visit during browser session
    const hasVisited = sessionStorage.getItem('upscalemark_visited');
    if (hasVisited === 'true') {
      setVisible(false);
      setShouldRender(false);
    } else {
      setShouldRender(true);
    }
  }, []);

  useEffect(() => {
    if (!shouldRender) return;

    const duration = 1200; // 1.2 seconds for the progress count
    const intervalTime = 12;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          // Save visit status and trigger split-out slide transition
          sessionStorage.setItem('upscalemark_visited', 'true');
          setTimeout(() => setVisible(false), 300); // Small pause at 100%
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [shouldRender]);

  if (!shouldRender || !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        progress === 100 ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex flex-col items-center gap-6 max-w-xs w-full px-6">
        {/* Crisp vector logo mark outline */}
        <div className="w-14 h-14 relative flex items-center justify-center opacity-80 animate-pulse">
          {/* Logo symbol recreation in miniature */}
          <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
            <rect x="35" y="10" width="10" height="80" rx="3" />
            <rect x="55" y="10" width="10" height="80" rx="3" />
            <rect x="10" y="35" width="80" height="10" rx="3" />
            <rect x="10" y="55" width="80" height="10" rx="3" />
          </svg>
        </div>

        <div className="flex flex-col w-full gap-2 text-center">
          <span className="font-mono text-3xs font-semibold tracking-[0.2em] text-primary/60 uppercase">
            System Initializing
          </span>
          <span className="text-3xl font-extrabold tracking-tighter text-foreground font-mono">
            {Math.floor(progress)}%
          </span>
        </div>

        {/* Technical scanning line */}
        <div className="w-full h-[2px] bg-muted relative overflow-hidden rounded-full">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-primary animate-scan rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
