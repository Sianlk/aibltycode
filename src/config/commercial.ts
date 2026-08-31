export type AibltyCodePlanId = 'free' | 'pro' | 'family' | 'educator' | 'school' | 'enterprise';

export type CommercialFeature =
  | 'learning_paths'
  | 'practice_projects'
  | 'ai_tutor'
  | 'progress_history'
  | 'certificates'
  | 'family_dashboard'
  | 'educator_dashboard'
  | 'classrooms'
  | 'team_seats'
  | 'advanced_analytics'
  | 'api'
  | 'white_label'
  | 'priority_support';

export interface PlanDefinition {
  id: AibltyCodePlanId;
  name: string;
  audience: string;
  monthlyPriceGBP: number | null;
  annualPriceGBP: number | null;
  includedSeats: number;
  limits: { aiTutorActionsPerMonth: number | null; activeLearningPaths: number | null };
  features: readonly CommercialFeature[];
  expansion: readonly ('seat' | 'usage' | 'api' | 'white_label')[];
}

/**
 * Shared commercial catalogue for mobile, web and API clients. Billing provider
 * IDs and subscription truth remain server-side; this file defines product intent
 * and client-safe entitlements only.
 */
export const AIBLTY_CODE_PLANS: Record<AibltyCodePlanId, PlanDefinition> = {
  free: {
    id: 'free', name: 'Free', audience: 'Learners discovering AIBLTY Code',
    monthlyPriceGBP: 0, annualPriceGBP: 0, includedSeats: 1,
    limits: { aiTutorActionsPerMonth: 10, activeLearningPaths: 1 },
    features: ['learning_paths', 'practice_projects'], expansion: [],
  },
  pro: {
    id: 'pro', name: 'Pro Learner', audience: 'Independent learners building job-ready skills',
    monthlyPriceGBP: 19, annualPriceGBP: 190, includedSeats: 1,
    limits: { aiTutorActionsPerMonth: 500, activeLearningPaths: null },
    features: ['learning_paths', 'practice_projects', 'ai_tutor', 'progress_history', 'certificates', 'advanced_analytics'],
    expansion: ['usage'],
  },
  family: {
    id: 'family', name: 'Family', audience: 'Households supporting multiple learners',
    monthlyPriceGBP: 29, annualPriceGBP: 290, includedSeats: 5,
    limits: { aiTutorActionsPerMonth: 1200, activeLearningPaths: null },
    features: ['learning_paths', 'practice_projects', 'ai_tutor', 'progress_history', 'certificates', 'family_dashboard', 'advanced_analytics'],
    expansion: ['seat', 'usage'],
  },
  educator: {
    id: 'educator', name: 'Educator', audience: 'Tutors and independent educators',
    monthlyPriceGBP: 49, annualPriceGBP: 490, includedSeats: 30,
    limits: { aiTutorActionsPerMonth: 3000, activeLearningPaths: null },
    features: ['learning_paths', 'practice_projects', 'ai_tutor', 'progress_history', 'certificates', 'educator_dashboard', 'classrooms', 'advanced_analytics', 'priority_support'],
    expansion: ['seat', 'usage'],
  },
  school: {
    id: 'school', name: 'School', audience: 'Schools, colleges and training providers',
    monthlyPriceGBP: 299, annualPriceGBP: 2990, includedSeats: 250,
    limits: { aiTutorActionsPerMonth: 20000, activeLearningPaths: null },
    features: ['learning_paths', 'practice_projects', 'ai_tutor', 'progress_history', 'certificates', 'educator_dashboard', 'classrooms', 'team_seats', 'advanced_analytics', 'api', 'priority_support'],
    expansion: ['seat', 'usage', 'api'],
  },
  enterprise: {
    id: 'enterprise', name: 'Enterprise', audience: 'Large education, workforce and platform partners',
    monthlyPriceGBP: null, annualPriceGBP: null, includedSeats: 1000,
    limits: { aiTutorActionsPerMonth: null, activeLearningPaths: null },
    features: ['learning_paths', 'practice_projects', 'ai_tutor', 'progress_history', 'certificates', 'family_dashboard', 'educator_dashboard', 'classrooms', 'team_seats', 'advanced_analytics', 'api', 'white_label', 'priority_support'],
    expansion: ['seat', 'usage', 'api', 'white_label'],
  },
};

export function hasFeature(planId: AibltyCodePlanId, feature: CommercialFeature): boolean {
  return AIBLTY_CODE_PLANS[planId].features.includes(feature);
}

/**
 * Privacy-safe, aggregate learning signals that can improve owned curriculum and
 * recommendation systems. Do not include learner names, messages, raw code or
 * other directly identifying content in commercial analytics.
 */
export interface LearningSignal {
  skillId: string;
  lessonId?: string;
  difficultyBand?: string;
  completionState: 'started' | 'completed' | 'abandoned';
  attemptsBand?: string;
  masteryBand?: string;
  timeOnTaskBand?: string;
  capturedAt: string;
  schemaVersion: 1;
}

export const COMMERCIAL_ARCHITECTURE = {
  revenueFloorTargetMRRGBP: 100_000,
  wealthEquation: 'Value × Reach × Repeatability × Ownership',
  growthLoops: [
    'free lesson/tool → learner activation → Pro conversion',
    'progress history + adaptive learning → repeat use → retention',
    'shareable projects/certificates → learner distribution → acquisition',
    'classroom invitations → institutional adoption → seat expansion',
    'aggregate mastery signals → better curriculum/recommendations → higher outcomes → retention',
    'school/API/white-label partners → distribution → recurring B2B revenue',
  ] as const,
  ownedAssets: [
    'structured curriculum graph',
    'privacy-safe mastery benchmarks',
    'learning-path performance data',
    'assessment and recommendation logic',
    'project/certificate distribution graph',
    'institutional integrations',
  ] as const,
} as const;
