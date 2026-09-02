// GEO GPS prototype — scenario library + generators.
//
// Nothing here is a fixed answer sheet. A run picks one scenario at random and
// every derived artefact (prompts, category mix, strategy library, validation
// mismatches) is generated from it, with jitter, so two runs never look alike.

/* ------------------------------------------------------------------ chrome */

export const NAV = [
  { label: "Home", icon: "home" },
  { label: "My Dashboard", icon: "grid" },
  { label: "New Prompt Universe", icon: "sparkle", active: true },
  { label: "Prompt Workbench", icon: "wrench", count: 3 },
  { label: "Approval Hub", icon: "check", count: 12 },
  { label: "Prompt Library", icon: "book" },
];

export const STEPS = ["Scoping", "Review", "Plan", "Generation", "Completed"];

export const SCOPE_FIELDS = ["Disease", "Indication", "Brand", "Molecule", "Markets"];
export const PARAM_FIELDS = [
  "Audience", "Stage", "Intent", "Brand Lifecycle",
  "Prompt Orientation", "Themes", "Keywords", "Count", "Brand Strategy",
];

/* ------------------------------------------------------- shared option sets */

const STAGES = [
  "Disease Awareness", "Treatment Awareness", "Evaluation & Decision-Making",
  "Treatment Initiation", "Long-Term Management", "Advocacy & Empowerment",
  "Prevention & Risk Reduction", "Advanced Disease & Supportive Care",
];

const LIFECYCLES = [
  "Pre-launch", "Launch", "Growth", "Maturity",
  "Approaching Patent Expiry", "Post Patent Expiry",
];

// Indications the picker offers by default. Not exhaustive — the step allows
// "Other", the same as markets and personas.
const INDICATIONS = [
  "Obesity", "Type 2 Diabetes", "Hypertension", "Heart Failure",
  "Atopic Dermatitis", "Psoriasis", "Asthma", "COPD",
  "Non-small Cell Lung Cancer", "Breast Cancer",
  "Rheumatoid Arthritis", "Chronic Kidney Disease", "Migraine",
];

const MARKETS = ["India", "US", "EU", "UK", "Brazil", "Japan", "Canada", "Australia"];
const AUDIENCES = ["Patient", "HCP", "Caregiver", "Payer"];
const ORIENTATIONS = ["Branded", "Unbranded", "Mixed"];

/* ------------------------------------------------------------------ people */

const OWNERS = [
  "Meera Nair", "Arjun Kapoor", "Sofia Almeida", "Daniel Osei",
  "Priya Raghavan", "Tomas Lindqvist", "Hannah Weiss",
];

/* --------------------------------------------------------------- scenarios */

