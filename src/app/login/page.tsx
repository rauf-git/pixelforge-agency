'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/pocketbase';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const isSuperuser = pb.authStore.isValid && 
      (pb.authStore.record?.collectionName === '_superusers' || !pb.authStore.record);
    
    if (isSuperuser && pb.authStore.isValid) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Authenticate as a superuser/admin (compatible with PocketBase v0.23+)
      let authData;
      try {
        authData = await pb.collection('_superusers').authWithPassword(email, password);
      } catch (err) {
        // Fallback for PocketBase v0.22 and below
        authData = await pb.admins.authWithPassword(email, password);
      }

      if (authData && pb.authStore.isValid) {
        router.push('/admin');
        router.refresh();
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Invalid admin email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 font-sans selection:bg-violet-600/30 selection:text-violet-200">
      {/* Decorative gradient glowing orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col gap-6">
        <div className="text-center">
          <Link href="/" className="text-2xs font-mono text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-widest">
            &larr; Back to Agency
          </Link>
          <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">PixelForge Admin</h1>
          <p className="text-xs text-zinc-400 mt-2">Log in to manage your digital agency portfolio</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col gap-5 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-3xs font-semibold text-zinc-400 uppercase tracking-wider">
              Admin Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pixelforge.agency"
              className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-650"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-3xs font-semibold text-zinc-400 uppercase tracking-wider">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-650"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-400 text-center bg-red-950/20 border border-red-900/30 py-2.5 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-800 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-violet-600/10 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-b-white rounded-full animate-spin" />
                Logging in...
              </>
            ) : (
              'Enter Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
