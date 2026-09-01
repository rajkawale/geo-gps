// Static content for the GEO GPS brand-strategy prototype.

export const NAV = [
  { label: "Home", color: "#98a0ad" },
  { label: "My Dashboard", color: "#98a0ad" },
  { label: "New Prompt Universe", color: "#25429b", active: true },
  { label: "Prompt Workbench", color: "#98a0ad" },
  { label: "Approval Hub", color: "#98a0ad" },
  { label: "Prompt Library", color: "#98a0ad" },
];

export const STEPS = ["Scoping", "Generation", "Review", "Approval", "Completed"];

export const SCOPE_FIELDS = ["Disease", "Indication", "Brand", "Molecule", "Markets"];
export const PARAM_FIELDS = [
  "Audience", "Stage", "Intent", "Brand Lifecycle",
  "Prompt Orientation", "Themes", "Keywords", "Count", "Brand Strategy",
];

// The conversational scoping script. Each step asks one question and resolves one
// answer for the demo. Brand strategy is intentionally NOT here — it moved to the end.
export const chatScript = [
  { type: "welcome", text: "Welcome to GEO GPS!" },
  { type: "free", q: "Which disease or indication are we focusing on?",
    a: "Obesity", note: "Obesity confirmed.",
    set: { Disease: "Cardiovascular and Metabolic Diseases", Indication: "Obesity" } },
  { type: "free", q: "Which brand is this prompt universe being planned for? You can search and select from the list, or type the brand name directly.",
    a: "Contrave", note: "Brand saved. Contrave is associated with naltrexone / bupropion.",
    set: { Brand: "Contrave", Molecule: "naltrexone / bupropion" } },
  { type: "multi", q: "Now select the target market or markets for these prompts.",
    a: "India", opts: ["India", "US", "EU", "UK", "Brazil", "Japan"],
    note: "Market selection saved.", set: { Markets: "India" } },
  { type: "free", q: "Choose the correct persona you want me to simulate for these prompts.",
    a: "Patient", note: "Persona confirmed.", set: { Audience: "Patient" } },
  { type: "single", q: "Select the stage from the following.",
    a: "Treatment Initiation",
    opts: ["Disease Awareness", "Treatment Awareness", "Evaluation & Decision-Making", "Treatment Initiation",
      "Long-Term Management", "Advocacy & Empowerment", "Prevention & Risk Reduction", "Advanced Disease & Supportive Care"],
    note: "Stage selection saved.", set: { Stage: "Treatment Initiation" } },
  { type: "multi", q: "Select one or more intents that best match your objective.",
    a: "Lifestyle & Weight Management",
    opts: ["Disease Awareness", "Risk Assessment & Early Detection", "Treatment Understanding", "Disease Control & Prevention",
      "Lifestyle & Weight Management", "Symptom Improvement", "Quality of Life", "Safety & Side Effect Education"],
    note: "Intent selection saved.", set: { Intent: "Lifestyle & Weight Management" } },
  { type: "single", q: "What lifecycle stage is the brand currently in?",
    a: "Post Patent Expiry",
    opts: ["Pre-launch", "Launch", "Growth", "Maturity", "Approaching Patent Expiry", "Post Patent Expiry"],
    note: "Brand lifecycle saved.", set: { "Brand Lifecycle": "Post Patent Expiry" } },
  { type: "single", q: "Should these prompts be branded, unbranded, or mixed?",
    a: "Unbranded", opts: ["Branded", "Unbranded", "Mixed"],
    note: "Selection saved.", set: { "Prompt Orientation": "Unbranded" } },
  { type: "multi", q: "Is there any specific theme or focus area you want GEO to consider? This step is optional.",
    a: "Safety Concerns with Treatment",
    opts: ["How Weight-Loss Drugs Work", "Who Obesity Treatment Helps", "Medication Versus Lifestyle Changes",
      "Safety Concerns with Treatment", "Expected Results and Timeline"],
    note: "Theme selection saved.", set: { Themes: "Safety Concerns with Treatment" } },
  { type: "skip", q: "You can add a keyword to influence the prompt set.",
    a: "Skipped", note: "Keywords saved.", set: { Keywords: "Not set (optional)" } },
  { type: "free", q: "Please enter how many prompts you want to generate (minimum 5):",
    a: "13", note: "Count set to 13.", set: { Count: "13" } },
];