export const SCENARIOS = [
  {
    id: "contrave",
    disease: "Cardiovascular and Metabolic Diseases",
    indication: "Obesity",
    brand: "Contrave",
    molecule: "naltrexone / bupropion",
    markets: ["India"],
    audience: "Patient",
    stage: "Treatment Initiation",
    intents: ["Lifestyle & Weight Management"],
    intentOpts: [
      "Disease Awareness", "Risk Assessment & Early Detection", "Treatment Understanding",
      "Disease Control & Prevention", "Lifestyle & Weight Management", "Symptom Improvement",
      "Quality of Life", "Safety & Side Effect Education",
    ],
    lifecycle: "Post Patent Expiry",
    orientation: "Unbranded",
    themes: ["Safety Concerns with Treatment"],
    themeOpts: [
      "How Weight-Loss Drugs Work", "Who Obesity Treatment Helps",
      "Medication Versus Lifestyle Changes", "Safety Concerns with Treatment",
      "Expected Results and Timeline",
    ],
    competitors: ["Wegovy", "Saxenda", "Qsymia"],
    diseaseShort: "obesity",
    objective: "Entrench Contrave's oral, non-injectable position through tolerability differentiation and first-90-day adherence support.",
    priorities: [
      "Primary — Reinforce tolerability and oral-convenience differentiation",
      "Secondary — Defend community share against GLP-1 injectables",
    ],
    risks: ["Safety misinformation risk", "Efficacy comparison risk"],
    narrative: {
      win: {
        title: "Win the community setting with oral, non-injectable convenience vs. GLP-1 injectables",
        points: [
          "Defend and grow community share by positioning against Wegovy and Saxenda's injection burden",
          "Drive higher duration of therapy by leveraging once-daily oral dosing and a non-stimulant mechanism",
          "Counter injectable noise by anchoring on 'no injection' as the core differentiator",
        ],
      },
      focus: {
        title: "Own the first 90 days to maximize duration of therapy",
        points: [
          "Directly combat the highest period of discontinuation (nausea, early drop-off) with titration education",
          "Shift focus from pre-script decisions to post-script support and adherence",
          "Build practice-level loyalty by simplifying onboarding and AE management for NPs and PAs",
        ],
      },
      proposition: {
        title: "The most established oral option for patients who'd rather avoid a daily injection",
        points: [
          "Solidify Contrave as a non-injectable standard by leveraging naltrexone/bupropion's real-world history",
          "Appeal to injection-averse patients by emphasizing oral convenience and titration flexibility",
          "Counter competitor noise by anchoring on tolerability and a non-stimulant profile",
        ],
      },
      characteristics: [
        "Naltrexone/bupropion, once-daily oral, non-stimulant",
        "Key differentiators: oral dosing, no injection, titration flexibility",
        "Perceived as the 'oral alternative' for injection-averse patients",
      ],
      evidence: [
        "COR-I / COR-II — 56-week trials, ~5-6% mean weight loss vs placebo",
        "COR-BMOD — with intensive behaviour modification, ~9% weight loss",
        "COR-Diabetes — in type 2 diabetes, improved glycemic control",
      ],
    },
  },
  {
    id: "jardiance",
    disease: "Cardiovascular and Metabolic Diseases",
    indication: "Type 2 Diabetes with CV risk",
    brand: "Jardiance",
    molecule: "empagliflozin",
    markets: ["US", "EU"],
    audience: "HCP",
    stage: "Evaluation & Decision-Making",
    intents: ["Treatment Understanding", "Disease Control & Prevention"],
    intentOpts: [
      "Disease Awareness", "Risk Assessment & Early Detection", "Treatment Understanding",
      "Disease Control & Prevention", "Cardio-Renal Protection", "Symptom Improvement",
      "Quality of Life", "Safety & Side Effect Education",
    ],
    lifecycle: "Maturity",
    orientation: "Mixed",
    themes: ["Cardio-Renal Outcomes", "Guideline Positioning"],
    themeOpts: [
      "How SGLT2 Inhibitors Work", "Cardio-Renal Outcomes", "Guideline Positioning",
      "Combination With Metformin", "Genitourinary Safety",
    ],
    competitors: ["Farxiga", "Invokana", "Ozempic"],
    diseaseShort: "type 2 diabetes",
    objective: "Hold guideline-preferred status in cardio-renal protection while defending against Farxiga's broader heart-failure label.",
    priorities: [
      "Primary — Own cardio-renal outcomes as the reason to choose",
      "Secondary — Neutralize Farxiga's label-breadth argument at formulary level",
    ],
    risks: ["Class-effect dilution risk", "Genitourinary safety misinformation"],
    narrative: {
      win: {
        title: "Win the cardio-renal conversation before the glycemic one",
        points: [
          "Lead with EMPA-REG and EMPEROR outcomes rather than HbA1c reduction",
          "Convert cardiology and nephrology referrers, not only endocrinology",
          "Displace the 'just another SGLT2' framing with outcome-specific evidence",
        ],
      },
      focus: {
        title: "Convert guideline mentions into first-line prescribing behaviour",
        points: [
          "Close the gap between guideline endorsement and real-world initiation rates",
          "Arm primary care with a simple 'who to start, when' decision frame",
          "Address renal-dosing hesitation that stalls initiation in CKD patients",
        ],
      },
      proposition: {
        title: "The SGLT2 with the deepest outcome evidence across heart and kidney",
        points: [
          "Anchor on EMPA-REG OUTCOME as the trial that changed the class",
          "Emphasize consistency of effect across CV death, HF hospitalization and CKD progression",
          "Counter class-effect framing with trial-specific endpoints",
        ],
      },
      characteristics: [
        "Empagliflozin, once-daily oral SGLT2 inhibitor",
        "Key differentiators: CV death reduction, heart-failure and CKD indications",
        "Positioned as a cardio-renal drug that also lowers glucose",
      ],
      evidence: [
        "EMPA-REG OUTCOME — 38% relative reduction in CV death",
        "EMPEROR-Preserved / EMPEROR-Reduced — HF benefit across ejection fraction",
        "EMPA-KIDNEY — slowed CKD progression in a broad renal population",
      ],
    },
  },
  {
    id: "dupixent",
    disease: "Immunology and Inflammation",
    indication: "Moderate-to-severe Atopic Dermatitis",
    brand: "Dupixent",
    molecule: "dupilumab",
    markets: ["US"],
    audience: "Caregiver",
    stage: "Evaluation & Decision-Making",
    intents: ["Treatment Understanding", "Quality of Life"],
    intentOpts: [
      "Disease Awareness", "Symptom Improvement", "Treatment Understanding",
      "Quality of Life", "Safety & Side Effect Education", "Pediatric Considerations",
      "Long-Term Control", "Steroid Reduction",
    ],
    lifecycle: "Growth",
    orientation: "Branded",
    themes: ["Long-Term Disease Control", "Steroid-Sparing"],
    themeOpts: [
      "How Biologics Work", "Long-Term Disease Control", "Steroid-Sparing",
      "Pediatric Safety", "Injection Experience at Home",
    ],
    competitors: ["Adbry", "Rinvoq", "Cibinqo"],
    diseaseShort: "atopic dermatitis",
    objective: "Establish biologic-first thinking in moderate-to-severe disease before oral JAK inhibitors set the default.",
    priorities: [
      "Primary — Make long-term control the standard of expectation, not symptom relief",
      "Secondary — Own pediatric and caregiver confidence in the injection experience",
    ],
    risks: ["Injection anxiety in caregivers", "Oral-over-injectable preference drift"],
    narrative: {
      win: {
        title: "Win the caregiver decision before the JAK conversation starts",
        points: [
          "Reach caregivers at the point of steroid fatigue, not at specialist referral",
          "Convert 'manage flares' expectations into 'control the disease' expectations",
          "Pre-empt oral-JAK preference by reframing convenience as long-term safety",
        ],
      },
      focus: {
        title: "Remove injection anxiety as the last barrier to starting",
        points: [
          "Address at-home administration fear with step-level caregiver education",
          "Set realistic time-to-response expectations to prevent early abandonment",
          "Give caregivers language to advocate for a biologic at the specialist visit",
        ],
      },
      proposition: {
        title: "The most established biologic for children and adults who need more than steroids",
        points: [
          "Leverage the broadest age-range label in the biologic class",
          "Anchor on long-term safety data over sustained treatment periods",
          "Emphasize type 2 inflammation as the mechanism story caregivers can retell",
        ],
      },
      characteristics: [
        "Dupilumab, subcutaneous biologic targeting IL-4 / IL-13 signalling",
        "Key differentiators: pediatric label breadth, long-term safety record",
        "Positioned as the first biologic to try, not the last resort",
      ],
      evidence: [
        "SOLO 1 / SOLO 2 — significant EASI-75 response vs placebo at 16 weeks",
        "LIBERTY AD CHRONOS — sustained control with topical corticosteroids",
        "Open-label extension — safety maintained across multi-year exposure",
      ],
    },
  },
  {
    id: "keytruda",
    disease: "Oncology",
    indication: "Non-small Cell Lung Cancer (1L)",
    brand: "Keytruda",
    molecule: "pembrolizumab",
    markets: ["EU", "UK"],
    audience: "HCP",
    stage: "Advanced Disease & Supportive Care",
    intents: ["Treatment Understanding", "Biomarker Testing"],
    intentOpts: [
      "Disease Awareness", "Biomarker Testing", "Treatment Understanding",
      "Survival Expectations", "Safety & Side Effect Education",
      "Quality of Life", "Supportive Care", "Access & Reimbursement",
    ],
    lifecycle: "Approaching Patent Expiry",
    orientation: "Mixed",
    themes: ["Biomarker-Led Selection", "Immune-Related Adverse Events"],
    themeOpts: [
      "How Checkpoint Inhibitors Work", "Biomarker-Led Selection",
      "Immune-Related Adverse Events", "Duration of Therapy", "Combination Chemotherapy",
    ],
    competitors: ["Opdivo", "Tecentriq", "Imfinzi"],
    diseaseShort: "non-small cell lung cancer",
    objective: "Defend 1L standard-of-care status through biomarker-led selection ahead of biosimilar and subcutaneous entry.",
    priorities: [
      "Primary — Keep PD-L1-guided selection anchored to pembrolizumab evidence",
      "Secondary — Protect duration-of-therapy decisions from cost-led truncation",
    ],
    risks: ["Biosimilar substitution pressure", "irAE management misinformation"],
    narrative: {
      win: {
        title: "Win at the biomarker decision, where 1L therapy is actually chosen",
        points: [
          "Make PD-L1 testing completeness the battleground, not brand preference",
          "Reinforce KEYNOTE evidence at multidisciplinary tumour board level",
          "Defend against class-parity framing from competing checkpoint inhibitors",
        ],
      },
      focus: {
        title: "Protect duration of therapy against cost-driven early stopping",
        points: [
          "Give oncologists evidence-backed language for continuing to two years",
          "Address irAE management confidence as the real driver of early discontinuation",
          "Equip pharmacy and payer conversations with total-outcome framing",
        ],
      },
      proposition: {
        title: "The checkpoint inhibitor with the deepest 1L evidence base in lung cancer",
        points: [
          "Anchor on KEYNOTE-024 and KEYNOTE-189 as practice-defining trials",
          "Emphasize five-year survival data over response-rate comparisons",
          "Counter parity claims with indication-specific, not class-level, evidence",
        ],
      },
      characteristics: [
        "Pembrolizumab, anti-PD-1 checkpoint inhibitor, IV infusion",
        "Key differentiators: 1L monotherapy and combination evidence, five-year follow-up",
        "Positioned as the reference standard against which the class is measured",
      ],
      evidence: [
        "KEYNOTE-024 — improved OS vs chemotherapy in PD-L1 ≥50%",
        "KEYNOTE-189 — combination with pemetrexed/platinum in non-squamous NSCLC",
        "Five-year follow-up — sustained survival benefit in a subset of responders",
      ],
    },
  },
];

