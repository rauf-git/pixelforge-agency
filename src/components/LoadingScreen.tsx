'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
  showSkip?: boolean;
}

const WORDS = ["Design.", "Market.", "Grow."];

export default function LoadingScreen({ onComplete, showSkip = true }: LoadingScreenProps) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  // Cycle through the words vertically upward
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('upscalemark_visited');
    if (hasVisited === 'true') {
      setVisible(false);
      setShouldRender(false);
    } else {
      setShouldRender(true);
    }
  }, []);

  const handleComplete = useCallback(() => {
    sessionStorage.setItem('upscalemark_visited', 'true');
    setVisible(false);
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    if (!shouldRender) return;
    const wordInterval = setInterval(() => {
      setIndex((prev) => {
        if (prev === WORDS.length - 1) {
          // Keep on the final word slightly before dismissing
          return prev; 
        }
        return prev + 1;
      });
    }, 1800);

    return () => clearInterval(wordInterval);
  }, [shouldRender]);

  // Map progress to the active animation timer duration
  useEffect(() => {
    if (!shouldRender) return;
    const totalDuration = WORDS.length * 1800; // 5400ms
    const intervalMs = 30;
    const increment = (intervalMs / totalDuration) * 100;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(progressInterval);
          // Optional sound trigger on load complete (subtle, high-end design pattern)
          if (soundEnabled) {
            try {
              const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
              if (AudioContextClass) {
                const audioCtx = new AudioContextClass();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5 clean clear note
                gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.4);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.4);
              }
            } catch {
              // Graceful failure if browser prevents immediate audio initialization
            }
          }
          // Brief pleasant delay showing 100% state before navigating to the main viewport
          setTimeout(() => {
            handleComplete();
          }, 400);
          return 100;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(progressInterval);
  }, [soundEnabled, shouldRender, handleComplete]);

  if (!shouldRender || !visible) return null;

  const currentWord = WORDS[Math.min(index, WORDS.length - 1)];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="loader-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#FAFAFA] p-8 md:p-12 select-none"
        >
          {/* Top Header Row: System metadata & subtle accessory controls */}
          <div id="loader-top-bar" className="flex items-center justify-between w-full max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#6B7280] uppercase">
                Est. 2026 // System Ingress
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono text-neutral-400 hover:text-neutral-800 transition-colors bg-white/50 border border-neutral-100 hover:border-neutral-200 cursor-pointer"
                id="sound-toggle-btn"
                title="Toggle micro-sound alerts"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 size={10} className="text-[#2563EB]" />
                    <span>SOUND ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX size={10} />
                    <span>SOUND MUTED</span>
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Center Cluster: Clean Minimalism Layout */}
          <div id="loader-center-cluster" className="flex flex-col items-center justify-center flex-1 max-w-xl w-full">
            
            {/* Accent indicator line above custom text */}
            <div className="w-[1px] h-[40px] bg-[#2563EB] mb-10 relative overflow-hidden" id="vertical-blue-accent">
              <motion.div 
                className="absolute inset-[0.5px] w-full bg-[#2563EB] origin-top opacity-50"
                animate={{
                  scaleY: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: [0.25, 1, 0.5, 1],
                }}
              />
            </div>

            {/* Vertical Moving Typography Stage */}
            <div className="h-[160px] flex items-center justify-center overflow-hidden mb-8 w-full text-center relative">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentWord}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1] // Custom high-end deceleration curves (Stripe/Apple style)
                  }}
                  className="text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-tight text-[#111827] select-none font-sans leading-none m-0"
                  style={{ fontWeight: 800, letterSpacing: '-0.05em' }}
                  id={`animated-word-${currentWord.toLowerCase().replace('.', '')}`}
                >
                  {currentWord}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Linear Progress Rail & Agency Title */}
            <div className="flex flex-col items-center gap-6">
              <div className="w-[120px] h-[1px] bg-[#E5E7EB] relative overflow-hidden" id="loader-progress-track">
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-[#2563EB]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-[12px] font-semibold uppercase tracking-[0.4em] text-[#6B7280]"
                id="loader-agency-branding"
              >
                Upscale Mark
              </motion.p>
            </div>
          </div>

          {/* Bottom Footer Controls */}
          <div id="loader-bottom-controls" className="w-full max-w-7xl mx-auto flex items-center justify-between gap-6 pointer-events-auto">
            <div className="text-[10px] text-[#9CA3AF] tracking-[0.15em] uppercase font-mono">
              Est. 2026 • Loading Portfolio
            </div>
            
            {showSkip && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={handleComplete}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono text-[#9CA3AF] hover:text-neutral-800 bg-transparent hover:bg-neutral-100/50 border border-transparent hover:border-neutral-200 transition-all cursor-pointer"
                id="skip-loader-btn"
              >
                <span>SKIP INTRO</span>
                <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
