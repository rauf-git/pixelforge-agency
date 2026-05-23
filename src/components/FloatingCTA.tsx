'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FloatingCTA() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [contactInView, setContactInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 1. Hide completely on the dedicated /contact page
    if (pathname === '/contact') {
      setVisible(false);
      return;
    }

    // 2. Scroll height listener to show after scrolling down 300px
    let requestPending = false;
    const handleScroll = () => {
      if (!requestPending) {
        requestPending = true;
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 300;
          setVisible(scrolled);
          requestPending = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load
    handleScroll();

    // 3. High-performance IntersectionObserver to detect when #contact form is on screen
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          // If the contact section is intersecting (in view), set state to hide the button
          setContactInView(entry.isIntersecting);
        },
        {
          // Trigger when even 5% of the contact section enters the screen
          threshold: 0.05,
          rootMargin: '0px 0px 50px 0px' // Offset slightly to fade out early
        }
      );
      observerRef.current.observe(contactSection);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observerRef.current && contactSection) {
        observerRef.current.unobserve(contactSection);
      }
    };
  }, [pathname]);

  // Show if scrolled down AND the contact section is NOT in view
  const active = visible && !contactInView;

  return (
    <Link
      href="/contact"
      className={`fixed bottom-6 right-6 z-50 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-black text-xs tracking-wider uppercase shadow-lg shadow-primary/25 border border-white/10 hover:border-white/20 active:scale-95 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform will-change-transform backface-hidden ${
        active 
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' 
          : 'opacity-0 translate-y-6 pointer-events-none scale-90'
      }`}
      style={{ transform: active ? 'translate3d(0,0,0)' : 'translate3d(0,24px,0)' }}
    >
      Start Project
      <ArrowRight className="w-4 h-4 animate-pulse" />
    </Link>
  );
}