/* -------------------------------------------------------- prompt templates */

// Ten canonical categories. `weight` is the statistical prior; the run jitters
// it. `branded` decides whether the category counts toward branded share.
export const CATEGORIES = [
  {
    name: "Safety & Tolerability", weight: 16, branded: false,
    why: "Statistical prior + brand strategy primary priority",
    templates: [
      "What side effects of {brand} should I ask my doctor about?",
      "Is {brand} safe for people already managing {diseaseShort}?",
      "What are the most common tolerability issues in the first weeks of {molecule}?",
      "How is {molecule} tolerated compared with other options for {diseaseShort}?",
      "What safety monitoring is recommended when starting {brand}?",
    ],
  },
  {
    name: "Clinical Evidence", weight: 14, branded: false,
    why: "Reinforces the High direction set in prompt strategy",
    templates: [
      "What does the clinical evidence show about {molecule} in {diseaseShort}?",
      "How strong is the trial evidence behind {brand}?",
      "What outcomes were measured in the pivotal {brand} trials?",
      "How long were patients followed in the studies supporting {molecule}?",
      "What do guidelines say about {molecule} for {diseaseShort}?",
    ],
  },
  {
    name: "Comparison & Competition", weight: 8, branded: true,
    why: "Supporting priority; {competitor} context",
    templates: [
      "How does {brand} compare with {competitor}?",
      "What are the trade-offs between {brand} and {competitor} for {diseaseShort}?",
      "Why might a clinician choose {molecule} over {competitor}?",
      "Is {brand} or {competitor} better tolerated?",
    ],
  },
  {
    name: "Disease & Symptoms", weight: 12, branded: false,
    why: "Baseline disease-awareness scope coverage",
    templates: [
      "What are the early signs of {diseaseShort}?",
      "How does {diseaseShort} progress if it isn't treated?",
      "What day-to-day symptoms do people with {diseaseShort} deal with?",
      "How does {diseaseShort} affect long-term health?",
    ],
  },
  {
    name: "Diagnosis & Screening", weight: 8, branded: false,
    why: "Statistical prior baseline; supporting in prompt strategy",
    templates: [
      "How is {diseaseShort} diagnosed?",
      "What tests confirm {diseaseShort} before treatment starts?",
      "Who should be screened for {diseaseShort}?",
      "What results would make a specialist referral necessary?",
    ],
  },
  {
    name: "Treatment Landscape", weight: 12, branded: false,
    why: "{lifecycle} lifecycle emphasizes treatment-selection context",
    templates: [
      "What treatment options exist for {diseaseShort} today?",
      "How do clinicians decide between treatments for {diseaseShort}?",
      "What happens if the first treatment for {diseaseShort} doesn't work?",
      "How has treatment for {diseaseShort} changed in recent years?",
    ],
  },
  {
    name: "Product-Specific", weight: 10, branded: true,
    why: "Brand-anchored coverage independent of orientation",
    templates: [
      "What is {brand} and how does it work?",
      "Who is {brand} approved for?",
      "How does {molecule} act in the body?",
      "What should I know about {brand} before my next appointment?",
    ],
  },
  {
    name: "Administration & Use", weight: 10, branded: false,
    why: "Moderate prompt-strategy direction",
    templates: [
      "How is {brand} taken, and how often?",
      "What happens if a dose of {molecule} is missed?",
      "How long does it take before {brand} starts working?",
      "What does the first month on {molecule} usually look like?",
    ],
  },
  {
    name: "Access & Cost", weight: 6, branded: false,
    why: "Existing framework baseline; no strategy signal this run",
    templates: [
      "Is {brand} covered by insurance in {market}?",
      "What does treatment for {diseaseShort} typically cost in {market}?",
      "What support exists if {brand} isn't affordable?",
    ],
  },
  {
    name: "Patient Support", weight: 4, branded: false,
    why: "Secondary: {audience}-led universe reduces emphasis",
    templates: [
      "What support programs exist for people starting {brand}?",
      "Where can caregivers find reliable information about {diseaseShort}?",
      "What questions should I bring to my next appointment about {brand}?",
    ],
  },
];

