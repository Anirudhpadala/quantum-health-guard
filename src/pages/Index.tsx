import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DiseaseCardsSection from "@/components/DiseaseCardsSection";
import { Activity } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DiseaseCardsSection />

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">QuantumMedPredict</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Human Multiple Disease Prediction using Quantum Machine Learning
          </p>
          <p className="mt-2 text-xs text-muted-foreground/60">
            For educational purposes only. Not a substitute for medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
