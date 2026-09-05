import React, { useState } from 'react';
import { 
  Map, 
  CheckCircle2, 
  CircleDashed, 
  Clock, 
  ChevronRight, 
  Briefcase, 
  Code, 
  Sparkles, 
  Check, 
  ArrowRight,
  RotateCcw,
  BarChart3,
  Layers,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Career, StudentProfile, SkillStatus, RoadmapProgressItem, AppView } from '../types.ts';
import { CAREERS_DATA } from '../data/careersData.ts';

interface CareerRoadmapProps {
  careerId: string;
  student: StudentProfile | null;
  onUpdateStepStatus: (stepNumber: number, skill: string, newStatus: SkillStatus) => Promise<void>;
  setCurrentView: (view: AppView) => void;
  onSelectCareer: (careerId: string) => void;
}

export const CareerRoadmap: React.FC<CareerRoadmapProps> = ({
  careerId,
  student,
  onUpdateStepStatus,
  setCurrentView,
  onSelectCareer
}) => {
  const [updatingStep, setUpdatingStep] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'projects'>('roadmap');

  const career: Career = CAREERS_DATA.find((c) => c.id === careerId) || CAREERS_DATA[0];

  // Merge career static steps with student personalized roadmap progress
  const progressMap = new Map<number, RoadmapProgressItem>();
  if (student?.roadmapProgress) {
    student.roadmapProgress.forEach((p) => progressMap.set(p.stepNumber, p));
  }

  const stepsWithStatus = career.roadmap.map((step) => {
    const saved = progressMap.get(step.stepNumber);
    let status: SkillStatus = saved?.status || 'not_started';

    // If no explicit record yet, check if student already has this skill
    if (!saved) {
      const hasSkill = student?.currentSkills?.some(
        (s) =>
          s.toLowerCase().trim() === step.skill.toLowerCase().trim() ||
          step.skill.toLowerCase().includes(s.toLowerCase().trim())
      );
      if (hasSkill) status = 'completed';
    }

    return {
      ...step,
      status
    };
  });

  const totalSteps = stepsWithStatus.length;
  const completedSteps = stepsWithStatus.filter((s) => s.status === 'completed').length;
  const inProgressSteps = stepsWithStatus.filter((s) => s.status === 'in_progress').length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const handleStatusChange = async (stepNumber: number, skill: string, newStatus: SkillStatus) => {
    setUpdatingStep(stepNumber);
    try {
      await onUpdateStepStatus(stepNumber, skill, newStatus);
    } catch (err) {
      console.error('Failed to update step status:', err);
    } finally {
      setUpdatingStep(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <Map className="w-3.5 h-3.5" />
            <span>Feature 4: Personalized Career Roadmap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {career.name} Learning Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Personalized learning sequence for {student?.name || 'you'}, organized from foundational skills to portfolio capstones.
          </p>
        </div>

        {/* Action button & Career Selector */}
        <div className="flex items-center gap-2">
          <select
            id="roadmap-career-select"
            value={career.id}
            onChange={(e) => onSelectCareer(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          >
            {CAREERS_DATA.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            id="roadmap-view-dashboard-btn"
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>View Dashboard</span>
          </button>
        </div>
      </div>

      {/* OVERALL ROADMAP PROGRESS CARD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Personalized Milestone Tracker
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-xl font-extrabold text-slate-900">
                {completedSteps} of {totalSteps} Milestones Achieved
              </h2>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {progressPercent}% Complete
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1 text-emerald-700">
              <Check className="w-3.5 h-3.5" />
              <span>{completedSteps} Completed</span>
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <Clock className="w-3.5 h-3.5" />
              <span>{inProgressSteps} In Progress</span>
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span>{totalSteps - completedSteps - inProgressSteps} Remaining</span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* SUB-TABS: Roadmap Steps vs Recommended Projects */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-2">
          <button
            id="tab-roadmap-steps-btn"
            onClick={() => setActiveTab('roadmap')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'roadmap'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Step-by-Step Curriculum ({totalSteps})</span>
          </button>
          <button
            id="tab-recommended-projects-btn"
            onClick={() => setActiveTab('projects')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Recommended Portfolio Projects ({career.recommendedProjects.length})</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: STEP-BY-STEP ROADMAP TIMELINE */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {stepsWithStatus.map((step, index) => {
              const isUpdating = updatingStep === step.stepNumber;
              const isCompleted = step.status === 'completed';
              const isInProgress = step.status === 'in_progress';

              // Category Badge styling
              let catLabel = 'Foundational';
              let catStyle = 'bg-slate-100 text-slate-700';
              if (step.category === 'core') {
                catLabel = 'Core Architecture';
                catStyle = 'bg-blue-50 text-blue-700';
              } else if (step.category === 'framework') {
                catLabel = 'Framework Mastery';
                catStyle = 'bg-indigo-50 text-indigo-700';
              } else if (step.category === 'tool') {
                catLabel = 'Developer Tooling';
                catStyle = 'bg-purple-50 text-purple-700';
              } else if (step.category === 'project') {
                catLabel = 'Hands-on Project';
                catStyle = 'bg-amber-50 text-amber-800';
              } else if (step.category === 'interview') {
                catLabel = 'Interview Prep';
                catStyle = 'bg-emerald-50 text-emerald-800';
              }

              return (
                <div
                  key={step.stepNumber}
                  className={`bg-white border rounded-2xl p-5 transition-all shadow-2xs ${
                    isCompleted
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : isInProgress
                      ? 'border-amber-300 ring-2 ring-amber-100/60'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Step number, Skill, Explanation */}
                    <div className="flex items-start gap-3.5">
                      {/* Step Indicator Circle */}
                      <div
                        className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm transition-colors ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isInProgress
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isCompleted ? <Check className="w-5 h-5" /> : step.stepNumber}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">
                            {step.skill}
                          </h3>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${catStyle}`}>
                            {catLabel}
                          </span>
                          {/* Current Status Pill */}
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : isInProgress
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isCompleted ? '✓ Completed' : isInProgress ? '◐ In Progress' : '○ Not Started'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                          {step.shortExplanation}
                        </p>
                      </div>
                    </div>

                    {/* Right: Interactive Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {isCompleted ? (
                        <button
                          id={`step-revert-btn-${step.stepNumber}`}
                          onClick={() => handleStatusChange(step.stepNumber, step.skill, 'not_started')}
                          disabled={isUpdating}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 text-xs font-medium transition-colors cursor-pointer"
                          title="Reset milestone status"
                        >
                          Reset
                        </button>
                      ) : (
                        <>
                          {!isInProgress && (
                            <button
                              id={`step-start-btn-${step.stepNumber}`}
                              onClick={() => handleStatusChange(step.stepNumber, step.skill, 'in_progress')}
                              disabled={isUpdating}
                              className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Start Learning ◐
                            </button>
                          )}
                          <button
                            id={`step-complete-btn-${step.stepNumber}`}
                            onClick={() => handleStatusChange(step.stepNumber, step.skill, 'completed')}
                            disabled={isUpdating}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark as Completed</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: RECOMMENDED PROJECTS (SUPPORTING CONTENT) */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-5 text-xs text-blue-900 leading-relaxed">
            <h3 className="font-bold text-sm text-blue-950 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Recommended Portfolio Projects for {career.name}</span>
            </h3>
            <p>
              Recruiters prioritize practical proof of execution over certifications. Build and deploy these curated projects to substantiate your readiness on your GitHub and resume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {career.recommendedProjects.map((proj, i) => {
              const diffBadge =
                proj.difficulty === 'Beginner'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : proj.difficulty === 'Intermediate'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-purple-50 text-purple-700 border-purple-200';

              return (
                <div
                  key={proj.title}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Project 0{i + 1}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${diffBadge}`}>
                        {proj.difficulty}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mb-2">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {proj.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Recommended Stack:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {proj.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => setCurrentView('dashboard')}
                        className="w-full py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-700 text-xs font-semibold border border-slate-200 hover:border-blue-200 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Add to Progress Dashboard</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Roadmap Bottom CTA */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white">
            Track Your Job-Readiness Progress
          </h3>
          <p className="text-xs text-slate-400 max-w-md">
            Review your comprehensive Job-Readiness Estimate, skills remaining count, and recommended next actions.
          </p>
        </div>
        <button
          id="roadmap-footer-cta-dashboard-btn"
          onClick={() => setCurrentView('dashboard')}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-900 flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <span>Open Progress Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
