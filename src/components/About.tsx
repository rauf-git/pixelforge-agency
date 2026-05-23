'use client';

export default function About() {
  const stats = [
    { value: "05+", label: "Years Experience" },
    { value: "50+", label: "Brands Scaled" },
    { value: "100%", label: "Inquiry Success" }
  ];

  return (
    <section id="about" className="py-24 px-6 max-w-6xl mx-auto border-t border-border">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Info Column */}
        <div className="flex flex-col gap-6 text-left">
          <span className="font-mono text-3xs font-black tracking-widest text-primary uppercase">
            {"// Architecture"}
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground lowercase mt-1">
            about upscalemark
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We are a compact digital consultancy built for speed and technical excellence. We operate at the intersection of performance marketing and modern engineering, eliminating layout bloat and communication overhead to deliver immediate value.
          </p>
          
          {/* Large zero-padded metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-border/60 pt-8 mt-4 text-center sm:text-left">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col gap-1 items-center sm:items-start">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-primary">
                  {stat.value}
                </span>
                <span className="text-[9px] sm:text-3xs font-mono font-semibold tracking-wider text-muted-foreground uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Blueprint-style Diagram Column */}
        <div className="relative aspect-auto py-10 px-6 sm:aspect-[16/10] bg-muted/65 rounded-[2rem] border border-border overflow-hidden flex flex-col justify-between sm:p-8 group">
          {/* Decorative grid outline */}
          <div className="absolute inset-0 z-0 opacity-15 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <div className="z-10 flex justify-between items-start">
            <span className="font-mono text-3xs text-muted-foreground/40 font-bold uppercase tracking-widest">
              Consultancy Core Architecture
            </span>
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></div>
          </div>

          {/* Abstract structural grid vectors */}
          <div className="z-10 w-full flex flex-col gap-2 items-center justify-center my-6 py-6 opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-4">
              <div className="px-4 py-2 border border-border bg-card rounded-lg font-mono text-3xs font-bold text-foreground transition-all group-hover:border-primary/30 group-hover:-translate-y-1">
                /marketing.ads
              </div>
              <div className="px-4 py-2 border border-border bg-card rounded-lg font-mono text-3xs font-bold text-foreground transition-all group-hover:border-primary/30 group-hover:-translate-y-1">
                /web.nextjs
              </div>
            </div>
            {/* Visual connector lines */}
            <div className="h-6 w-[2px] bg-border/80"></div>
            <div className="px-5 py-2.5 border border-primary bg-primary/5 rounded-xl font-mono text-2xs font-black text-primary transition-all group-hover:scale-105 shadow-sm">
              {"// upscalemark_core"}
            </div>
          </div>

          <div className="z-10 flex justify-between items-end font-mono text-4xs text-muted-foreground/30">
            <span>ver=2.1.0</span>
            <span>node=0x8AB4</span>
          </div>
        </div>
      </div>
    </section>
  );
}