// What the uploaded brand-strategy file (CSV/XML) "contains" after extraction.
// Disease and Markets are deliberately different from the user input to trigger validation flags.
export const extractedStrategy = {
  Disease: "Diabetes",
  Markets: "USA",
  Brand: "Contrave",
  Audience: "Patient",
  objective: "Entrench Contrave's first-line position through tolerability differentiation and treatment-management support.",
  priorities: [
    "Primary — Reinforce treatment-management differentiation",
    "Secondary — Defend against Competitor A",
  ],
  competitors: ["Wegovy", "Saxenda", "Qsymia"],
  risks: ["Safety misinformation risk", "Efficacy comparison risk"],
  sources: ["brand_strategy_sample.csv"],
};

// Which user-input fields to compare against the extracted strategy.
export const comparableFields = ["Disease", "Markets", "Brand", "Audience"];

// Guidance sections shown in the review screen (from the live product).
export const guidanceSections = [
  { label: "Disease / Therapy Context", badge: "DISEASE", tone: "blue" },
  { label: "Persona & Journey Context", badge: "PERSONA", tone: "purple" },
  { label: "Audience Language Guidance", badge: "ALR", tone: "blue" },
  { label: "Intent Evidence Guidance", badge: "EWIP", tone: "purple" },
  { label: "Market Lens Guidance", badge: "MCX", tone: "green" },
  { label: "Market Access Language", badge: "MALL", tone: "green" },
  { label: "Governance Guidance", badge: "GOV", tone: "blue" },
  { label: "Prompt Planning Guidance", badge: "PLAN", tone: "purple" },
  { label: "Source Traceability", badge: "TRACE", tone: "blue" },
];

// Mock generated prompts (what the generation step returns) — natural-language questions.
export const mockPrompts = [
  "What should I know about Contrave if I have a cardiovascular or metabolic condition?",
  "What side effects of Contrave should I ask my doctor about?",
  "How can I better understand whether Contrave is appropriate to discuss with my doctor?",
  "Is Contrave safe for people with cardiovascular and metabolic diseases?",
  "Why might someone with a metabolic disease want to learn more about Contrave before starting treatment?",
  "Can Contrave affect heart health in people with cardiovascular disease?",
  "When comparing treatment options, what should patients understand about Contrave safety?",
  "What questions should I ask about Contrave if I am newly learning about treatment options?",
  "What are common patient concerns about taking Contrave with cardiovascular or metabolic diseases?",
  "How does Contrave fit into treatment discussions for cardiovascular and metabolic diseases?",
];

// The brand-strategy document columns a strategist must fill (shown as a table).
export const strategyColumns = [
  { field: "disease", desc: "Disease / therapeutic area the strategy targets", example: "Diabetes" },
  { field: "market", desc: "Market this strategy is written for", example: "USA" },
  { field: "brand", desc: "Brand name", example: "Contrave" },
  { field: "audience", desc: "Audience / persona", example: "Patient" },
  { field: "objective", desc: "Strategic objective, one sentence", example: "Entrench first-line position through tolerability" },
  { field: "primary_priority", desc: "Primary strategic priority", example: "Reinforce treatment-management differentiation" },
  { field: "secondary_priority", desc: "Secondary priority", example: "Defend against Competitor A" },
  { field: "competitors", desc: "Competitor set, `;` separated", example: "Wegovy;Saxenda;Qsymia" },
  { field: "risk_areas", desc: "Priority risk areas, `;` separated", example: "Safety misinformation risk" },
];

// Prompt Strategy Review (Screen 13) — recommended direction.
export const promptStrategy = {
  runtime: [
    ["Brand", "Contrave"], ["Indication", "Obesity"], ["Market", "India"],
    ["Audience", "Patient"], ["Journey Stage", "Treatment Initiation"],
    ["Lifecycle", "Post Patent Expiry"], ["Orientation", "Unbranded"],
  ],
  recommended: "Prioritize Safety and Clinical Evidence, reflecting Brand Strategy's tolerability priority and elevated current evidence demand. Maintain predominantly unbranded education while reserving branded coverage for product-specific and comparison needs.",
  categoryDirection: [
    ["Safety & Tolerability", "High"],
    ["Clinical Evidence", "High"],
    ["Administration & Use", "Moderate"],
    ["Comparison & Competition", "Supporting"],
  ],
  blueprint: [
    ["Safety Direction", "High Focus Priority"],
    ["Brand Strategy", "Tolerability (Primary priority)"],
    ["Alignment Rating", "Optimal Statistical Prior"],
  ],
  implications: "Maintain comparison coverage vs Competitor A, secondary to Safety. Emphasize treatment-initiation given the Post Patent Expiry lifecycle stage and Treatment-Initiation focus.",
  risks: "Priority Risk — Safety misinformation risk; avoid unsupported superiority claims on weight-loss magnitude.",
  alignment: "Alignment — Brand Strategy, current evidence and Statistical Prior all support elevated Safety emphasis.",
};

