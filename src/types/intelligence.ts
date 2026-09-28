export type ConfidenceLevel = 'REPORTED' | 'ESTIMATED' | 'INFERRED';

export interface Founder {
  name: string;
  role: string;
  background: string;
  archetype: 'Technical' | 'Product' | 'Sales/Commercial' | 'Domain Specialist';
  priorAdvantage: string;
}

export interface OriginStory {
  originalProblem: string;
  initialWedge: string;
  monthsToMvp: number;
  monthsToFirstCustomer: number;
  firstFinancing: string;
  majorPivot: string;
}

export interface FirstCustomer {
  number: number;
  nameOrType: string;
  date: string;
  channel: string;
  buyerPersona: string;
  initialPain: string;
  contractType: string;
  estimatedAcv: string;
  founderInvolvement: string;
  evidence: string;
  confidence: ConfidenceLevel;
}

export interface CustomerMilestone {
  customerCount: number;
  period: string;
  primaryChannel: string;
  icp: string;
  salesMotion: string;
  pricing: string;
}

export interface DistributionEngine {
  strongestInitialChannel: string;
  subsequentChannels: string[];
  motionType: string;
  viralityMechanism: string;
  expansionTactic: string;
}

export interface SalesMachine {
  buyerPersona: string;
  championPersona: string;
  estimatedSalesCycle: string;
  pocModel: string;
  securityRequirement: string;
}

export interface PricingEra {
  era: string;
  model: string;
  notes: string;
}

export interface PositioningEra {
  year: string;
  headline: string;
  subheadline: string;
  cta: string;
  targetIcp: string;
  promisedOutcome: string;
}

export interface StrategicMove {
  year: string;
  type: 'Launch' | 'Pricing Change' | 'Pivot' | 'Open Source' | 'Enterprise Expansion' | 'Acquisition' | 'Strategic Partnership';
  title: string;
  objective: string;
  observableEffect: string;
  confidence: ConfidenceLevel;
}

export interface StressSignal {
  period: string;
  type: 'Layoff' | 'Executive Departure' | 'Down Round' | 'Pilot Trap' | 'Repositioning Reversal' | 'Outage / Security' | 'Customer Concentration';
  observableFact: string;
  strategicInterpretation: string;
  confidence: ConfidenceLevel;
}

export interface StrategyDecomposition {
  wedge: string;
  icp: string;
  pain: string;
  offer: string;
  distribution: string;
  salesMotion: string;
  retentionMechanism: string;
  expansionMechanism: string;
  moat: string;
  failurePointsAvoided: string;
}

export interface PlaybookTactic {
  name: string;
  targetStage: string;
  bestFor: string;
  risk: string;
  actionableStep: string;
}

export interface Experiment {
  id: string;
  title: string;
  hypothesis: string;
  targetIcp: string;
  channel: string;
  offer: string;
  volume: string;
  duration: string;
  successThreshold: string;
  stopCondition: string;
  status: 'backlog' | 'testing' | 'validated' | 'killed';
  learnings?: string;
  createdAt?: string;
  milestoneTarget?: number;
  phaseTag?: string;
}

export interface EvidenceItem {
  fact: string;
  source: string;
  date: string;
  confidence: ConfidenceLevel;
}

export interface UnitEconomicsBenchmark {
  estimatedCac: number;
  estimatedLtv: number;
  ltvCacRatio: number;
  cacPaybackMonths: number;
  grossMarginPercent: number;
  nrrPercent: number;
  primaryAcquisitionChannel: string;
  notes: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  domain: string;
  foundingYear: number;
  hq: string;
  status: 'Public' | 'Private' | 'Acquired' | 'Shut Down';
  category: string;
  businessModel: string;
  targetSegment: 'B2B' | 'B2C' | 'B2B2C';
  summary: string;
  founders: Founder[];
  originStory: OriginStory;
  firstCustomers: FirstCustomer[];
  milestones: CustomerMilestone[];
  distributionEngine: DistributionEngine;
  salesMachine: SalesMachine;
  pricingEvolution: PricingEra[];
  positioningEvolution: PositioningEra[];
  strategicMoves: StrategicMove[];
  stressSignals: StressSignal[];
  strategyDecomposition: StrategyDecomposition;
  playbookTactics: PlaybookTactic[];
  unitEconomicsBenchmark?: UnitEconomicsBenchmark;
  recommendedExperiments: Array<{
    title: string;
    hypothesis: string;
    targetIcp: string;
    channel: string;
    offer: string;
    volume: string;
    duration: string;
    successThreshold: string;
    stopCondition: string;
  }>;
  evidenceGraph: EvidenceItem[];
}

