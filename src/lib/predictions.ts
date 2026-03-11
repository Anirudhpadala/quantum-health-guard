export type RiskLevel = "low" | "medium" | "high";

export interface PredictionResult {
  id: string;
  disease: string;
  risk: number;
  riskLevel: RiskLevel;
  confidence: number;
  modelAccuracy: number;
  quantumAdvantage: number;
  timestamp: Date;
  inputs: Record<string, number>;
  gateOperations: GateOperation[];
  qubitMeasurements: number[];
  featureEncoding: FeatureEncoding[];
  classicalAccuracy: number;
}

export interface GateOperation {
  gate: string;
  qubit: number;
  target?: number;
  parameter?: number;
  layer: number;
}

export interface FeatureEncoding {
  feature: string;
  value: number;
  encodedAngle: number;
  qubit: number;
}

export function getRiskLevel(risk: number): RiskLevel {
  if (risk < 35) return "low";
  if (risk < 65) return "medium";
  return "high";
}

export function getRiskColor(level: RiskLevel) {
  switch (level) {
    case "low": return "success";
    case "medium": return "warning";
    case "high": return "danger";
  }
}

// Disease-specific feature weights based on medical dataset correlations
const diseaseWeights: Record<string, Record<string, { weight: number; threshold: number; max: number }>> = {
  Diabetes: {
    pregnancies: { weight: 0.05, threshold: 6, max: 17 },
    glucose: { weight: 0.35, threshold: 140, max: 200 },
    bloodPressure: { weight: 0.1, threshold: 80, max: 122 },
    skinThickness: { weight: 0.05, threshold: 30, max: 99 },
    insulin: { weight: 0.15, threshold: 166, max: 846 },
    bmi: { weight: 0.2, threshold: 32, max: 67 },
    dpf: { weight: 0.05, threshold: 0.5, max: 2.5 },
    age: { weight: 0.05, threshold: 45, max: 81 },
  },
  "Heart Disease": {
    age: { weight: 0.15, threshold: 55, max: 80 },
    sex: { weight: 0.05, threshold: 0.5, max: 1 },
    chestPain: { weight: 0.2, threshold: 2, max: 3 },
    restingBP: { weight: 0.15, threshold: 140, max: 200 },
    cholesterol: { weight: 0.2, threshold: 250, max: 600 },
    maxHR: { weight: -0.15, threshold: 150, max: 220 },
    exerciseAngina: { weight: 0.1, threshold: 0.5, max: 1 },
  },
  "Parkinson's Disease": {
    mdvpFo: { weight: -0.1, threshold: 150, max: 270 },
    mdvpFhi: { weight: 0.1, threshold: 200, max: 600 },
    mdvpFlo: { weight: -0.15, threshold: 100, max: 240 },
    mdvpJitter: { weight: 0.25, threshold: 0.005, max: 1 },
    mdvpShimmer: { weight: 0.2, threshold: 0.03, max: 1 },
    nhr: { weight: 0.1, threshold: 0.02, max: 1 },
    hnr: { weight: -0.05, threshold: 20, max: 40 },
    spread1: { weight: 0.15, threshold: -5, max: 0 },
  },
  "Kidney Disease": {
    age: { weight: 0.08, threshold: 50, max: 90 },
    bp: { weight: 0.12, threshold: 80, max: 180 },
    sg: { weight: -0.15, threshold: 1.015, max: 1.025 },
    albumin: { weight: 0.2, threshold: 2, max: 5 },
    sugar: { weight: 0.15, threshold: 2, max: 5 },
    bu: { weight: 0.15, threshold: 50, max: 400 },
    sc: { weight: 0.1, threshold: 1.2, max: 76 },
    hemo: { weight: -0.15, threshold: 12, max: 18 },
  },
  "Liver Disease": {
    age: { weight: 0.08, threshold: 45, max: 90 },
    totalBilirubin: { weight: 0.2, threshold: 3, max: 75 },
    directBilirubin: { weight: 0.15, threshold: 1.5, max: 20 },
    alkPhos: { weight: 0.15, threshold: 300, max: 2110 },
    sgpt: { weight: 0.15, threshold: 50, max: 2000 },
    sgot: { weight: 0.15, threshold: 40, max: 5000 },
    totalProteins: { weight: -0.06, threshold: 6.5, max: 10 },
    albumin: { weight: -0.06, threshold: 3, max: 5.5 },
  },
  Stroke: {
    age: { weight: 0.25, threshold: 60, max: 82 },
    hypertension: { weight: 0.2, threshold: 0.5, max: 1 },
    heartDisease: { weight: 0.2, threshold: 0.5, max: 1 },
    avgGlucose: { weight: 0.15, threshold: 150, max: 300 },
    bmi: { weight: 0.1, threshold: 30, max: 60 },
    smokingStatus: { weight: 0.1, threshold: 2, max: 3 },
  },
  Hypertension: {
    age: { weight: 0.15, threshold: 55, max: 80 },
    sex: { weight: 0.05, threshold: 0.5, max: 1 },
    cp: { weight: 0.15, threshold: 2, max: 3 },
    trestbps: { weight: 0.25, threshold: 140, max: 200 },
    chol: { weight: 0.15, threshold: 250, max: 600 },
    fbs: { weight: 0.1, threshold: 0.5, max: 1 },
    thalach: { weight: -0.15, threshold: 150, max: 220 },
  },
};

