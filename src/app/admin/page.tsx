'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/pocketbase';
import { Project, Contact, Testimonial } from '@/types';
import Link from 'next/link';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [inquiries, setInquiries] = useState<Contact[]>([]);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  // Authentication guard
  useEffect(() => {
    const isSuperuser = pb.authStore.isValid && 
      (pb.authStore.record?.collectionName === '_superusers' || !pb.authStore.record);
    
    if (!isSuperuser || !pb.authStore.isValid) {
      router.push('/login');
    } else {
      fetchDashboardData();

      // Subscribe to real-time changes
      pb.collection('projects').subscribe('*', fetchDashboardData).catch(console.error);
      pb.collection('contacts').subscribe('*', fetchDashboardData).catch(console.error);
      pb.collection('testimonials').subscribe('*', fetchDashboardData).catch(console.error);
    }

    return () => {
      pb.collection('projects').unsubscribe('*').catch(console.error);
      pb.collection('contacts').unsubscribe('*').catch(console.error);
      pb.collection('testimonials').unsubscribe('*').catch(console.error);
    };
  }, [router]);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      // Fetch projects
      const projectRecords = await pb.collection('projects').getFullList<Project>({
        sort: '-id',
      });
      setProjects(projectRecords);

      // Fetch inquiries (contacts)
      const contactRecords = await pb.collection('contacts').getFullList<Contact>({
        sort: '-id',
      });
      setInquiries(contactRecords);

      // Fetch testimonials count
      const testimonialRecords = await pb.collection('testimonials').getFullList<Testimonial>();
      setTestimonialsCount(testimonialRecords.length);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    pb.authStore.clear();
    router.push('/login');
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    setActionLoading(id);
    try {
      await pb.collection('projects').delete(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;
    setActionLoading(id);
    try {
      await pb.collection('contacts').delete(id);
      setInquiries(inquiries.filter(i => i.id !== id));
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      alert('Failed to delete message.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mb-4"></div>
        <p className="text-xs text-zinc-400">Loading PixelForge Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col selection:bg-violet-600/30 selection:text-violet-200">
      
      {/* Admin Navbar */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-30 w-full">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-black tracking-tight text-white hover:text-violet-400 transition-colors">
              PixelForge<span className="text-violet-500 font-normal">.Admin</span>
            </Link>
            <span className="h-4 w-px bg-zinc-800" />
            <Link href="/admin/add-project" className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors bg-violet-600/10 px-3 py-1.5 rounded-lg border border-violet-500/25">
              + New Project
            </Link>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-10">
        
        {/* Metric Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/50 flex flex-col gap-1.5 shadow-md">
            <span className="text-3xs font-semibold text-zinc-500 uppercase tracking-widest">Total Projects</span>
            <span className="text-3xl font-black text-white">{projects.length}</span>
            <span className="text-4xs font-mono text-violet-500 mt-1">Live in Grid</span>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/50 flex flex-col gap-1.5 shadow-md">
            <span className="text-3xs font-semibold text-zinc-500 uppercase tracking-widest">Client Testimonials</span>
            <span className="text-3xl font-black text-white">{testimonialsCount}</span>
            <span className="text-4xs font-mono text-violet-500 mt-1">Active Reviews</span>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/50 flex flex-col gap-1.5 shadow-md">
            <span className="text-3xs font-semibold text-zinc-500 uppercase tracking-widest">Inquiries Received</span>
            <span className="text-3xl font-black text-white">{inquiries.length}</span>
            <span className="text-4xs font-mono text-violet-500 mt-1">Contact Messages</span>
          </div>
        </section>

        {/* Details Section Splits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Projects List Panel (2/3 width) */}
          <section className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Active Portfolio Projects</h2>
            <div className="border border-zinc-900 rounded-2xl bg-zinc-950 overflow-hidden shadow-inner">
              {projects.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 text-sm flex flex-col gap-2 items-center">
                  <p>No projects in the database yet.</p>
                  <Link href="/admin/add-project" className="text-xs font-semibold text-violet-400 hover:text-violet-300 mt-1">&rarr; Create your first project</Link>
                </div>
              ) : (
                <div className="divide-y divide-zinc-900">
                  {projects.map((proj) => {
                    const thumbUrl = proj.thumbnail ? pb.files.getUrl(proj, proj.thumbnail, { thumb: '100x60' }) : null;

                    return (
                      <div key={proj.id} className="p-4 flex items-center justify-between hover:bg-zinc-950/60 transition-all gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-16 h-10 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                            {thumbUrl ? (
                              <img src={thumbUrl} alt={proj.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-3xs font-mono text-zinc-650">Empty</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-white truncate">{proj.title}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-4xs font-semibold text-violet-400 uppercase tracking-widest">{proj.category}</span>
                              <span className="text-4xs font-mono text-zinc-600 truncate">{proj.tags}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          disabled={actionLoading === proj.id}
                          onClick={() => handleDeleteProject(proj.id)}
                          className="text-xs font-semibold text-red-500 hover:text-red-400 border border-red-950/30 hover:border-red-900/50 bg-red-950/5 hover:bg-red-950/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer flex-shrink-0 disabled:opacity-50"
                        >
                          {actionLoading === proj.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Contact Inquiries Feed (1/3 width) */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Inquiries</h2>
            <div className="border border-zinc-900 rounded-2xl bg-zinc-950 p-4 shadow-inner flex flex-col gap-4 overflow-y-auto max-h-[500px]">
              {inquiries.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  No messages received yet.
                </div>
              ) : (
                inquiries.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 flex flex-col gap-2.5 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white truncate">{msg.name}</span>
                        <a href={`mailto:${msg.email}`} className="text-4xs font-mono text-zinc-500 hover:text-violet-400 transition-colors truncate mt-0.5">{msg.email}</a>
                      </div>
                      <button
                        disabled={actionLoading === msg.id}
                        onClick={() => handleDeleteInquiry(msg.id)}
                        className="text-4xs font-bold text-red-500 hover:text-red-400 transition-colors border border-transparent hover:border-red-950 p-1 rounded cursor-pointer disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-xs text-zinc-350 bg-zinc-900/30 border border-zinc-900/50 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                    <span className="text-4xs font-mono text-zinc-600 self-end mt-1">
                      {msg.created ? new Date(msg.created).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Received'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
