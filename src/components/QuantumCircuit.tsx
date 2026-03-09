import { motion } from "framer-motion";

export default function QuantumCircuit() {
  const qubits = 4;
  const gates = ["H", "Rz", "CNOT", "Ry", "H", "M"];

  return (
    <div className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
      <h3 className="font-display text-lg font-semibold mb-4">Quantum Circuit Visualization</h3>
      <div className="min-w-[500px] space-y-1">
        {Array.from({ length: qubits }).map((_, q) => (
          <motion.div
            key={q}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: q * 0.15 }}
            className="flex items-center gap-0"
          >
            <span className="w-12 text-xs font-mono text-muted-foreground">q[{q}]</span>
            <div className="flex-1 flex items-center">
              <div className="h-px flex-1 bg-border relative flex items-center">
                {gates.map((g, gi) => (
                  <motion.div
                    key={gi}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: q * 0.15 + gi * 0.1 }}
                    className="absolute flex items-center justify-center"
                    style={{ left: `${(gi + 1) * (100 / (gates.length + 1))}%`, transform: "translateX(-50%)" }}
                  >
                    {g === "CNOT" && q < qubits - 1 ? (
                      <div className="h-6 w-6 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-primary">⊕</span>
                      </div>
                    ) : g === "M" ? (
                      <div className="h-7 w-7 rounded border border-secondary bg-secondary/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-secondary">M</span>
                      </div>
                    ) : (
                      <div className="h-7 w-7 rounded border border-primary bg-primary/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary">{g}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        VQC with ZZFeatureMap encoding → RealAmplitudes ansatz → COBYLA optimizer
      </p>
    </div>
  );
}
