import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative">
      {/* Sleek initial entry loader */}
      <LoadingScreen />

      {/* Premium header with navigation and bright/dark mode toggle */}
      <Navbar />

      <main className="flex-grow flex flex-col">
        {/* Dynamic introduction section */}
        <Hero />

        {/* Capabilities listing with self-explanatory vector SVGs */}
        <Services />

        {/* Interactive work grid with state filters */}
        <Portfolio />

        {/* Agency background and metrics */}
        <About />

        {/* Client reviews slider panel */}
        <Testimonials />

        {/* Stepped project interactive inquiry form */}
        <ContactForm />
      </main>

      {/* Clean minimal footer */}
      <footer className="w-full py-8 border-t border-border bg-background/50 text-center text-3xs font-mono tracking-widest text-muted-foreground/60">
        <p>&copy; {new Date().getFullYear()} upscalemark. All rights reserved.</p>
      </footer>
    </div>
  );
}
