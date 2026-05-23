'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { pb } from '@/lib/pocketbase';
import { Project } from '@/types';
import Link from 'next/link';

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Authentication guard
  useEffect(() => {
    const isSuperuser = pb.authStore.isValid && 
      (pb.authStore.record?.collectionName === '_superusers' || !pb.authStore.record);
    
    if (!isSuperuser || !pb.authStore.isValid) {
      router.push('/login');
    }
  }, [router]);

  // Load project details on mount
  useEffect(() => {
    if (!id) return;

    async function loadProject() {
      try {
        setLoading(true);
        const record = await pb.collection('projects').getOne(id);
        setTitle(record.title);
        setCategory(record.category);
        setClient(record.client || '');
        setDescription(record.description);
        setTags(record.tags || '');
        setLiveUrl(record.liveUrl || '');
        setExistingThumbnail(record.thumbnail);
      } catch (err) {
        console.error('Error loading project details:', err);
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Use FormData for PocketBase compatibility (handling multi-part text and optional new file)
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('client', client);
      formData.append('description', description);
      formData.append('tags', tags);
      formData.append('liveUrl', liveUrl);
      
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      // Update the record in the 'projects' collection
      await pb.collection('projects').update(id, formData);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1500);
    } catch (err) {
      console.error('Error updating project:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || 'Failed to update project. Please verify fields.');
    } finally {
      setSaving(false);
    }
  };

  const currentThumbUrl = existingThumbnail 
    ? pb.files.getUrl({ id, thumbnail: existingThumbnail } as unknown as Project, existingThumbnail, { thumb: '120x80' }) 
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mb-4"></div>
        <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Loading project copy...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-12 flex flex-col items-center justify-center selection:bg-violet-600/30 selection:text-violet-200">
      {/* Glow decorative effect */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
            &larr; Cancel & Go Back
          </Link>
          <span className="text-3xs font-mono text-violet-500 uppercase tracking-widest">Upscalemark Workspace</span>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-zinc-900 bg-zinc-950 shadow-2xl flex flex-col gap-6">
          <div className="border-b border-zinc-900 pb-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">Edit Portfolio Project</h1>
            <p className="text-xs text-zinc-400 mt-1">Make changes to the copy or replace the thumbnail image.</p>
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
              placeholder="Describe the challenges faced..."
              className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-650 resize-none leading-relaxed"
            />
          </div>

          {/* Current Image Preview */}
          {currentThumbUrl && (
            <div className="flex flex-col gap-2">
              <label className="text-3xs font-semibold text-zinc-400 uppercase tracking-wider">Current Thumbnail Image</label>
              <div className="w-32 h-20 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                <img src={currentThumbUrl} alt="Current" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Custom File Upload Area */}
          <div className="flex flex-col gap-2">
            <label className="text-3xs font-semibold text-zinc-400 uppercase tracking-wider">Replace Thumbnail Image (Optional)</label>
            <div className="relative border border-dashed border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-all rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <span className="text-2xs font-semibold text-violet-400">
                {thumbnail ? `✔ Selected: ${thumbnail.name}` : 'Click to Upload New Image'}
              </span>
              <span className="text-4xs text-zinc-500 font-mono">
                {thumbnail ? `${(thumbnail.size / 1024 / 1024).toFixed(2)} MB` : 'Leave empty to keep existing image (PNG, JPG, SVG, or WEBP up to 5MB)'}
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
              ✔ Project saved successfully! Redirecting to admin panel...
            </p>
          )}

          <button
            type="submit"
            disabled={saving || success}
            className="w-full py-3.5 mt-2 rounded-lg bg-violet-600 hover:bg-violet-770 disabled:bg-zinc-800 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-violet-600/10 cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-b-white rounded-full animate-spin" />
                Saving updates...
              </>
            ) : (
              'Save Project Copy'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
