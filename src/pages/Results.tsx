import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import QuantumCircuit from "@/components/QuantumCircuit";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, AlertCircle, ArrowLeft, Atom } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PredictionResult } from "@/lib/predictions";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as PredictionResult | undefined;

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-3xl font-bold mb-4">No Results</h1>
          <p className="text-muted-foreground mb-6">Run a health assessment first to see results.</p>
          <Button onClick={() => navigate("/assessment")} className="gradient-primary border-0 text-primary-foreground">
            Go to Assessment
          </Button>
        </div>
      </div>
    );
  }

  const RiskIcon = result.riskLevel === "low" ? CheckCircle : result.riskLevel === "medium" ? AlertCircle : AlertTriangle;
  const riskColorClass = result.riskLevel === "low" ? "text-success" : result.riskLevel === "medium" ? "text-warning" : "text-danger";
  const riskBorderClass = result.riskLevel === "low" ? "border-success/40 bg-success/5" : result.riskLevel === "medium" ? "border-warning/40 bg-warning/5" : "border-danger/40 bg-danger/5";

  const comparisonData = [
    { name: "Quantum VQC", accuracy: result.modelAccuracy },
    { name: "Classical SVM", accuracy: result.classicalAccuracy },
    { name: "Random Forest", accuracy: result.classicalAccuracy - 2 },
    { name: "Logistic Reg.", accuracy: result.classicalAccuracy - 5 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" onClick={() => navigate("/assessment")} className="mb-4 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assessment
          </Button>

          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Prediction</span> Results
          </h1>
          <p className="text-muted-foreground mb-8">
            {result.disease} risk analysis powered by Variational Quantum Classifier
          </p>
        </motion.div>

        {/* Main Result Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl border-2 p-8 mb-8 ${riskBorderClass}`}
        >
          <div className="flex items-center gap-4 mb-6">
            <RiskIcon className={`h-12 w-12 ${riskColorClass}`} />
            <div>
              <h2 className="text-3xl font-bold">{result.disease} Risk: {result.risk}%</h2>
              <p className="text-muted-foreground capitalize text-lg">{result.riskLevel} Risk Category</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg bg-card p-4 border border-border text-center">
              <div className="text-3xl font-bold text-gradient">{result.confidence}%</div>
              <div className="text-xs text-muted-foreground mt-1">Confidence</div>
            </div>
            <div className="rounded-lg bg-card p-4 border border-border text-center">
              <div className="text-3xl font-bold text-gradient">{result.modelAccuracy}%</div>
              <div className="text-xs text-muted-foreground mt-1">Model Accuracy</div>
            </div>
            <div className="rounded-lg bg-card p-4 border border-border text-center">
              <div className="text-3xl font-bold text-gradient-accent">+{result.quantumAdvantage}%</div>
              <div className="text-xs text-muted-foreground mt-1">Quantum Advantage</div>
            </div>
            <div className="rounded-lg bg-card p-4 border border-border text-center">
              <div className="text-3xl font-bold text-gradient">{result.qubitMeasurements.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Qubits Used</div>
            </div>
          </div>
        </motion.div>

        {/* Feature Encoding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6 mb-8"
        >
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Atom className="h-5 w-5 text-primary" />
            Angle Encoding — Feature → Qubit Mapping
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.featureEncoding.map((f, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="gradient-primary rounded-lg h-8 w-8 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary-foreground">q{f.qubit}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{f.feature}</div>
                  <div className="text-xs text-muted-foreground">
                    Value: {f.value} → θ = {(f.encodedAngle / Math.PI).toFixed(3)}π rad
                  </div>
                </div>
                <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full gradient-primary"
                    style={{ width: `${(f.encodedAngle / Math.PI) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quantum Circuit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <QuantumCircuit
            gateOperations={result.gateOperations}
            numQubits={result.qubitMeasurements.length}
          />
        </motion.div>

        {/* Qubit Measurements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-6 mb-8"
        >
          <h3 className="font-semibold text-lg mb-4">Qubit Measurement Probabilities</h3>
          <div className="grid gap-3">
            {result.qubitMeasurements.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-8">q[{i}]</span>
                <div className="flex-1 h-6 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full gradient-primary"
                  />
                </div>
                <span className="text-sm font-medium w-16 text-right">
                  |1⟩: {(m * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Model Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-border bg-card p-6 mb-8"
        >
          <h3 className="font-semibold text-lg mb-4">Quantum vs Classical Model Accuracy</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={comparisonData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,15%,89%)" />
              <XAxis type="number" domain={[70, 100]} tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
              <Tooltip />
              <Bar dataKey="accuracy" radius={[0, 6, 6, 0]}>
                {comparisonData.map((_, i) => (
                  <motion.rect
                    key={i}
                    fill={i === 0 ? "hsl(174,72%,40%)" : "hsl(210,15%,70%)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate("/assessment")} variant="outline">
            New Assessment
          </Button>
          <Button onClick={() => navigate("/dashboard")} className="gradient-primary border-0 text-primary-foreground">
            View Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
