import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { AssessmentForm } from './components/AssessmentForm.tsx';
import { CareerRecommendations } from './components/CareerRecommendations.tsx';
import { SkillGapAnalysis } from './components/SkillGapAnalysis.tsx';
import { CareerRoadmap } from './components/CareerRoadmap.tsx';
import { ProgressDashboard } from './components/ProgressDashboard.tsx';
import { 
  AppView, 
  StudentProfile, 
  CareerMatch, 
  SkillStatus 
} from './types.ts';
import { CAREERS_DATA } from './data/careersData.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [recommendations, setRecommendations] = useState<CareerMatch[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('frontend-developer');
  const [dbStatus, setDbStatus] = useState<{
    isConnected: boolean;
    message: string;
    usingFallback: boolean;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Initialize DB status and try loading existing student session
  useEffect(() => {
    checkDbStatus();

    // Check if a student token or ID was previously saved in this browser
    const savedToken =
      localStorage.getItem('careerpath_token') ||
      localStorage.getItem('careerpath_active_student_id');

    if (savedToken) {
      loadStudentProfile(savedToken);
    }
  }, []);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const checkDbStatus = async () => {
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      setDbStatus(data);
    } catch (err) {
      setDbStatus({
        isConnected: false,
        message: 'Local Mode (In-Memory persistence active)',
        usingFallback: true
      });
    }
  };

  const loadStudentProfile = async (studentIdOrToken: string) => {
    try {
      const res = await fetch(`/api/students/${studentIdOrToken}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${studentIdOrToken}`,
          'x-access-token': studentIdOrToken
        }
      });
      const data = await res.json();
      if (data.success && data.student) {
        setStudent(data.student);
        setSelectedCareerId(data.student.selectedCareer || 'frontend-developer');

        // Fetch recommendations for this student
        fetchRecommendations(data.student.currentSkills || [], data.student.interests || []);
      }
    } catch (err) {
      console.warn('Could not restore previous student session:', err);
    }
  };

  const fetchRecommendations = async (skills: string[], interests: string[]) => {
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentSkills: skills, interests })
      });
      const data = await res.json();
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  const handleAssessmentComplete = (newStudent: StudentProfile) => {
    setStudent(newStudent);
    const targetCareer = newStudent.selectedCareer || 'frontend-developer';
    setSelectedCareerId(targetCareer);

    // Save token and ID for session restoration
    const token = newStudent.token || newStudent._id || newStudent.id;
    if (token) {
      try {
        localStorage.setItem('careerpath_token', token);
        localStorage.setItem('careerpath_active_student_id', token);
      } catch (_) {}
    }

    // Fetch and populate recommendations
    fetchRecommendations(newStudent.currentSkills || [], newStudent.interests || []);

    showToast('Assessment saved! Your personalized career map & recommendations are ready.', 'success');
    setCurrentView('recommendations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateRoadmap = async (careerId: string) => {
    const targetCareer = careerId || selectedCareerId;
    setSelectedCareerId(targetCareer);

    try {
      const idOrToken = student?.token || student?._id || student?.id;
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(student?.token ? { 'Authorization': `Bearer ${student.token}` } : {})
        },
        body: JSON.stringify({
          careerId: targetCareer,
          studentId: idOrToken,
          token: student?.token,
          currentSkills: student?.currentSkills || []
        })
      });

      const data = await res.json();
      if (data.success) {
        if (data.student) {
          setStudent(data.student);
        } else if (data.personalizedRoadmap) {
          setStudent((prev) =>
            prev
              ? {
                  ...prev,
                  selectedCareer: targetCareer,
                  roadmapProgress: data.personalizedRoadmap
                }
              : null
          );
        }
        const matchedCareer = CAREERS_DATA.find((c) => c.id === targetCareer);
        showToast(`Generated personalized Career Map for ${matchedCareer?.name || targetCareer}!`, 'success');
      }
    } catch (err) {
      console.error('Error generating roadmap:', err);
      showToast('Could not sync career map.', 'error');
    }
  };

  const handleSelectCareer = async (careerId: string) => {
    setSelectedCareerId(careerId);

    if (student) {
      const studentId = student.token || student._id || student.id;
      try {
        const res = await fetch('/api/roadmap/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(student.token ? { 'Authorization': `Bearer ${student.token}` } : {})
          },
          body: JSON.stringify({
            careerId,
            studentId,
            token: student.token,
            currentSkills: student.currentSkills || []
          })
        });
        const data = await res.json();
        if (data.success && data.student) {
          setStudent(data.student);
        } else if (data.success && data.personalizedRoadmap) {
          setStudent((prev) =>
            prev
              ? {
                  ...prev,
                  selectedCareer: careerId,
                  roadmapProgress: data.personalizedRoadmap
                }
              : null
          );
        }
      } catch (err) {
        console.error('Error updating target career roadmap:', err);
      }
    }

    const matchedCareer = CAREERS_DATA.find((c) => c.id === careerId);
    showToast(`Target role set to: ${matchedCareer?.name || careerId}`, 'info');
  };

  const handleUpdateStepStatus = async (stepNumber: number, skill: string, newStatus: SkillStatus) => {
    if (!student) {
      showToast(`Milestone "${skill}" set to ${newStatus.replace('_', ' ')}. Complete assessment to persist!`, 'info');
      return;
    }

    const studentId = student.token || student._id || student.id;
    try {
      const res = await fetch(`/api/roadmap/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(student.token ? { 'Authorization': `Bearer ${student.token}` } : {})
        },
        body: JSON.stringify({
          stepNumber,
          skill,
          status: newStatus,
          careerId: selectedCareerId,
          token: student.token
        })
      });

      const data = await res.json();
      if (data.success && data.student) {
        setStudent(data.student);
        showToast(`Milestone "${skill}" marked as ${newStatus.replace('_', ' ')}!`, 'success');
      }
    } catch (err) {
      console.error('Error updating roadmap status:', err);
      showToast('Failed to update progress. Please check server.', 'error');
    }
  };

  const handleUpdateSkillStatus = async (skill: string, newStatus: SkillStatus) => {
    if (!student) return;

    // Find step number in active career roadmap
    const career = CAREERS_DATA.find((c) => c.id === selectedCareerId) || CAREERS_DATA[0];
    const step = career.roadmap.find(
      (s) =>
        s.skill.toLowerCase().trim() === skill.toLowerCase().trim() ||
        s.skill.toLowerCase().includes(skill.toLowerCase().trim())
    );

    const stepNumber = step ? step.stepNumber : 1;
    await handleUpdateStepStatus(stepNumber, skill, newStatus);
  };

  const handleResetAssessment = () => {
    if (confirm('Start a new assessment? This allows you to evaluate another engineering profile.')) {
      setStudent(null);
      setRecommendations([]);
      localStorage.removeItem('careerpath_active_student_id');
      setCurrentView('assessment');
      showToast('Profile cleared. Ready for fresh assessment.', 'info');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Top Floating Toast Notification */}
      {toastMessage && (
        <div
          id="app-toast-alert"
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200 shadow-rose-100'
              : toastMessage.type === 'info'
              ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-blue-100'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        student={student}
        dbStatus={dbStatus}
        onResetAssessment={handleResetAssessment}
      />

      {/* Dynamic Main Body Content */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            setCurrentView={setCurrentView}
            student={student}
            onSelectCareer={handleSelectCareer}
          />
        )}

        {currentView === 'assessment' && (
          <AssessmentForm
            onAssessmentComplete={handleAssessmentComplete}
            existingProfile={student}
          />
        )}

        {currentView === 'recommendations' && (
          <CareerRecommendations
            recommendations={recommendations}
            student={student}
            onSelectCareer={handleSelectCareer}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'skill-gap' && (
          <SkillGapAnalysis
            selectedCareerId={selectedCareerId}
            student={student}
            onUpdateSkillStatus={handleUpdateSkillStatus}
            setCurrentView={setCurrentView}
            onSelectCareer={handleSelectCareer}
          />
        )}

        {currentView === 'roadmap' && (
          <CareerRoadmap
            careerId={selectedCareerId}
            student={student}
            onUpdateStepStatus={handleUpdateStepStatus}
            setCurrentView={setCurrentView}
            onSelectCareer={handleSelectCareer}
            onGenerateRoadmap={handleGenerateRoadmap}
          />
        )}

        {currentView === 'dashboard' && (
          <ProgressDashboard
            student={student}
            setCurrentView={setCurrentView}
            onSelectCareer={handleSelectCareer}
          />
        )}
      </main>

      {/* Global Application Footer */}
      <Footer setCurrentView={setCurrentView} />
    </div>
  );
}
