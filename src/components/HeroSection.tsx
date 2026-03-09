import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "95%", label: "Accuracy" },
  { value: "7+", label: "Disease Types" },
  { value: "10K+", label: "Users Helped" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden gradient-hero flex items-center">
      {/* Animated bg orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-secondary/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 right-1/3 h-64 w-64 rounded-full bg-accent/10 blur-[80px] animate-pulse-glow" style={{ animationDelay: "3s" }} />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(174,72%,40%) 1px, transparent 1px), linear-gradient(90deg, hsl(174,72%,40%) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div className="container relative mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground/80"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Powered by Quantum Machine Learning
          </motion.div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-primary-foreground md:text-7xl">
            Predict Multiple{" "}
            <span className="text-gradient">Diseases Early</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/60 md:text-xl">
            AI-powered health prediction using Quantum Machine Learning. Get instant, accurate risk assessments for 7+ diseases.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/assessment">
              <Button size="lg" className="gradient-primary border-0 text-primary-foreground gap-2 text-base px-8 py-6 shadow-glow">
                Start Health Assessment <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8 py-6 border-primary-foreground/20 text-primary-foreground/80 hover:bg-primary-foreground/10 bg-transparent">
                <BookOpen className="h-5 w-5" /> Learn More
              </Button>
            </a>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 grid grid-cols-3 gap-8 mx-auto max-w-lg"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-gradient md:text-4xl">{s.value}</div>
                <div className="mt-1 text-sm text-primary-foreground/50">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
