'use client';

import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';
import { Project } from '@/types';
import { ArrowUpRight } from 'lucide-react';

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'mock-1',
    collectionId: '',
    collectionName: 'projects',
    created: '',
    updated: '',
    title: "Quantum E-Commerce System",
    category: "Web",
    tags: "Next.js, Tailwind, PocketBase",
    description: "A secure, blistering-fast digital store built with headless headless architecture.",
    thumbnail: ""
  },
  {
    id: 'mock-2',
    collectionId: '',
    collectionName: 'projects',
    created: '',
    updated: '',
    title: "Vibe Social Campaign",
    category: "Branding",
    tags: "Paid Ads, Social Strategy",
    description: "High-conversion product launch campaign leveraging influencer marketing and custom ads.",
    thumbnail: ""
  },
  {
    id: 'mock-3',
    collectionId: '',
    collectionName: 'projects',
    created: '',
    updated: '',
    title: "Vortex SaaS UI Audit",
    category: "Design",
    tags: "UI/UX, Product Advisory",
    description: "Comprehensive product advisory audit reorganizing layout architectures for scale.",
    thumbnail: ""
  }
];

export default function Portfolio() {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchProjects() {
      try {
        const records = await pb.collection('projects').getFullList<Project>({
          sort: '-id',
        });
        setProjects(records);
        setErrorMsg('');
      } catch (err: unknown) {
        console.error('Error fetching projects from PocketBase:', err);
        const error = err as { 
          status?: number; 
          data?: Record<string, unknown>; 
          originalError?: { message?: string }; 
          message?: string 
        };
        const status = error.status ? `[HTTP ${error.status}] ` : '';
        let details = '';
        if (error.data && typeof error.data === 'object' && Object.keys(error.data).length > 0) {
          details = JSON.stringify(error.data);
        } else if (error.originalError) {
          details = error.originalError.message || String(error.originalError);
        } else {
          details = error.message || String(error);
        }
        setErrorMsg(`${status}Connection notice: ${details || 'Using mockup projects fallback.'}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();

    pb.collection('projects').subscribe('*', () => {
      fetchProjects();
    }).catch((err) => {
      console.error('Real-time project subscription error:', err);
    });

    return () => {
      pb.collection('projects').unsubscribe('*').catch((err) => {
        console.error('Real-time project unsubscribe error:', err);
      });
    };
  }, []);

  const activeProjects = projects.length > 0 ? projects : FALLBACK_PROJECTS;

  // Smart mapping: Web -> Web Dev, Design/Branding -> Marketing
  const filteredProjects = filter === 'All' 
    ? activeProjects 
    : activeProjects.filter(p => {
        if (filter.toLowerCase() === 'web dev') {
          return p.category.toLowerCase() === 'web';
        }
        return p.category.toLowerCase() === 'design' || p.category.toLowerCase() === 'branding';
      });

  return (
    <section id="portfolio" className="py-24 px-6 max-w-6xl mx-auto border-t border-border">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="text-left max-w-xl">
          <span className="font-mono text-3xs font-black tracking-widest text-primary uppercase">
            {"// Gallery"}
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground lowercase mt-3">
            featured work
          </h2>
          <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
            Discover a curated collection of platforms and campaigns designed for performance and scale.
          </p>
        </div>

        {/* Minimalist Tab Filters */}
        <div className="flex flex-wrap gap-2.5">
          {['All', 'Web Dev', 'Marketing'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold font-mono tracking-tighter transition-all cursor-pointer border ${
                filter === cat 
                  ? 'bg-primary border-primary text-primary-foreground shadow-sm' 
                  : 'border-border bg-card/40 hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              /{cat.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const hasThumbnail = project.thumbnail !== "";
            const imageUrl = hasThumbnail 
              ? pb.files.getUrl(project, project.thumbnail, { thumb: '400x250' }) 
              : null;

            return (
              <div
                key={project.id}
                className="group flex flex-col justify-between rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Thumbnail Image Container */}
                  <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-muted flex items-center justify-center text-muted-foreground/30">
                        {/* Styled mini SVG pattern */}
                        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current fill-none stroke-[1] opacity-25">
                          <rect x="20" y="20" width="60" height="60" rx="4" />
                          <line x1="20" y1="50" x2="80" y2="50" />
                          <circle cx="50" cy="50" r="10" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <span className="font-mono text-3xs font-bold text-primary tracking-widest uppercase">
                      /{project.category.toLowerCase()}
                    </span>
                    <h3 className="text-lg font-extrabold text-foreground tracking-tight mt-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="font-mono text-3xs text-muted-foreground/50">
                    {project.tags}
                  </span>
                  {project.liveUrl ? (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                      launch
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="font-mono text-3xs text-muted-foreground/30 select-none">
                      mockup
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {errorMsg && (
        <div className="max-w-md mx-auto mt-12 p-4 rounded-xl border border-amber-900/10 dark:border-amber-950/20 bg-amber-950/5 text-center text-3xs text-amber-600 dark:text-amber-300">
          <p className="font-semibold">⚠️ Database Connection Note</p>
          <p className="mt-1 font-mono text-4xs leading-relaxed opacity-80">{errorMsg}</p>
        </div>
      )}
    </section>
  );
}
