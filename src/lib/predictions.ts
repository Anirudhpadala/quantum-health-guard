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

// Simulated quantum ML prediction
export function simulateQuantumPrediction(
  disease: string,
  inputs: Record<string, number>
): PredictionResult {
  const values = Object.values(inputs);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const normalized = Math.min(100, Math.max(0, avg));
  
  // Add some quantum-like randomness
  const quantumNoise = (Math.random() - 0.5) * 20;
  const risk = Math.min(100, Math.max(5, normalized + quantumNoise));
  
  return {
    id: crypto.randomUUID(),
    disease,
    risk: Math.round(risk),
    riskLevel: getRiskLevel(risk),
    confidence: Math.round(85 + Math.random() * 12),
    modelAccuracy: Math.round(90 + Math.random() * 8),
    quantumAdvantage: Math.round(3 + Math.random() * 7),
    timestamp: new Date(),
    inputs,
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
