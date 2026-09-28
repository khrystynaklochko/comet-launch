import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization as mandated by gemini-api skill
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System prompt for Reverse Engineering Startups
const REVERSE_ENGINEERING_SYSTEM_PROMPT = `
You are the world's foremost Startup Strategy & Reverse-Engineering Intelligence Agent.
When given a company name and optional domain/context, you dissect and reconstruct how the company was actually built, grounded in real public facts, founder interviews, investor memos, and press records.
You do NOT just provide high-level fluff; you provide granular evidence, numbers, timelines, and tactics.

CRITICAL RULES:
1. Distinguish between evidence types for every fact:
   - "REPORTED" (confirmed public fact from founder interview, SEC filing, press release)
   - "ESTIMATED" (grounded industry estimation, third-party data)
   - "INFERRED" (strategic hypothesis based on observable signals)
2. Reconstruct how they got their FIRST 10 CUSTOMERS with granular detail (acquisition channel, persona, pain, pilot duration, founder involvement).
3. Track POSITIONING EVOLUTION across eras (Headline, Subhead, CTA, Target Persona, Promised outcome).
4. Track STRESS & RISK SIGNALS (layoffs, down-rounds, pilot traps, executive departures, pricing reversals) and offer objective strategic interpretations rather than emotional declarations.
5. Provide actionable STRATEGY EXPERIMENTS for early-stage founders to test inspired by this company's playbook.

Output MUST be strictly valid JSON matching this structure:
{
  "id": "slug-id",
  "name": "Company Name",
  "domain": "example.com",
  "foundingYear": 2019,
  "hq": "San Francisco, CA",
  "status": "Public" | "Private" | "Acquired" | "Shut Down",
  "category": "Developer Tools" | "B2B SaaS" | "Fintech" | "Infrastructure" | "Marketplace" | "AI Systems",
  "businessModel": "Usage-Based" | "Seat-Based SaaS" | "Open Source Core" | "Transaction Fee" | "Enterprise License",
  "targetSegment": "B2B" | "B2C" | "B2B2C",
  "summary": "2-3 sentences concise strategic overview",
  "founders": [
    {
      "name": "Founder Name",
      "role": "CEO / CTO",
      "background": "Previous engineering at X, YC alum",
      "archetype": "Technical" | "Product" | "Sales/Commercial",
      "priorAdvantage": "Existing network in Y, domain expertise in Z"
    }
  ],
  "originStory": {
    "originalProblem": "What initial burning pain sparked the company",
    "initialWedge": "Small bounded entry point used to get inside the door",
    "monthsToMvp": 4,
    "monthsToFirstCustomer": 6,
    "firstFinancing": "Bootstrapped" | "Angel / Pre-seed" | "Seed $2M",
    "majorPivot": "Description of any pre-PMF pivot, or 'None - direct evolution'"
  },
  "firstCustomers": [
    {
      "number": 1,
      "nameOrType": "First Customer Name or Profile",
      "date": "2019-Q2",
      "channel": "Founder personal network / YC batchmate",
      "buyerPersona": "VP Engineering at 30-person startup",
      "initialPain": "Specific burning issue solved",
      "contractType": "Paid pilot / Free beta / Annual contract",
      "estimatedAcv": "$10,000 / $500/mo",
      "founderInvolvement": "Extremely high: founder installed code directly",
      "evidence": "Founder interview on podcast X",
      "confidence": "REPORTED"
    }
  ],
  "milestones": [
    {
      "customerCount": 1,
      "period": "2019",
      "primaryChannel": "Founder personal network",
      "icp": "Seed-stage tech founders",
      "salesMotion": "Founder-led high-touch",
      "pricing": "Discounted beta ($100/mo)"
    },
    {
      "customerCount": 10,
      "period": "2020",
      "primaryChannel": "Warm referrals & private beta",
      "icp": "Series A engineering teams",
      "salesMotion": "Founder-assisted onboarding",
      "pricing": "Standard tiered SaaS"
    },
    {
      "customerCount": 100,
      "period": "2021",
      "primaryChannel": "Product Hunt + Word of Mouth",
      "icp": "Modern software orgs",
      "salesMotion": "Self-serve + inside sales",
      "pricing": "Self-serve $12/seat + custom enterprise"
    },
    {
      "customerCount": 1000,
      "period": "2023",
      "primaryChannel": "SEO + Viral sharing loop",
      "icp": "Mid-market & Global Enterprises",
      "salesMotion": "Product-led expansion + Enterprise Sales team",
      "pricing": "Tiered usage + volume commitments"
    }
  ],
  "distributionEngine": {
    "strongestInitialChannel": "Primary breakout channel",
    "subsequentChannels": ["Channel 1", "Channel 2", "Channel 3"],
    "motionType": "Product-Led Growth (PLG)" | "Founder-Led Outbound" | "Developer-First / Open-Source" | "Enterprise Top-Down",
    "viralityMechanism": "How users invited others or shared work",
    "expansionTactic": "Land-and-expand across developer seats"
  },
  "salesMachine": {
    "buyerPersona": "Title of person signing contract",
    "championPersona": "Title of person fighting for adoption",
    "estimatedSalesCycle": "2 weeks / 60 days / 6 months",
    "pocModel": "14-day free pilot / Paid proof-of-concept",
    "securityRequirement": "SOC2 required at Stage X"
  },
  "pricingEvolution": [
    {
      "era": "2019-2020",
      "model": "Flat rate beta ($20/mo)",
      "notes": "Focused solely on feedback, not revenue optimization"
    },
    {
      "era": "2021-2023",
      "model": "Tiered per-seat ($8 / $15 / Enterprise)",
      "notes": "Introduced team collaboration barrier"
    },
    {
      "era": "2024-Present",
      "model": "Seat + AI consumption add-ons",
      "notes": "Added enterprise governance and compliance tier"
    }
  ],
  "positioningEvolution": [
    {
      "year": "2019",
      "headline": "Historic Homepage Headline",
      "subheadline": "Historic subheadline text",
      "cta": "Request Early Access",
      "targetIcp": "Solo developers / Early startups",
      "promisedOutcome": "Build faster in 5 minutes"
    },
    {
      "year": "2022",
      "headline": "Mid-Stage Homepage Headline",
      "subheadline": "Mid-Stage subheadline",
      "cta": "Start Free Trial",
      "targetIcp": "Growing engineering teams",
      "promisedOutcome": "Modern workflow without friction"
    },
    {
      "year": "2025",
      "headline": "Current Homepage Headline",
      "subheadline": "Current subheadline",
      "cta": "Contact Sales / Deploy Now",
      "targetIcp": "Global Enterprises & AI native orgs",
      "promisedOutcome": "Autonomous enterprise software engine"
    }
  ],
  "strategicMoves": [
    {
      "year": "2020",
      "type": "Launch" | "Pricing Change" | "Pivot" | "Open Source" | "Enterprise Expansion" | "Acquisition",
      "title": "Short title of move",
      "objective": "Why they did it",
      "observableEffect": "What happened next in metrics or adoption",
      "confidence": "REPORTED"
    }
  ],
  "stressSignals": [
    {
      "period": "2022-Q3",
      "type": "Layoff" | "Executive Departure" | "Down Round" | "Pilot Trap" | "Repositioning Reversal" | "Outage / Security",
      "observableFact": "Factual event that occurred",
      "strategicInterpretation": "Objective diagnosis (e.g. 'Scaled GTM headcount ahead of repeatable enterprise demand')",
      "confidence": "REPORTED"
    }
  ],
  "strategyDecomposition": {
    "wedge": "Exact entry point",
    "icp": "Initial high-converting buyer",
    "pain": "Acute trigger problem",
    "offer": "What customers initially bought",
    "distribution": "How they discovered it",
    "salesMotion": "How deals closed",
    "retentionMechanism": "Why churn stayed low",
    "expansionMechanism": "How contract size grew",
    "moat": "Defensibility over time",
    "failurePointsAvoided": "Pitfalls they navigated"
  },
  "playbookTactics": [
    {
      "name": "Tactic Name (e.g. Founder-Assisted Installation)",
      "targetStage": "0-10 customers",
      "bestFor": "Complex technical workflows with high friction",
      "risk": "Fails to scale if not productized into self-serve within 9 months",
      "actionableStep": "Step-by-step guidance for early-stage founders to run this exact tactic"
    }
  ],
  "unitEconomicsBenchmark": {
    "estimatedCac": 1200,
    "estimatedLtv": 24000,
    "ltvCacRatio": 20.0,
    "cacPaybackMonths": 5,
    "grossMarginPercent": 80,
    "nrrPercent": 125,
    "primaryAcquisitionChannel": "Developer Word of Mouth / Inbound PLG",
    "notes": "Estimated early-to-mid stage unit economics benchmark"
  },
  "recommendedExperiments": [
    {
      "title": "Experiment Name",
      "hypothesis": "Clear statement of cause and effect",
      "targetIcp": "Precise niche of 30-50 accounts",
      "channel": "Exact outreach or acquisition channel",
      "offer": "Bounded, low-friction pilot or audit",
      "volume": "50 target accounts",
      "duration": "3 weeks",
      "successThreshold": ">= 4 qualified pilot agreements (>25% reply)",
      "stopCondition": "< 2 replies after 40 accounts contacted"
    }
  ],
  "evidenceGraph": [
    {
      "fact": "Key verifiable claim",
      "source": "Founders Podcast / TechCrunch / YC Directory / S-1 Filing",
      "date": "2020",
      "confidence": "REPORTED"
    }
  ]
}
`;

