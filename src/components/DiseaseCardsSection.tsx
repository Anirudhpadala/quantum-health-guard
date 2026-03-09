import { motion } from "framer-motion";
import { diseaseInfo } from "@/lib/predictions";
import { Link } from "react-router-dom";

export default function DiseaseCardsSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Supported <span className="text-gradient">Disease Predictions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Quantum ML models trained on established medical datasets.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {diseaseInfo.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to="/assessment"
                className="group block rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/30"
              >
                <span className="text-4xl">{d.icon}</span>
                <h3 className="mt-4 mb-1 text-lg font-semibold group-hover:text-gradient">{d.name}</h3>
                <p className="text-xs text-primary/70 font-medium mb-2">{d.dataset}</p>
                <p className="text-sm text-muted-foreground">{d.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
