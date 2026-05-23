'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Initialize theme from localStorage or default to bright (light) mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('upscalemark_theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      setDarkMode(false);
      localStorage.setItem('upscalemark_theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      localStorage.setItem('upscalemark_theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <>
      {/* FLOATING NAVBAR PILL */}
      <header className="w-full fixed top-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
        <nav className="w-full max-w-4xl bg-card/60 dark:bg-card/40 backdrop-blur-md border border-border/80 rounded-full py-3.5 px-6 flex justify-between items-center shadow-lg pointer-events-auto transition-transform duration-500 hover:scale-[1.01]">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Inline SVG Woven Hashtag Symbol */}
            <div className="w-8 h-8 relative flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
              <svg viewBox="0 0 100 100" className="w-full h-full text-primary fill-current">
                {/* 1. V2 (right vertical) */}
                <rect x="55" y="10" width="10" height="80" rx="3" />
                {/* 2. H1 (top horizontal) */}
                <rect x="10" y="35" width="80" height="10" rx="3" />
                {/* 3. V1 (left vertical) */}
                <rect x="35" y="10" width="10" height="80" rx="3" />
                {/* 4. H2 (bottom horizontal) */}
                <rect x="10" y="55" width="80" height="10" rx="3" />
                {/* 5. V2 overlay patch at H2 intersection (x=55, y=55, w=10, h=10) */}
                <rect x="55" y="55" width="10" height="10" />
              </svg>
            </div>
            {/* lowercase geometric brand typography */}
            <span className="font-sans font-black text-lg tracking-tighter text-foreground group-hover:text-primary transition-colors">
              upscalemark<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {['services', 'portfolio', 'about', 'contact'].map((item) => (
              <Link
                key={item}
                href={`/${item}`}
                className="font-mono text-3xs font-black tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors duration-300 relative group/nav cursor-pointer py-1"
              >
                /{item}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover/nav:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </div>

          {/* Action Row: Theme Toggle + Burger */}
          <div className="flex items-center gap-4">
            {/* Dynamic Sun/Moon Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full border border-border bg-background hover:bg-muted text-foreground hover:text-primary transition-all duration-300 relative cursor-pointer"
              aria-label="Toggle Bright/Dark Mode"
            >
              <div className="w-4 h-4 relative flex items-center justify-center overflow-hidden">
                {darkMode ? (
                  <Sun className="w-4 h-4 transition-transform duration-500 scale-100 rotate-0" />
                ) : (
                  <Moon className="w-4 h-4 transition-transform duration-500 scale-100 rotate-0" />
                )}
              </div>
            </button>

            {/* Minimalist Burger Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 justify-center items-center w-8 h-8 rounded-full border border-border bg-background hover:bg-muted cursor-pointer group"
              aria-label={menuOpen ? "Close Menu" : "Open Menu"}
            >
              <span
                className={`w-4 h-[2px] bg-foreground transition-all duration-300 rounded-full group-hover:bg-primary ${
                  menuOpen ? "rotate-45 translate-y-[4px]" : ""
                }`}
              ></span>
              <span
                className={`w-4 h-[2px] bg-foreground transition-all duration-300 rounded-full group-hover:bg-primary ${
                  menuOpen ? "-rotate-45 -translate-y-[4px]" : ""
                }`}
              ></span>
            </button>
          </div>
        </nav>
      </header>

      {/* FULLSCREEN NAVIGATION OVERLAY */}
      <div
        className={`fixed inset-0 z-40 bg-background/95 dark:bg-background/95 backdrop-blur-lg flex flex-col justify-center px-12 transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-16">
          <ul className="flex flex-col gap-8">
            {['services', 'portfolio', 'about', 'contact'].map((item, index) => (
              <li key={item} className="overflow-hidden">
                <Link
                  href={`/${item}`}
                  onClick={() => setMenuOpen(false)}
                  className={`block text-4xl md:text-6xl font-black tracking-tighter text-foreground hover:text-primary lowercase transition-all duration-500 ease-out transform ${
                    menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <span className="text-primary/40 font-mono mr-4 select-none">{"//"}</span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          {/* Slide-out Overlay CTA */}
          <div
            className={`border-t border-border pt-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 transition-all duration-700 delay-300 transform ${
              menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className="font-mono text-3xs tracking-widest text-muted-foreground uppercase">
                Let&apos;s build next-gen growth
              </span>
              <a href="mailto:hello@upscalemark.com" className="text-sm font-semibold hover:underline">
                hello@upscalemark.com
              </a>
            </div>

            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg"
            >
              Start Project
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
