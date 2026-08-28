/**
 * Dementia Risk Scoring Configuration
 * Version-controlled independently from application code.
 * Source: Rodriguez et al. (2025) Nature Reviews Psychology + Lancet Commission (2024)
 */
window.DementiaApp = window.DementiaApp || {};

window.DementiaApp.CONFIG_VERSION = "1.0.0";

window.DementiaApp.TIER1_FACTORS = {
  education: {
    id: "education", label: "Low education", category: "background",
    comparison: "Low vs high education", rr: 1.6, ci: [1.3, 2.0], weight: 1.0,
    modifiable: false, backgroundNote: "Background factor — not something to blame yourself for"
  },
  hearing_loss: {
    id: "hearing_loss", label: "Hearing loss (untreated)", category: "sensory",
    comparison: "Per 10dB decrement", rr: 1.4, ci: [1.0, 1.9], weight: 1.0,
    modifiable: true, severityMap: { none: 1.0, mild: 1.2, moderate: 1.4, severe: 1.6 }
  },
  hypertension: {
    id: "hypertension", label: "High blood pressure", category: "cardiovascular",
    comparison: "Hypertension vs no", rr: 1.2, ci: [1.1, 1.4], weight: 1.0, modifiable: true
  },
  obesity: {
    id: "obesity", label: "Obesity (midlife)", category: "cardiovascular",
    comparison: "Obese vs not", rr: 1.3, ci: [1.0, 1.7], weight: 1.0, modifiable: true
  },
  smoking: {
    id: "smoking", label: "Current smoking", category: "lifestyle",
    comparison: "Current vs never/former", rr: 1.3, ci: [1.2, 1.4], weight: 1.0, modifiable: true
  },
  alcohol: {
    id: "alcohol", label: "Excessive alcohol", category: "lifestyle",
    comparison: ">168g ethanol/week", rr: 1.2, ci: [1.0, 1.5], weight: 1.0, modifiable: true
  },
  physical_inactivity: {
    id: "physical_inactivity", label: "Physical inactivity", category: "lifestyle",
    comparison: "Inactive vs active", rr: 1.2, ci: [1.2, 1.3], weight: 1.0, modifiable: true
  },
  diabetes: {
    id: "diabetes", label: "Type 2 diabetes", category: "cardiovascular",
    comparison: "Type 2 vs none", rr: 1.7, ci: [1.6, 1.8], weight: 1.0, modifiable: true
  },
  ldl_cholesterol: {
    id: "ldl_cholesterol", label: "High LDL cholesterol", category: "cardiovascular",
    comparison: ">3 mmol/L vs lower", rr: 1.3, ci: [1.3, 1.4], weight: 1.0, modifiable: true
  },
  vision_loss: {
    id: "vision_loss", label: "Untreated vision loss", category: "sensory",
    comparison: "Untreated vs none/treated", rr: 1.5, ci: [1.4, 1.6], weight: 1.0, modifiable: true
  },
  depression: {
    id: "depression", label: "Depression", category: "mental_health",
    comparison: "Ever diagnosed vs not", rr: 2.2, ci: [1.7, 3.0], weight: 1.0, modifiable: true
  },
  tbi: {
    id: "tbi", label: "Traumatic brain injury", category: "medical_history",
    comparison: "History vs none", rr: 1.7, ci: [1.7, 1.9], weight: 1.0,
    modifiable: false, backgroundNote: "Past event — cannot be changed, but important context"
  },
  social_isolation: {
    id: "social_isolation", label: "Social isolation", category: "social",
    comparison: "Isolated vs socially active", rr: 1.6, ci: [1.3, 1.8], weight: 1.0, modifiable: true
  },
  air_pollution: {
    id: "air_pollution", label: "Air pollution exposure", category: "environment",
    comparison: "Per unit PM2.5 increment", rr: 1.1, ci: [1.1, 1.1], weight: 1.0,
    modifiable: false, backgroundNote: "Environmental factor — limited individual control"
  },
  sleep: {
    id: "sleep", label: "Sleep problems", category: "lifestyle",
    comparison: "Sleep issues vs none", rr: 1.3, ci: [1.2, 1.4], weight: 1.0, modifiable: true
  },
  mediterranean_diet: {
    id: "mediterranean_diet", label: "Poor diet adherence", category: "nutrition",
    comparison: "Non-adherent vs adherent", rr: 1.12, ci: [1.02, 1.24], weight: 1.0, modifiable: true
  },
  cognitive_training: {
    id: "cognitive_training", label: "No cognitive engagement", category: "cognitive",
    comparison: "None vs regular", rr: 1.15, ci: null, weight: 1.0,
    modifiable: true, lowConfidence: true, note: "Placeholder RR — no pooled estimate available"
  }
};