// Reverse engineer company endpoint
app.post('/api/reverse-engineer', async (req: Request, res: Response) => {
  try {
    const { companyName, domain, extraContext } = req.body;
    if (!companyName || typeof companyName !== 'string') {
      res.status(400).json({ error: 'companyName is required' });
      return;
    }

    if (!apiKey) {
      res.status(500).json({
        error: 'GEMINI_API_KEY environment variable is not configured. Please set it in Settings > Secrets.',
      });
      return;
    }

    const prompt = `Reconstruct and reverse-engineer the startup "${companyName.trim()}" ${domain ? `(website: ${domain})` : ''}.
${extraContext ? `Additional context: ${extraContext}` : ''}
Provide exhaustive, factually grounded details for their founding, first 10 customers, first 100 customer scaling, GTM motion, positioning evolution, pricing changes, stress signals, strategy decomposition, and reusable founder experiments.
Return ONLY valid JSON with no markdown backticks or commentary.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: REVERSE_ENGINEERING_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText.trim());
    } catch {
      // If there are stray markdown backticks
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json({ success: true, company: parsedData });
  } catch (error: any) {
    console.error('Error reverse engineering company:', error);
    res.status(500).json({
      error: error?.message || 'Failed to reverse engineer company',
    });
  }
});

// Strategic Advisor ("What Should I Do?") endpoint
app.post('/api/strategic-advisor', async (req: Request, res: Response) => {
  try {
    const { myCompany } = req.body;
    if (!myCompany) {
      res.status(400).json({ error: 'myCompany data is required' });
      return;
    }

    if (!apiKey) {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured.',
      });
      return;
    }

    const prompt = `
You are a principal startup strategist analyzing this founder's company:
Company Name: ${myCompany.name || 'Startup'}
Current Stage: ${myCompany.stage || 'Early Stage'}
Active Pilots: ${myCompany.pilots || '0'}
Paying Customers: ${myCompany.payingCustomers || '0'}
Product Description: ${myCompany.description || 'B2B software'}
Primary Bottleneck / Dilemma: ${myCompany.bottleneck || 'Finding first 10 customers'}
Current Sales Motion: ${myCompany.currentMotion || 'Founder-led outbound'}
Target ICP: ${myCompany.targetIcp || 'Tech companies'}

Do NOT output generic startup platitudes. Ground your guidance in proven historical precedents from comparable startups (e.g. Stripe, Linear, Supabase, Retool, Ramp, Figma, Datadog).
Provide:
1. "comparableCohort": 3-4 historical companies that faced this EXACT stage and bottleneck.
2. "stageDiagnosis": Brutally honest diagnosis of where they actually are.
3. "antiPatternsDetected": Specific traps they are at imminent risk of (e.g., Premature Enterprise Sales, Pilot Trap, Feature Factory, ICP Drift, Discount Dependency) with why it happens.
4. "concreteExperiments": Exactly 3 bounded, measurable experiments to run immediately (with Hypothesis, Target ICP, Channel, Offer/Wedge, Volume, Duration, Success Threshold, and Stop Condition).
5. "immediateNextSteps": 3 non-negotiable actions for this week.
6. "discoveryQuestions": 5 high-signal customer interview questions to validate willingness-to-pay.

Return ONLY valid JSON matching this schema:
{
  "comparableCohort": [
    { "company": "Company Name", "situation": "How they were in the same spot", "move": "The decisive move they made" }
  ],
  "stageDiagnosis": "Thorough analysis of current bottlenecks and structural advantages",
  "antiPatternsDetected": [
    { "name": "Anti-Pattern Name", "warning": "Specific warning", "remedy": "How to avoid or escape it" }
  ],
  "concreteExperiments": [
    {
      "title": "Experiment Title",
      "hypothesis": "Hypothesis text",
      "targetIcp": "Exact target list description",
      "channel": "Channel to use",
      "offer": "Specific bounded offer",
      "volume": "30-50 accounts",
      "duration": "2 weeks",
      "successThreshold": "Clear metric",
      "stopCondition": "Condition to kill test"
    }
  ],
  "immediateNextSteps": ["Step 1", "Step 2", "Step 3"],
  "discoveryQuestions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText.trim().replace(/```json/g, '').replace(/```/g, ''));
    res.json({ success: true, advice: parsedData });
  } catch (error: any) {
    console.error('Error generating strategic advice:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate strategic advice' });
  }
});

