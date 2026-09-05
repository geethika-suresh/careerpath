import React, { useState } from 'react';
import { 
  UserCheck, 
  Sparkles, 
  Check, 
  Plus, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  BookOpen,
  GraduationCap,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { StudentProfile } from '../types.ts';
import { 
  BRANCH_OPTIONS, 
  YEAR_OPTIONS, 
  SKILL_OPTIONS, 
  INTEREST_OPTIONS 
} from '../data/careersData.ts';

interface AssessmentFormProps {
  onAssessmentComplete: (student: StudentProfile) => void;
  existingProfile?: StudentProfile | null;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  onAssessmentComplete,
  existingProfile
}) => {
  // Form state
  const [name, setName] = useState(existingProfile?.name || '');
  const [degree, setDegree] = useState(existingProfile?.degree || 'B.Tech (Bachelor of Technology)');
  const [branch, setBranch] = useState(existingProfile?.branch || 'Computer Science Engineering');
  const [year, setYear] = useState(existingProfile?.year || '3rd Year');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    existingProfile?.currentSkills || ['HTML', 'CSS', 'JavaScript']
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    existingProfile?.interests || ['Web Development', 'Frontend Development']
  );
  const [preferredDomain, setPreferredDomain] = useState(existingProfile?.preferredDomain || '');
  const [customSkillInput, setCustomSkillInput] = useState('');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const degreeOptions = [
    'B.Tech (Bachelor of Technology)',
    'B.E. (Bachelor of Engineering)',
    'B.S. in Computer Science',
    'BCA / MCA',
    'M.Tech / M.S.',
    'Other Degree / Diploma'
  ];

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
    if (errors.skills) {
      setErrors((prev) => ({ ...prev, skills: '' }));
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
      setCustomSkillInput('');
      if (errors.skills) {
        setErrors((prev) => ({ ...prev, skills: '' }));
      }
    }
  };

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
    if (errors.interests) {
      setErrors((prev) => ({ ...prev, interests: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!degree.trim()) {
      newErrors.degree = 'Please select your current degree.';
    }

    if (!branch.trim()) {
      newErrors.branch = 'Please select your engineering branch.';
    }

    if (!year.trim()) {
      newErrors.year = 'Please select your current academic year.';
    }

    if (selectedSkills.length === 0) {
      newErrors.skills = 'Please select at least 1 current skill (even basics like HTML or C).';
    }

    if (selectedInterests.length === 0) {
      newErrors.interests = 'Please select at least 1 technology interest.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      // Scroll to top of form if errors
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        degree: degree.trim(),
        branch: branch.trim(),
        year: year.trim(),
        currentSkills: selectedSkills,
        interests: selectedInterests,
        preferredDomain: preferredDomain.trim()
      };

      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save student profile.');
      }

      setSuccessMessage('Your career recommendations are ready!');

      // Smooth delay so the user sees the confirmation as instructed
      setTimeout(() => {
        onAssessmentComplete(data.student);
      }, 1000);
    } catch (err: any) {
      console.error('Assessment submission error:', err);
      setServerError(
        err.message || 'Something went wrong while saving your assessment. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>Feature 1: Student Profile &amp; Career Assessment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Discover Your Ideal Career Direction
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Tell us about your background, existing programming tools, and areas of excitement. We'll map them to high-growth tech roles and generate a tailored roadmap.
        </p>
      </div>

      {/* Main Assessment Form Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-10 relative overflow-hidden">
        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-20 flex flex-col items-center justify-center space-y-3 p-6 text-center animate-in fade-in">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-base font-bold text-slate-900">
              Analyzing your career profile...
            </p>
            <p className="text-xs text-slate-500 max-w-xs">
              Evaluating your skills, comparing industry requirements, and calculating transparent match scores.
            </p>
          </div>
        )}

        {/* Success Confirmation Banner */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm font-medium animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage} Loading your recommendations...</span>
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm font-medium">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* SECTION 1: PERSONAL & ACADEMIC INFO */}
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                <span>Academic &amp; Personal Profile</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">* Required fields</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Student Name */}
              <div className="sm:col-span-2">
                <label htmlFor="student-name-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="student-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="e.g. Geethika Suresh"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/30'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Degree */}
              <div>
                <label htmlFor="degree-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Degree / Program <span className="text-rose-500">*</span>
                </label>
                <select
                  id="degree-select"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                >
                  {degreeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch */}
              <div>
                <label htmlFor="branch-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Engineering Branch <span className="text-rose-500">*</span>
                </label>
                <select
                  id="branch-select"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                >
                  {BRANCH_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year of study */}
              <div>
                <label htmlFor="year-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Year of Study <span className="text-rose-500">*</span>
                </label>
                <select
                  id="year-select"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                >
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred domain */}
              <div>
                <label htmlFor="preferred-domain-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Domain / Goal <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="preferred-domain-input"
                  type="text"
                  value={preferredDomain}
                  onChange={(e) => setPreferredDomain(e.target.value)}
                  placeholder="e.g. Product Startups, Fintech, Full-Stack"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: CURRENT SKILLS */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                  <span>Current Technical Skills <span className="text-rose-500">*</span></span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select all skills you have learned or used in classes, tutorials, or projects.
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                {selectedSkills.length} selected
              </span>
            </div>

            {errors.skills && (
              <p className="text-xs text-rose-600 flex items-center gap-1 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.skills}</span>
              </p>
            )}

            {/* Predefined skill chips */}
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    id={`skill-chip-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>

            {/* Add custom skill input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                id="custom-skill-input"
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSkill(e);
                  }
                }}
                placeholder="Add other skill (e.g. TypeScript, Docker, Flutter)..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-100 focus:outline-none"
              />
              <button
                id="add-custom-skill-btn"
                type="button"
                onClick={handleAddCustomSkill}
                disabled={!customSkillInput.trim()}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* SECTION 3: TECHNOLOGY INTERESTS */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] flex items-center justify-center font-bold">3</span>
                  <span>Technology &amp; Career Interests <span className="text-rose-500">*</span></span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Which fields excite you most? (These provide a slight bonus in recommendation weighting)
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                {selectedInterests.length} selected
              </span>
            </div>

            {errors.interests && (
              <p className="text-xs text-rose-600 flex items-center gap-1 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.interests}</span>
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    id={`interest-btn-${interest.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => handleToggleInterest(interest)}
                    className={`p-3 rounded-xl text-left text-xs font-medium border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 font-semibold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{interest}</span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 text-center sm:text-left">
              Data is persisted to MongoDB. You can update your skills anytime.
            </p>
            <button
              id="submit-assessment-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm shadow-md shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Profile...</span>
                </>
              ) : (
                <>
                  <span>Generate Career Recommendations</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