// Prompt Mix Plan Review (Screen 15) — category weighting.
export const promptMix = {
  unbranded: 64, branded: 36,
  lifecycleNote: "Lifecycle start 60U/40B — secondary context",
  categories: [
    ["Safety & Tolerability", "16%", "8", "Statistical Prior + Brand Strategy Primary priority"],
    ["Clinical Evidence", "14%", "7", "Reinforces High Prompt Strategy direction"],
    ["Comparison & Competition = Branded", "8%", "4", "Supporting priority; Competitor A context"],
    ["Disease & Symptoms", "12%", "6", "Baseline Disease Awareness scope coverage"],
    ["Diagnosis & Screening", "8%", "4", "Statistical Prior baseline; Supporting in Prompt Strategy"],
    ["Treatment Landscape", "12%", "6", "Growth lifecycle emphasizes treatment-selection context"],
    ["Product-Specific", "10%", "5", "Brand-anchored coverage independent of orientation"],
    ["Administration & Use", "10%", "5", "Moderate Prompt Strategy direction"],
    ["Access & Cost", "6%", "3", "Existing framework baseline; no strategy signal"],
    ["Patient Support", "4%", "2", "Secondary: HCP-run universe reduces emphasis"],
  ],
  total: "Total 100% / 50 prompts — all 10 canonical categories shown (0 conditional categories active for this run)",
};

// Battle Narrative (after brand strategy) — where the brand wins, synthesized from sources.
export const battleNarrative = {
  summary: "Synthesized from the brand plan + deck + live web research — a consulting-strategy pass, not a human-reviewed sign-off. This is the battle narrative; the columns are the raw inputs it reasoned over.",
  columns: [
    {
      key: "WIN AREA",
      title: "Win the community setting with oral, non-injectable convenience vs. GLP-1 injectables",
      points: [
        "Defend and grow community share by positioning against Wegovy and Saxenda's injection burden",
        "Drive higher duration of therapy by leveraging once-daily oral dosing and a non-stimulant mechanism",
        "Counter injectable noise by anchoring on 'no injection' as the core differentiator",
      ],
    },
    {
      key: "FOCUS AREA",
      title: "Own the first 90 days to maximize duration of therapy",
      points: [
        "Directly combat the highest period of discontinuation (nausea, early drop-off) with titration education",
        "Shift focus from pre-script decisions to post-script support and adherence",
        "Build practice-level loyalty by simplifying onboarding and AE management for NPs and PAs",
      ],
    },
    {
      key: "UNIQUE PROPOSITION",
      title: "The most established oral option for patients who'd rather avoid a daily injection",
      points: [
        "Solidify Contrave as a non-injectable standard by leveraging naltrexone/bupropion's long real-world history",
        "Appeal to injection-averse patients by emphasizing oral convenience and titration flexibility",
        "Counter competitor noise by anchoring on tolerability and a non-stimulant profile",
      ],
    },
  ],
  evidence: [
    { key: "BRAND PRIORITY", items: [
      "Entrench Contrave as the leading oral option for obesity",
      "Defend share by reinforcing tolerability and oral convenience",
      "Extend adherence through titration and support education",
    ]},
    { key: "KEY CHARACTERISTICS", items: [
      "Naltrexone/bupropion, once-daily oral, non-stimulant",
      "Key differentiators: oral dosing, no injection, titration flexibility",
      "Perceived as the 'oral alternative' for injection-averse patients",
    ]},
    { key: "CLINICAL TRIALS & EVIDENCE", items: [
      "COR-I / COR-II — 56-week trials, ~5-6% mean weight loss vs placebo",
      "COR-BMOD — with intensive behavior modification, ~9% weight loss",
      "COR-Diabetes — in type 2 diabetes, improved glycemic control",
    ]},
  ],
};
