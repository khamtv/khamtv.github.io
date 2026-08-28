/**
 * Scoring Engine — computes composite risk from user responses
 * Uses config version: reads from window.DementiaApp config
 */
(function() {
  const App = window.DementiaApp;

  /**
   * Evaluate a single Tier 1 factor and return its RR
   */
  function evaluateTier1Factor(factorId, answers) {
    const demo = answers.demographics || {};
    const t1 = answers.tier1 || {};
    const cfg = App.TIER1_FACTORS[factorId];
    if (!cfg) return 1.0;

    switch (factorId) {
      case 'education':
        if (t1.education_years == null) return 1.0;
        return t1.education_years < 12 ? cfg.rr : 1.0;

      case 'hearing_loss':
        if (!t1.hearing_loss_level || t1.hearing_loss_level === 'none') return 1.0;
        if (t1.uses_hearing_aid) return 1.0; // treated
        return cfg.severityMap[t1.hearing_loss_level] || 1.0;

      case 'hypertension':
        return t1.diagnosed_hypertension ? cfg.rr : 1.0;

      case 'obesity':
        return t1.bmi_category === 'obese' ? cfg.rr : 1.0;

      case 'smoking':
        return t1.smoking_status === 'current' ? cfg.rr : 1.0;

      case 'alcohol': {
        // Convert drinks to grams: ~14g per standard drink
        const gPerWeek = (t1.alcohol_drinks_per_week || 0) * 14;
        return gPerWeek > 168 ? cfg.rr : 1.0;
      }

      case 'physical_inactivity':
        if (t1.physical_activity_min == null) return 1.0;
        return t1.physical_activity_min < 150 ? cfg.rr : 1.0;

      case 'diabetes':
        return t1.diabetes_status === 'type2' ? cfg.rr : 1.0;

      case 'ldl_cholesterol':
        if (t1.ldl_mmol_l == null) return 1.0;
        return t1.ldl_mmol_l > 3.0 ? cfg.rr : 1.0;

      case 'vision_loss':
        return (t1.vision_condition && !t1.vision_treated) ? cfg.rr : 1.0;

      case 'depression':
        return t1.depression_ever ? cfg.rr : 1.0;

      case 'tbi':
        return t1.tbi_history ? cfg.rr : 1.0;

      case 'social_isolation': {
        const isoScore = (t1.lives_alone ? 1 : 0) +
                         (t1.contact_lt_monthly ? 1 : 0) +
                         (!t1.weekly_group_activity ? 1 : 0);
        return isoScore >= 2 ? cfg.rr : (isoScore === 1 ? 1.0 + (cfg.rr - 1.0) * 0.5 : 1.0);
      }

      case 'air_pollution':
        if (!t1.air_pollution_proxy || t1.air_pollution_proxy === 'low') return 1.0;
        return t1.air_pollution_proxy === 'high' ? cfg.rr : 1.0 + (cfg.rr - 1.0) * 0.5;

      case 'sleep': {
        const sleepIssues = [t1.insomnia, t1.fragmented_sleep, t1.daytime_dysfunction].filter(Boolean).length;
        return sleepIssues > 0 ? cfg.rr : 1.0;
      }

      case 'mediterranean_diet':
        if (t1.medas_score == null) return 1.0;
        return t1.medas_score < 7 ? cfg.rr : 1.0;

      case 'cognitive_training':
        return t1.cognitive_engagement === 'none' ? cfg.rr : 1.0;

      default:
        return 1.0;
    }
  }

  /**
   * Evaluate Tier 2 factors
   */
  function evaluateTier2Factors(answers) {
    const results = {};
    const t2f = answers.tier2_financial || {};
    const t2n = answers.tier2_neighbourhood || {};
    const t2w = answers.tier2_workplace || {};
    const t2l = answers.tier2_leisure || {};
    const t2nu = answers.tier2_nutrition || {};
    const t2e = answers.tier2_emotional || {};
    const t2p = answers.tier2_psychiatric || {};

    // Financial
    if (t2f.wealth_tertile === 'low') results.high_wealth = App.TIER2_FACTORS.high_wealth.rr;
    if (t2f.income_bracket === 'low') results.high_income = App.TIER2_FACTORS.high_income.rr;
    if (t2f.wealth_shock) results.wealth_shock = App.TIER2_FACTORS.wealth_shock.rr;
    if (t2f.financial_insecurity != null && t2f.financial_insecurity >= 7)
      results.financial_deprivation = App.TIER2_FACTORS.financial_deprivation.rr;

    // Neighbourhood
    if (t2n.area_deprivation === 'high') results.area_deprivation = App.TIER2_FACTORS.area_deprivation.rr;
    if (t2n.urbanicity === 'dense_urban') results.urbanicity = App.TIER2_FACTORS.urbanicity.rr;
    if (t2n.near_major_road) results.road_proximity = App.TIER2_FACTORS.road_proximity.rr;

    // Greenspace — non-linear lookup
    if (t2n.green_space) {
      const gs = App.LOOKUP_TABLES.greenspace.find(g => g.level === t2n.green_space);
      if (gs) results.low_greenspace = gs.rr;
    }

    // Workplace
    if (t2w.employment_status === 'employed' || t2w.employment_status === 'self_employed') {
      if (t2w.shift_work === 'consistent_nights' || t2w.shift_work === 'rotating')
        results.shift_work = App.TIER2_FACTORS.shift_work.rr;
      if (t2w.job_control === 'low' && t2w.job_demands === 'high')
        results.job_strain = App.TIER2_FACTORS.job_strain.rr;
      if (t2w.cognitive_stimulation === 'low')
        results.low_cognitive_work = App.TIER2_FACTORS.low_cognitive_work.rr;
      if (t2w.pesticide_exposure) results.pesticide_exposure = App.TIER2_FACTORS.pesticide_exposure.rr;
      if (t2w.magnetic_field_exposure) results.magnetic_field = App.TIER2_FACTORS.magnetic_field.rr;
      if (t2w.solvent_exposure) results.solvent_exposure = App.TIER2_FACTORS.solvent_exposure.rr;
    }

    // Leisure
    if (t2l.hobby_count != null && t2l.hobby_count === 0) results.no_hobbies = App.TIER2_FACTORS.no_hobbies.rr;
    if (t2l.plays_instrument) results.no_instrument = App.TIER2_FACTORS.no_instrument.protectiveRR;
    else results.no_instrument = 1.0;
    if (t2l.creative_activities) results.no_crafts = App.TIER2_FACTORS.no_crafts.protectiveRR;
    if (t2l.sings_regularly) results.no_karaoke = App.TIER2_FACTORS.no_karaoke.protectiveRR;

    // Nutrition
    if (t2nu.ultra_processed === 'high') results.ultra_processed = App.TIER2_FACTORS.ultra_processed.rr;
    if (t2nu.processed_meat_g != null && t2nu.processed_meat_g >= 25)
      results.processed_meat = App.TIER2_FACTORS.processed_meat.rr;
    if (t2nu.fruit_servings != null && t2nu.fruit_servings < 2)
      results.low_fruit = App.TIER2_FACTORS.low_fruit.rr;
    if (t2nu.vegetable_servings != null && t2nu.vegetable_servings < 3)
      results.low_vegetable = App.TIER2_FACTORS.low_vegetable.rr;
    if (t2nu.ssb_per_week != null && t2nu.ssb_per_week > 7)
      results.ssb = App.TIER2_FACTORS.ssb.rr;

    // Coffee — non-linear
    if (t2nu.coffee_cups != null) {
      const coffeeEntry = App.LOOKUP_TABLES.coffee.find(
        c => t2nu.coffee_cups >= c.min && t2nu.coffee_cups <= c.max
      );
      if (coffeeEntry) results.coffee = coffeeEntry.rr;
    }

    // Unprocessed red meat (protective — counterintuitive)
    if (t2nu.red_meat_g != null && t2nu.red_meat_g >= 50)
      results.unprocessed_red_meat = App.TIER2_FACTORS.unprocessed_red_meat.protectiveRR;

    // Emotional
    if (t2e.purpose_score != null && t2e.purpose_score <= 3)
      results.low_purpose = App.TIER2_FACTORS.low_purpose.rr;
    if (t2e.life_satisfaction != null && t2e.life_satisfaction <= 3)
      results.low_positive_affect = App.TIER2_FACTORS.low_positive_affect.rr;
    if (t2e.hopelessness_score != null && t2e.hopelessness_score >= 7)
      results.hopelessness = App.TIER2_FACTORS.hopelessness.rr;
    if (t2e.stress_frequency === 'constantly' || t2e.stress_frequency === 'often')
      results.chronic_stress = App.TIER2_FACTORS.chronic_stress.rr;
    if (t2e.meditation === 'weekly_plus' || t2e.meditation === 'long_term')
      results.no_meditation = App.TIER2_FACTORS.no_meditation.protectiveRR;

    // Psychiatric (informational only)
    if (t2p.consented) {
      if (t2p.bipolar) results.bipolar = App.TIER2_FACTORS.bipolar.rr;
      if (t2p.anxiety) results.anxiety = App.TIER2_FACTORS.anxiety.rr;
      if (t2p.ptsd) results.ptsd = App.TIER2_FACTORS.ptsd.rr;
      if (t2p.psychotic) results.psychotic = App.TIER2_FACTORS.psychotic.rr;
    }

    return results;
  }

  /**
   * Main scoring function
   */
  App.computeScore = function(answers) {
    const tier1Results = {};
    const tier2Results = evaluateTier2Factors(answers);

    // Evaluate each Tier 1 factor
    Object.keys(App.TIER1_FACTORS).forEach(fId => {
      const rr = evaluateTier1Factor(fId, answers);
      if (rr !== 1.0) tier1Results[fId] = rr;
    });

    // Compute composite log RR
    let compositeLogRR = 0;
    const contributions = [];

    // Tier 1 contributions (weight = 1.0)
    Object.entries(tier1Results).forEach(([fId, rr]) => {
      const cfg = App.TIER1_FACTORS[fId];
      const weightedLogRR = cfg.weight * Math.log(rr);
      compositeLogRR += weightedLogRR;
      contributions.push({
        id: fId, label: cfg.label, rr, weight: cfg.weight,
        weightedLogRR, tier: 1, modifiable: cfg.modifiable,
        backgroundNote: cfg.backgroundNote, lowConfidence: cfg.lowConfidence
      });
    });

    // Tier 2 contributions (variable weights)
    Object.entries(tier2Results).forEach(([fId, rr]) => {
      const cfg = App.TIER2_FACTORS[fId];
      if (!cfg) return;
      const weightedLogRR = cfg.weight * Math.log(rr);
      compositeLogRR += weightedLogRR;
      contributions.push({
        id: fId, label: cfg.label, rr, weight: cfg.weight,
        weightedLogRR, tier: 2, domain: cfg.domain,
        informationalOnly: cfg.informationalOnly,
        lowConfidence: cfg.lowConfidence, note: cfg.note
      });
    });

    const overallRR = Math.exp(compositeLogRR);

    // Determine band
    const band = App.RISK_BANDS.find(b => overallRR < b.max) || App.RISK_BANDS[App.RISK_BANDS.length - 1];

    // Sort contributions by absolute impact
    contributions.sort((a, b) => Math.abs(b.weightedLogRR) - Math.abs(a.weightedLogRR));

    // Split into risk and protective factors
    const riskFactors = contributions.filter(c => c.weightedLogRR > 0);
    const protectiveFactors = contributions.filter(c => c.weightedLogRR < 0);

    // Separate modifiable from background
    const modifiableRisks = riskFactors.filter(c => c.modifiable !== false && !c.informationalOnly);
    const backgroundRisks = riskFactors.filter(c => c.modifiable === false);
    const informationalRisks = riskFactors.filter(c => c.informationalOnly);

    // Check for psychiatric distress routing
    const t2e = answers.tier2_emotional || {};
    const routeToSupport = (t2e.hopelessness_score != null && t2e.hopelessness_score >= 7) ||
                           (t2e.stress_frequency === 'constantly');

    return {
      configVersion: App.CONFIG_VERSION,
      overallRR,
      compositeLogRR,
      band,
      contributions,
      riskFactors,
      protectiveFactors,
      modifiableRisks,
      backgroundRisks,
      informationalRisks,
      routeToSupport,
      tier1Count: Object.keys(tier1Results).length,
      tier2Count: Object.keys(tier2Results).length,
      totalFactorsEvaluated: Object.keys(App.TIER1_FACTORS).length + Object.keys(App.TIER2_FACTORS).length,
      timestamp: new Date().toISOString()
    };
  };
})();
