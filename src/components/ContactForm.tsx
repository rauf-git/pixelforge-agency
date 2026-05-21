'use client';

import { useState } from 'react';
import { pb } from '@/lib/pocketbase';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // Save the form data directly to the PocketBase 'contacts' collection
      await pb.collection('contacts').create({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('PocketBase submission error:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 max-w-2xl mx-auto px-4 border-t border-zinc-900">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Let&apos;s Craft Something Together</h2>
        <p className="mt-4 text-zinc-400">Have a project or partnership in mind? Get in touch with us.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 rounded-2xl border border-zinc-800 bg-zinc-950">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Name</label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-650"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-650"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Message</label>
          <textarea
            id="message"
            rows={5}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell us about your project..."
            className="w-full bg-zinc-900 border border-zinc-850 focus:border-violet-600 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-650 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-800 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-violet-600/10 cursor-pointer"
        >
          {status === 'loading' ? 'Sending Inquiry...' : 'Send Message'}
        </button>

        {status === 'success' && (
          <p className="text-center text-xs text-green-400 mt-2 font-medium">
            Thank you! Your message has been sent successfully.
          </p>
        )}

        {status === 'error' && (
          <p className="text-center text-xs text-red-400 mt-2 font-medium">
            Oops! Something went wrong. Please check your connection or try again.
          </p>
        )}
      </form>
    </section>
  );
}
