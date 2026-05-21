import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-violet-600/30 selection:text-violet-200">
      {/* Premium header with navigation */}
      <Navbar />

      <main className="flex-grow flex flex-col">
        {/* Dynamic introduction section */}
        <Hero />

        {/* Capabilities listing */}
        <Services />

        {/* Interactive work grid with state filters */}
        <Portfolio />

        {/* Agency background and metrics */}
        <About />

        {/* Client reviews slider panel */}
        <Testimonials />

        {/* Database integrated inquiry form */}
        <ContactForm />
      </main>

      {/* Tiny clean footer */}
      <footer className="w-full py-8 border-t border-zinc-900 bg-zinc-950 text-center text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} PixelForge Agency. All rights reserved.</p>
      </footer>
    </div>
  );
}