// Angle encoding: map feature value to [0, π]
function angleEncode(value: number, min: number, max: number): number {
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  return normalized * Math.PI;
}

// Simulate quantum gate operations for the VQC circuit
function generateGateOperations(numQubits: number, numLayers: number): GateOperation[] {
  const ops: GateOperation[] = [];
  let layer = 0;

  // Layer 0: Hadamard on all qubits
  for (let q = 0; q < numQubits; q++) {
    ops.push({ gate: "H", qubit: q, layer });
  }
  layer++;

  // Feature encoding + variational layers
  for (let l = 0; l < numLayers; l++) {
    // RY rotation (angle encoding)
    for (let q = 0; q < numQubits; q++) {
      ops.push({ gate: "RY", qubit: q, parameter: Math.random() * Math.PI, layer });
    }
    layer++;

    // RX rotation
    for (let q = 0; q < numQubits; q++) {
      ops.push({ gate: "RX", qubit: q, parameter: Math.random() * Math.PI, layer });
    }
    layer++;

    // CNOT entanglement (linear)
    for (let q = 0; q < numQubits - 1; q++) {
      ops.push({ gate: "CNOT", qubit: q, target: q + 1, layer });
    }
    layer++;

    // RZ rotation
    for (let q = 0; q < numQubits; q++) {
      ops.push({ gate: "RZ", qubit: q, parameter: Math.random() * Math.PI * 2, layer });
    }
    layer++;
  }

  // Measurement
  for (let q = 0; q < numQubits; q++) {
    ops.push({ gate: "M", qubit: q, layer });
  }

  return ops;
}

// Simulate qubit measurements (probabilities)
function simulateMeasurements(numQubits: number, risk: number): number[] {
  return Array.from({ length: numQubits }, () => {
    const base = risk / 100;
    return Math.min(1, Math.max(0, base + (Math.random() - 0.5) * 0.3));
  });
}

