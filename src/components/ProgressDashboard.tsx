import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Target, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Map, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Check,
  Code
} from 'lucide-react';
import { StudentProfile, DashboardMetrics, AppView } from '../types.ts';
import { CAREERS_DATA } from '../data/careersData.ts';

interface ProgressDashboardProps {
  student: StudentProfile | null;
  setCurrentView: (view: AppView) => void;
  onSelectCareer: (careerId: string) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  student,
  setCurrentView,
  onSelectCareer
}) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [aiInsights, setAiInsights] = useState<{
    tips: string[];
    recommendedProjectIdea: string;
    interviewPrepQuestion: string;
    source: 'gemini' | 'rule-based';
  } | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);

  const targetCareerId = student?.selectedCareer || 'frontend-developer';
  const targetCareer = CAREERS_DATA.find((c) => c.id === targetCareerId) || CAREERS_DATA[0];

  useEffect(() => {
    if (student) {
      fetchProgressData();
    } else {
      setLoadingMetrics(false);
    }
  }, [student, targetCareerId]);

  const fetchProgressData = async () => {
    setLoadingMetrics(true);
    try {
      const studentId = student?._id || student?.id;
      const response = await fetch(`/api/progress/${studentId}?careerId=${targetCareerId}`);
      const data = await response.json();

      if (data.success && data.metrics) {
        setMetrics(data.metrics);
        // Load AI Insights in background
        fetchAIInsights(data.metrics.currentFocus);
      }
    } catch (err) {
      console.error('Failed to load dashboard progress:', err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const fetchAIInsights = async (focusSkill?: string) => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student?._id || student?.id,
          careerName: targetCareer.name,
          targetSkill: focusSkill
        })
      });
      const data = await res.json();
      if (data.success && data.insights) {
        setAiInsights(data.insights);
      }
    } catch (err) {
      console.error('AI Insights fetch error:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  // If no student profile yet, show friendly empty state as required
  if (!student) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <BarChart3 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            No Active Career Profile Found
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Complete your onboarding assessment to unlock your personalized job-readiness estimate, skill gap metrics, and learning dashboard.
          </p>
        </div>
        <button
          id="dashboard-empty-state-cta"
          onClick={() => setCurrentView('assessment')}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-200 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <span>Start Student Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const overallReadiness = metrics?.overallJobReadiness ?? student.readinessScore ?? 0;
  const roadmapPercent = metrics?.roadmapProgressPercent ?? 0;
  const skillsCompleted = metrics?.skillsCompletedCount ?? student.completedSkills?.length ?? 0;
  const skillsTotal = metrics?.skillsTotalCount ?? targetCareer.requiredSkills.length;
  const skillsRemaining = metrics?.skillsRemainingCount ?? Math.max(0, skillsTotal - skillsCompleted);
  const currentFocus = metrics?.currentFocus ?? 'Core Foundations';
  const recommendedNextStep =
    metrics?.recommendedNextStep ??
    `Solidify your knowledge in ${currentFocus} and complete the next roadmap milestone.`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner: Student Welcome & Target Career Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Feature 5: Job-Readiness &amp; Progress Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {student.name}'s Preparation Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {student.degree} • {student.branch} ({student.year})
          </p>
        </div>

        {/* Target Career Switcher */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Target Career:
            </span>
            <span className="text-xs font-bold text-slate-800">{targetCareer.name}</span>
          </div>
          <select
            id="dashboard-career-switcher"
            value={targetCareer.id}
            onChange={(e) => onSelectCareer(e.target.value)}
            className="text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 shadow-2xs focus:ring-2 focus:ring-blue-100 focus:outline-none"
          >
            {CAREERS_DATA.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CORE ANSWER BOX (Answering: "How ready am I for my target career, and what should I do next?") */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Career Readiness Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Target: {targetCareer.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              CareerPath Job-Readiness Estimate combines required core skills mastery, roadmap milestone execution, and capstone project preparation.
            </p>
          </div>

          {/* Readiness Circle / Score Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center shrink-0 min-w-[170px]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-200 block">
              Job-Readiness
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white my-1 tracking-tight">
              {overallReadiness}%
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">
              {overallReadiness >= 75 ? '★ Interview Ready' : overallReadiness >= 50 ? '● Solid Momentum' : '▲ Early Trajectory'}
            </span>
          </div>
        </div>

        {/* Action Buttons inside hero banner */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
          <button
            id="dashboard-return-roadmap-btn"
            onClick={() => setCurrentView('roadmap')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Map className="w-4 h-4" />
            <span>Return to Roadmap</span>
          </button>
          <button
            id="dashboard-explore-career-btn"
            onClick={() => setCurrentView('skill-gap')}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Skill Gap</span>
          </button>
          <button
            id="dashboard-view-all-careers-btn"
            onClick={() => setCurrentView('recommendations')}
            className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
          >
            <span>Switch or Explore All Roles</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Skill Progress */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Skill Progress</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {skillsCompleted} / {skillsTotal}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Required core skills completed
          </p>
        </div>

        {/* Card 2: Roadmap Progress */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Roadmap Progress</span>
            <Map className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {roadmapPercent}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${roadmapPercent}%` }}
            />
          </div>
        </div>

        {/* Card 3: Skills Completed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Skills Completed</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Done
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            {skillsCompleted}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Verified in active profile
          </p>
        </div>

        {/* Card 4: Skills Remaining */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Skills Remaining</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              To Learn
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {skillsRemaining}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            To reach 100% role readiness
          </p>
        </div>
      </div>

      {/* TWO ACTIONABLE GUIDANCE PANELS: Current Focus & Recommended Next Step */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CURRENT FOCUS CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Current Learning Focus</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {currentFocus}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This is your highest-priority milestone currently in progress or next in sequence on the {targetCareer.name} roadmap.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Ready to mark done?</span>
            <button
              onClick={() => setCurrentView('roadmap')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Update on Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RECOMMENDED NEXT STEP CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>Recommended Next Action</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80">
              "{recommendedNextStep}"
            </p>
            <p className="text-xs text-slate-500">
              Generated algorithmically based on your current completion ratio and missing competencies.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Project support available</span>
            <button
              onClick={() => setCurrentView('roadmap')}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
            >
              <span>See Suggested Projects</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* AI MENTOR TIPS & INTERVIEW PREP CARD (Modular AI / Rule-based enhancement) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              CareerPath Mentor Advice &amp; Interview Question
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
            {aiInsights?.source === 'gemini' ? 'AI-Powered Insights' : 'Structured Career Insights'}
          </span>
        </div>

        {loadingAI ? (
          <div className="py-6 text-center text-xs text-slate-500 animate-pulse">
            Generating mentor tips and interview prep for {targetCareer.name}...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Actionable Tips */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                3 Concrete Preparation Tips:
              </span>
              <ul className="space-y-2 text-xs text-slate-700">
                {(aiInsights?.tips || [
                  `Complete your ${currentFocus} exercises and push them to a dedicated GitHub repo.`,
                  `Build a demonstrable capstone project with a live URL to showcase in campus placements.`,
                  `Practice explaining design tradeoffs between different libraries and paradigms.`
                ]).map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-blue-600 font-bold shrink-0 mt-0.5">0{i + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interview Question & Project Idea */}
            <div className="space-y-3 flex flex-col justify-between">
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 block">
                  Sample Interview Question:
                </span>
                <p className="text-xs font-medium text-indigo-950 italic">
                  "{aiInsights?.interviewPrepQuestion || 'Can you walk us through how you handled asynchronous state or API errors in your recent project?'}"
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Recommended Capstone Idea:
                </span>
                <p className="text-xs text-slate-800 font-medium">
                  {aiInsights?.recommendedProjectIdea || `Interactive ${targetCareer.name} application deployed with CI/CD and unit tests.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
