'use client';

import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';
import { Testimonial } from '@/types';

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'mock-1',
    collectionId: '',
    collectionName: 'testimonials',
    created: '',
    updated: '',
    clientName: "Sarah Jenkins",
    roleCompany: "Product Manager, TechCorp",
    reviewText: "PixelForge delivered a beautiful, blisteringly fast platform that exceeded our expectations.",
    rating: 5
  },
  {
    id: 'mock-2',
    collectionId: '',
    collectionName: 'testimonials',
    created: '',
    updated: '',
    clientName: "Marcus Vance",
    roleCompany: "Founder, Vortex Ventures",
    reviewText: "Working with them was seamless. Their attention to detail and UI execution is masterclass.",
    rating: 5
  }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const records = await pb.collection('testimonials').getFullList<Testimonial>({
          sort: '-id',
        });
        setTestimonials(records);
      } catch (error) {
        console.error('Error fetching testimonials from PocketBase:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();

    // Subscribe to real-time testimonial changes
    pb.collection('testimonials').subscribe('*', () => {
      fetchTestimonials();
    }).catch((err) => {
      console.error('Real-time testimonial subscription error:', err);
    });

    return () => {
      pb.collection('testimonials').unsubscribe('*').catch((err) => {
        console.error('Real-time testimonial unsubscribe error:', err);
      });
    };
  }, []);

  const activeTestimonials = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 border-t border-zinc-900 bg-zinc-950/40">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Client Testimonials</h2>
        <p className="mt-4 text-zinc-400">Read what industry leaders say about working with us.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeTestimonials.map((rev) => {
            const hasAvatar = rev.clientAvatar && rev.clientAvatar !== "";
            const avatarUrl = hasAvatar 
              ? pb.files.getUrl(rev, rev.clientAvatar!, { thumb: '80x80' }) 
              : null;

            return (
              <div key={rev.id} className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col gap-4 justify-between">
                <div>
                  {/* Render dynamic rating stars */}
                  <div className="flex gap-1 mb-4 text-violet-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed italic">
                    &ldquo;{rev.reviewText}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={rev.clientName} 
                      className="w-10 h-10 rounded-full object-cover border border-zinc-850"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-violet-950/40 border border-violet-800/40 flex items-center justify-center text-xs font-bold text-violet-400">
                      {rev.clientName.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">{rev.clientName}</span>
                    <span className="text-xs text-zinc-500 mt-0.5">{rev.roleCompany}</span>
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
