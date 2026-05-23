'use client';

import { useState, useEffect } from 'react';
import { Target, Heart, Star, Layout, RefreshCw, HelpCircle } from 'lucide-react';
import { pb } from '@/lib/pocketbase';

interface ServiceRecord {
  id: string;
  title: string;
  description: string;
  category: string; // 'web' or 'marketing'
  icon: string; // e.g. 'Target', 'Heart', 'Star', 'Layout', 'RefreshCw'
  order: number;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Target,
  Heart,
  Star,
  Layout,
  RefreshCw
};

const FALLBACK_MARKETING = [
  { id: 'dm-1', title: 'Paid Ads', description: 'Performance-driven campaign setups on Search and Social platforms with technical optimization and maximum conversion output.', icon: 'Target' },
  { id: 'dm-2', title: 'Social Media Management', description: 'Brand-focused content creation, curation, community nurturing, and scheduled publishing for organic reach.', icon: 'Heart' },
  { id: 'dm-3', title: 'Influencer Marketing', description: 'Sourcing, matching, and executing strategic content partnerships with creators to boost brand awareness.', icon: 'Star' }
];

const FALLBACK_WEB = [
  { id: 'wd-1', title: 'New Websites', description: 'Blisteringly fast, responsive, and SEO-optimized digital stores and corporate products built with Next.js.', icon: 'Layout' },
  { id: 'wd-2', title: 'Old to New Revamping', description: 'Re-engineering legacy legacy systems into highly polished, lightweight, and modern digital destinations.', icon: 'RefreshCw' }
];

