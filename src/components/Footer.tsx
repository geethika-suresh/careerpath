import React from 'react';
import { Compass, ShieldAlert, Code2, Heart } from 'lucide-react';
import { AppView } from '../types.ts';

interface FooterProps {
  setCurrentView: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">CareerPath</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Personalized career guidance and step-by-step roadmap for engineering students.
              Bridge your skill gaps, follow structured milestones, and track your job-readiness with confidence.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-400">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Full-Stack MVP built with React, Node.js, Express &amp; MongoDB</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs uppercase font-semibold tracking-wider text-slate-200 mb-3">
              5-Step Journey
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  id="footer-nav-assess"
                  onClick={() => setCurrentView('assessment')}
                  className="hover:text-white transition-colors"
                >
                  1. Assess — Profile &amp; Skills Assessment
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-discover"
                  onClick={() => setCurrentView('recommendations')}
                  className="hover:text-white transition-colors"
                >
                  2. Discover — Career Recommendations
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-analyze"
                  onClick={() => setCurrentView('skill-gap')}
                  className="hover:text-white transition-colors"
                >
                  3. Analyze — Skill Gap Analysis
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-learn"
                  onClick={() => setCurrentView('roadmap')}
                  className="hover:text-white transition-colors"
                >
                  4. Learn — Personalized Roadmap
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-track"
                  onClick={() => setCurrentView('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  5. Track — Job-Readiness Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Career Roles Covered */}
          <div>
            <h4 className="text-xs uppercase font-semibold tracking-wider text-slate-200 mb-3">
              Target Career Domains
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Frontend Developer</li>
              <li>• Backend Developer</li>
              <li>• Data Analyst</li>
              <li>• UI/UX Designer</li>
              <li>• Software Developer (DSA &amp; OOP)</li>
              <li>• AI / Machine Learning Engineer</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer box as required by prompt */}
        <div className="mt-8 p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white font-medium">Important Guidance Disclaimer:</strong> Career recommendations and job-readiness estimates are intended as educational guidance based on your self-reported inputs and are not professionally validated career or employment guarantees.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareerPath. Built for CSE Final-Year Project Demonstration.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for engineering students everywhere.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
