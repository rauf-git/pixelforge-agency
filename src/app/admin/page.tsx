'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/pocketbase';
import { Project, Contact, Testimonial, HeroConfig, ServiceItem } from '@/types';
import Link from 'next/link';

export default function AdminDashboard() {
  const [tab, setTab] = useState<'overview' | 'customize'>('overview');
  
  // Overview states
  const [projects, setProjects] = useState<Project[]>([]);
  const [inquiries, setInquiries] = useState<Contact[]>([]);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Customization states
  const [hero, setHero] = useState<HeroConfig | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [savingHero, setSavingHero] = useState(false);
  const [savingServiceId, setSavingServiceId] = useState<string | null>(null);
  const [savingTestimonialId, setSavingTestimonialId] = useState<string | null>(null);
  const [deletingTestimonialId, setDeletingTestimonialId] = useState<string | null>(null);
  const [creatingTestimonial, setCreatingTestimonial] = useState(false);
  const [creatingService, setCreatingService] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState(false);

  const [newTestimonial, setNewTestimonial] = useState({
    clientName: '',
    roleCompany: '',
    reviewText: '',
    rating: 5
  });

  const [newService, setNewService] = useState({
    title: '',
    description: '',
    category: 'marketing',
    icon: 'Target',
    order: 6
  });
  
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
      pb.collection('hero').subscribe('*', fetchDashboardData).catch(console.error);
      pb.collection('services').subscribe('*', fetchDashboardData).catch(console.error);
    }

    return () => {
      pb.collection('projects').unsubscribe('*').catch(console.error);
      pb.collection('contacts').unsubscribe('*').catch(console.error);
      pb.collection('testimonials').unsubscribe('*').catch(console.error);
      pb.collection('hero').unsubscribe('*').catch(console.error);
      pb.collection('services').unsubscribe('*').catch(console.error);
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

      // Fetch testimonials
      try {
        const testimonialRecords = await pb.collection('testimonials').getFullList<Testimonial>({
          sort: '-id',
        });
        setTestimonials(testimonialRecords);
        setTestimonialsCount(testimonialRecords.length);
      } catch (e) {
        console.warn('No testimonials in database:', e);
      }

      // Fetch hero config
      try {
        const heroRecord = await pb.collection('hero').getFirstListItem<HeroConfig>('');
        setHero(heroRecord);
      } catch (e) {
        console.warn('No hero configs in database:', e);
      }

      // Fetch services configurations
      try {
        const serviceRecords = await pb.collection('services').getFullList<ServiceItem>({
          sort: 'order',
        });
        setServices(serviceRecords);
      } catch (e) {
        console.warn('No services in database:', e);
      }

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

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero) return;
    setSavingHero(true);
    setHeroSuccess(false);
    try {
      await pb.collection('hero').update(hero.id, {
        badge: hero.badge,
        title1: hero.title1,
        title2: hero.title2,
        description: hero.description,
        ctaText1: hero.ctaText1,
        ctaText2: hero.ctaText2
      });
      setHeroSuccess(true);
      setTimeout(() => setHeroSuccess(false), 2500);
    } catch (err) {
      console.error('Error updating hero:', err);
      alert('Failed to save Hero configurations. Make sure fields are correct.');
    } finally {
      setSavingHero(false);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title || !newService.description) {
      alert('Please fill out all fields for the new capability.');
      return;
    }
    setCreatingService(true);
    try {
      const nextOrder = services.length > 0 ? Math.max(...services.map(s => s.order || 0)) + 1 : 1;
      await pb.collection('services').create({
        ...newService,
        order: nextOrder
      });
      setNewService({
        title: '',
        description: '',
        category: 'marketing',
        icon: 'Target',
        order: nextOrder + 1
      });
      alert('New capability added successfully!');
      fetchDashboardData();
    } catch (err) {
      console.error('Error creating service:', err);
      alert('Failed to create new capability.');
    } finally {
      setCreatingService(false);
    }
  };

  const handleUpdateService = async (id: string, updatedFields: Partial<ServiceItem>) => {
    setSavingServiceId(id);
    try {
      await pb.collection('services').update(id, updatedFields);
      setServices(services.map(s => s.id === id ? { ...s, ...updatedFields } : s));
      alert('Service listing copy updated successfully!');
    } catch (err) {
      console.error('Error updating service:', err);
      alert('Failed to save service listing update.');
    } finally {
      setSavingServiceId(null);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this capability?')) return;
    try {
      await pb.collection('services').delete(id);
      setServices(services.filter(s => s.id !== id));
      alert('Capability deleted successfully!');
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Failed to delete capability.');
    }
  };

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.clientName || !newTestimonial.roleCompany || !newTestimonial.reviewText) {
      alert('Please fill out all fields for the client review.');
      return;
    }
    setCreatingTestimonial(true);
    try {
      await pb.collection('testimonials').create(newTestimonial);
      setNewTestimonial({
        clientName: '',
        roleCompany: '',
        reviewText: '',
        rating: 5
      });
      alert('New client review added successfully!');
      fetchDashboardData();
    } catch (err) {
      console.error('Error creating testimonial:', err);
      alert('Failed to create client review.');
    } finally {
      setCreatingTestimonial(false);
    }
  };

  const handleUpdateTestimonial = async (id: string, updatedFields: Partial<Testimonial>) => {
    setSavingTestimonialId(id);
    try {
      await pb.collection('testimonials').update(id, updatedFields);
      setTestimonials(testimonials.map(t => t.id === id ? { ...t, ...updatedFields } : t));
      alert('Client review updated successfully!');
    } catch (err) {
      console.error('Error updating testimonial:', err);
      alert('Failed to save client review update.');
    } finally {
      setSavingTestimonialId(null);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client review?')) return;
    setDeletingTestimonialId(id);
    try {
      await pb.collection('testimonials').delete(id);
      setTestimonials(testimonials.filter(t => t.id !== id));
      setTestimonialsCount(prev => Math.max(0, prev - 1));
      alert('Client review deleted successfully!');
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      alert('Failed to delete client review.');
    } finally {
      setDeletingTestimonialId(null);
    }
  };

  if (loading && projects.length === 0 && inquiries.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mb-4"></div>
        <p className="text-xs text-zinc-400">Loading Upscalemark Dashboard...</p>
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
              Upscalemark<span className="text-violet-500 font-normal">.Admin</span>
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
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
        
        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-900 gap-6 text-sm font-bold tracking-wider uppercase pb-2">
          <button 
            onClick={() => setTab('overview')}
            className={`pb-2 border-b-2 transition-all cursor-pointer ${
              tab === 'overview' 
                ? 'border-violet-500 text-white font-extrabold' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Dashboard Overview
          </button>
          <button 
            onClick={() => setTab('customize')}
            className={`pb-2 border-b-2 transition-all cursor-pointer ${
              tab === 'customize' 
                ? 'border-violet-500 text-white font-extrabold' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Edit Website Copy
          </button>
        </div>

        {tab === 'customize' ? (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* COLUMN 1: HERO CONFIG EDITOR */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white tracking-tight">Edit Hero Copy</h2>
              {hero ? (
                <form onSubmit={handleSaveHero} className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/50 flex flex-col gap-4 shadow-md">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-4xs font-semibold text-zinc-400 uppercase tracking-wider">Badge Tag</label>
                    <input 
                      type="text" 
                      value={hero.badge} 
                      onChange={(e) => setHero({ ...hero, badge: e.target.value })} 
                      className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-4xs font-semibold text-zinc-400 uppercase tracking-wider">Heading Line 1</label>
                    <input 
                      type="text" 
                      value={hero.title1} 
                      onChange={(e) => setHero({ ...hero, title1: e.target.value })} 
                      className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-4xs font-semibold text-zinc-400 uppercase tracking-wider">Heading Line 2 (Highlighted)</label>
                    <input 
                      type="text" 
                      value={hero.title2} 
                      onChange={(e) => setHero({ ...hero, title2: e.target.value })} 
                      className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-4xs font-semibold text-zinc-400 uppercase tracking-wider">Description Slogan</label>
                    <textarea 
                      rows={4} 
                      value={hero.description} 
                      onChange={(e) => setHero({ ...hero, description: e.target.value })} 
                      className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all resize-none leading-relaxed"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-4xs font-semibold text-zinc-400 uppercase tracking-wider">Primary CTA</label>
                      <input 
                        type="text" 
                        value={hero.ctaText1 || ''} 
                        onChange={(e) => setHero({ ...hero, ctaText1: e.target.value })} 
                        placeholder="Start Project" 
                        className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-4xs font-semibold text-zinc-400 uppercase tracking-wider">Secondary CTA</label>
                      <input 
                        type="text" 
                        value={hero.ctaText2 || ''} 
                        onChange={(e) => setHero({ ...hero, ctaText2: e.target.value })} 
                        placeholder="Our Work" 
                        className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  {heroSuccess && (
                    <p className="text-3xs font-semibold text-green-400 text-center bg-green-950/20 border border-green-900/30 py-2 rounded-lg">
                      ✔ Hero copy updated live successfully!
                    </p>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={savingHero}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-800 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer flex justify-center items-center gap-2"
                  >
                    {savingHero ? 'Saving changes...' : 'Save Hero Copy'}
                  </button>
                </form>
              ) : (
                <div className="p-8 text-center text-zinc-500 text-sm border border-zinc-900 rounded-2xl">
                  No Hero configs found.
                </div>
              )}
            </div>

            {/* COLUMN 2: SERVICES MANAGER */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white tracking-tight">Capabilities & Services</h2>
              
              {/* Add New Capability inline block */}
              <form onSubmit={handleCreateService} className="p-4 rounded-xl border border-dashed border-zinc-850 bg-zinc-950/40 flex flex-col gap-2.5">
                <h3 className="text-4xs font-black uppercase text-violet-400 tracking-wider">+ Add New Capability</h3>
                <div className="grid grid-cols-1 gap-2">
                  <input 
                    type="text" 
                    placeholder="Capability Title (e.g. Paid Ads)" 
                    value={newService.title}
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <textarea 
                    rows={2} 
                    placeholder="Description of the offering..." 
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none resize-none leading-relaxed"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    value={newService.icon} 
                    onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                    className="bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2 py-1.5 text-4xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Target">Target (Ads)</option>
                    <option value="Heart">Heart (Social)</option>
                    <option value="Star">Star (Influencers)</option>
                    <option value="Layout">Layout (Design)</option>
                    <option value="RefreshCw">RefreshCw (Revamp)</option>
                  </select>
                  <select 
                    value={newService.category} 
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                    className="bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2 py-1.5 text-4xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="marketing">Digital Marketing</option>
                    <option value="web">Web Development</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={creatingService}
                  className="w-full py-1.5 bg-violet-600 hover:bg-violet-750 text-white font-semibold text-3xs rounded transition-all cursor-pointer"
                >
                  {creatingService ? 'Creating...' : 'Add Capability'}
                </button>
              </form>

              {/* Scrollable list of existing services */}
              <div className="border border-zinc-900 rounded-2xl bg-zinc-950 p-4 shadow-inner flex flex-col gap-4 overflow-y-auto max-h-[400px]">
                {services.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 text-sm">
                    No capabilities found.
                  </div>
                ) : (
                  services.map((s) => (
                    <div key={s.id} className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 flex flex-col gap-3 relative">
                      <div className="flex flex-col gap-1">
                        <label className="text-4xs font-semibold text-zinc-500 uppercase tracking-wider">Service Title</label>
                        <input 
                          type="text" 
                          value={s.title} 
                          onChange={(e) => {
                            const newServices = services.map(item => item.id === s.id ? { ...item, title: e.target.value } : item);
                            setServices(newServices);
                          }}
                          className="bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-4xs font-semibold text-zinc-500 uppercase tracking-wider">Description</label>
                        <textarea 
                          rows={2} 
                          value={s.description} 
                          onChange={(e) => {
                            const newServices = services.map(item => item.id === s.id ? { ...item, description: e.target.value } : item);
                            setServices(newServices);
                          }}
                          className="bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none resize-none leading-relaxed"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-4xs font-semibold text-zinc-500 uppercase tracking-wider">Icon</label>
                          <select 
                            value={s.icon} 
                            onChange={(e) => {
                              const newServices = services.map(item => item.id === s.id ? { ...item, icon: e.target.value } : item);
                              setServices(newServices);
                            }}
                            className="bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2 py-1.5 text-4xs text-white focus:outline-none cursor-pointer"
                          >
                            <option value="Target">Target (Ads)</option>
                            <option value="Heart">Heart (Social)</option>
                            <option value="Star">Star (Influencers)</option>
                            <option value="Layout">Layout (Design)</option>
                            <option value="RefreshCw">RefreshCw (Revamp)</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-4xs font-semibold text-zinc-500 uppercase tracking-wider">Category</label>
                          <select 
                            value={s.category} 
                            onChange={(e) => {
                              const newServices = services.map(item => item.id === s.id ? { ...item, category: e.target.value } : item);
                              setServices(newServices);
                            }}
                            className="bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2 py-1.5 text-4xs text-white focus:outline-none cursor-pointer"
                          >
                            <option value="marketing">Digital Marketing</option>
                            <option value="web">Web Development</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1.5">
                        <button 
                          disabled={savingServiceId === s.id}
                          onClick={() => handleUpdateService(s.id, { 
                            title: s.title, 
                            description: s.description, 
                            icon: s.icon, 
                            category: s.category 
                          })}
                          className="py-1.5 bg-violet-600 hover:bg-violet-750 disabled:bg-zinc-800 text-white font-semibold text-3xs rounded transition-all cursor-pointer flex justify-center items-center"
                        >
                          {savingServiceId === s.id ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                          onClick={() => handleDeleteService(s.id)}
                          className="py-1.5 bg-red-950/20 hover:bg-red-900/40 border border-red-900/30 text-red-400 font-semibold text-3xs rounded transition-all cursor-pointer flex justify-center items-center"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 3: TESTIMONIALS MANAGER */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white tracking-tight">Edit Client Reviews</h2>
              
              {/* Add New Review inline block */}
              <form onSubmit={handleCreateTestimonial} className="p-4 rounded-xl border border-dashed border-zinc-850 bg-zinc-950/40 flex flex-col gap-2.5">
                <h3 className="text-4xs font-black uppercase text-violet-400 tracking-wider">+ Add Client Review</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Client Name" 
                    value={newTestimonial.clientName}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, clientName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Role, Company" 
                    value={newTestimonial.roleCompany}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, roleCompany: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <textarea 
                  rows={2} 
                  placeholder="Review content details..." 
                  value={newTestimonial.reviewText}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, reviewText: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none resize-none leading-relaxed"
                />
                <select 
                  value={newTestimonial.rating} 
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
                  className="bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2 py-1.5 text-4xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                  <option value="3">⭐⭐⭐ (3 Stars)</option>
                  <option value="2">⭐⭐ (2 Stars)</option>
                  <option value="1">⭐ (1 Star)</option>
                </select>
                <button 
                  type="submit" 
                  disabled={creatingTestimonial}
                  className="w-full py-1.5 bg-violet-600 hover:bg-violet-750 text-white font-semibold text-3xs rounded transition-all cursor-pointer"
                >
                  {creatingTestimonial ? 'Adding...' : 'Add Review'}
                </button>
              </form>

              {/* Scrollable list of existing client reviews */}
              <div className="border border-zinc-900 rounded-2xl bg-zinc-950 p-4 shadow-inner flex flex-col gap-4 overflow-y-auto max-h-[400px]">
                {testimonials.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 text-sm">
                    No client reviews found.
                  </div>
                ) : (
                  testimonials.map((t) => (
                    <div key={t.id} className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 flex flex-col gap-3 relative">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-4xs font-semibold text-zinc-500 uppercase tracking-wider">Client Name</label>
                          <input 
                            type="text" 
                            value={t.clientName} 
                            onChange={(e) => {
                              const newTestimonials = testimonials.map(item => item.id === t.id ? { ...item, clientName: e.target.value } : item);
                              setTestimonials(newTestimonials);
                            }}
                            className="bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-4xs font-semibold text-zinc-500 uppercase tracking-wider">Role / Company</label>
                          <input 
                            type="text" 
                            value={t.roleCompany} 
                            onChange={(e) => {
                              const newTestimonials = testimonials.map(item => item.id === t.id ? { ...item, roleCompany: e.target.value } : item);
                              setTestimonials(newTestimonials);
                            }}
                            className="bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-4xs font-semibold text-zinc-500 uppercase tracking-wider">Review Content</label>
                        <textarea 
                          rows={2} 
                          value={t.reviewText} 
                          onChange={(e) => {
                            const newTestimonials = testimonials.map(item => item.id === t.id ? { ...item, reviewText: e.target.value } : item);
                            setTestimonials(newTestimonials);
                          }}
                          className="bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none resize-none leading-relaxed"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-4xs font-semibold text-zinc-500 uppercase tracking-wider">Rating</label>
                        <select 
                          value={t.rating} 
                          onChange={(e) => {
                            const newTestimonials = testimonials.map(item => item.id === t.id ? { ...item, rating: parseInt(e.target.value) } : item);
                            setTestimonials(newTestimonials);
                          }}
                          className="bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded px-2 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                        >
                          <option value="5">5 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="3">3 Stars</option>
                          <option value="2">2 Stars</option>
                          <option value="1">1 Star</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1.5">
                        <button 
                          disabled={savingTestimonialId === t.id}
                          onClick={() => handleUpdateTestimonial(t.id, { 
                            clientName: t.clientName, 
                            roleCompany: t.roleCompany, 
                            reviewText: t.reviewText, 
                            rating: t.rating 
                          })}
                          className="py-1.5 bg-violet-600 hover:bg-violet-750 disabled:bg-zinc-800 text-white font-semibold text-3xs rounded transition-all cursor-pointer flex justify-center items-center"
                        >
                          {savingTestimonialId === t.id ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                          disabled={deletingTestimonialId === t.id}
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="py-1.5 bg-red-950/20 hover:bg-red-900/40 border border-red-900/30 text-red-400 font-semibold text-3xs rounded transition-all cursor-pointer flex justify-center items-center"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        ) : (
          <>
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
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Link
                                href={`/admin/edit-project/${proj.id}`}
                                className="text-xs font-semibold text-violet-400 hover:text-violet-300 border border-violet-950/50 hover:border-violet-900 bg-violet-950/10 hover:bg-violet-950/30 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                              >
                                Edit
                              </Link>
                              <button
                                disabled={actionLoading === proj.id}
                                onClick={() => handleDeleteProject(proj.id)}
                                className="text-xs font-semibold text-red-500 hover:text-red-400 border border-red-950/30 hover:border-red-900/50 bg-red-950/5 hover:bg-red-950/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                              >
                                {actionLoading === proj.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
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
          </>
        )}
      </main>
    </div>
  );
}
