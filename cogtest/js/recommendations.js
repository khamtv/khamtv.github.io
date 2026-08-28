/**
 * Recommendations engine — maps elevated factors to evidence-based interventions
 */
(function() {
  const App = window.DementiaApp;

  App.RECOMMENDATIONS = {
    physical_inactivity: {
      title: "Increase Physical Activity",
      action: "Aim for at least 150 minutes of moderate activity per week — walking, swimming, gardening, or any movement you enjoy.",
      evidence: "Established Tier 1 factor with strong evidence base across multiple large studies.",
      tier: 1, icon: "🏃"
    },
    smoking: {
      title: "Quit Smoking",
      action: "Talk to your doctor about smoking cessation support. Even stopping later in life reduces risk.",
      evidence: "Established Tier 1 factor — current smokers have ~30% higher risk vs non-smokers.",
      tier: 1, icon: "🚭"
    },
    alcohol: {
      title: "Reduce Alcohol Intake",
      action: "Consider reducing to moderate levels (no more than 12 standard drinks per week).",
      evidence: "Excessive alcohol (>168g/week) is an established risk factor.",
      tier: 1, icon: "🍷"
    },
    social_isolation: {
      title: "Build Social Connections",
      action: "Try to meet friends or family regularly, join a local group, volunteer, or attend community events.",
      evidence: "Established Tier 1 factor — social isolation associated with ~60% higher risk.",
      tier: 1, icon: "👥"
    },
    hearing_loss: {
      title: "Get a Hearing Check",
      action: "Schedule a hearing test. If hearing loss is confirmed, hearing aids can help — and may reduce dementia risk.",
      evidence: "Established Tier 1 factor — one of the most actionable, high-confidence items in the evidence.",
      tier: 1, icon: "👂"
    },
    depression: {
      title: "Seek Mental Health Support",
      action: "If you're experiencing depression, talk to your GP or a mental health professional. Treatment matters.",
      evidence: "Established Tier 1 factor with the highest single Tier-1 RR (2.2). Professional support is recommended.",
      tier: 1, icon: "💚", routeToSupport: true
    },
    sleep: {
      title: "Improve Sleep Habits",
      action: "Practice good sleep hygiene: consistent bedtime, limit screens before bed, keep your room cool and dark. See a doctor if problems persist.",
      evidence: "Established Tier 1 factor — sleep problems associated with ~30% higher risk.",
      tier: 1, icon: "😴"
    },
    vision_loss: {
      title: "Get Your Eyes Checked",
      action: "Schedule an eye exam. Corrective lenses, cataract surgery, or other treatments may help.",
      evidence: "Established Tier 1 factor — untreated vision loss associated with ~50% higher risk.",
      tier: 1, icon: "👁️"
    },
    hypertension: {
      title: "Manage Blood Pressure",
      action: "Work with your doctor to monitor and manage your blood pressure through medication, diet, and exercise.",
      evidence: "Established Tier 1 factor — particularly important in midlife.",
      tier: 1, icon: "❤️"
    },
    diabetes: {
      title: "Manage Diabetes",
      action: "Work with your healthcare team to keep blood sugar well-controlled. Regular monitoring is key.",
      evidence: "Established Tier 1 factor — type 2 diabetes associated with ~70% higher risk.",
      tier: 1, icon: "💉"
    },
    obesity: {
      title: "Work Toward a Healthy Weight",
      action: "Small, sustainable changes in diet and activity can help. Talk to your doctor about a plan that works for you.",
      evidence: "Established Tier 1 factor — particularly relevant in midlife.",
      tier: 1, icon: "⚖️"
    },
    mediterranean_diet: {
      title: "Improve Diet Quality",
      action: "Try incorporating more fruits, vegetables, olive oil, fish, and whole grains into your meals.",
      evidence: "Mediterranean diet adherence is associated with better cognitive outcomes.",
      tier: 1, icon: "🥗"
    },
    cognitive_training: {
      title: "Challenge Your Brain",
      action: "Try puzzles, learn a new language or skill, take a class, or use brain-training apps regularly.",
      evidence: "Established factor — regular cognitive engagement appears protective.",
      tier: 1, icon: "🧩"
    },
    ldl_cholesterol: {
      title: "Check Your Cholesterol",
      action: "Talk to your doctor about your LDL levels. Diet changes and medication can help if needed.",
      evidence: "Established Tier 1 factor — high LDL (>3 mmol/L) associated with ~30% higher risk.",
      tier: 1, icon: "🩸"
    },
    // Tier 2 recommendations
    low_fruit: {
      title: "Eat More Fruit",
      action: "Aim for at least 2 servings of fruit daily. RCT evidence shows 16-week fruit supplementation improved cognitive test scores.",
      evidence: "Emerging evidence with RCT support for cognitive benefit.",
      tier: 2, icon: "🍎"
    },
    low_vegetable: {
      title: "Eat More Vegetables",
      action: "Aim for at least 3 servings of vegetables daily. Variety and color are good guides.",
      evidence: "Meta-analytic evidence: each ~77g/day associated with 25% lower risk.",
      tier: 2, icon: "🥦"
    },
    ultra_processed: {
      title: "Reduce Ultra-Processed Foods",
      action: "Try swapping packaged snacks, ready meals, and soft drinks for whole-food alternatives.",
      evidence: "Emerging evidence with meta-analytic support. Worth reducing, though not proven causal.",
      tier: 2, icon: "🚫"
    },
    no_hobbies: {
      title: "Pick Up a Hobby",
      action: "Any regular leisure activity helps — gardening, crafts, reading groups, sports, music, or games.",
      evidence: "Multiple large cohort studies; arts/theatre RCTs also improved cognitive test scores.",
      tier: 2, icon: "🎨"
    },
    no_instrument: {
      title: "Try Making Music",
      action: "Learning an instrument at any age may be beneficial. Even casual playing counts.",
      evidence: "Twin study + meta-analytic support: up to 65% lower risk in musicians.",
      tier: 2, icon: "🎵"
    },
    low_purpose: {
      title: "Explore Purpose & Meaning",
      action: "Volunteering, mentoring, setting meaningful goals, or journaling about values can strengthen sense of purpose.",
      evidence: "Meta-analytic association: 18–20% lower risk with higher purpose in life.",
      tier: 2, icon: "🌟"
    },
    chronic_stress: {
      title: "Address Chronic Stress",
      action: "Consider meditation, mindfulness programs, or counseling. Even 2x/week practice shows cognitive benefits in RCTs.",
      evidence: "RCTs show meditation lowers inflammatory markers and improves cognitive performance.",
      tier: 2, icon: "🧘"
    },
    hopelessness: {
      title: "Reach Out for Support",
      action: "Feelings of hopelessness are important to address. Please talk to someone you trust or contact a helpline.",
      evidence: "Associated with higher risk, but more importantly — you deserve support right now.",
      tier: 2, icon: "💜", routeToSupport: true
    },
    ssb: {
      title: "Reduce Sugary Drinks",
      action: "Try replacing sugar-sweetened beverages with water, tea, or sparkling water.",
      evidence: "Emerging evidence from long-term (20-year) analysis.",
      tier: 2, icon: "🥤"
    },
    shift_work: {
      title: "Manage Shift Work Impact",
      action: "If possible, prioritize sleep quality, use blackout curtains, and maintain consistent meal times.",
      evidence: "Night/shift work associated with significantly higher risk. Mitigate where possible.",
      tier: 2, icon: "🌙"
    }
  };

  // Multi-domain intervention note
  App.MULTI_DOMAIN_NOTE = "Research note: Multi-domain interventions (combining diet, exercise, cognitive training, and social activity) showed only a small effect on cognitive test scores in the rigorous Cochrane review, and no evidence yet of reduced dementia incidence. These recommendations are based on the best available evidence, but we want to be honest — lifestyle changes are worthwhile for many reasons, and every small step counts, but we should set realistic expectations.";

  // Support resources
  App.SUPPORT_RESOURCES = {
    title: "Support & Resources",
    items: [
      { label: "Lifeline Australia", value: "13 11 14", type: "phone" },
      { label: "Beyond Blue", value: "1300 22 4636", type: "phone" },
      { label: "WHO Dementia Fact Sheet", value: "https://www.who.int/news-room/fact-sheets/detail/dementia", type: "link" },
      { label: "Dementia Australia", value: "https://www.dementia.org.au", type: "link" },
      { label: "Alzheimer's Disease International", value: "https://www.alzint.org", type: "link" }
    ]
  };

  App.getRecommendations = function(scoreResult) {
    const recs = [];
    const seen = new Set();

    // Get top modifiable risks → recommendations
    scoreResult.modifiableRisks.forEach(risk => {
      if (seen.has(risk.id)) return;
      const rec = App.RECOMMENDATIONS[risk.id];
      if (rec) {
        recs.push({ ...rec, factorId: risk.id, impact: Math.abs(risk.weightedLogRR) });
        seen.add(risk.id);
      }
    });

    // Sort by impact, take top 5
    recs.sort((a, b) => b.impact - a.impact);
    return recs.slice(0, 5);
  };
})();
