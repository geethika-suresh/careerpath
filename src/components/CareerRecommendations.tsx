import React from 'react';
import { 
  Target, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldAlert, 
  ChevronRight, 
  Layers, 
  HelpCircle,
  Clock,
  TrendingUp,
  Compass,
  Map
} from 'lucide-react';
import { CareerMatch, StudentProfile, AppView } from '../types.ts';

interface CareerRecommendationsProps {
  recommendations: CareerMatch[];
  student: StudentProfile | null;
  onSelectCareer: (careerId: string) => void;
  setCurrentView: (view: AppView) => void;
}

export const CareerRecommendations: React.FC<CareerRecommendationsProps> = ({
  recommendations,
  student,
  onSelectCareer,
  setCurrentView
}) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">No Recommendations Found Yet</h2>
        <p className="text-sm text-slate-600 mb-6">
          Complete your student assessment to see personalized career recommendations matched to your skills.
        </p>
        <button
          id="empty-state-take-assessment-btn"
          onClick={() => setCurrentView('assessment')}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
        >
          Start Assessment Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Heading Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Feature 2: Personalized Career Recommendations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tailored Career Paths for {student?.name || 'You'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Ranked by transparent skill-match scoring ({student?.currentSkills?.length || 0} skills analyzed).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="rec-retake-assessment-btn"
            onClick={() => setCurrentView('assessment')}
            className="text-xs font-semibold text-slate-600 bg-white border border-slate-300 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Update Skills
          </button>
          {student?.selectedCareer && (
            <button
              id="rec-view-roadmap-btn"
              onClick={() => setCurrentView('roadmap')}
              className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
            >
              <span>Current Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mandatory Career Guidance Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-3 text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed space-y-1">
          <p className="font-semibold text-amber-950">
            Career Guidance Disclaimer
          </p>
          <p className="text-amber-800">
            "Career recommendations are intended as guidance based on your inputs and are not professionally validated."
          </p>
        </div>
      </div>

      {/* Transparent Logic Explanation Pill */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Transparent Match Formula:</span>
          <code className="bg-white px-2 py-0.5 rounded border border-slate-200 text-blue-700 font-mono text-[11px]">
            (Matching Skills / Total Required Skills) × 100 + Interest Bonus
          </code>
        </div>
        <span className="text-slate-400 text-[11px]">Sorted strictly by highest match</span>
      </div>

      {/* Career Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((item, index) => {
          const { career, matchScore, matchingSkills, skillsToDevelop } = item;
          const isCurrentSelected = student?.selectedCareer === career.id;

          // Color accents based on match tier
          const scoreColor =
            matchScore >= 75
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : matchScore >= 50
              ? 'text-blue-700 bg-blue-50 border-blue-200'
              : 'text-amber-700 bg-amber-50 border-amber-200';

          return (
            <div
              key={career.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between p-6 relative ${
                isCurrentSelected
                  ? 'border-blue-500 shadow-md ring-2 ring-blue-100'
                  : 'border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Rank & Selection Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                    #{index + 1}
                  </span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {career.category}
                  </span>
                </div>

                {isCurrentSelected && (
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Active Target Career
                  </span>
                )}
              </div>

              {/* Career Title & Match Percentage */}
              <div className="mb-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {career.name}
                  </h3>
                  <div
                    className={`px-2.5 py-1 rounded-lg border font-extrabold text-xs tracking-tight shrink-0 ${scoreColor}`}
                  >
                    {matchScore}% Match
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {career.description}
                </p>
              </div>

              {/* Skills Breakdown: Matching vs Need to Develop */}
              <div className="space-y-3.5 my-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                {/* Matching Skills */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <Check className="w-3.5 h-3.5" />
                      <span>Matching Skills ({matchingSkills.length}):</span>
                    </span>
                  </div>
                  {matchingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {matchingSkills.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md font-medium"
                        >
                          <span>✓</span>
                          <span>{sk}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">No direct matching skills yet.</p>
                  )}
                </div>

                {/* Skills To Develop */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1.5">
                    <span className="flex items-center gap-1 text-amber-700">
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Skills to Develop ({skillsToDevelop.length}):</span>
                    </span>
                  </div>
                  {skillsToDevelop.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {skillsToDevelop.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-medium"
                        >
                          <span className="text-amber-500">→</span>
                          <span>{sk}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-emerald-700 font-medium">
                      All required skills already in your toolkit!
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <span className="text-[11px] text-slate-500 font-medium">
                  {career.roadmap.length} Milestones • {career.recommendedProjects.length} Projects
                </span>

                <div className="flex items-center gap-2">
                  <button
                    id={`skill-gap-btn-${career.id}`}
                    onClick={() => {
                      onSelectCareer(career.id);
                      setCurrentView('skill-gap');
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                    title="Inspect skill gaps"
                  >
                    Skill Gap
                  </button>

                  <button
                    id={`generate-career-map-btn-${career.id}`}
                    onClick={() => {
                      onSelectCareer(career.id);
                      setCurrentView('roadmap');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isCurrentSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                        : 'bg-slate-900 text-white hover:bg-blue-600'
                    }`}
                  >
                    <Map className="w-3.5 h-3.5" />
                    <span>Career Map</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
