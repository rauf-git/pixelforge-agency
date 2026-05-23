import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import LoadingScreen from "@/components/LoadingScreen";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative">
      {/* Dynamic entry loader */}
      <LoadingScreen />

      {/* Global Navigation Header */}
      <Navbar />

      {/* Dedicated Section View */}
      <main className="flex-grow pt-28 pb-12">
        <Services />
      </main>

      {/* Standard Footer */}
      <footer className="w-full py-8 border-t border-border bg-background/50 text-center text-3xs font-mono tracking-widest text-muted-foreground/60">
        <p>&copy; {new Date().getFullYear()} upscalemark. All rights reserved.</p>
      </footer>
    </div>
  );
}
