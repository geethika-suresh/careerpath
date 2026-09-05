import React, { useState } from 'react';
import { 
  Compass, 
  UserCheck, 
  Target, 
  Map, 
  BarChart3, 
  Sparkles, 
  Database,
  Menu, 
  X,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { AppView, StudentProfile } from '../types.ts';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  student: StudentProfile | null;
  dbStatus: { isConnected: boolean; message: string; usingFallback: boolean } | null;
  onResetAssessment: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  student,
  dbStatus,
  onResetAssessment
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AppView; label: string; icon: React.ReactNode; requiresStudent?: boolean }[] = [
    { id: 'landing', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { id: 'assessment', label: student ? 'Assessment' : 'Start Assessment', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'recommendations', label: 'Careers', icon: <Target className="w-4 h-4" /> },
    { id: 'skill-gap', label: 'Skill Gap', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Roadmap', icon: <Map className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-slate-900 tracking-tight">CareerPath</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                  MVP
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Personalized Career Roadmap
              </p>
            </div>
          </button>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side info: Student Badge & DB Indicator */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Database indicator */}
            <div 
              title={dbStatus?.message || 'Database status'} 
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                dbStatus?.isConnected 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="font-medium">
                {dbStatus?.isConnected ? 'MongoDB Connected' : 'Local Storage Mode'}
              </span>
            </div>

            {/* Student profile pill if registered */}
            {student ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  id="nav-user-profile-btn"
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[110px] truncate">{student.name}</span>
                  <span className="text-blue-600 font-semibold">{student.readinessScore || 0}%</span>
                </button>
                <button
                  id="nav-retake-assessment-btn"
                  onClick={onResetAssessment}
                  title="Retake or start new assessment"
                  className="text-slate-400 hover:text-slate-600 p-1 text-xs"
                >
                  Reset
                </button>
              </div>
            ) : (
              <button
                id="nav-cta-assessment-btn"
                onClick={() => handleNavClick('assessment')}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors"
              >
                <span>Assess Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {student && (
              <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                {student.readinessScore || 0}% Ready
              </span>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            );
          })}

          <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-2">
              <span>Database Mode:</span>
              <span className={dbStatus?.isConnected ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                {dbStatus?.isConnected ? 'MongoDB Atlas' : 'Local Storage'}
              </span>
            </div>
            {student && (
              <button
                id="mobile-retake-assessment-btn"
                onClick={() => {
                  onResetAssessment();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center text-xs text-rose-600 py-1.5 font-medium hover:underline"
              >
                Clear / Retake Assessment
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
