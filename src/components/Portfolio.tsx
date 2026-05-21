'use client';

import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';
import { Project } from '@/types';

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'mock-1',
    collectionId: '',
    collectionName: 'projects',
    created: '',
    updated: '',
    title: "Quantum E-Commerce",
    category: "Web",
    tags: "Next.js, Tailwind, PocketBase",
    description: "A secure, blistering-fast digital store with real-time inventory management.",
    thumbnail: ""
  },
  {
    id: 'mock-2',
    collectionId: '',
    collectionName: 'projects',
    created: '',
    updated: '',
    title: "Pulse Wellness App",
    category: "Design",
    tags: "Figma, UI/UX, Prototyping",
    description: "A beautiful, patient-centric mobile interface helping thousands track wellness habits.",
    thumbnail: ""
  },
  {
    id: 'mock-3',
    collectionId: '',
    collectionName: 'projects',
    created: '',
    updated: '',
    title: "Vortex Brand Identity",
    category: "Branding",
    tags: "Identity, Brand Guidelines",
    description: "A comprehensive design language, guideline package, and brand asset launch.",
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
      } catch (error: any) {
        console.error('Error fetching projects from PocketBase:', error);
        const status = error.status ? `[HTTP ${error.status}] ` : '';
        let details = '';
        if (error.data && typeof error.data === 'object' && Object.keys(error.data).length > 0) {
          details = JSON.stringify(error.data);
        } else if (error.originalError) {
          details = error.originalError.message || String(error.originalError);
        } else {
          details = error.message || String(error);
        }
        setErrorMsg(`${status}Connection failed: ${details}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();

    // Subscribe to real-time project changes (create, update, delete)
    pb.collection('projects').subscribe('*', (e) => {
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

  const filteredProjects = filter === 'All' 
    ? activeProjects 
    : activeProjects.filter(p => p.category.toLowerCase() === filter.toLowerCase());

  return (
    <section id="portfolio" className="py-20 max-w-7xl mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Portfolio</h2>
        <p className="mt-4 text-zinc-400">Discover our latest projects built with cutting-edge technologies.</p>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        {['All', 'Web', 'Design', 'Branding'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border ${
              filter === cat 
                ? 'bg-violet-600 border-violet-600 text-white' 
                : 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="max-w-md mx-auto mb-8 p-4 rounded-xl border border-amber-900/30 bg-amber-950/15 text-center text-xs text-amber-300">
          <p className="font-semibold">⚠️ Database Connection Notice</p>
          <p className="mt-1 text-zinc-400 font-mono text-3xs">{errorMsg}</p>
          <p className="mt-2 text-zinc-500 text-3xs">The website is currently showing mockup design projects as a fallback.</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const hasThumbnail = project.thumbnail !== "";
            const imageUrl = hasThumbnail 
              ? pb.files.getUrl(project, project.thumbnail, { thumb: '400x250' }) 
              : null;

            return (
              <div key={project.id} className="group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition-all flex flex-col">
                <div className="relative h-48 bg-zinc-900 w-full overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 to-zinc-900 flex items-center justify-center text-zinc-650 group-hover:scale-105 transition-transform duration-300">
                      <span className="text-2xs font-semibold text-violet-400/60 uppercase tracking-widest">
                        {project.title} Mockup
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col gap-2 flex-grow justify-between">
                  <div>
                    <span className="text-xs font-semibold text-violet-400 tracking-wider uppercase">
                      {project.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{project.title}</h3>
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between">
                    <span className="text-3xs font-mono text-zinc-500">{project.tags}</span>
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        View Live &rarr;
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
