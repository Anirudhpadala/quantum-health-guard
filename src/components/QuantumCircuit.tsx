import { motion } from "framer-motion";
import type { GateOperation } from "@/lib/predictions";

interface Props {
  gateOperations?: GateOperation[];
  numQubits?: number;
}

const gateColors: Record<string, { border: string; bg: string; text: string }> = {
  H: { border: "border-primary", bg: "bg-primary/15", text: "text-primary" },
  RX: { border: "border-secondary", bg: "bg-secondary/15", text: "text-secondary" },
  RY: { border: "border-accent", bg: "bg-accent/15", text: "text-accent" },
  RZ: { border: "border-warning", bg: "bg-warning/15", text: "text-warning" },
  CNOT: { border: "border-primary", bg: "bg-primary/20", text: "text-primary" },
  M: { border: "border-danger", bg: "bg-danger/15", text: "text-danger" },
};

export default function QuantumCircuit({ gateOperations, numQubits = 4 }: Props) {
  // If no gate operations provided, use default visualization
  const defaultGates = ["H", "RY", "RX", "CNOT", "RZ", "M"];
  const layers = gateOperations
    ? Math.max(...gateOperations.map((g) => g.layer)) + 1
    : defaultGates.length;

  const getGatesForQubit = (qubit: number) => {
    if (!gateOperations) {
      return defaultGates.map((g, i) => ({ gate: g, qubit, layer: i, target: g === "CNOT" && qubit < numQubits - 1 ? qubit + 1 : undefined }));
    }
    return gateOperations.filter((g) => g.qubit === qubit);
  };

  // Get unique layers
  const uniqueLayers = gateOperations
    ? [...new Set(gateOperations.map((g) => g.layer))].sort((a, b) => a - b)
    : defaultGates.map((_, i) => i);

  return (
    <div className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
      <div className="flex items-center gap-3 mb-5">
        <h3 className="font-display text-lg font-semibold">Quantum Circuit — VQC</h3>
        <span className="text-xs rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-primary font-medium">
          {numQubits} qubits · {uniqueLayers.length} layers
        </span>
      </div>

      <div className="min-w-[600px] space-y-0">
        {Array.from({ length: numQubits }).map((_, q) => {
          const qGates = getGatesForQubit(q);
          // Only show a subset of gates to keep it readable
          const displayGates = qGates.slice(0, Math.min(qGates.length, 8));

          return (
            <motion.div
              key={q}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: q * 0.1 }}
              className="flex items-center"
            >
              <span className="w-14 text-xs font-mono text-muted-foreground shrink-0">
                |q{q}⟩
              </span>
              <div className="flex-1 flex items-center h-12 relative">
                {/* Wire */}
                <div className="absolute inset-x-0 top-1/2 h-px bg-border" />

                {/* Gates */}
                <div className="relative flex items-center gap-2 px-2 w-full justify-around">
                  {displayGates.map((g, gi) => {
                    const colors = gateColors[g.gate] || gateColors.H;
                    return (
                      <motion.div
                        key={gi}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: q * 0.1 + gi * 0.06 }}
                        className="relative z-10"
                      >
                        {g.gate === "CNOT" ? (
                          <div className="flex flex-col items-center">
                            <div className={`h-7 w-7 rounded-full border-2 ${colors.border} ${colors.bg} flex items-center justify-center`}>
                              <span className="text-[10px] font-bold ${colors.text}">⊕</span>
                            </div>
                            {g.target !== undefined && (
                              <div className="w-px h-3 bg-primary/50" />
                            )}
                          </div>
                        ) : g.gate === "M" ? (
                          <div className={`h-8 w-8 rounded border-2 ${colors.border} ${colors.bg} flex items-center justify-center`}>
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] font-bold text-danger">📏</span>
                            </div>
                          </div>
                        ) : (
                          <div className={`h-8 w-10 rounded border ${colors.border} ${colors.bg} flex flex-col items-center justify-center`}>
                            <span className={`text-[10px] font-bold ${colors.text}`}>{g.gate}</span>
                            {g.parameter !== undefined && (
                              <span className="text-[7px] text-muted-foreground">
                                {(g.parameter / Math.PI).toFixed(1)}π
                              </span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <span className="w-10 text-xs font-mono text-muted-foreground text-right shrink-0">
                c{q}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-3 text-xs">
        {Object.entries(gateColors).map(([gate, colors]) => (
          <div key={gate} className="flex items-center gap-1.5">
            <div className={`h-4 w-6 rounded border ${colors.border} ${colors.bg} flex items-center justify-center`}>
              <span className={`text-[8px] font-bold ${colors.text}`}>{gate === "CNOT" ? "⊕" : gate}</span>
            </div>
            <span className="text-muted-foreground">
              {gate === "H" ? "Hadamard" : gate === "CNOT" ? "Entangle" : gate === "M" ? "Measure" : gate}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        ZZFeatureMap angle encoding → RealAmplitudes ansatz → COBYLA optimizer · AerSimulator backend
      </p>
    </div>
  );
}