export default function Services() {
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);
  const [dbServices, setDbServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const records = await pb.collection('services').getFullList<ServiceRecord>({
          sort: 'order',
        });
        setDbServices(records);
      } catch (err) {
        console.warn('PocketBase Services fetch failed, using fallback:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Split fetched items or fallbacks
  const digitalMarketingSubs = dbServices.length > 0
    ? dbServices.filter(s => s.category === 'marketing')
    : FALLBACK_MARKETING;

  const webDevSubs = dbServices.length > 0
    ? dbServices.filter(s => s.category === 'web')
    : FALLBACK_WEB;

  return (
    <section id="services" className="py-24 px-6 max-w-6xl mx-auto border-t border-border">
      <div className="text-left mb-16 max-w-2xl">
        <span className="font-mono text-3xs font-black tracking-widest text-primary uppercase">
          {"// Capabilities"}
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground lowercase mt-3">
          our services
        </h2>
        <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
          High-performance execution meets minimalist design. We build digital products and coordinate campaigns that stand out.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-px md:bg-border/60 overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition-shadow duration-500 hover:shadow-md">
        {/* COLUMN 1: DIGITAL MARKETING */}
        <div className="p-8 sm:p-12 bg-card hover:bg-background/40 transition-colors duration-500 flex flex-col justify-between gap-12 group/card">
          <div className="flex flex-col gap-8">
            {/* Integrated Self-Explanatory SVG Graphic */}
            <div className="w-24 h-24 relative flex items-center justify-center bg-muted/60 rounded-2xl overflow-hidden border border-border/80 p-4 transition-all duration-500 group-hover/card:border-primary/30 group-hover/card:bg-primary/5">
              {/* Marketing Blueprint SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-primary stroke-current fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Expandable outer ripples (broadcast) */}
                <circle cx="50" cy="65" r="12" className="transition-all duration-700 ease-out group-hover/card:r-[16] opacity-40" />
                <circle cx="50" cy="65" r="24" className="transition-all duration-700 ease-out group-hover/card:r-[30] opacity-35 animate-pulse" />
                <circle cx="50" cy="65" r="32" className="transition-all duration-700 ease-out group-hover/card:r-[40] opacity-20" />
                
                {/* Central Target Circle */}
                <circle cx="50" cy="65" r="4" className="fill-primary" />
                
                {/* Rising Vector Growth Line */}
                <path d="M15 85 L40 60 L60 65 L85 25" className="transition-all duration-700 ease-out group-hover/card:stroke-primary stroke-[3]" />
                {/* Arrow pointer tip */}
                <path d="M78 25 L85 25 L85 32" className="transition-all duration-700 ease-out group-hover/card:stroke-primary stroke-[3]" />
              </svg>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-3xs font-black tracking-widest text-primary/60 uppercase">
                01
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground lowercase">
                /digital marketing
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
                Targeting and scaling campaign channels to reach and convert your audience with premium analytical frameworks.
              </p>
            </div>

            {/* Micro-animated bullet list */}
            <div className="flex flex-col gap-4 mt-4">
              {digitalMarketingSubs.map((sub, index) => {
                const Icon = iconMap[sub.icon] || Target;
                const isHovered = hoveredSub === sub.id;
                const isAnyHovered = hoveredSub !== null;
                return (
                  <div
                    key={sub.id}
                    onMouseEnter={() => setHoveredSub(sub.id)}
                    onMouseLeave={() => setHoveredSub(null)}
                    className={`flex items-start gap-4 p-4 rounded-xl border border-transparent transition-all duration-300 transform ${
                      isHovered ? 'bg-primary/5 border-primary/20 translate-x-2' : 'hover:bg-primary/5 hover:border-primary/10'
                    } ${isAnyHovered && !isHovered ? 'opacity-50 blur-[0.5px]' : 'opacity-100'}`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-3xs font-bold text-primary mb-1">
                        0{index + 1}
                      </span>
                      <div className={`p-2 rounded-lg bg-muted text-muted-foreground transition-all duration-300 ${
                        isHovered ? 'bg-primary text-primary-foreground scale-110' : ''
                      }`}>
                        <Icon className={`w-3.5 h-3.5 ${isHovered && sub.id === 'dm-2' ? 'animate-heartBeat' : ''}`} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                        {sub.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {sub.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMN 2: WEB DEVELOPMENT */}
        <div className="p-8 sm:p-12 bg-card hover:bg-background/40 transition-colors duration-500 flex flex-col justify-between gap-12 group/card">
          <div className="flex flex-col gap-8">
            {/* Integrated Self-Explanatory SVG Graphic */}
            <div className="w-24 h-24 relative flex items-center justify-center bg-muted/60 rounded-2xl overflow-hidden border border-border/80 p-4 transition-all duration-500 group-hover/card:border-primary/30 group-hover/card:bg-primary/5">
              {/* Web Dev Blueprint SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-primary stroke-current fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Base isometric grid boxes (Modular layers) */}
                <path d="M20 70 L50 85 L80 70 L50 55 Z" className="opacity-30 transition-all duration-500 group-hover/card:translate-y-2" />
                <path d="M20 50 L50 65 L80 50 L50 35 Z" className="opacity-60 transition-all duration-500 group-hover/card:translate-y-[-2px] group-hover/card:stroke-primary" />
                <path d="M20 30 L50 45 L80 30 L50 15 Z" className="transition-all duration-500 group-hover/card:translate-y-[-6px] stroke-[3]" />
                
                {/* Connecting alignment grid dots */}
                <circle cx="50" cy="45" r="1.5" className="fill-primary" />
                <circle cx="20" cy="30" r="1.5" className="fill-primary" />
                <circle cx="80" cy="30" r="1.5" className="fill-primary" />
                <circle cx="50" cy="15" r="1.5" className="fill-primary" />
              </svg>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-3xs font-black tracking-widest text-primary/60 uppercase">
                02
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground lowercase">
                /web development
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
                Engineering modern, static, blazing-fast interfaces with customized layouts and fluid front-end animations.
              </p>
            </div>

            {/* Micro-animated bullet list */}
            <div className="flex flex-col gap-4 mt-4">
              {webDevSubs.map((sub, index) => {
                const Icon = iconMap[sub.icon] || Layout;
                const isHovered = hoveredSub === sub.id;
                const isAnyHovered = hoveredSub !== null;
                return (
                  <div
                    key={sub.id}
                    onMouseEnter={() => setHoveredSub(sub.id)}
                    onMouseLeave={() => setHoveredSub(null)}
                    className={`flex items-start gap-4 p-4 rounded-xl border border-transparent transition-all duration-300 transform ${
                      isHovered ? 'bg-primary/5 border-primary/20 translate-x-2' : 'hover:bg-primary/5 hover:border-primary/10'
                    } ${isAnyHovered && !isHovered ? 'opacity-50 blur-[0.5px]' : 'opacity-100'}`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-3xs font-bold text-primary mb-1">
                        0{index + 1}
                      </span>
                      <div className={`p-2 rounded-lg bg-muted text-muted-foreground transition-all duration-300 ${
                        isHovered ? 'bg-primary text-primary-foreground scale-110' : ''
                      }`}>
                        <Icon className={`w-3.5 h-3.5 ${isHovered && sub.id === 'wd-2' ? 'animate-spin' : ''}`} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                        {sub.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {sub.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
