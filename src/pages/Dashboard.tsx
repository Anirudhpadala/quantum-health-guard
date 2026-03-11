import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Shield, BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell,
} from "recharts";
import type { PredictionResult } from "@/lib/predictions";

const COLORS = [
  "hsl(174,72%,40%)",
  "hsl(220,60%,50%)",
  "hsl(265,60%,55%)",
  "hsl(38,92%,50%)",
  "hsl(0,72%,51%)",
  "hsl(152,60%,42%)",
  "hsl(340,65%,47%)",
];

// Demo data for dashboard
const makeDemoResult = (id: string, disease: string, risk: number, riskLevel: "low" | "medium" | "high", confidence: number, modelAccuracy: number, quantumAdvantage: number): PredictionResult => ({
  id, disease, risk, riskLevel, confidence, modelAccuracy, quantumAdvantage,
  classicalAccuracy: modelAccuracy - quantumAdvantage,
  timestamp: new Date(), inputs: {},
  gateOperations: [], qubitMeasurements: [], featureEncoding: [],
});

const demoHistory: PredictionResult[] = [
  makeDemoResult("1", "Diabetes", 32, "low", 94, 95, 5),
  makeDemoResult("2", "Heart Disease", 58, "medium", 91, 93, 6),
  makeDemoResult("3", "Parkinson's", 15, "low", 96, 97, 4),
  makeDemoResult("4", "Kidney Disease", 72, "high", 89, 92, 7),
  makeDemoResult("5", "Liver Disease", 44, "medium", 90, 91, 5),
  makeDemoResult("6", "Stroke", 22, "low", 93, 94, 6),
  makeDemoResult("7", "Hypertension", 61, "medium", 92, 95, 4),
];

export default function Dashboard() {
  const [history] = useState<PredictionResult[]>(demoHistory);

  const avgRisk = Math.round(history.reduce((a, h) => a + h.risk, 0) / history.length);
  const avgAccuracy = Math.round(history.reduce((a, h) => a + h.modelAccuracy, 0) / history.length);
  const overallScore = Math.round(100 - avgRisk);

  const riskData = history.map((h) => ({ name: h.disease.split(" ")[0], risk: h.risk, accuracy: h.modelAccuracy }));
  const radarData = history.map((h) => ({ subject: h.disease.split(" ")[0], risk: h.risk, fullMark: 100 }));
  const pieData = [
    { name: "Low", value: history.filter((h) => h.riskLevel === "low").length },
    { name: "Medium", value: history.filter((h) => h.riskLevel === "medium").length },
    { name: "High", value: history.filter((h) => h.riskLevel === "high").length },
  ];
  const pieColors = ["hsl(152,60%,42%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)"];

  const stats = [
    { icon: Activity, label: "Health Score", value: `${overallScore}/100`, color: "text-primary" },
    { icon: TrendingUp, label: "Avg Risk", value: `${avgRisk}%`, color: "text-warning" },
    { icon: Shield, label: "Model Accuracy", value: `${avgAccuracy}%`, color: "text-success" },
    { icon: BarChart3, label: "Assessments", value: history.length.toString(), color: "text-secondary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-bold mb-2">
            Health <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">Overview of your quantum ML prediction results.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <div className="gradient-primary rounded-lg p-2">
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Risk by Disease</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,15%,89%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="risk" fill="hsl(174,72%,40%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Risk Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(210,15%,89%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Risk" dataKey="risk" stroke="hsl(174,72%,40%)" fill="hsl(174,72%,40%)" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Prediction History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Disease</th>
                    <th className="pb-3 font-medium">Risk</th>
                    <th className="pb-3 font-medium">Level</th>
                    <th className="pb-3 font-medium">Confidence</th>
                    <th className="pb-3 font-medium">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} className="border-b border-border/50">
                      <td className="py-3 font-medium">{h.disease}</td>
                      <td className="py-3">{h.risk}%</td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          h.riskLevel === "low"
                            ? "bg-success/10 text-success"
                            : h.riskLevel === "medium"
                            ? "bg-warning/10 text-warning"
                            : "bg-danger/10 text-danger"
                        }`}>
                          {h.riskLevel}
                        </span>
                      </td>
                      <td className="py-3">{h.confidence}%</td>
                      <td className="py-3">{h.modelAccuracy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
