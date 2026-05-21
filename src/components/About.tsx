export default function About() {
  const stats = [
    { value: "5+", label: "Years Experience" },
    { value: "50+", label: "Clients Served" },
    { value: "100%", label: "Success Rate" }
  ];

  return (
    <section id="about" className="py-20 max-w-7xl mx-auto px-4 border-t border-zinc-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">About PixelForge</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            We are a group of creative designers and developers united by a single vision: forging high-performance, memorable digital platforms. We don&apos;t just build pages; we engineer digital destinations that inspire and scale.
          </p>
          <div className="flex gap-8 mt-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-3xl font-extrabold text-violet-500">{stat.value}</span>
                <span className="text-xs text-zinc-500 font-medium tracking-wide mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-64 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 text-xs">
          About Graphic Mockup
        </div>
      </div>
    </section>
  );
}
