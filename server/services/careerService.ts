import { CAREERS_DATA } from '../../src/data/careersData.ts';
import {
  Career,
  CareerMatch,
  SkillGapAnalysisData,
  SkillGapItem,
  SkillStatus,
  RoadmapProgressItem,
  DashboardMetrics,
  StudentProfile
} from '../../src/types.ts';

// Normalize skill names for flexible matching (e.g. "Git" vs "Git & GitHub", "React" vs "React.js")
export function normalizeSkillName(name: string): string {
  return name.trim().toLowerCase().replace(/[\.\-_]/g, '');
}

export function skillsMatch(skillA: string, skillB: string): boolean {
  const a = normalizeSkillName(skillA);
  const b = normalizeSkillName(skillB);
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  if ((a.includes('git') && b.includes('git')) || (a.includes('rest') && b.includes('rest'))) return true;
  if ((a.includes('dsa') || a.includes('data structures')) && (b.includes('dsa') || b.includes('data structures'))) return true;
  if ((a.includes('ui') || a.includes('ux')) && (b.includes('ui') || b.includes('ux'))) return true;
  return false;
}

export function calculateCareerMatches(currentSkills: string[], interests: string[]): CareerMatch[] {
  const matches: CareerMatch[] = CAREERS_DATA.map((career) => {
    const requiredSkills = career.requiredSkills;
    const matchingSkills: string[] = [];
    const skillsToDevelop: string[] = [];

    requiredSkills.forEach((reqSkill) => {
      const hasSkill = currentSkills.some((s) => skillsMatch(s, reqSkill));
      if (hasSkill) {
        matchingSkills.push(reqSkill);
      } else {
        skillsToDevelop.push(reqSkill);
      }
    });

    // Pure transparent formula: (Matching Skills / Total Required Skills) * 100
    const rawSkillRatio = requiredSkills.length > 0 ? (matchingSkills.length / requiredSkills.length) * 100 : 0;

    // Small interest influence: +5% for each aligned interest (capped at 15%)
    let interestMatches = 0;
    career.coreInterests.forEach((coreInt) => {
      if (interests.some((i) => i.toLowerCase().includes(coreInt.toLowerCase()) || coreInt.toLowerCase().includes(i.toLowerCase()))) {
        interestMatches += 1;
      }
    });
    const interestBonus = Math.min(interestMatches * 5, 15);

    // Calculate final transparent match score, rounded, min 10% (if interest exists) up to 100%
    const calculatedScore = Math.min(Math.round(rawSkillRatio * 0.85 + interestBonus), 100);
    const finalScore = Math.max(calculatedScore, matchingSkills.length > 0 ? 25 : (interestMatches > 0 ? 15 : 5));

    return {
      career,
      matchScore: finalScore,
      matchingSkills,
      skillsToDevelop,
      interestBonus
    };
  });

  // Sort from highest match to lowest match
  matches.sort((a, b) => b.matchScore - a.matchScore);
  return matches;
}

export function calculateSkillGap(
  careerId: string,
  currentSkills: string[],
  skillStatuses: Record<string, SkillStatus> = {}
): SkillGapAnalysisData {
  const career = CAREERS_DATA.find((c) => c.id === careerId) || CAREERS_DATA[0];
  const requiredSkills = career.requiredSkills;

  const skillsHave: string[] = [];
  const skillsInProgress: string[] = [];
  const skillsNeeded: string[] = [];
  const detailedTable: SkillGapItem[] = [];

  requiredSkills.forEach((skill, index) => {
    // Check manual override in skillStatuses first, then fallback to currentSkills list
    let status: SkillStatus = skillStatuses[skill] || 'not_started';
    if (!skillStatuses[skill]) {
      const studentHas = currentSkills.some((s) => skillsMatch(s, skill));
      status = studentHas ? 'completed' : 'not_started';
    }

    if (status === 'completed') {
      skillsHave.push(skill);
    } else if (status === 'in_progress') {
      skillsInProgress.push(skill);
    } else {
      skillsNeeded.push(skill);
    }

    detailedTable.push({
      skill,
      status,
      importance: index < 3 ? 'Essential' : 'Recommended',
      category: index < 2 ? 'Core Foundations' : index < 5 ? 'Practical Frameworks' : 'Tools & Best Practices'
    });
  });

  // Transparent calculation: (Completed Required Skills + In Progress * 0.5) / Total Required Skills * 100
  const completedPoints = skillsHave.length * 1.0 + skillsInProgress.length * 0.5;
  const readinessPercentage = requiredSkills.length > 0
    ? Math.round((completedPoints / requiredSkills.length) * 100)
    : 0;

  return {
    careerId: career.id,
    careerName: career.name,
    readinessPercentage: Math.min(readinessPercentage, 100),
    skillsHave,
    skillsInProgress,
    skillsNeeded,
    detailedTable
  };
}

