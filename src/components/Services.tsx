export default function Services() {
  const services = [
    { title: "Web Development", desc: "Performance-oriented, secure web experiences built with Next.js and Tailwind." },
    { title: "UI/UX Design", desc: "Immersive, user-centric interfaces crafted with meticulous attention to detail." },
    { title: "Branding", desc: "Modern visual identities, guidelines, and logos that build trust and scale." }
  ];

  return (
    <section id="services" className="py-20 max-w-7xl mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Our Services</h2>
        <p className="mt-4 text-zinc-400">High-impact solutions designed to elevate your brand&apos;s digital presence.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition-all flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-white">{service.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
