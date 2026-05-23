'use client';

import { useState } from 'react';
import { pb } from '@/lib/pocketbase';
import { ArrowRight, Check } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // Custom Stepped Selectors
  const [service, setService] = useState<'web' | 'marketing'>('web');
  const [webType, setWebType] = useState<'new' | 'revamp'>('new');
  const [websiteCategory, setWebsiteCategory] = useState('ecommerce');
  const [marketingCampaigns, setMarketingCampaigns] = useState<string[]>([]);
  const [budget, setBudget] = useState(2); // Default to Tier 2 ($10k-$25k)
  const [timeline, setTimeline] = useState<'immediately' | '1-2weeks' | 'month' | 'flexible'>('immediately');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const budgetTiers = [
    { value: 0, label: '₹10,000 - ₹50,000', detail: 'Starter Tier' },
    { value: 1, label: '₹50,000 - ₹2,00,000', detail: 'Growth Tier' },
    { value: 2, label: '₹2,00,000 - ₹5,00,000', detail: 'Professional Tier' },
    { value: 3, label: '₹5,00,000+', detail: 'Enterprise Tier' }
  ];

  const timelineLabels = {
    immediately: 'Immediately',
    '1-2weeks': 'In 1-2 Weeks',
    month: 'Within a Month',
    flexible: 'Flexible Timeline'
  };

  const handleMarketingCampaignToggle = (campaign: string) => {
    setMarketingCampaigns((prev) =>
      prev.includes(campaign)
        ? prev.filter((c) => c !== campaign)
        : [...prev, campaign]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // Pack all dynamic selectors cleanly into the message string to keep schema intact
      let compiledMessage = `[Service: ${service === 'web' ? 'Web Development' : 'Digital Marketing'}]\n`;
      if (service === 'web') {
        compiledMessage += `[Type: ${webType === 'new' ? 'New Website' : 'Old to New Revamping'}]\n`;
        compiledMessage += `[Category: ${websiteCategory}]\n`;
      } else {
        compiledMessage += `[Campaign Focus: ${marketingCampaigns.join(', ') || 'None selected'}]\n`;
      }
      compiledMessage += `[Budget: ${budgetTiers[budget].label}]\n`;
      compiledMessage += `[Timeline: ${timelineLabels[timeline]}]\n\n`;
      compiledMessage += `Client Message:\n${message}`;

      await pb.collection('contacts').create({
        name,
        email,
        message: compiledMessage,
      });

      setStatus('success');
      // Reset form standard fields
      setName('');
      setEmail('');
      setMessage('');
      setMarketingCampaigns([]);
    } catch (error) {
      console.error('PocketBase submission error:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-4xl mx-auto border-t border-border">
      <div className="text-left mb-16 max-w-xl">
        <span className="font-mono text-3xs font-black tracking-widest text-primary uppercase">
          {"// Project Planner"}
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground lowercase mt-3">
          let&apos;s start something
        </h2>
        <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
          Tell us about your project requirements and target goals. We will align a comprehensive engineering and marketing plan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 sm:p-12 rounded-[2rem] border border-primary/20 bg-zinc-50/90 dark:bg-zinc-900/60 shadow-[0_24px_60px_rgba(80,79,237,0.08)] flex flex-col gap-10">
        
        {/* STEP 1: SERVICE TYPE SEGMENTED TOGGLE */}
        <div className="flex flex-col gap-4">
          <label className="font-mono text-3xs font-black tracking-widest text-muted-foreground/60 uppercase">
            01 / Select Service Area
          </label>
          <div className="grid grid-cols-2 p-1.5 bg-muted rounded-full border border-border/80 relative overflow-hidden">
            <button
              type="button"
              onClick={() => setService('web')}
              className={`py-3 text-xs sm:text-sm font-bold font-mono tracking-tighter rounded-full z-10 transition-all cursor-pointer ${
                service === 'web' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              /web development
            </button>
            <button
              type="button"
              onClick={() => setService('marketing')}
              className={`py-3 text-xs sm:text-sm font-bold font-mono tracking-tighter rounded-full z-10 transition-all cursor-pointer ${
                service === 'marketing' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              /digital marketing
            </button>
          </div>
        </div>

        {/* STEP 2: CONDITIONAL SUB-FIELDS */}
        {service === 'web' ? (
          <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Website Type Toggle */}
            <div className="flex flex-col gap-4">
              <label className="font-mono text-3xs font-black tracking-widest text-muted-foreground/60 uppercase">
                02 / Development Target
              </label>
              <div className="flex gap-3">
                {['new', 'revamp'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setWebType(type as 'new' | 'revamp')}
                    className={`px-5 py-2.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer border ${
                      webType === type 
                        ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                        : 'border-border bg-card hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    /{type === 'new' ? 'new website' : 'old to new revamp'}
                  </button>
                ))}
              </div>
            </div>

            {/* Website Category Grid */}
            <div className="flex flex-col gap-4">
              <label className="font-mono text-3xs font-black tracking-widest text-muted-foreground/60 uppercase">
                03 / Product Category
              </label>
              <div className="flex flex-wrap gap-3">
                {['ecommerce', 'portfolio', 'saas product', 'landing page', 'other'].map((cat) => {
                  const isActive = websiteCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setWebsiteCategory(cat)}
                      className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border ${
                        isActive 
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                          : 'border-border bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Campaign Selection Grid */}
            <label className="font-mono text-3xs font-black tracking-widest text-muted-foreground/60 uppercase">
              02 / Campaign Target Focus
            </label>
            <div className="flex flex-wrap gap-3">
              {['paid ads', 'social media management', 'influencer marketing'].map((camp) => {
                const isActive = marketingCampaigns.includes(camp);
                return (
                  <button
                    key={camp}
                    type="button"
                    onClick={() => handleMarketingCampaignToggle(camp)}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border ${
                      isActive 
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                        : 'border-border bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    {camp}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: TIMELINE PIL SELECTOR */}
        <div className="flex flex-col gap-4">
          <label className="font-mono text-3xs font-black tracking-widest text-muted-foreground/60 uppercase">
            {service === 'web' ? '04' : '03'} / Launch Timeline
          </label>
          <div className="flex flex-wrap gap-3">
            {(['immediately', '1-2weeks', 'month', 'flexible'] as const).map((time) => {
              const isActive = timeline === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => setTimeline(time)}
                  className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border ${
                    isActive 
                      ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                      : 'border-border bg-card/60 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {time === 'immediately' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                  )}
                  {timelineLabels[time]}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 4: INTERACTIVE BUDGET RANGE SLIDER */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <label className="font-mono text-3xs font-black tracking-widest text-muted-foreground/60 uppercase">
              {service === 'web' ? '05' : '04'} / Budget Estimate
            </label>
            {/* Dynamic visual bubble indicator */}
            <div className="px-3 py-1.5 bg-primary/15 border border-primary/20 rounded-lg text-primary font-mono text-xs font-black animate-pulse">
              {budgetTiers[budget].label}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="range"
              min="0"
              max="3"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between font-mono text-[9px] text-muted-foreground/60 mt-1.5 px-1 uppercase tracking-wider">
              <span>min (₹10,000)</span>
              <span>max (₹5,00,000+)</span>
            </div>
          </div>
        </div>

        {/* STEP 5: REGULAR FIELDS WITH FLOATING LABELS */}
        <div className="border-t border-border/60 pt-10 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name Input */}
            <div className="relative flex flex-col justify-end h-12 w-full border-b border-border/80 focus-within:border-primary">
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
                className="w-full bg-transparent text-sm text-foreground focus:outline-none py-1.5 material-input"
              />
              <label
                htmlFor="name"
                className="absolute left-0 bottom-2.5 text-xs text-muted-foreground tracking-wide uppercase transition-all duration-350 pointer-events-none material-label"
              >
                Your Name
              </label>
            </div>

            {/* Email Input */}
            <div className="relative flex flex-col justify-end h-12 w-full border-b border-border/80 focus-within:border-primary">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="w-full bg-transparent text-sm text-foreground focus:outline-none py-1.5 material-input"
              />
              <label
                htmlFor="email"
                className="absolute left-0 bottom-2.5 text-xs text-muted-foreground tracking-wide uppercase transition-all duration-350 pointer-events-none material-label"
              >
                Email Address
              </label>
            </div>
          </div>

          {/* Message Area */}
          <div className="relative flex flex-col justify-end w-full border-b border-border/80 focus-within:border-primary mt-4">
            <textarea
              id="message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder=" "
              className="w-full bg-transparent text-sm text-foreground focus:outline-none py-2 resize-none material-input"
            />
            <label
              htmlFor="message"
              className="absolute left-0 top-2 text-xs text-muted-foreground tracking-wide uppercase transition-all duration-350 pointer-events-none material-label"
            >
              Message / Project Details
            </label>
          </div>
        </div>

        {/* SUBMIT BUTTON WITH SPINNER/SUCCESS ANIMATIONS */}
        <div className="flex flex-col gap-4 mt-2">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-4 rounded-full bg-primary hover:bg-primary/95 disabled:bg-muted text-primary-foreground font-black text-xs tracking-wider uppercase transition-all duration-350 flex justify-center items-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:shadow-primary/10"
          >
            {status === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                Locking In Plan...
              </>
            ) : status === 'success' ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                Inquiry Logged Successfully!
              </>
            ) : (
              <>
                Submit Inquiry
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {status === 'success' && (
            <p className="text-center text-3xs font-mono font-bold tracking-widest text-primary animate-pulse">
              Thank you! Our advisory team will respond within 24 hours.
            </p>
          )}

          {status === 'error' && (
            <p className="text-center text-3xs font-mono font-bold tracking-widest text-destructive">
              Submission notice: Something went wrong. Check connection.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
