export type SkillStatus = 'completed' | 'in_progress' | 'not_started';

export interface StudentProfile {
  _id?: string;
  id?: string;
  name: string;
  degree: string;
  branch: string;
  year: string;
  currentSkills: string[];
  interests: string[];
  preferredDomain?: string;
  selectedCareer?: string;
  completedSkills: string[];
  skillStatuses: Record<string, SkillStatus>;
  roadmapProgress: RoadmapProgressItem[];
  readinessScore: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoadmapStep {
  stepNumber: number;
  skill: string;
  shortExplanation: string;
  category: 'fundamental' | 'core' | 'framework' | 'tool' | 'project' | 'interview';
  recommendedResource?: string;
  defaultStatus?: SkillStatus;
}

export interface RecommendedProject {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  techStack: string[];
}

export interface Career {
  id: string;
  name: string;
  category: string;
  description: string;
  marketOutlook: string;
  averageSalaryIndia: string;
  requiredSkills: string[];
  coreInterests: string[];
  roadmap: RoadmapStep[];
  recommendedProjects: RecommendedProject[];
}

export interface CareerMatch {
  career: Career;
  matchScore: number;
  matchingSkills: string[];
  skillsToDevelop: string[];
  interestBonus: number;
}

export interface SkillGapItem {
  skill: string;
  status: SkillStatus; // 'completed' | 'in_progress' | 'not_started'
  importance: 'Essential' | 'Recommended' | 'Bonus';
  category: string;
}

export interface SkillGapAnalysisData {
  careerId: string;
  careerName: string;
  readinessPercentage: number;
  skillsHave: string[];
  skillsInProgress: string[];
  skillsNeeded: string[];
  detailedTable: SkillGapItem[];
}

export interface RoadmapProgressItem {
  stepNumber: number;
  skill: string;
  status: SkillStatus;
  notes?: string;
  updatedAt?: string;
}

export interface DashboardMetrics {
  targetCareer: string;
  targetCareerId: string;
  overallJobReadiness: number;
  skillsCompletedCount: number;
  skillsTotalCount: number;
  skillsRemainingCount: number;
  roadmapProgressPercent: number;
  currentFocus: string;
  recommendedNextStep: string;
  projectsCompletedCount: number;
  projectsTotalCount: number;
}

export type AppView = 
  | 'landing'
  | 'assessment'
  | 'recommendations'
  | 'skill-gap'
  | 'roadmap'
  | 'dashboard';
