import { useState } from "react";
import Navbar from "@/components/Navbar";
import PredictionForm from "@/components/PredictionForm";
import { diseaseInfo, type PredictionResult } from "@/lib/predictions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function Assessment() {
  const [history, setHistory] = useState<PredictionResult[]>([]);

  const handleResult = (r: PredictionResult) => {
    setHistory((prev) => [r, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-bold mb-2">
            Health <span className="text-gradient">Assessment</span>
          </h1>
          <p className="text-muted-foreground">Select a disease tab and enter your health parameters.</p>
        </motion.div>

        <Tabs defaultValue="diabetes" className="mx-auto max-w-3xl">
          <TabsList className="mb-6 flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
            {diseaseInfo.map((d) => (
              <TabsTrigger
                key={d.id}
                value={d.id}
                className="text-xs sm:text-sm data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground"
              >
                <span className="mr-1">{d.icon}</span> {d.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {diseaseInfo.map((d) => (
            <TabsContent key={d.id} value={d.id}>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span className="text-2xl">{d.icon}</span> {d.name} Prediction
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">{d.description}</p>
                  <p className="text-xs text-primary/70 mt-1">Dataset: {d.dataset}</p>
                </div>
                <PredictionForm disease={d} onResult={handleResult} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
