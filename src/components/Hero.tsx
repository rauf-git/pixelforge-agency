'use client';

import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center items-center py-20 sm:py-32 px-4 sm:px-6 max-w-5xl mx-auto text-center overflow-hidden"
    >
      {/* Decorative technical grid overlay in background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="z-10 flex flex-col items-center gap-8 max-w-4xl">
        {/* Floating Mini Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-3xs font-mono font-bold tracking-widest uppercase transition-all duration-300 hover:border-primary/40 hover:bg-primary/10">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
          ✦ now scaling digital platforms
        </div>

        {/* Editorial Bold Lowercase Slogans */}
        <h1 className="text-3.5xl sm:text-6xl md:text-7.5xl font-black tracking-tighter leading-[1] sm:leading-[0.9] text-foreground lowercase">
          we help brands turn <br />
          <span className="text-primary">digital chaos into clarity</span> <br />
          <span className="text-muted-foreground/60 font-light">
            {"// systems that scale & marketing that converts."}
          </span>
        </h1>

        {/* Brand Pitch Paragraph */}
        <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
          upscalemark is a digital consultancy engineered for high-performance execution. We design and build bleeding-edge web platforms and coordinate high-impact digital campaigns to elevate your market position.
        </p>

        {/* Modern Call to Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <a
            href="/contact"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/10"
          >
            Start Project
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-350 group-hover:translate-x-1" />
          </a>
          <a
            href="/portfolio"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border bg-card/40 hover:bg-muted text-foreground font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:border-border"
          >
            Our Work
          </a>
        </div>
      </div>

      {/* Technical Animating Scroll Arrow */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1 z-10 pointer-events-none select-none">
        <span className="font-mono text-3xs font-semibold tracking-[0.25em] text-muted-foreground/40 uppercase">
          Scroll
        </span>
        <div className="w-[1px] h-10 bg-border relative overflow-hidden mt-1">
          <div className="absolute top-0 left-0 right-0 h-4 bg-primary animate-scroll-arrow rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