export function buildPersonalizedRoadmap(
  careerId: string,
  currentSkills: string[],
  existingProgress: RoadmapProgressItem[] = []
): RoadmapProgressItem[] {
  const career = CAREERS_DATA.find((c) => c.id === careerId) || CAREERS_DATA[0];

  // Match existing progress by normalized skill name so switching careers doesn't falsely overwrite steps
  const existingSkillMap = new Map<string, RoadmapProgressItem>();
  existingProgress.forEach((item) => {
    if (item.skill) {
      existingSkillMap.set(normalizeSkillName(item.skill), item);
    }
  });

  let firstUncompletedFound = false;

  return career.roadmap.map((step) => {
    const normalized = normalizeSkillName(step.skill);

    // If student already saved a status for this exact skill, keep it
    if (existingSkillMap.has(normalized)) {
      const saved = existingSkillMap.get(normalized)!;
      if (saved.status === 'in_progress') {
        firstUncompletedFound = true;
      }
      return {
        stepNumber: step.stepNumber,
        skill: step.skill,
        careerId: career.id,
        status: saved.status,
        notes: saved.notes,
        updatedAt: saved.updatedAt || new Date().toISOString()
      };
    }

    // Default initialization based on student's verified skills
    const hasSkill = currentSkills.some((s) => skillsMatch(s, step.skill));
    let status: SkillStatus = 'not_started';

    if (hasSkill) {
      status = 'completed';
    } else if (!firstUncompletedFound && step.category !== 'project' && step.category !== 'interview') {
      status = 'in_progress';
      firstUncompletedFound = true;
    }

    return {
      stepNumber: step.stepNumber,
      skill: step.skill,
      careerId: career.id,
      status,
      updatedAt: new Date().toISOString()
    };
  });
}

export function computeDashboardMetrics(student: StudentProfile, careerId?: string): DashboardMetrics {
  const targetCareerId = careerId || student.selectedCareer || 'frontend-developer';
  const career = CAREERS_DATA.find((c) => c.id === targetCareerId) || CAREERS_DATA[0];

  const skillGap = calculateSkillGap(targetCareerId, student.currentSkills || [], student.skillStatuses || {});

  // Roadmap metrics: filter for this career or rebuild for this career
  const relevantRoadmap = (student.roadmapProgress || []).filter(
    (item) => !item.careerId || item.careerId === targetCareerId
  );

  const roadmapItems = relevantRoadmap.length > 0
    ? relevantRoadmap
    : buildPersonalizedRoadmap(targetCareerId, student.currentSkills || [], student.roadmapProgress || []);

  const totalSteps = roadmapItems.length;
  const completedSteps = roadmapItems.filter((s) => s.status === 'completed').length;
  const inProgressSteps = roadmapItems.filter((s) => s.status === 'in_progress').length;

  const roadmapProgressPercent = totalSteps > 0
    ? Math.round(((completedSteps + inProgressSteps * 0.4) / totalSteps) * 100)
    : 0;

  // Find current focus
  const currentStep = roadmapItems.find((s) => s.status === 'in_progress') ||
                      roadmapItems.find((s) => s.status === 'not_started') ||
                      roadmapItems[roadmapItems.length - 1];

  const currentFocus = currentStep ? currentStep.skill : 'Skill Mastery & Mock Interviews';

  // Overall Job Readiness estimate calculation combining:
  // - Required Skills Mastery: 55%
  // - Roadmap Execution: 35%
  // - Project & Interview Step: 10%
  const skillReadiness = skillGap.readinessPercentage;
  const overallJobReadiness = Math.min(
    Math.round(skillReadiness * 0.55 + roadmapProgressPercent * 0.35 + (completedSteps > 4 ? 10 : 0)),
    100
  );

  // Generate recommended next step
  let recommendedNextStep = `Focus on mastering ${currentFocus}. Review core documentation and write hands-on code examples.`;
  if (overallJobReadiness < 40) {
    recommendedNextStep = `Solidify foundations in ${currentFocus}. Work through practice problems and build a simple starter mini-app.`;
  } else if (overallJobReadiness < 75) {
    recommendedNextStep = `Complete ${currentFocus} and begin your next recommended portfolio project: "${career.recommendedProjects[1]?.title || 'Practical Capstone'}".`;
  } else {
    recommendedNextStep = `You are highly prepared! Polish your GitHub portfolio, deploy your projects, and prepare for mock technical interviews.`;
  }

  return {
    targetCareer: career.name,
    targetCareerId: career.id,
    overallJobReadiness,
    skillsCompletedCount: skillGap.skillsHave.length,
    skillsTotalCount: career.requiredSkills.length,
    skillsRemainingCount: skillGap.skillsNeeded.length,
    roadmapProgressPercent,
    currentFocus,
    recommendedNextStep,
    projectsCompletedCount: completedSteps >= 6 ? 2 : completedSteps >= 3 ? 1 : 0,
    projectsTotalCount: career.recommendedProjects.length
  };
}
