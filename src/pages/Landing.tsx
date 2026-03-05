import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Droplets, Zap, BarChart3, Lightbulb, TreePine, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const features = [
  { icon: BarChart3, title: "Track Your Daily Activities", desc: "Log water, energy, transport, food, and waste habits effortlessly." },
  { icon: Leaf, title: "Measure Environmental Impact", desc: "See your carbon, water, and energy footprint calculated in real time." },
  { icon: Lightbulb, title: "Improve with Smart Suggestions", desc: "Receive personalized tips to reduce your ecological footprint." },
];

export default function Landing() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 md:py-36">
          <div className="absolute inset-0 opacity-[0.03]">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <TreePine className="w-20 h-20 text-primary" />
              </motion.div>
            ))}
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Leaf className="w-4 h-4" /> Personal Environmental Tracker
              </span>
            </motion.div>
            <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 max-w-4xl mx-auto">
              Track Your Habits.{" "}
              <span className="eco-gradient-text">Protect the Planet.</span>
            </motion.h1>
            <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Small daily choices shape the future of our environment. Monitor your lifestyle and see your environmental impact in real time.
            </motion.p>
            <motion.div {...fadeUp(0.3)}>
              <Link to="/onboarding">
                <Button size="lg" className="eco-gradient border-0 text-primary-foreground text-lg px-8 py-6 hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg">
                  Start Tracking Your Impact
                </Button>
              </Link>
            </motion.div>

            {/* Animated Icons */}
            <motion.div {...fadeUp(0.4)} className="flex justify-center gap-8 mt-16">
              {[
                { icon: Droplets, label: "Water", color: "text-aqua" },
                { icon: Zap, label: "Energy", color: "text-leaf" },
                { icon: Wind, label: "Carbon", color: "text-accent" },
                { icon: TreePine, label: "Nature", color: "text-primary" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex flex-col items-center gap-2 hover-lift cursor-default"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Quotes */}
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                "We do not inherit the Earth from our ancestors; we borrow it from our children.",
                "The greatest threat to our planet is the belief that someone else will save it.",
              ].map((quote, i) => (
                <motion.blockquote key={i} {...fadeUp(i * 0.15)} className="eco-card text-center">
                  <p className="text-lg font-display italic text-foreground/80">"{quote}"</p>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-4">
            <motion.h2 {...fadeUp(0)} className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
              How It Works
            </motion.h2>
            <motion.p {...fadeUp(0.1)} className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
              Three simple steps to understand and reduce your environmental impact.
            </motion.p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((f, i) => (
                <motion.div key={f.title} {...fadeUp(i * 0.15)} className="eco-card text-center group">
                  <div className="w-16 h-16 rounded-2xl eco-gradient flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                    <f.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 eco-gradient">
          <div className="container mx-auto px-4 text-center">
            <motion.h2 {...fadeUp(0)} className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Ready to Make a Difference?
            </motion.h2>
            <motion.p {...fadeUp(0.1)} className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Join thousands tracking their impact and building sustainable habits every day.
            </motion.p>
            <motion.div {...fadeUp(0.2)}>
              <Link to="/onboarding">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 hover:scale-105 transition-all duration-300">
                  Get Started Free
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2026 EcoTrack. Built for a sustainable future. 🌱
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
