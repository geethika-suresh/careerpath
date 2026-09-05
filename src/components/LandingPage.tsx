import React from 'react';
import { 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  BookOpen, 
  Map, 
  BarChart3, 
  HelpCircle, 
  AlertCircle,
  GraduationCap,
  Layers,
  ChevronRight,
  Code
} from 'lucide-react';
import { AppView, StudentProfile } from '../types.ts';
import { CAREERS_DATA } from '../data/careersData.ts';

interface LandingPageProps {
  setCurrentView: (view: AppView) => void;
  student: StudentProfile | null;
  onSelectCareer: (careerId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setCurrentView,
  student,
  onSelectCareer
}) => {
  const steps = [
    {
      number: '1',
      title: 'Assess',
      desc: 'Input your branch, current skills, and technology interests.',
      icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
      action: () => setCurrentView('assessment'),
      btnLabel: 'Take Assessment'
    },
    {
      number: '2',
      title: 'Discover',
      desc: 'Receive transparent career match percentages based on your profile.',
      icon: <Target className="w-5 h-5 text-indigo-600" />,
      action: () => setCurrentView('recommendations'),
      btnLabel: 'View Roles'
    },
    {
      number: '3',
      title: 'Analyze',
      desc: 'Pinpoint which skills you have, what is in-progress, and what is missing.',
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      action: () => setCurrentView('skill-gap'),
      btnLabel: 'Check Gap'
    },
    {
      number: '4',
      title: 'Learn',
      desc: 'Follow an ordered, step-by-step curriculum with real project ideas.',
      icon: <Map className="w-5 h-5 text-amber-600" />,
      action: () => setCurrentView('roadmap'),
      btnLabel: 'Open Roadmap'
    },
    {
      number: '5',
      title: 'Track',
      desc: 'Monitor your real-time job-readiness score as you tick off milestones.',
      icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
      action: () => setCurrentView('dashboard'),
      btnLabel: 'View Dashboard'
    }
  ];

  const studentProblems = [
    "Don't know which tech role aligns with their branch & current skills.",
    "Uncertain which specific tools and frameworks recruiters actually look for.",
    "Struggle to identify their exact skill gaps before applying.",
    "Paralyzed by tutorial hell: don't know what to study first and what to learn next.",
    "No measurable way to know how job-ready they currently are."
  ];

  const careerSolutions = [
    "Transparent algorithmic skill & interest matching algorithm.",
    "Curated, industry-aligned required skills for each key career path.",
    "Visual Skill-Gap breakdown: Have vs. In Progress vs. Needed.",
    "Personalized, step-by-step roadmap ordering foundational skills to capstone projects.",
    "Dynamic CareerPath Job-Readiness Estimate with immediate MongoDB persistence."
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white pt-16 pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Student Project Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Final-Year CSE AI Vibe Coding Project</span>
            </div>

            {/* Main Title & Tagline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                CareerPath
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-blue-700 tracking-tight">
                Know your destination. Follow your path. Become job-ready.
              </p>
            </div>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Discover suitable career roles, identify your skill gaps, follow a personalized roadmap, and track your progress toward becoming job-ready.
            </p>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                id="hero-primary-cta"
                onClick={() => setCurrentView('assessment')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{student ? 'Review Career Assessment' : 'Start Career Assessment'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => setCurrentView('recommendations')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Careers</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Active student indicator banner if already assessed */}
            {student && (
              <div className="mt-4 p-3 bg-white/90 border border-blue-200 rounded-xl shadow-2xs inline-flex items-center gap-3 text-xs text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Welcome back, <strong className="text-slate-900">{student.name}</strong>! Target:{' '}
                  <strong className="text-blue-700">{student.selectedCareer?.replace('-', ' ')}</strong> (
                  {student.readinessScore || 0}% Ready)
                </span>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Go to Dashboard →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5-STEP JOURNEY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Structured Guidance Flow
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">
            The 5-Step Path to Tech Employment
          </p>
          <p className="text-sm text-slate-500">
            Assess → Discover → Analyze → Learn → Track
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                    0{step.number}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {step.desc}
                </p>
              </div>

              <button
                id={`step-card-btn-${idx + 1}`}
                onClick={step.action}
                className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-blue-700 text-xs font-semibold border border-slate-200 hover:border-blue-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{step.btnLabel}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM VS SOLUTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl text-white p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Why CareerPath Exists
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
              Solving the Fresh Graduate Dilemma
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Engineering students often possess passion and motivation, but lack clear direction and structured milestone tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Common Problems */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 text-rose-400 font-semibold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>The Student Challenges</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                {studentProblems.map((prob, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                    <span>{prob}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The CareerPath Solution */}
            <div className="bg-blue-950/40 border border-blue-800/60 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>How CareerPath Solves It</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-200">
                {careerSolutions.map((sol, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                    <span>{sol}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CAREER PATHS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Curated Specializations
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Popular Engineering Career Roles
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select any role to view required competencies, roadmap milestones, and capstones.
            </p>
          </div>
          <button
            id="view-all-careers-btn"
            onClick={() => setCurrentView('recommendations')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            <span>View All Recommendations</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAREERS_DATA.slice(0, 6).map((career) => (
            <div
              key={career.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    {career.category}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {career.requiredSkills.length} Core Skills
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                  {career.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {career.description}
                </p>

                <div className="space-y-1.5 mb-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Key Required Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {career.requiredSkills.slice(0, 4).map((sk) => (
                      <span
                        key={sk}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                    {career.requiredSkills.length > 4 && (
                      <span className="text-[11px] bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded">
                        +{career.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
                  {career.roadmap.length} Roadmap Steps
                </span>
                <button
                  id={`explore-preview-${career.id}`}
                  onClick={() => {
                    onSelectCareer(career.id);
                    setCurrentView('skill-gap');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Analyze Gap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