window.DementiaApp.TIER2_FACTORS = {
  // Financial
  high_income: { id: "high_income", domain: "financial", label: "Low income", rr: 1.19, weight: 0.5, note: "Single study" },
  high_wealth: { id: "high_wealth", domain: "financial", label: "Low wealth", rr: 1.72, weight: 0.5, note: "UK sample" },
  wealth_shock: { id: "wealth_shock", domain: "financial", label: "Negative wealth shock", rr: 1.27, weight: 0.5 },
  financial_deprivation: { id: "financial_deprivation", domain: "financial", label: "Socioeconomic deprivation", rr: 1.79, weight: 0.5, note: "Composite index" },
  // Neighbourhood
  area_deprivation: { id: "area_deprivation", domain: "neighbourhood", label: "High area deprivation", rr: 1.17, weight: 0.5 },
  urbanicity: { id: "urbanicity", domain: "neighbourhood", label: "High urbanicity", rr: 1.21, weight: 0.4, note: "Confounded with pollution" },
  road_proximity: { id: "road_proximity", domain: "neighbourhood", label: "Near major road", rr: 1.07, weight: 0.5, note: "Meta-analytic support" },
  low_greenspace: { id: "low_greenspace", domain: "neighbourhood", label: "Low green space", rr: 1.0, weight: 0.4, nonLinear: true },
  // Workplace
  shift_work: { id: "shift_work", domain: "workplace", label: "Night/shift work", rr: 2.03, weight: 0.5 },
  job_strain: { id: "job_strain", domain: "workplace", label: "High job strain", rr: 1.60, weight: 0.4 },
  low_cognitive_work: { id: "low_cognitive_work", domain: "workplace", label: "Low cognitive stimulation at work", rr: 1.15, weight: 0.3, note: "Inconsistent findings — conservative weight" },
  pesticide_exposure: { id: "pesticide_exposure", domain: "workplace", label: "Pesticide exposure", rr: 1.64, weight: 0.4 },
  magnetic_field: { id: "magnetic_field", domain: "workplace", label: "Magnetic field exposure", rr: 1.26, weight: 0.4 },
  solvent_exposure: { id: "solvent_exposure", domain: "workplace", label: "Solvent exposure", rr: 1.30, weight: 0.4 },
  // Leisure
  no_hobbies: { id: "no_hobbies", domain: "leisure", label: "No hobbies", rr: 1.22, weight: 0.5 },
  no_instrument: { id: "no_instrument", domain: "leisure", label: "No musical instrument", rr: 1.0, weight: 0.5, protectiveRR: 0.35, note: "Twin study + meta-analytic" },
  no_crafts: { id: "no_crafts", domain: "leisure", label: "No crafts/art activities", rr: 1.0, weight: 0.5, protectiveRR: 0.75 },
  no_karaoke: { id: "no_karaoke", domain: "leisure", label: "No singing practice", rr: 1.0, weight: 0.4, protectiveRR: 0.83, note: "Single study, culturally specific" },
  // Nutrition
  ultra_processed: { id: "ultra_processed", domain: "nutrition", label: "High ultra-processed food", rr: 1.25, weight: 0.5, note: "Meta-analytic support" },
  processed_meat: { id: "processed_meat", domain: "nutrition", label: "Processed meat intake", rr: 1.44, weight: 0.5, note: "Per 25g/day" },
  low_fruit: { id: "low_fruit", domain: "nutrition", label: "Low fruit intake", rr: 1.20, weight: 0.5, note: "Meta-analytic: 17% lower per 80g/day" },
  low_vegetable: { id: "low_vegetable", domain: "nutrition", label: "Low vegetable intake", rr: 1.33, weight: 0.5, note: "Meta-analytic: 25% lower per 77g/day" },
  ssb: { id: "ssb", domain: "nutrition", label: "Sugar-sweetened beverages", rr: 2.80, weight: 0.4, note: "20-yr analysis; 10-yr found no effect" },
  unprocessed_red_meat: { id: "unprocessed_red_meat", domain: "nutrition", label: "Low red meat intake", rr: 1.0, weight: 0.4, protectiveRR: 0.81, note: "Counterintuitive — low confidence", lowConfidence: true },
  // Emotional
  low_purpose: { id: "low_purpose", domain: "emotional", label: "Low purpose in life", rr: 1.22, weight: 0.5, note: "Meta-analytic" },
  low_positive_affect: { id: "low_positive_affect", domain: "emotional", label: "Low life satisfaction", rr: 1.15, weight: 0.4, note: "Inconsistent across cohorts" },
  hopelessness: { id: "hopelessness", domain: "emotional", label: "Hopelessness", rr: 1.30, weight: 0.4, routeToSupport: true },
  chronic_stress: { id: "chronic_stress", domain: "emotional", label: "Chronic stress", rr: 2.00, weight: 0.35, note: "Wide variance across studies" },
  no_meditation: { id: "no_meditation", domain: "emotional", label: "No meditation practice", rr: 1.0, weight: 0.4, protectiveRR: 0.85, note: "Cognitive performance outcomes, not incidence" },
  // Psychiatric (informational only)
  bipolar: { id: "bipolar", domain: "psychiatric", label: "Bipolar disorder history", rr: 1.50, weight: 0.4, informationalOnly: true },
  anxiety: { id: "anxiety", domain: "psychiatric", label: "Clinical anxiety history", rr: 1.39, weight: 0.4, informationalOnly: true },
  ptsd: { id: "ptsd", domain: "psychiatric", label: "PTSD history", rr: 2.05, weight: 0.35, informationalOnly: true, note: "Wide CI" },
  psychotic: { id: "psychotic", domain: "psychiatric", label: "Psychotic disorder history", rr: 2.35, weight: 0.4, informationalOnly: true }
};

