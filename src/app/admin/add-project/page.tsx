'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/pocketbase';
import Link from 'next/link';

export default function AddProjectPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Authentication guard
  useEffect(() => {
    const isSuperuser = pb.authStore.isValid && 
      (pb.authStore.record?.collectionName === '_superusers' || !pb.authStore.record);
    
    if (!isSuperuser || !pb.authStore.isValid) {
      router.push('/login');
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnail) {
      setError('Please upload a thumbnail image for the project.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // PocketBase uses standard FormData for multi-part file uploads
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('client', client);
      formData.append('description', description);
      formData.append('tags', tags);
      formData.append('liveUrl', liveUrl);
      formData.append('thumbnail', thumbnail);

      // Create the record in the 'projects' collection
      await pb.collection('projects').create(formData);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1500);
    } catch (err) {
      console.error('Error adding project:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || 'Failed to create project. Please verify your fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-12 flex flex-col items-center justify-center selection:bg-violet-600/30 selection:text-violet-200">
      
      {/* Glow decorative effect */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
            &larr; Cancel & Go Back
          </Link>
          <span className="text-3xs font-mono text-violet-500 uppercase tracking-widest">PixelForge Workspace</span>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-zinc-900 bg-zinc-950 shadow-2xl flex flex-col gap-6">
          <div className="border-b border-zinc-900 pb-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">Add New Portfolio Project</h1>
            <p className="text-xs text-zinc-400 mt-1">Fields marked with (*) are required.</p>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-3xs font-semibold text-zinc-400 uppercase tracking-wider">Project Title *</label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Quantum e-Commerce"
                className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-650"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="text-3xs font-semibold text-zinc-400 uppercase tracking-wider">Category *</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all cursor-pointer"
              >
                <option value="Web">Web Development</option>
                <option value="Design">UI/UX Design</option>
                <option value="Branding">Branding / Identity</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="client" className="text-3xs font-semibold text-zinc-400 uppercase tracking-wider">Client Name</label>
              <input
                id="client"
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="TechCorp LLC"
                className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-650"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="liveUrl" className="text-3xs font-semibold text-zinc-400 uppercase tracking-wider">Live Preview URL</label>
              <input
                id="liveUrl"
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://quantum-shop.com"
                className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-650"
              />
            </div>

          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tags" className="text-3xs font-semibold text-zinc-400 uppercase tracking-wider">Technology Tags</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Next.js, Tailwind CSS, PocketBase, SQLite"
              className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-650"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-3xs font-semibold text-zinc-400 uppercase tracking-wider">Project Description *</label>
            <textarea
              id="description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the challenges faced, visual concepts built, and technology implementation in detail..."
              className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-650 resize-none leading-relaxed"
            />
          </div>

          {/* Custom File Upload Area */}
          <div className="flex flex-col gap-2">
            <label className="text-3xs font-semibold text-zinc-400 uppercase tracking-wider">Project Thumbnail Image *</label>
            <div className="relative border border-dashed border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-all rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2">
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <span className="text-2xs font-semibold text-violet-400">
                {thumbnail ? `✔ Selected: ${thumbnail.name}` : 'Click to Upload Image'}
              </span>
              <span className="text-4xs text-zinc-500 font-mono">
                {thumbnail ? `${(thumbnail.size / 1024 / 1024).toFixed(2)} MB` : 'PNG, JPG, SVG, or WEBP up to 5MB'}
              </span>
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-400 text-center bg-red-950/20 border border-red-900/30 py-2.5 rounded-lg">
              ✖ {error}
            </p>
          )}

          {success && (
            <p className="text-xs font-semibold text-green-400 text-center bg-green-950/20 border border-green-900/30 py-2.5 rounded-lg">
              ✔ Project uploaded successfully! Redirecting to admin panel...
            </p>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3.5 mt-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-800 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-violet-600/10 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-b-white rounded-full animate-spin" />
                Uploading assets & record...
              </>
            ) : (
              'Publish Project'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