// Customer Interview Clustering endpoint
app.post('/api/cluster-interviews', async (req: Request, res: Response) => {
  try {
    const { interviews } = req.body;
    if (!interviews || !Array.isArray(interviews)) {
      res.status(400).json({ error: 'interviews array is required' });
      return;
    }

    if (!apiKey) {
      res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      return;
    }

    const prompt = `Analyze these ${interviews.length} customer discovery interview notes:
${JSON.stringify(interviews, null, 2)}

Extract and cluster:
1. "recurringPains": Array of items with { pain: string, frequency: number, urgencyRating: 'High' | 'Medium' | 'Low', quotes: string[] }
2. "recurringObjections": Array of items with { objection: string, frequency: number, underlyingFear: string, recommendedCounter: string }
3. "idealBuyerPersonaSignals": What specific traits distinguish hot prospects from tire-kickers?
4. "pilotConversionReadiness": Overall synthesis of whether customer demand is repeatable or if ICP needs tightening.

Return ONLY valid JSON matching that structure.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText.trim().replace(/```json/g, '').replace(/```/g, ''));
    res.json({ success: true, clusters: parsedData });
  } catch (error: any) {
    console.error('Error clustering interviews:', error);
    res.status(500).json({ error: error?.message || 'Failed to cluster interviews' });
  }
});

// Growth Strategist & Daily Calendar Planner System Prompt
const GROWTH_STRATEGIST_SYSTEM_PROMPT = `
You are the world's premier Startup Growth Strategist and Tactical Execution Architect at StratEngine.
Your mission is to examine the founder's company description, bottleneck, traction metrics, and desired target goal, and construct an authoritative, highly actionable growth strategy backed by empirical research from benchmark startups (Stripe, Linear, Supabase, Datadog, Retool, Ramp, Figma, PostHog).

CORE BENCHMARK PLAYBOOKS TO REFERENCE:
- Stripe: "Collison Installation" — founder sitting with user or screen-sharing live to install the integration, removing all first-mile activation friction; simple 7-line API wedge over banking bureaucracy.
- Linear: Extreme craft, private beta gating, rejection of premature enterprise custom features to build obsessive developer word-of-mouth.
- Supabase: Quarterly Launch Weeks, open-source Postgres core, documentation benchmarks that drive compounding developer inbound without paid ads.
- Datadog: 21-day hard pilot expiration enforced by written Mutual Action Plans (MAPs) signed by economic buyers before sandbox setup.
- Retool: Live 15-minute internal tooling teardown audits with ops teams, showing them working custom dashboards before asking for money.
- Ramp: Automated SaaS spend audits showing CFOs immediate duplicate software savings before selling corporate cards.

YOUR RESPONSE STRUCTURE IN MULTI-TURN CHAT:
1. Provide a direct, unvarnished diagnostic of the founder's current situation and explain WHICH benchmark playbook applies and WHY.
2. Outline the strategic growth thesis and key milestone phases to reach the goal.
3. Formulate or adjust an exact DAY-BY-DAY plan of tangible deliverables in a calendar timeline up to the goal date. Each deliverable must be a concrete work artifact (e.g. "Signed Mutual Action Plan 2-pager", "15 personalized 45-second Loom teardowns", "SOC2 security FAQ sheet", "Stripe annual prepayment checkout link with 15% discount").
4. EMBEDDED DELIVERABLE CALENDAR JSON:
When formulating or updating the plan, you MUST append a valid JSON block enclosed in exact delimiters <<<GROWTH_PLAN_JSON and >>> at the end of your response so the interactive calendar updates automatically:

<<<GROWTH_PLAN_JSON
{
  "goalTitle": "e.g. Reach 10 Paying Enterprise Customers ($50k ARR)",
  "targetDate": "YYYY-MM-DD",
  "totalDays": 21,
  "strategicSummary": "Core strategic thesis in 2 sentences",
  "coreWedge": "Specific bounded entry offer",
  "targetIcp": "Exact title and company profile",
  "primaryPlaybook": "Stripe Collison Installation + Datadog Mutual Action Plan",
  "deliverables": [
    {
      "dayNumber": 1,
      "dateString": "YYYY-MM-DD",
      "dayOfWeek": "Monday",
      "phase": "Wedge Validation & Prep",
      "title": "Define 3 Non-Negotiable Pilot SLA Criteria",
      "tacticalAction": "Draft the 2-page Mutual Action Plan anchoring to 3 measurable outcomes instead of open-ended testing.",
      "deliverableArtifact": "1-page Mutual Action Plan (MAP) Template in Google Docs/PDF",
      "timeEstimateHours": 3,
      "precedentCompany": "Datadog",
      "precedentLesson": "Eliminates indefinite evaluation drag by agreeing on the go/no-go commercial review date upfront."
    }
  ]
}
>>>

Keep your chat responses articulate, encouraging yet ruthlessly disciplined, and tactical. Never give generic platitudes like 'network more' or 'do marketing'. Give specific, verifiable actions.
`;

// Multi-turn Gemini Chatbot Endpoint for Growth Planning
app.post('/api/chat-growth-planner', async (req: Request, res: Response) => {
  try {
    const { messages, companyContext, model } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'messages array is required' });
      return;
    }

    if (!apiKey) {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured. Please set your key in Settings > Secrets.',
      });
      return;
    }

    // Select model based on user request or guidelines:
    // gemini-3.1-pro-preview for complex tasks, gemini-3.5-flash for general tasks (default), gemini-3.1-flash-lite for fast tasks
    let selectedModel = 'gemini-3.5-flash';
    if (model === 'gemini-3.1-pro-preview') {
      selectedModel = 'gemini-3.1-pro-preview';
    } else if (model === 'gemini-3.1-flash-lite') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else if (model === 'gemini-3.8-flash') {
      selectedModel = 'gemini-3.8-flash';
    }

    // Contextual system prompt with company details
    const contextPrefix = companyContext
      ? `CURRENT FOUNDER'S COMPANY CONTEXT:
- Company Name: ${companyContext.name || 'Startup'}
- Stage: ${companyContext.stage || 'Seed / Early'}
- Paying Customers: ${companyContext.payingCustomers ?? 0}
- Active Pilots: ${companyContext.pilots ?? 0}
- Product & Wedge: ${companyContext.description || 'B2B Software'}
- Primary Bottleneck: ${companyContext.bottleneck || 'Uncertain'}
- Current GTM Motion: ${companyContext.currentMotion || 'Founder-led'}
- Target ICP: ${companyContext.targetIcp || 'Tech companies'}
- Desired Goal: ${companyContext.goalTitle || 'Reach 10 paying customers'}
- Target Horizon / Date: ${companyContext.targetDate || '30 days out'} (${companyContext.totalDays || 30} days)
`
      : '';

    const systemInstruction = `${GROWTH_STRATEGIST_SYSTEM_PROMPT}\n\n${contextPrefix}`;

    // Map messages to Gemini API format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    const responseText = response.text || '';

    // Extract any embedded JSON plan if present
    let extractedPlan = null;
    const planMatch = responseText.match(/<<<GROWTH_PLAN_JSON([\s\S]*?)>>>/);
    if (planMatch && planMatch[1]) {
      try {
        extractedPlan = JSON.parse(planMatch[1].trim());
      } catch (e) {
        console.warn('Failed to parse embedded growth plan JSON:', e);
      }
    }

    res.json({
      success: true,
      message: responseText,
      extractedPlan,
      modelUsed: selectedModel,
    });
  } catch (error: any) {
    console.error('Error in chat-growth-planner:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate growth plan response from Gemini',
    });
  }
});


// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`StratEngine Server running on port ${PORT}`);
  });
}

startServer();