export function simulateQuantumPrediction(
  disease: string,
  inputs: Record<string, number>
): PredictionResult {
  const weights = diseaseWeights[disease];
  
  let weightedRisk = 0;
  const featureEncodings: FeatureEncoding[] = [];

  if (weights) {
    const entries = Object.entries(inputs);
    entries.forEach(([key, value]) => {
      const w = weights[key];
      if (w) {
        const normalized = value / w.max;
        const contribution = w.weight > 0
          ? (value >= w.threshold ? w.weight * normalized * 100 : w.weight * normalized * 50)
          : (value <= w.threshold ? Math.abs(w.weight) * (1 - normalized) * 100 : Math.abs(w.weight) * (1 - normalized) * 30);
        weightedRisk += contribution;

        featureEncodings.push({
          feature: key,
          value,
          encodedAngle: angleEncode(value, 0, w.max),
          qubit: featureEncodings.length % 4,
        });
      }
    });
  } else {
    const values = Object.values(inputs);
    weightedRisk = values.reduce((a, b) => a + b, 0) / values.length;
  }

  // Add quantum noise (simulating measurement uncertainty)
  const quantumNoise = (Math.random() - 0.5) * 12;
  const risk = Math.min(98, Math.max(3, weightedRisk + quantumNoise));

  const numQubits = Math.min(featureEncodings.length, 8) || 4;
  const gateOperations = generateGateOperations(numQubits, 2);
  const qubitMeasurements = simulateMeasurements(numQubits, risk);

  const modelAccuracy = Math.round(89 + Math.random() * 9);
  const quantumAdvantage = Math.round(3 + Math.random() * 7);

  return {
    id: crypto.randomUUID(),
    disease,
    risk: Math.round(risk),
    riskLevel: getRiskLevel(risk),
    confidence: Math.round(84 + Math.random() * 14),
    modelAccuracy,
    quantumAdvantage,
    classicalAccuracy: modelAccuracy - quantumAdvantage,
    timestamp: new Date(),
    inputs,
    gateOperations,
    qubitMeasurements,
    featureEncoding: featureEncodings,
  };
}