/* ------------------------------------------------------------------ random */

const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];
const shuffle = (arr) => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(p => p[1]);

/** Pick a scenario, never the one currently on screen. */
export function pickScenario(excludeId) {
  const pool = SCENARIOS.filter(s => s.id !== excludeId);
  return pool[rand(pool.length)];
}

function fill(tpl, s, market) {
  return tpl
    .replace(/{brand}/g, s.brand)
    .replace(/{molecule}/g, s.molecule)
    .replace(/{diseaseShort}/g, s.diseaseShort)
    .replace(/{competitor}/g, pick(s.competitors))
    .replace(/{market}/g, market || s.markets[0])
    .replace(/{lifecycle}/g, s.lifecycle)
    .replace(/{audience}/g, s.audience);
}

/* -------------------------------------------------------- the chat script */

// Built per scenario so the questions stay the same but every answer differs.
// `key` identifies the step, `field` is the config row the answer writes into,
// and `set` holds the values the step resolves alongside the answer (picking a
// brand also resolves its molecule).
export function buildScript(s) {
  return [
    { key: "Disease", field: "Indication", type: "single", allowOther: true,
      otherLabel: "Other indication", otherHint: "Type the disease or indication",
      q: "Which disease or indication are we focusing on?",
      a: s.indication,
      opts: [s.indication, ...shuffle(INDICATIONS.filter(i => i !== s.indication)).slice(0, 7)],
      note: `${s.indication} confirmed.`,
      set: { Disease: s.disease, Indication: s.indication } },

    { key: "Brand", field: "Brand", type: "free",
      q: "Which brand is this prompt universe being planned for? Search the list or type a brand name.",
      a: s.brand, suggestions: shuffle([s.brand, ...s.competitors]).slice(0, 4),
      note: `Brand saved. ${s.brand} is associated with ${s.molecule}.`,
      set: { Brand: s.brand, Molecule: s.molecule } },

    // `allowOther` marks an OPEN vocabulary: the listed options are the common
    // cases, not the whole world. Markets in particular — a universe can target
    // a country no dropdown anticipated.
    { key: "Markets", field: "Markets", type: "multi", allowOther: true,
      otherLabel: "Other country", otherHint: "Type a country or region, e.g. Saudi Arabia",
      q: "Now select the target market or markets for these prompts.",
      a: s.markets, opts: MARKETS,
      note: "Market selection saved.", set: { Markets: s.markets.join(", ") } },

    { key: "Audience", field: "Audience", type: "single", allowOther: true,
      otherLabel: "Other persona", otherHint: "e.g. Pharmacist, Nurse, Advocacy group",
      q: "Choose the persona you want me to simulate for these prompts.",
      a: s.audience, opts: AUDIENCES,
      note: "Persona confirmed.", set: { Audience: s.audience } },

    { key: "Stage", field: "Stage", type: "single", allowOther: true,
      otherLabel: "Other stage", otherHint: "Name the journey stage in your own words",
      q: "Select the journey stage.",
      a: s.stage, opts: STAGES,
      note: "Stage selection saved.", set: { Stage: s.stage } },

    { key: "Intent", field: "Intent", type: "multi", allowOther: true,
      otherLabel: "Other intent", otherHint: "e.g. Adherence support, Reimbursement",
      q: "Select one or more intents that best match your objective.",
      a: s.intents, opts: s.intentOpts,
      note: "Intent selection saved.", set: { Intent: s.intents.join(", ") } },

    { key: "Brand Lifecycle", field: "Brand Lifecycle", type: "single", allowOther: true,
      otherLabel: "Other lifecycle", otherHint: "e.g. Line extension, Re-launch",
      q: "What lifecycle stage is the brand currently in?",
      a: s.lifecycle, opts: LIFECYCLES,
      note: "Brand lifecycle saved.", set: { "Brand Lifecycle": s.lifecycle } },

    // Closed vocabulary: these three drive the branded/unbranded split, so a
    // free-text fourth value would have nothing to weight against.
    { key: "Prompt Orientation", field: "Prompt Orientation", type: "single",
      q: "Should these prompts be branded, unbranded, or mixed?",
      a: s.orientation, opts: ORIENTATIONS,
      note: "Orientation saved.", set: { "Prompt Orientation": s.orientation } },

    { key: "Themes", field: "Themes", type: "multi", optional: true, allowOther: true,
      otherLabel: "Other theme", otherHint: "Describe the focus area in your own words",
      q: "Any specific theme or focus area GEO should weight? Optional.",
      a: s.themes, opts: s.themeOpts,
      note: "Theme selection saved.", set: { Themes: s.themes.join(", ") } },

    { key: "Keywords", field: "Keywords", type: "free", optional: true,
      q: "Add keywords to influence the prompt set. Optional.",
      a: "", suggestions: [s.diseaseShort, s.molecule.split(" ")[0], "tolerability", "first 90 days"],
      note: "Keywords saved.", set: { Keywords: "Not set (optional)" } },

    { key: "Count", field: "Count", type: "number",
      q: "How many prompts should I generate? Minimum 5.",
      a: String(10 + rand(16)), suggestions: ["10", "13", "20", "25"],
      note: "Count saved.", set: {} },
  ];
}