// Non-linear lookup tables
window.DementiaApp.LOOKUP_TABLES = {
  coffee: [
    { min: 0, max: 0, rr: 1.00, label: "No coffee" },
    { min: 0.1, max: 2, rr: 0.95, label: "Light (0.5–2 cups)" },
    { min: 2.1, max: 5, rr: 0.85, label: "Moderate (3–5 cups)" },
    { min: 5.1, max: 99, rr: 0.95, label: "Heavy (6+ cups)" }
  ],
  greenspace: [
    { level: "none", rr: 1.00, label: "No nearby green space" },
    { level: "low", rr: 1.00, label: "Limited green space" },
    { level: "medium", rr: 0.77, label: "Moderate green space" },
    { level: "high", rr: 0.82, label: "Abundant green space (note: may reflect rural confound)" }
  ]
};

// Risk band thresholds
window.DementiaApp.RISK_BANDS = [
  { max: 0.85, key: "below_average", label: "Below Average Risk Profile", color: "#00d4aa",
    description: "Your modifiable lifestyle and health factors are associated with a lower-than-average risk profile. Keep up the good work!" },
  { max: 1.15, key: "average", label: "Average Risk Profile", color: "#60a5fa",
    description: "Your modifiable risk profile is about average. There may be a few areas where small changes could help." },
  { max: 1.50, key: "above_average", label: "Above Average — Several Factors Present", color: "#f4a261",
    description: "Several modifiable factors are present. The good news is that many of these can be addressed with lifestyle changes." },
  { max: Infinity, key: "high", label: "Above Average — Multiple Established Risk Factors", color: "#ef4444",
    description: "Multiple established risk factors are present. Consider discussing these findings with your doctor." }
];

window.DementiaApp.DISCLAIMER = "This tool estimates your relative standing on lifestyle and health factors that have been associated with dementia risk in population studies. It cannot diagnose dementia or mild cognitive impairment, and it is not a substitute for a clinical evaluation. If you have concerns about your memory or thinking, talk to a doctor.";
