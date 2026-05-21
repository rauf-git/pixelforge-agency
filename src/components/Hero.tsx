export default function Hero() {
  return (
    <section id="hero" className="py-24 text-center max-w-4xl mx-auto px-4 flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
        Crafting Bleeding-Edge <br />
        <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
          Digital Experiences
        </span>
      </h1>
      <p className="mt-6 text-zinc-400 text-lg md:text-xl max-w-2xl">
        We are PixelForge, a modern digital agency specialized in designing and developing ultra-premium websites, applications, and brands.
      </p>
      <div className="mt-10 flex gap-4">
        <a 
          href="#portfolio" 
          className="px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-all"
        >
          View Our Work
        </a>
        <a 
          href="#contact" 
          className="px-6 py-3 rounded-full border border-zinc-800 hover:bg-zinc-900 text-zinc-300 font-medium text-sm transition-all"
        >
          Let&apos;s Talk
        </a>
      </div>
    </section>
  );
}
