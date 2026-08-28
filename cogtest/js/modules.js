/**
 * Questionnaire module definitions — data-driven form generation
 */
window.DementiaApp = window.DementiaApp || {};

window.DementiaApp.MODULES = [
  {
    id: 'demographics', title: 'About You', icon: '👤', tier: null,
    subtitle: 'Basic information to help contextualise your results.',
    groups: [{
      title: 'Demographics', icon: '📋',
      fields: [
        { id: 'age', type: 'number', label: 'How old are you?', min: 18, max: 120, placeholder: 'Age in years', dataPath: 'demographics.age' },
        { id: 'sex', type: 'pills', label: 'What is your sex?', options: [
          { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' },
          { value: 'intersex', label: 'Intersex' }, { value: 'prefer_not_to_say', label: 'Prefer not to say' }
        ], dataPath: 'demographics.sex' }
      ]
    }]
  },
  {
    id: 'core_health', title: 'Core Health Factors', icon: '🏥', tier: 1,
    subtitle: 'Well-established factors from large population studies.',
    badge: 'Tier 1 — Established Evidence',
    groups: [
      {
        title: 'Education & Senses', icon: '🎓',
        fields: [
          { id: 'education_years', type: 'number', label: 'How many years of formal education have you completed?', min: 0, max: 30, placeholder: 'e.g. 12', hint: 'Count from primary/elementary school onwards.', dataPath: 'tier1.education_years' },
          { id: 'hearing_loss_level', type: 'pills', label: 'Do you have difficulty hearing conversations, even with background noise?', options: [
            { value: 'none', label: 'No difficulty' }, { value: 'mild', label: 'Mild' },
            { value: 'moderate', label: 'Moderate' }, { value: 'severe', label: 'Severe' }
          ], dataPath: 'tier1.hearing_loss_level' },
          { id: 'uses_hearing_aid', type: 'checkbox', label: 'Do you use a hearing aid?', dataPath: 'tier1.uses_hearing_aid', showIf: 'hearing_loss_level !== "none"' },
          { id: 'vision_condition', type: 'checkbox', label: 'Have you been told you have a vision condition (cataracts, glaucoma, macular degeneration, etc.)?', dataPath: 'tier1.vision_condition' },
          { id: 'vision_treated', type: 'checkbox', label: 'Is your vision condition being treated?', dataPath: 'tier1.vision_treated', showIf: 'vision_condition' }
        ]
      },
      {
        title: 'Cardiovascular & Metabolic', icon: '❤️',
        fields: [
          { id: 'diagnosed_hypertension', type: 'checkbox', label: 'Has a doctor ever told you that you have high blood pressure?', dataPath: 'tier1.diagnosed_hypertension' },
          { id: 'bmi_category', type: 'pills', label: 'Which best describes your body weight?', options: [
            { value: 'underweight', label: 'Underweight' }, { value: 'normal', label: 'Normal' },
            { value: 'overweight', label: 'Overweight' }, { value: 'obese', label: 'Obese' }
          ], dataPath: 'tier1.bmi_category' },
          { id: 'diabetes_status', type: 'pills', label: 'Has a doctor diagnosed you with diabetes?', options: [
            { value: 'none', label: 'No' }, { value: 'prediabetes', label: 'Pre-diabetes' },
            { value: 'type1', label: 'Type 1' }, { value: 'type2', label: 'Type 2' }
          ], dataPath: 'tier1.diabetes_status' },
          { id: 'ldl_mmol_l', type: 'number', label: 'LDL cholesterol level (mmol/L) — if known', min: 0, max: 15, step: 0.1, placeholder: 'e.g. 3.2', hint: 'Leave blank if unsure. This is often on blood test results.', dataPath: 'tier1.ldl_mmol_l' }
        ]
      },
      {
        title: 'Lifestyle', icon: '🏃',
        fields: [
          { id: 'smoking_status', type: 'pills', label: 'What is your smoking status?', options: [
            { value: 'never', label: 'Never smoked' }, { value: 'former', label: 'Former smoker' },
            { value: 'current', label: 'Current smoker' }
          ], dataPath: 'tier1.smoking_status' },
          { id: 'alcohol_drinks_per_week', type: 'number', label: 'On a typical week, how many standard alcoholic drinks do you have?', min: 0, max: 100, placeholder: 'e.g. 5', hint: 'One standard drink ≈ one beer, one glass of wine, or one shot of spirits.', dataPath: 'tier1.alcohol_drinks_per_week' },
          { id: 'physical_activity_min', type: 'number', label: 'In a typical week, how many minutes of physical activity do you get?', min: 0, max: 2000, placeholder: 'e.g. 150', hint: 'Include walking, sport, exercise, gardening — anything that gets you moving.', dataPath: 'tier1.physical_activity_min' }
        ]
      },
      {
        title: 'Mental Health & History', icon: '🧠',
        fields: [
          { id: 'depression_ever', type: 'checkbox', label: 'Has a doctor ever diagnosed you with depression?', dataPath: 'tier1.depression_ever' },
          { id: 'tbi_history', type: 'checkbox', label: 'Have you ever had a head injury with loss of consciousness?', dataPath: 'tier1.tbi_history' }
        ]
      },
      {
        title: 'Social Connection', icon: '👥',
        fields: [
          { id: 'lives_alone', type: 'checkbox', label: 'Do you live alone?', dataPath: 'tier1.lives_alone' },
          { id: 'contact_lt_monthly', type: 'checkbox', label: 'Do you see or speak with friends/family less than once a month?', dataPath: 'tier1.contact_lt_monthly' },
          { id: 'weekly_group_activity', type: 'checkbox', label: 'Do you take part in any weekly group activity (clubs, classes, religious services, volunteering)?', dataPath: 'tier1.weekly_group_activity' }
        ]
      },
      {
        title: 'Sleep', icon: '😴',
        fields: [
          { id: 'insomnia', type: 'checkbox', label: 'Do you regularly have trouble falling or staying asleep?', dataPath: 'tier1.insomnia' },
          { id: 'fragmented_sleep', type: 'checkbox', label: 'Do you frequently wake up during the night?', dataPath: 'tier1.fragmented_sleep' },
          { id: 'daytime_dysfunction', type: 'checkbox', label: 'Do you often feel excessively sleepy during the day?', dataPath: 'tier1.daytime_dysfunction' }
        ]
      },
      {
        title: 'Diet & Cognitive Activity', icon: '🥗',
        fields: [
          { id: 'medas_score', type: 'range', label: 'How closely does your diet follow a Mediterranean pattern?', min: 0, max: 14, value: 7, minLabel: 'Not at all (0)', maxLabel: 'Very closely (14)', hint: 'Mediterranean diet: rich in vegetables, fruits, olive oil, fish, legumes, nuts; low in processed foods and red meat.', dataPath: 'tier1.medas_score' },
          { id: 'cognitive_engagement', type: 'pills', label: 'Do you regularly do activities that challenge your memory or thinking?', options: [
            { value: 'none', label: 'Rarely/never' }, { value: 'occasional', label: 'Occasionally' },
            { value: 'regular', label: 'Regularly' }
          ], hint: 'E.g. puzzles, learning a language, brain-training apps, taking courses.', dataPath: 'tier1.cognitive_engagement' },
          { id: 'air_pollution_proxy', type: 'pills', label: 'How would you rate air quality where you live?', options: [
            { value: 'low', label: 'Good (low pollution)' }, { value: 'medium', label: 'Moderate' },
            { value: 'high', label: 'Poor (high pollution)' }
          ], hint: 'Optional — skip if unsure.', dataPath: 'tier1.air_pollution_proxy' }
        ]
      }
    ]
  },
  {
    id: 'financial', title: 'Financial & Neighbourhood', icon: '🏘️', tier: 2,
    subtitle: 'Emerging research on socioeconomic and neighbourhood factors.',
    badge: 'Tier 2 — Emerging Evidence',
    groups: [
      {
        title: 'Financial Situation', icon: '💰',
        fields: [
          { id: 'income_bracket', type: 'pills', label: 'How would you describe your household income?', options: [
            { value: 'low', label: 'Below average' }, { value: 'mid', label: 'About average' }, { value: 'high', label: 'Above average' }
          ], dataPath: 'tier2_financial.income_bracket' },
          { id: 'wealth_tertile', type: 'pills', label: 'How would you describe your overall wealth (savings, property, assets)?', options: [
            { value: 'low', label: 'Lower third' }, { value: 'mid', label: 'Middle third' }, { value: 'high', label: 'Upper third' }
          ], dataPath: 'tier2_financial.wealth_tertile' },
          { id: 'wealth_shock', type: 'checkbox', label: 'In the last two years, have you lost 75% or more of your savings or assets?', dataPath: 'tier2_financial.wealth_shock' },
          { id: 'financial_insecurity', type: 'range', label: 'How financially secure do you feel?', min: 0, max: 10, value: 5, minLabel: 'Very insecure (0)', maxLabel: 'Very secure (10)', dataPath: 'tier2_financial.financial_insecurity' }
        ]
      },
      {
        title: 'Your Neighbourhood', icon: '🏡',
        fields: [
          { id: 'area_deprivation', type: 'pills', label: 'How would you rate the overall deprivation level of your neighbourhood?', options: [
            { value: 'low', label: 'Low (affluent)' }, { value: 'medium', label: 'Average' }, { value: 'high', label: 'High (deprived)' }
          ], dataPath: 'tier2_neighbourhood.area_deprivation' },
          { id: 'urbanicity', type: 'pills', label: 'How would you describe where you live?', options: [
            { value: 'rural', label: 'Rural' }, { value: 'suburban', label: 'Suburban' },
            { value: 'urban', label: 'Urban' }, { value: 'dense_urban', label: 'Dense urban' }
          ], dataPath: 'tier2_neighbourhood.urbanicity' },
          { id: 'green_space', type: 'pills', label: 'Do you have parks or green spaces within a short walk?', options: [
            { value: 'none', label: 'None nearby' }, { value: 'low', label: 'A little' },
            { value: 'medium', label: 'Some' }, { value: 'high', label: 'Plenty' }
          ], dataPath: 'tier2_neighbourhood.green_space' },
          { id: 'near_major_road', type: 'checkbox', label: 'Do you live near a busy main road?', dataPath: 'tier2_neighbourhood.near_major_road' }
        ]
      }
    ]
  },
  {
    id: 'work', title: 'Work & Occupation', icon: '💼', tier: 2,
    subtitle: 'Workplace factors that research has linked to cognitive health.',
    badge: 'Tier 2 — Emerging Evidence',
    groups: [{
      title: 'Work Details', icon: '🏢',
      fields: [
        { id: 'employment_status', type: 'pills', label: 'What is your current employment status?', options: [
          { value: 'employed', label: 'Employed' }, { value: 'self_employed', label: 'Self-employed' },
          { value: 'retired', label: 'Retired' }, { value: 'not_working', label: 'Not working' }
        ], dataPath: 'tier2_workplace.employment_status' },
        { id: 'job_control', type: 'pills', label: 'How much control do you have over how you do your work?', options: [
          { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }
        ], hint: 'Skip if retired/not working.', dataPath: 'tier2_workplace.job_control' },
        { id: 'job_demands', type: 'pills', label: 'How demanding is your job?', options: [
          { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }
        ], dataPath: 'tier2_workplace.job_demands' },
        { id: 'shift_work', type: 'pills', label: 'What is your shift pattern?', options: [
          { value: 'none', label: 'No shift work' }, { value: 'day_shifts_only', label: 'Day shifts' },
          { value: 'rotating', label: 'Rotating shifts' }, { value: 'consistent_nights', label: 'Night shifts' }
        ], dataPath: 'tier2_workplace.shift_work' },
        { id: 'cognitive_stimulation', type: 'pills', label: 'Does your job involve complex problem-solving or varied information?', options: [
          { value: 'low', label: 'Rarely' }, { value: 'medium', label: 'Sometimes' }, { value: 'high', label: 'Often' }
        ], dataPath: 'tier2_workplace.cognitive_stimulation' },
        { id: 'pesticide_exposure', type: 'checkbox', label: 'Are you regularly exposed to pesticides at work?', dataPath: 'tier2_workplace.pesticide_exposure' },
        { id: 'magnetic_field_exposure', type: 'checkbox', label: 'Do you work with strong magnetic fields or electrical equipment?', dataPath: 'tier2_workplace.magnetic_field_exposure' },
        { id: 'solvent_exposure', type: 'checkbox', label: 'Are you regularly exposed to industrial solvents?', dataPath: 'tier2_workplace.solvent_exposure' }
      ]
    }]
  },
  {
    id: 'leisure', title: 'Leisure & Activities', icon: '🎨', tier: 2,
    subtitle: 'How you spend your free time may influence cognitive health.',
    badge: 'Tier 2 — Emerging Evidence',
    groups: [{
      title: 'Your Activities', icon: '🎭',
      fields: [
        { id: 'hobby_count', type: 'number', label: 'How many hobbies or leisure activities do you regularly do?', min: 0, max: 20, placeholder: 'e.g. 3', dataPath: 'tier2_leisure.hobby_count' },
        { id: 'active_mental', type: 'checkbox', label: 'Games, puzzles, or crosswords', dataPath: 'tier2_leisure.active_mental' },
        { id: 'creative_activities', type: 'checkbox', label: 'Crafts, painting, or other creative activities', dataPath: 'tier2_leisure.creative_activities' },
        { id: 'plays_instrument', type: 'checkbox', label: 'Playing a musical instrument', dataPath: 'tier2_leisure.plays_instrument' },
        { id: 'sings_regularly', type: 'checkbox', label: 'Regular singing (choir, karaoke, etc.)', dataPath: 'tier2_leisure.sings_regularly' },
        { id: 'arts_engagement', type: 'pills', label: 'Do you engage with the arts (museums, concerts, theatre)?', options: [
          { value: 'none', label: 'Never' }, { value: 'receptive_only', label: 'Attending only' },
          { value: 'active_only', label: 'Creating only' }, { value: 'both', label: 'Both' }
        ], dataPath: 'tier2_leisure.arts_engagement' }
      ]
    }]
  },
  {
    id: 'nutrition', title: 'Nutrition Details', icon: '🍎', tier: 2,
    subtitle: 'Specific dietary patterns linked to cognitive outcomes.',
    badge: 'Tier 2 — Emerging Evidence',
    groups: [{
      title: 'Your Diet', icon: '🥘',
      fields: [
        { id: 'ultra_processed', type: 'pills', label: 'How often do you eat ultra-processed foods (packaged snacks, ready meals, fast food)?', options: [
          { value: 'low', label: 'Rarely' }, { value: 'moderate', label: 'Sometimes' }, { value: 'high', label: 'Often/daily' }
        ], dataPath: 'tier2_nutrition.ultra_processed' },
        { id: 'processed_meat_g', type: 'number', label: 'Processed meat per day (grams)?', min: 0, max: 500, placeholder: 'e.g. 25', hint: 'Ham, bacon, sausages, salami. One slice ≈ 15-20g.', dataPath: 'tier2_nutrition.processed_meat_g' },
        { id: 'fruit_servings', type: 'number', label: 'How many servings of fruit do you eat per day?', min: 0, max: 10, step: 0.5, placeholder: 'e.g. 2', hint: 'One serving ≈ one medium fruit or ½ cup.', dataPath: 'tier2_nutrition.fruit_servings' },
        { id: 'vegetable_servings', type: 'number', label: 'How many servings of vegetables do you eat per day?', min: 0, max: 15, step: 0.5, placeholder: 'e.g. 3', dataPath: 'tier2_nutrition.vegetable_servings' },
        { id: 'ssb_per_week', type: 'number', label: 'Sugar-sweetened drinks per week?', min: 0, max: 50, placeholder: 'e.g. 3', hint: 'Soft drinks, sweetened juices, energy drinks.', dataPath: 'tier2_nutrition.ssb_per_week' },
        { id: 'coffee_cups', type: 'number', label: 'Cups of coffee per day?', min: 0, max: 20, step: 0.5, placeholder: 'e.g. 3', hint: 'Research shows a U-shaped relationship — moderate coffee (3-5 cups) associated with lowest risk.', dataPath: 'tier2_nutrition.coffee_cups' },
        { id: 'red_meat_g', type: 'number', label: 'Unprocessed red meat per day (grams)?', min: 0, max: 500, placeholder: 'e.g. 50', hint: 'Beef, lamb, pork (not processed). One serving ≈ 100g.', dataPath: 'tier2_nutrition.red_meat_g', lowConfidence: true, lowConfidenceNote: 'Counterintuitive finding — limited evidence' }
        ]
    }]
  },
  {
    id: 'emotional', title: 'Emotional Wellbeing', icon: '💚', tier: 2,
    subtitle: 'How you feel day-to-day has been linked to long-term cognitive health.',
    badge: 'Tier 2 — Emerging Evidence',
    groups: [{
      title: 'Your Wellbeing', icon: '🌟',
      fields: [
        { id: 'life_satisfaction', type: 'range', label: 'Overall, how satisfied are you with your life?', min: 0, max: 10, value: 5, minLabel: 'Not at all (0)', maxLabel: 'Completely (10)', dataPath: 'tier2_emotional.life_satisfaction' },
        { id: 'purpose_score', type: 'range', label: 'How strongly do you feel a sense of purpose or meaning in your life?', min: 0, max: 10, value: 5, minLabel: 'Not at all (0)', maxLabel: 'Very strongly (10)', dataPath: 'tier2_emotional.purpose_score' },
        { id: 'hopelessness_score', type: 'range', label: 'How often do you feel hopeless about the future?', min: 0, max: 10, value: 0, minLabel: 'Never (0)', maxLabel: 'Constantly (10)', dataPath: 'tier2_emotional.hopelessness_score' },
        { id: 'stress_frequency', type: 'pills', label: 'In the last few months, how often have you felt under a lot of stress?', options: [
          { value: 'rarely', label: 'Rarely' }, { value: 'sometimes', label: 'Sometimes' },
          { value: 'often', label: 'Often' }, { value: 'constantly', label: 'Constantly' }
        ], dataPath: 'tier2_emotional.stress_frequency' },
        { id: 'meditation', type: 'pills', label: 'Do you practice meditation or mindfulness?', options: [
          { value: 'none', label: 'No' }, { value: 'occasional', label: 'Occasionally' },
          { value: 'weekly_plus', label: 'Weekly or more' }, { value: 'long_term', label: '10+ years' }
        ], dataPath: 'tier2_emotional.meditation' }
      ]
    }]
  },
  {
    id: 'psychiatric', title: 'Psychiatric History', icon: '🔒', tier: 2,
    subtitle: 'This section is optional and requires your consent.',
    badge: 'Optional — Consent Required',
    badgeClass: 'optional',
    consentGated: true,
    consentText: 'Some psychiatric diagnoses have been associated with dementia risk in research, but the direction of causality is unclear — psychiatric symptoms can also be an early sign of dementia itself. This information is for context only and will not be scored as something to "fix." Your responses are private and stay in your browser.',
    groups: [{
      title: 'Prior Diagnoses', icon: '📋',
      fields: [
        { id: 'bipolar', type: 'checkbox', label: 'Has a doctor diagnosed you with bipolar disorder?', dataPath: 'tier2_psychiatric.bipolar' },
        { id: 'anxiety', type: 'checkbox', label: 'Has a doctor diagnosed you with a clinical anxiety disorder?', dataPath: 'tier2_psychiatric.anxiety' },
        { id: 'ptsd', type: 'checkbox', label: 'Has a doctor diagnosed you with PTSD?', dataPath: 'tier2_psychiatric.ptsd' },
        { id: 'psychotic', type: 'checkbox', label: 'Has a doctor diagnosed you with a psychotic disorder?', dataPath: 'tier2_psychiatric.psychotic' },
        { id: 'psych_age_onset', type: 'number', label: 'Approximate age at first diagnosis (if any above)?', min: 0, max: 120, placeholder: 'e.g. 30', dataPath: 'tier2_psychiatric.age_at_first_diagnosis' }
      ]
    }]
  }
];
