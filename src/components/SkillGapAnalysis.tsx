import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  CircleDashed, 
  Clock, 
  Map, 
  TrendingUp, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight,
  Filter,
  Check,
  RotateCcw
} from 'lucide-react';
import { Career, SkillGapAnalysisData, StudentProfile, AppView, SkillStatus } from '../types.ts';
import { CAREERS_DATA } from '../data/careersData.ts';

interface SkillGapAnalysisProps {
  selectedCareerId: string;
  student: StudentProfile | null;
  onUpdateSkillStatus: (skill: string, newStatus: SkillStatus) => void;
  setCurrentView: (view: AppView) => void;
  onSelectCareer: (careerId: string) => void;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({
  selectedCareerId,
  student,
  onUpdateSkillStatus,
  setCurrentView,
  onSelectCareer
}) => {
  const [analysis, setAnalysis] = useState<SkillGapAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'have' | 'in_progress' | 'needed'>('all');

  const career: Career = CAREERS_DATA.find((c) => c.id === selectedCareerId) || CAREERS_DATA[0];

  useEffect(() => {
    fetchSkillGap();
  }, [selectedCareerId, student]);

  const fetchSkillGap = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerId: selectedCareerId,
          studentId: student?._id || student?.id,
          currentSkills: student?.currentSkills || [],
          skillStatuses: student?.skillStatuses || {}
        })
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Error fetching skill gap:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const readinessPercent = analysis?.readinessPercentage ?? 0;

  // Filter detailed items
  const displayedSkills = (analysis?.detailedTable || []).filter((item) => {
    if (filterMode === 'have') return item.status === 'completed';
    if (filterMode === 'in_progress') return item.status === 'in_progress';
    if (filterMode === 'needed') return item.status === 'not_started';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Breadcrumb & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Feature 3: Skill Gap Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{career.name} Readiness:</span>
            <span className="text-blue-600 font-black">{readinessPercent}%</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Analyzing your verified skills against industry expectations for {career.name}.
          </p>
        </div>

        {/* Change Target Career Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="change-target-career-select" className="text-xs text-slate-500 font-medium">
            Role:
          </label>
          <select
            id="change-target-career-select"
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
            id="build-roadmap-primary-btn"
            onClick={() => setCurrentView('roadmap')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Build My Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* READINESS PROGRESS BANNER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Role Preparation Index
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              {career.name} Readiness: <span className="text-blue-700">{readinessPercent}%</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-emerald-700">
              ✓ {analysis?.skillsHave.length || 0} Have
            </span>
            <span className="text-amber-700">
              ◐ {analysis?.skillsInProgress.length || 0} In Progress
            </span>
            <span className="text-slate-500">
              ○ {analysis?.skillsNeeded.length || 0} Needed
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{
              width: `${
                career.requiredSkills.length > 0
                  ? ((analysis?.skillsHave.length || 0) / career.requiredSkills.length) * 100
                  : 0
              }%`
            }}
            title="Completed Skills"
          />
          <div
            className="bg-amber-400 h-full transition-all duration-500"
            style={{
              width: `${
                career.requiredSkills.length > 0
                  ? ((analysis?.skillsInProgress.length || 0) / career.requiredSkills.length) * 100
                  : 0
              }%`
            }}
            title="In Progress Skills"
          />
        </div>

        <p className="text-xs text-slate-500">
          Calculated transparently: (Completed Skills + In-Progress × 0.5) ÷ {career.requiredSkills.length} Total Core Skills.
        </p>
      </div>

      {/* 3 VISUAL STATUS COLUMNS: Have / In Progress / Needed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* SKILLS YOU HAVE */}
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                ✓
              </div>
              <h3 className="text-sm font-bold text-emerald-950">Skills You Have</h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {analysis?.skillsHave.length || 0}
            </span>
          </div>

          <p className="text-[11px] text-emerald-800 mb-3">
            Already verified in your student profile.
          </p>

          <div className="space-y-2">
            {(analysis?.skillsHave || []).length > 0 ? (
              analysis?.skillsHave.map((skill) => (
                <div
                  key={skill}
                  className="bg-white border border-emerald-200 rounded-xl px-3 py-2 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{skill}</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Completed
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic py-2">No completed skills yet for this role.</p>
            )}
          </div>
        </div>

        {/* SKILLS IN PROGRESS */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                ◐
              </div>
              <h3 className="text-sm font-bold text-amber-950">Skills In Progress</h3>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              {analysis?.skillsInProgress.length || 0}
            </span>
          </div>

          <p className="text-[11px] text-amber-800 mb-3">
            Currently active learning milestones.
          </p>

          <div className="space-y-2">
            {(analysis?.skillsInProgress || []).length > 0 ? (
              analysis?.skillsInProgress.map((skill) => (
                <div
                  key={skill}
                  className="bg-white border border-amber-200 rounded-xl px-3 py-2 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-amber-950 flex items-center gap-1.5">
                    <span className="text-amber-500 font-bold">◐</span>
                    <span>{skill}</span>
                  </span>
                  <button
                    id={`mark-complete-gap-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => onUpdateSkillStatus(skill, 'completed')}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Mark Done ✓
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic py-2">No skills currently marked in progress.</p>
            )}
          </div>
        </div>

        {/* SKILLS YOU NEED */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs font-bold">
                ○
              </div>
              <h3 className="text-sm font-bold text-slate-900">Skills You Need</h3>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full">
              {analysis?.skillsNeeded.length || 0}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mb-3">
            Required by recruiters but missing from your toolkit.
          </p>

          <div className="space-y-2">
            {(analysis?.skillsNeeded || []).length > 0 ? (
              analysis?.skillsNeeded.map((skill) => (
                <div
                  key={skill}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-700 flex items-center gap-1.5">
                    <span className="text-slate-400">○</span>
                    <span>{skill}</span>
                  </span>
                  <button
                    id={`start-learning-gap-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => onUpdateSkillStatus(skill, 'in_progress')}
                    className="text-[10px] font-semibold text-amber-600 hover:text-amber-800 hover:underline"
                  >
                    Start ◐
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-600 font-medium py-2">Great job! All core skills completed or started.</p>
            )}
          </div>
        </div>
      </div>

      {/* DETAILED COMPARISON TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Detailed Skill Competency Matrix</h3>
            <p className="text-xs text-slate-500">
              Interactive competency breakdown with real-time status toggles.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              All ({analysis?.detailedTable.length || 0})
            </button>
            <button
              onClick={() => setFilterMode('have')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterMode === 'have' ? 'bg-white text-emerald-700 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              Have
            </button>
            <button
              onClick={() => setFilterMode('in_progress')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterMode === 'in_progress' ? 'bg-white text-amber-700 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilterMode('needed')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterMode === 'needed' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              Needed
            </button>
          </div>
        </div>

        {/* HTML Table as specified in Feature 3 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-5">Skill Name</th>
                <th className="py-3 px-4">Importance</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedSkills.map((row) => {
                let statusBadge = (
                  <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                    <span>○</span>
                    <span>Needed</span>
                  </span>
                );

                if (row.status === 'completed') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      <span>✓</span>
                      <span>Have</span>
                    </span>
                  );
                } else if (row.status === 'in_progress') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                      <span>◐</span>
                      <span>In Progress</span>
                    </span>
                  );
                }

                return (
                  <tr key={row.skill} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      {row.skill}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        row.importance === 'Essential' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {row.importance}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {row.category}
                    </td>
                    <td className="py-3.5 px-4">
                      {statusBadge}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {row.status === 'completed' ? (
                        <button
                          onClick={() => onUpdateSkillStatus(row.skill, 'not_started')}
                          className="text-slate-400 hover:text-slate-600 text-[11px]"
                        >
                          Reset
                        </button>
                      ) : row.status === 'in_progress' ? (
                        <button
                          onClick={() => onUpdateSkillStatus(row.skill, 'completed')}
                          className="text-emerald-700 font-bold hover:underline text-[11px]"
                        >
                          Mark Completed ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateSkillStatus(row.skill, 'in_progress')}
                          className="text-blue-600 font-bold hover:underline text-[11px]"
                        >
                          Start Learning ◐
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer with "Build My Roadmap" Button */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 text-center sm:text-left">
            Ready to close your remaining skill gaps step-by-step?
          </p>
          <button
            id="build-my-roadmap-btn"
            onClick={() => setCurrentView('roadmap')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Map className="w-4 h-4" />
            <span>Build My Roadmap</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
