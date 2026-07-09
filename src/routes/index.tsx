import { createFileRoute } from "@tanstack/react-router";
import { AuroraBackground } from "@/components/site/AuroraBackground";
import { CursorGlow } from "@/components/site/CursorGlow";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Events } from "@/components/site/Events";
import { Projects } from "@/components/site/Projects";
import { Members } from "@/components/site/Members";
import { Achievements } from "@/components/site/Achievements";
import { Gallery } from "@/components/site/Gallery";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="relative">
      <AuroraBackground />
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Events />
        <Projects />
        <Members />
        <Achievements />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