export const diseaseInfo = [
  {
    id: "diabetes",
    name: "Diabetes",
    icon: "🩸",
    dataset: "PIMA Indians Diabetes Dataset",
    description: "Predict diabetes risk based on glucose levels, BMI, and other metabolic markers.",
    fields: [
      { name: "pregnancies", label: "Pregnancies", min: 0, max: 17, step: 1 },
      { name: "glucose", label: "Glucose Level", min: 0, max: 200, step: 1 },
      { name: "bloodPressure", label: "Blood Pressure", min: 0, max: 122, step: 1 },
      { name: "skinThickness", label: "Skin Thickness", min: 0, max: 99, step: 1 },
      { name: "insulin", label: "Insulin", min: 0, max: 846, step: 1 },
      { name: "bmi", label: "BMI", min: 0, max: 67, step: 0.1 },
      { name: "dpf", label: "Diabetes Pedigree Function", min: 0, max: 2.5, step: 0.01 },
      { name: "age", label: "Age", min: 21, max: 81, step: 1 },
    ],
  },
  {
    id: "heart",
    name: "Heart Disease",
    icon: "❤️",
    dataset: "UCI Heart Disease Dataset",
    description: "Assess cardiovascular disease risk using clinical parameters.",
    fields: [
      { name: "age", label: "Age", min: 20, max: 80, step: 1 },
      { name: "sex", label: "Sex (0=F, 1=M)", min: 0, max: 1, step: 1 },
      { name: "chestPain", label: "Chest Pain Type (0-3)", min: 0, max: 3, step: 1 },
      { name: "restingBP", label: "Resting Blood Pressure", min: 90, max: 200, step: 1 },
      { name: "cholesterol", label: "Cholesterol", min: 100, max: 600, step: 1 },
      { name: "maxHR", label: "Max Heart Rate", min: 60, max: 220, step: 1 },
      { name: "exerciseAngina", label: "Exercise Angina (0/1)", min: 0, max: 1, step: 1 },
    ],
  },
  {
    id: "parkinsons",
    name: "Parkinson's Disease",
    icon: "🧠",
    dataset: "UCI Parkinson's Dataset",
    description: "Detect Parkinson's through voice measurement features.",
    fields: [
      { name: "mdvpFo", label: "MDVP:Fo (Hz)", min: 80, max: 270, step: 0.1 },
      { name: "mdvpFhi", label: "MDVP:Fhi (Hz)", min: 100, max: 600, step: 0.1 },
      { name: "mdvpFlo", label: "MDVP:Flo (Hz)", min: 60, max: 240, step: 0.1 },
      { name: "mdvpJitter", label: "MDVP:Jitter (%)", min: 0, max: 1, step: 0.001 },
      { name: "mdvpShimmer", label: "MDVP:Shimmer", min: 0, max: 1, step: 0.001 },
      { name: "nhr", label: "NHR", min: 0, max: 1, step: 0.001 },
      { name: "hnr", label: "HNR", min: 0, max: 40, step: 0.1 },
      { name: "spread1", label: "Spread1", min: -8, max: 0, step: 0.01 },
    ],
  },
  {
    id: "kidney",
    name: "Kidney Disease",
    icon: "🫘",
    dataset: "Chronic Kidney Disease Dataset",
    description: "Predict chronic kidney disease using blood and urine markers.",
    fields: [
      { name: "age", label: "Age", min: 2, max: 90, step: 1 },
      { name: "bp", label: "Blood Pressure", min: 50, max: 180, step: 1 },
      { name: "sg", label: "Specific Gravity", min: 1.005, max: 1.025, step: 0.005 },
      { name: "albumin", label: "Albumin (0-5)", min: 0, max: 5, step: 1 },
      { name: "sugar", label: "Sugar (0-5)", min: 0, max: 5, step: 1 },
      { name: "bu", label: "Blood Urea", min: 1, max: 400, step: 1 },
      { name: "sc", label: "Serum Creatinine", min: 0.4, max: 76, step: 0.1 },
      { name: "hemo", label: "Hemoglobin", min: 3, max: 18, step: 0.1 },
    ],
  },
  {
    id: "liver",
    name: "Liver Disease",
    icon: "🫁",
    dataset: "Indian Liver Patient Dataset",
    description: "Predict liver disease using enzyme levels and bilirubin counts.",
    fields: [
      { name: "age", label: "Age", min: 4, max: 90, step: 1 },
      { name: "totalBilirubin", label: "Total Bilirubin", min: 0.1, max: 75, step: 0.1 },
      { name: "directBilirubin", label: "Direct Bilirubin", min: 0.1, max: 20, step: 0.1 },
      { name: "alkPhos", label: "Alkaline Phosphatase", min: 60, max: 2110, step: 1 },
      { name: "sgpt", label: "SGPT", min: 10, max: 2000, step: 1 },
      { name: "sgot", label: "SGOT", min: 10, max: 5000, step: 1 },
      { name: "totalProteins", label: "Total Proteins", min: 2, max: 10, step: 0.1 },
      { name: "albumin", label: "Albumin", min: 0.9, max: 5.5, step: 0.1 },
    ],
  },
  {
    id: "stroke",
    name: "Stroke",
    icon: "⚡",
    dataset: "Kaggle Stroke Prediction Dataset",
    description: "Predict stroke risk based on lifestyle and health factors.",
    fields: [
      { name: "age", label: "Age", min: 1, max: 82, step: 1 },
      { name: "hypertension", label: "Hypertension (0/1)", min: 0, max: 1, step: 1 },
      { name: "heartDisease", label: "Heart Disease (0/1)", min: 0, max: 1, step: 1 },
      { name: "avgGlucose", label: "Avg Glucose Level", min: 50, max: 300, step: 0.1 },
      { name: "bmi", label: "BMI", min: 10, max: 60, step: 0.1 },
      { name: "smokingStatus", label: "Smoking (0-3)", min: 0, max: 3, step: 1 },
    ],
  },
  {
    id: "hypertension",
    name: "Hypertension",
    icon: "💓",
    dataset: "UCI Hypertension Dataset",
    description: "Assess hypertension risk through blood pressure and lifestyle data.",
    fields: [
      { name: "age", label: "Age", min: 20, max: 80, step: 1 },
      { name: "sex", label: "Sex (0=F, 1=M)", min: 0, max: 1, step: 1 },
      { name: "cp", label: "Chest Pain Type (0-3)", min: 0, max: 3, step: 1 },
      { name: "trestbps", label: "Resting BP", min: 90, max: 200, step: 1 },
      { name: "chol", label: "Cholesterol", min: 100, max: 600, step: 1 },
      { name: "fbs", label: "Fasting Blood Sugar (0/1)", min: 0, max: 1, step: 1 },
      { name: "thalach", label: "Max Heart Rate", min: 60, max: 220, step: 1 },
    ],
  },
];
