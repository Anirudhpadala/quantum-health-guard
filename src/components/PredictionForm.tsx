import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { simulateQuantumPrediction, getRiskColor, type PredictionResult } from "@/lib/predictions";
import QuantumCircuit from "./QuantumCircuit";

interface Props {
  disease: typeof import("@/lib/predictions").diseaseInfo[number];
  onResult: (r: PredictionResult) => void;
}

export default function PredictionForm({ disease, onResult }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Simulate quantum processing delay
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));

    const numericValues: Record<string, number> = {};
    disease.fields.forEach((f) => {
      numericValues[f.name] = parseFloat(values[f.name] || "0");
    });

    const prediction = simulateQuantumPrediction(disease.name, numericValues);
    setResult(prediction);
    onResult(prediction);
    setLoading(false);
  };

  const riskIcon = result
    ? result.riskLevel === "low"
      ? CheckCircle
      : result.riskLevel === "medium"
      ? AlertCircle
      : AlertTriangle
    : null;

  const RiskIcon = riskIcon;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        {disease.fields.map((f) => (
          <div key={f.name} className="space-y-1.5">
            <Label htmlFor={f.name} className="text-sm">{f.label}</Label>
            <Input
              id={f.name}
              type="number"
              step={f.step}
              min={f.min}
              max={f.max}
              placeholder={`${f.min} – ${f.max}`}
              value={values[f.name] || ""}
              onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
              required
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full gradient-primary border-0 text-primary-foreground py-6 text-base shadow-glow"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Running Quantum Model...
              </>
            ) : (
              "Predict Disease Risk"
            )}
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Result card */}
            <div className={`rounded-xl border-2 p-6 ${
              result.riskLevel === "low"
                ? "border-success/40 bg-success/5"
                : result.riskLevel === "medium"
                ? "border-warning/40 bg-warning/5"
                : "border-danger/40 bg-danger/5"
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {RiskIcon && (
                  <RiskIcon className={`h-8 w-8 ${
                    result.riskLevel === "low"
                      ? "text-success"
                      : result.riskLevel === "medium"
                      ? "text-warning"
                      : "text-danger"
                  }`} />
                )}
                <div>
                  <h3 className="text-xl font-bold">{result.disease} Risk: {result.risk}%</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {result.riskLevel} Risk Category
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-card p-3 border border-border">
                  <div className="text-2xl font-bold text-gradient">{result.confidence}%</div>
                  <div className="text-xs text-muted-foreground">Confidence</div>
                </div>
                <div className="rounded-lg bg-card p-3 border border-border">
                  <div className="text-2xl font-bold text-gradient">{result.modelAccuracy}%</div>
                  <div className="text-xs text-muted-foreground">Model Accuracy</div>
                </div>
                <div className="rounded-lg bg-card p-3 border border-border">
                  <div className="text-2xl font-bold text-gradient-accent">+{result.quantumAdvantage}%</div>
                  <div className="text-xs text-muted-foreground">Quantum Advantage</div>
                </div>
              </div>
            </div>

            {/* Quantum circuit */}
            <QuantumCircuit />

            {/* Comparison */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h4 className="font-semibold mb-3">Quantum vs Classical Accuracy</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Quantum ML (VQC)</span>
                    <span className="font-semibold text-primary">{result.modelAccuracy}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.modelAccuracy}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full gradient-primary"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Classical SVM</span>
                    <span className="font-semibold text-muted-foreground">{result.modelAccuracy - result.quantumAdvantage}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.modelAccuracy - result.quantumAdvantage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full bg-muted-foreground/30"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