/** Find the step that owns a config field, by step key or written field. */
export function stepFor(script, key) {
  return script.find(s => s.key === key || s.field === key);
}

/* -------------------------------------------------- brand strategy library */

const SUMMARY_SHAPES = [
  (s, m, p) => `Defends ${s.diseaseShort} share in ${m} by leading with tolerability and ${p.toLowerCase()}-facing education.`,
  (s, m, p) => `${p} strategy for ${m}: prioritises long-term control messaging over short-term symptom relief.`,
  (s, m, p) => `Positions ${s.brand} against ${pick(s.competitors)} in ${m}, with ${p.toLowerCase()} decision-support as the wedge.`,
  (s, m, p) => `Access-led plan for ${m}; ${p.toLowerCase()} conversations anchored on evidence depth, not price.`,
  (s, m, p) => `Launch-phase ${m} plan built around biomarker/eligibility clarity for ${p.toLowerCase()}s.`,
];

/**
 * Saved strategies for the *same brand*, differing by market and persona.
 * One entry always matches the current scope; the rest deliberately don't, so
 * picking the wrong one exercises the validation table.
 */
export function buildStrategyLibrary(s) {
  const otherMarkets = shuffle(MARKETS.filter(m => !s.markets.includes(m))).slice(0, 3);
  const otherPersonas = shuffle(AUDIENCES.filter(a => a !== s.audience));

  const entries = [
    {
      id: "match",
      brand: s.brand,
      market: s.markets[0],
      persona: s.audience,
      lifecycle: s.lifecycle,
      summary: SUMMARY_SHAPES[0](s, s.markets[0], s.audience),
      updated: recentDate(rand(40) + 5),
      owner: pick(OWNERS),
      version: `v${2 + rand(4)}`,
      usedIn: rand(9) + 1,
      disease: s.disease,
      objective: s.objective,
      priorities: s.priorities,
      competitors: s.competitors,
      risks: s.risks,
    },
    ...otherMarkets.map((m, i) => {
      const persona = otherPersonas[i % otherPersonas.length];
      return {
        id: `alt-${i}`,
        brand: s.brand,
        market: m,
        persona,
        lifecycle: pick(LIFECYCLES),
        summary: SUMMARY_SHAPES[(i + 1) % SUMMARY_SHAPES.length](s, m, persona),
        updated: recentDate(rand(300) + 30),
        owner: pick(OWNERS),
        version: `v${1 + rand(5)}`,
        usedIn: rand(6),
        disease: i === 2 ? "Immunology and Inflammation" : s.disease,
        objective: s.objective,
        priorities: s.priorities,
        competitors: shuffle(s.competitors).slice(0, 2 + rand(2)),
        risks: s.risks,
      };
    }),
  ];

  return entries.map(e => ({ ...e, match: scoreMatch(e, s) }));
}

