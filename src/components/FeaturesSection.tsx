import { motion } from "framer-motion";
import { Brain, Shield, Zap, BarChart3, HeartPulse, Award } from "lucide-react";

const features = [
  { icon: Brain, title: "Advanced AI Models", desc: "Quantum-enhanced ML models for superior prediction accuracy." },
  { icon: Shield, title: "Medical Grade Security", desc: "Your health data is encrypted and never stored." },
  { icon: Zap, title: "Instant Results", desc: "Get predictions in seconds with quantum computing." },
  { icon: BarChart3, title: "Comprehensive Analytics", desc: "Detailed risk scores and confidence metrics." },
  { icon: HeartPulse, title: "Early Detection", desc: "Catch disease risk before symptoms appear." },
  { icon: Award, title: "Expert Validated", desc: "Models trained on peer-reviewed medical datasets." },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Why <span className="text-gradient">QuantumMedPredict</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leveraging quantum computing breakthroughs for healthcare predictions.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/30"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg gradient-primary">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
