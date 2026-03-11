import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { simulateQuantumPrediction, type PredictionResult } from "@/lib/predictions";

interface Props {
  disease: typeof import("@/lib/predictions").diseaseInfo[number];
  onResult: (r: PredictionResult) => void;
}

export default function PredictionForm({ disease, onResult }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate quantum processing delay
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));

    const numericValues: Record<string, number> = {};
    disease.fields.forEach((f) => {
      numericValues[f.name] = parseFloat(values[f.name] || "0");
    });

    const prediction = simulateQuantumPrediction(disease.name, numericValues);
    onResult(prediction);
    setLoading(false);

    // Navigate to results page
    navigate("/results", { state: { result: prediction } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full gradient-primary border-0 text-primary-foreground py-6 text-base shadow-glow"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Running Quantum VQC Model...
          </>
        ) : (
          "Predict Disease Risk"
        )}
      </Button>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-2"
        >
          <div className="flex justify-center gap-1">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                className="h-2 w-2 rounded-full gradient-primary"
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Encoding features → Applying quantum gates → Measuring qubits → COBYLA optimization
          </p>
        </motion.div>
      )}
    </form>
  );
}
