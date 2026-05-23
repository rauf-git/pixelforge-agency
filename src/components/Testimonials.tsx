'use client';

import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';
import { Testimonial } from '@/types';
import { Star } from 'lucide-react';

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'mock-1',
    collectionId: '',
    collectionName: 'testimonials',
    created: '',
    updated: '',
    clientName: "Sarah Jenkins",
    roleCompany: "Marketing Lead, TechCorp",
    reviewText: "upscalemark delivered an incredibly clean platform that increased our search campaign conversions by over 40%.",
    rating: 5
  },
  {
    id: 'mock-2',
    collectionId: '',
    collectionName: 'testimonials',
    created: '',
    updated: '',
    clientName: "Marcus Vance",
    roleCompany: "Founder, Vortex",
    reviewText: "Their layout precision and architectural clarity is masterclass. Best front-end execution we have hired.",
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
    <section className="py-24 px-6 max-w-6xl mx-auto border-t border-border bg-card/10">
      <div className="text-left mb-16 max-w-xl">
        <span className="font-mono text-3xs font-black tracking-widest text-primary uppercase">
          {"// Reviews"}
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground lowercase mt-3">
          client reviews
        </h2>
        <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
          Read strategic feedback from product teams and companies who have scaled their systems with us.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeTestimonials.map((rev) => {
            const hasAvatar = rev.clientAvatar && rev.clientAvatar !== "";
            const avatarUrl = hasAvatar 
              ? pb.files.getUrl(rev, rev.clientAvatar!, { thumb: '80x80' }) 
              : null;

            return (
              <div 
                key={rev.id} 
                className="p-8 sm:p-10 rounded-[2rem] border border-border bg-card flex flex-col justify-between gap-8 transition-all duration-300 hover:border-primary/20 shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col gap-4">
                  {/* Modern custom star vectors */}
                  <div className="flex gap-0.5 text-primary">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current stroke-none" />
                    ))}
                  </div>
                  <p className="text-foreground/90 text-sm leading-relaxed font-medium italic">
                    &ldquo;{rev.reviewText}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-border/60 pt-6">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={rev.clientName} 
                      className="w-10 h-10 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary font-mono uppercase">
                      {rev.clientName.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-foreground tracking-tight">
                      {rev.clientName}
                    </span>
                    <span className="text-3xs font-mono font-semibold tracking-wider text-muted-foreground uppercase mt-0.5">
                      {rev.roleCompany}
                    </span>
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