/** Percentage agreement between a saved strategy and the live scope. */
function scoreMatch(entry, s) {
  const checks = [
    entry.brand === s.brand,
    entry.market === s.markets[0],
    entry.persona === s.audience,
    entry.disease === s.disease,
    entry.lifecycle === s.lifecycle,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function recentDate(daysAgo) {
  const d = new Date(Date.now() - daysAgo * 86400000);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** What an *uploaded* file "contains" — deliberately drifted from the scope. */
export function buildExtracted(s) {
  const wrongMarket = pick(MARKETS.filter(m => !s.markets.includes(m)));
  const wrongDisease = pick(SCENARIOS.filter(x => x.disease !== s.disease)).disease;
  return {
    Disease: Math.random() < 0.6 ? wrongDisease : s.disease,
    Markets: Math.random() < 0.7 ? wrongMarket : s.markets[0],
    Brand: s.brand,
    Audience: Math.random() < 0.3 ? pick(AUDIENCES.filter(a => a !== s.audience)) : s.audience,
    objective: s.objective,
    priorities: s.priorities,
    competitors: s.competitors,
    risks: s.risks,
    sources: [`${s.brand.toLowerCase()}_brand_strategy_${new Date().getFullYear()}.csv`],
  };
}

export const comparableFields = ["Disease", "Markets", "Brand", "Audience"];

export const strategyColumns = [
  { field: "disease", desc: "Disease / therapeutic area the strategy targets", example: "Obesity" },
  { field: "market", desc: "Market this strategy is written for", example: "India" },
  { field: "brand", desc: "Brand name", example: "Contrave" },
  { field: "audience", desc: "Audience / persona", example: "Patient" },
  { field: "objective", desc: "Strategic objective, one sentence", example: "Entrench first-line position through tolerability" },
  { field: "primary_priority", desc: "Primary strategic priority", example: "Reinforce tolerability differentiation" },
  { field: "secondary_priority", desc: "Secondary priority", example: "Defend against GLP-1 injectables" },
  { field: "competitors", desc: "Competitor set, `;` separated", example: "Wegovy;Saxenda;Qsymia" },
  { field: "risk_areas", desc: "Priority risk areas, `;` separated", example: "Safety misinformation risk" },
];

/* -------------------------------------------------------- guidance sections */

export function buildGuidance(s) {
  const base = [
    { label: "Disease / Therapy Context", badge: "DISEASE", tone: "info" },
    { label: "Persona & Journey Context", badge: "PERSONA", tone: "primary" },
    { label: "Audience Language Guidance", badge: "ALR", tone: "info" },
    { label: "Intent Evidence Guidance", badge: "EWIP", tone: "primary" },
    { label: "Market Lens Guidance", badge: "MCX", tone: "success" },
    { label: "Market Access Language", badge: "MALL", tone: "success" },
    { label: "Governance Guidance", badge: "GOV", tone: "info" },
    { label: "Prompt Planning Guidance", badge: "PLAN", tone: "primary" },
    { label: "Source Traceability", badge: "TRACE", tone: "info" },
  ];
  // One section is randomly incomplete each run — that's what drives the
  // "generated with warnings" state on the review screen.
  const gapIndex = rand(base.length);
  return base.map((g, i) => i === gapIndex
    ? { ...g, status: "partial", detail: `No ${s.markets[0]}-specific source found; falling back to global guidance.` }
    : { ...g, status: "ready" });
}

/* ------------------------------------------------------------- the mix plan */

/** Category weights, jittered and renormalised, then turned into counts. */
export function buildMix(s, count) {
  const brandedBias = s.orientation === "Branded" ? 1.8 : s.orientation === "Mixed" ? 1.25 : 0.7;

  const raw = CATEGORIES.map(c => {
    const jitter = 1 + (Math.random() * 0.4 - 0.2);          // ±20%
    const w = c.weight * jitter * (c.branded ? brandedBias : 1);
    return { ...c, raw: w };
  });

  const sum = raw.reduce((t, c) => t + c.raw, 0);
  const rows = raw.map(c => ({ ...c, pct: (c.raw / sum) * 100 }));

  // Largest-remainder so the counts add up to exactly `count`.
  const exact = rows.map(r => (r.pct / 100) * count);
  const floors = exact.map(Math.floor);
  let left = count - floors.reduce((a, b) => a + b, 0);
  const order = exact.map((v, i) => [v - floors[i], i]).sort((a, b) => b[0] - a[0]);
  const counts = [...floors];
  for (let i = 0; left > 0; i++, left--) counts[order[i % order.length][1]]++;

  const out = rows.map((r, i) => ({
    name: r.name,
    branded: r.branded,
    count: counts[i],
    pct: Math.round((counts[i] / count) * 100),
    why: fill(r.why, s),
  })).filter(r => r.count > 0);

  const brandedCount = out.filter(r => r.branded).reduce((t, r) => t + r.count, 0);
  return {
    rows: out,
    branded: Math.round((brandedCount / count) * 100),
    unbranded: 100 - Math.round((brandedCount / count) * 100),
    total: count,
    lifecycleNote: `${s.lifecycle} lifecycle — secondary context`,
  };
}

/** Prompts, drawn from the mix so the two screens agree with each other. */
export function buildPrompts(s, mix) {
  const out = [];
  mix.rows.forEach(row => {
    const cat = CATEGORIES.find(c => c.name === row.name);
    const pool = shuffle(cat.templates);
    for (let i = 0; i < row.count; i++) {
      out.push({
        text: fill(pool[i % pool.length], s),
        category: row.name,
        branded: row.branded,
      });
    }
  });
  return shuffle(out);
}

/* --------------------------------------------------------- prompt strategy */

const DIRECTIONS = ["High", "High", "Moderate", "Supporting"];

export function buildStrategyDirection(s, mix) {
  const top = [...mix.rows].sort((a, b) => b.count - a.count).slice(0, 4);
  return {
    categoryDirection: top.map((r, i) => [r.name, DIRECTIONS[i]]),
    recommended: `Prioritize ${top[0].name} and ${top[1].name}, reflecting the brand strategy's ${s.priorities[0].split("— ")[1].toLowerCase()} and current evidence demand in ${s.markets.join(" / ")}. Maintain predominantly ${s.orientation.toLowerCase()} coverage, reserving branded prompts for product-specific and comparison needs.`,
    blueprint: [
      [`${top[0].name} direction`, "High focus priority"],
      ["Brand strategy", s.priorities[0].replace(/^Primary — /, "") + " (primary)"],
      ["Alignment rating", `${70 + rand(26)}% — optimal statistical prior`],
    ],
    implications: `Maintain comparison coverage against ${s.competitors.slice(0, 2).join(" and ")}, secondary to ${top[0].name}. Emphasize ${s.stage.toLowerCase()} given the ${s.lifecycle} lifecycle stage.`,
    risks: `Priority risk — ${s.risks[0]}; avoid unsupported superiority claims.`,
    alignment: `Brand strategy, current evidence and the statistical prior all support elevated ${top[0].name} emphasis.`,
  };
}

/* ------------------------------------------------------------------ run id */

export function newRunId() {
  const hex = () => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, "0");
  return `${hex()}${hex()}-${hex()}-${hex()}-${hex()}`;
}

export function nowStamp() {
  return new Date().toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