export interface CustomerInterview {
  id: string;
  company: string;
  interviewee: string;
  role: string;
  painRating: 1 | 2 | 3 | 4 | 5;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  budgetConfirmed: boolean;
  keyQuotes: string;
  notes: string;
  pilotInterest: 'High' | 'Medium' | 'Low' | 'None';
  date: string;
}

export interface MilestoneProgressItem {
  id: string;
  category: 'revenue' | 'customers' | 'product_pilot' | 'capital_efficiency';
  title: string;
  description: string;
  targetMetric?: string;
  currentMetric?: string;
  phaseId: 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4';
  completed: boolean;
  completedAt?: string;
  proofEvidence?: string;
}

export interface MyCompanyState {
  name: string;
  stage: string;
  pilots: number;
  payingCustomers: number;
  description: string;
  bottleneck: string;
  currentMotion: string;
  targetIcp: string;
  experiments: Experiment[];
  interviews: CustomerInterview[];
  unitEconomics?: {
    cac: number;
    monthlyArpu: number;
    lifetimeMonths: number;
    grossMargin: number;
    nrrPercent: number;
  };
  monthsActive?: number;
  financials?: {
    monthlyRevenue: number;
    operatingExpenses: number;
    cashBalance: number;
  };
  moatScores?: Record<string, number>;
  trackedMilestones?: MilestoneProgressItem[];
  currentGoalId?: string;
  resourceAllocation?: ResourceAllocationState;
  completedRiskMitigationSteps?: string[];
  customRiskMitigations?: RiskMitigationAction[];
  customGtmRisks?: GtmRiskItem[];
  growthPlan?: GrowthGoalPlan;
  growthChatHistory?: ChatMessage[];
}

export interface DailyDeliverablePlan {
  dayNumber: number;
  dateString: string;
  dayOfWeek: string;
  phase: string;
  title: string;
  tacticalAction: string;
  deliverableArtifact: string;
  timeEstimateHours: number;
  precedentCompany: string;
  precedentLesson: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface GrowthGoalPlan {
  goalTitle: string;
  targetDate: string;
  totalDays: number;
  strategicSummary: string;
  coreWedge: string;
  targetIcp: string;
  primaryPlaybook: string;
  deliverables: DailyDeliverablePlan[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  extractedPlan?: GrowthGoalPlan;
}

export interface GtmRiskItem {
  id: string;
  name: string;
  category: 'pipeline' | 'economics' | 'channel' | 'execution' | 'retention' | 'market';
  impact: number; // 0 to 100
  probability: number; // 0 to 100
  capitalAllocationPriority: 'CRITICAL_IMMEDIATE' | 'HIGH_CONTINGENCY' | 'MODERATE_MONITOR' | 'LOW_ACCEPTABLE';
  description: string;
  recommendedInvestment: string;
  precedentWarning: string;
  estimatedRevenueAtRisk: string;
  timeAllocationWeeklyHours: number;
  budgetAllocationMonthlyDollars: number;
}

export interface RiskMitigationAction {
  id: string;
  riskCategory: 'outbound_fatigue' | 'pilot_drag' | 'premature_ad_burn' | 'long_sales_cycle' | 'single_channel_dependency' | 'churn_expansion_leak';
  title: string;
  description: string;
  impactScoreReduction: number;
  difficulty: 'low' | 'medium' | 'high';
  estimatedDays: string;
  deliverable: string;
  precedentCompany: string;
  completed: boolean;
  completedAt?: string;
}

export interface ResourceChannelAllocation {
  id: string;
  name: string;
  timeHours: number; // hours/week
  budgetDollars: number; // monthly budget in USD
  category: 'direct_outbound' | 'community' | 'technical_content' | 'paid_channels' | 'integrations_plg' | 'events_partnerships';
  benchmarkTimePct: number;
  benchmarkBudgetPct: number;
  efficiencyTier: 'high' | 'medium' | 'low';
}

export interface ResourceAllocationState {
  totalWeeklyHours: number;
  totalMonthlyBudget: number;
  channels: ResourceChannelAllocation[];
  selectedPreset?: string;
}
