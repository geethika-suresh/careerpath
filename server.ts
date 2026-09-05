import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { CAREERS_DATA } from './src/data/careersData.ts';
import {
  initDatabase,
  getDatabaseStatus,
  createStudent,
  getStudentById,
  updateStudent
} from './server/db.ts';
import {
  calculateCareerMatches,
  calculateSkillGap,
  buildPersonalizedRoadmap,
  computeDashboardMetrics
} from './server/services/careerService.ts';
import { generateAICareerInsights } from './server/services/geminiService.ts';
import { SkillStatus } from './src/types.ts';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Parse JSON bodies
  app.use(express.json());

  // Initialize DB asynchronously without blocking server boot
  initDatabase().catch((err) => {
    console.warn('Background database initialization note:', err.message);
  });

  // Health and DB status
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/db-status', (req, res) => {
    res.json(getDatabaseStatus());
  });

  // ==========================================
  // CAREERS API
  // ==========================================
  app.get('/api/careers', (req, res) => {
    res.json({
      success: true,
      count: CAREERS_DATA.length,
      careers: CAREERS_DATA
    });
  });

  app.get('/api/careers/:id', (req, res) => {
    const career = CAREERS_DATA.find((c) => c.id === req.params.id);
    if (!career) {
      return res.status(404).json({ success: false, error: 'Career not found' });
    }
    res.json({ success: true, career });
  });

  // ==========================================
  // STUDENT API
  // ==========================================
  app.post('/api/students', async (req, res) => {
    try {
      const { name, degree, branch, year, currentSkills, interests, preferredDomain } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, error: 'Student name is required' });
      }
      if (!degree || !degree.trim()) {
        return res.status(400).json({ success: false, error: 'Degree is required' });
      }
      if (!branch || !branch.trim()) {
        return res.status(400).json({ success: false, error: 'Engineering branch is required' });
      }
      if (!year || !year.trim()) {
        return res.status(400).json({ success: false, error: 'Year of study is required' });
      }

      const skillsArray = Array.isArray(currentSkills) ? currentSkills : [];
      const interestsArray = Array.isArray(interests) ? interests : [];

      // Calculate initial recommendations to pick best default career
      const recommendations = calculateCareerMatches(skillsArray, interestsArray);
      const topCareer = recommendations[0]?.career.id || 'frontend-developer';

      // Build initial personalized roadmap
      const roadmapProgress = buildPersonalizedRoadmap(topCareer, skillsArray);

      // Construct initial skill statuses
      const skillStatuses: Record<string, SkillStatus> = {};
      skillsArray.forEach((sk: string) => {
        skillStatuses[sk] = 'completed';
      });

      const newStudent = await createStudent({
        name: name.trim(),
        degree: degree.trim(),
        branch: branch.trim(),
        year: year.trim(),
        currentSkills: skillsArray,
        interests: interestsArray,
        preferredDomain: preferredDomain?.trim() || '',
        selectedCareer: topCareer,
        completedSkills: skillsArray,
        skillStatuses,
        roadmapProgress,
        readinessScore: 0
      });

      // Calculate readiness score
      const dashboard = computeDashboardMetrics(newStudent, topCareer);
      newStudent.readinessScore = dashboard.overallJobReadiness;
      await updateStudent(newStudent._id || newStudent.id!, { readinessScore: dashboard.overallJobReadiness });

      res.status(201).json({
        success: true,
        student: newStudent,
        recommendations,
        message: 'Student profile and career assessment saved successfully'
      });
    } catch (error: any) {
      console.error('Error creating student:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save student profile. Please try again.'
      });
    }
  });

  app.get('/api/students/:id', async (req, res) => {
    try {
      const student = await getStudentById(req.params.id);
      if (!student) {
        return res.status(404).json({ success: false, error: 'Student not found' });
      }
      res.json({ success: true, student });
    } catch (error: any) {
      console.error('Error fetching student:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve student profile' });
    }
  });

  app.put('/api/students/:id', async (req, res) => {
    try {
      const { selectedCareer, currentSkills, interests, completedSkills } = req.body;
      const studentId = req.params.id;

      const existing = await getStudentById(studentId);
      if (!existing) {
        return res.status(404).json({ success: false, error: 'Student not found' });
      }

      const updates: any = {};
      if (selectedCareer) updates.selectedCareer = selectedCareer;
      if (currentSkills) updates.currentSkills = currentSkills;
      if (interests) updates.interests = interests;
      if (completedSkills) updates.completedSkills = completedSkills;

      // If career changed, rebuild personalized roadmap
      if (selectedCareer && selectedCareer !== existing.selectedCareer) {
        updates.roadmapProgress = buildPersonalizedRoadmap(
          selectedCareer,
          updates.currentSkills || existing.currentSkills || []
        );
      }

      const updated = await updateStudent(studentId, updates);
      res.json({ success: true, student: updated });
    } catch (error: any) {
      console.error('Error updating student:', error);
      res.status(500).json({ success: false, error: 'Failed to update student profile' });
    }
  });

  // ==========================================
  // RECOMMENDATIONS API
  // ==========================================
  app.post('/api/recommendations', (req, res) => {
    try {
      const { currentSkills = [], interests = [] } = req.body;
      const recommendations = calculateCareerMatches(currentSkills, interests);
      res.json({
        success: true,
        disclaimer: 'Career recommendations are intended as guidance based on your inputs and are not professionally validated.',
        recommendations
      });
    } catch (error: any) {
      console.error('Error calculating recommendations:', error);
      res.status(500).json({ success: false, error: 'Failed to generate recommendations' });
    }
  });

  // ==========================================
  // SKILL GAP ANALYSIS API
  // ==========================================
  app.post('/api/skill-gap', async (req, res) => {
    try {
      const { careerId, studentId, currentSkills, skillStatuses } = req.body;
      let skillsToUse = currentSkills || [];
      let statusesToUse = skillStatuses || {};

      if (studentId) {
        const student = await getStudentById(studentId);
        if (student) {
          skillsToUse = student.currentSkills || [];
          statusesToUse = student.skillStatuses || {};
        }
      }

      const targetCareerId = careerId || 'frontend-developer';
      const analysis = calculateSkillGap(targetCareerId, skillsToUse, statusesToUse);

      res.json({ success: true, analysis });
    } catch (error: any) {
      console.error('Error calculating skill gap:', error);
      res.status(500).json({ success: false, error: 'Failed to perform skill-gap analysis' });
    }
  });

  // ==========================================
  // ROADMAP API
  // ==========================================
  app.get('/api/roadmap/:careerId', (req, res) => {
    const career = CAREERS_DATA.find((c) => c.id === req.params.careerId);
    if (!career) {
      return res.status(404).json({ success: false, error: 'Career not found' });
    }
    res.json({
      success: true,
      careerId: career.id,
      careerName: career.name,
      roadmap: career.roadmap,
      recommendedProjects: career.recommendedProjects
    });
  });

  // Update specific step status for a student
  app.put('/api/roadmap/:studentId', async (req, res) => {
    try {
      const studentId = req.params.studentId;
      const { stepNumber, skill, status, notes } = req.body;

      if (stepNumber === undefined || !status) {
        return res.status(400).json({ success: false, error: 'stepNumber and status are required' });
      }

      const student = await getStudentById(studentId);
      if (!student) {
        return res.status(404).json({ success: false, error: 'Student not found' });
      }

      const targetCareerId = student.selectedCareer || 'frontend-developer';
      let roadmapProgress = student.roadmapProgress || [];

      if (roadmapProgress.length === 0) {
        roadmapProgress = buildPersonalizedRoadmap(targetCareerId, student.currentSkills || []);
      }

      // Update the step
      const stepIndex = roadmapProgress.findIndex((item) => item.stepNumber === Number(stepNumber));
      if (stepIndex >= 0) {
        roadmapProgress[stepIndex] = {
          ...roadmapProgress[stepIndex],
          status,
          notes: notes !== undefined ? notes : roadmapProgress[stepIndex].notes,
          updatedAt: new Date().toISOString()
        };
      } else {
        roadmapProgress.push({
          stepNumber: Number(stepNumber),
          skill: skill || `Step ${stepNumber}`,
          status,
          notes,
          updatedAt: new Date().toISOString()
        });
      }

      // Update skillStatuses map
      const skillStatuses = { ...(student.skillStatuses || {}) };
      if (skill) {
        skillStatuses[skill] = status;
      }

      // Update completedSkills list
      const completedSkillsSet = new Set(student.completedSkills || []);
      if (skill) {
        if (status === 'completed') {
          completedSkillsSet.add(skill);
        } else {
          completedSkillsSet.delete(skill);
        }
      }

      const updatedStudentData: Partial<typeof student> = {
        roadmapProgress,
        skillStatuses,
        completedSkills: Array.from(completedSkillsSet)
      };

      // Recalculate readiness score
      const tempStudent = { ...student, ...updatedStudentData };
      const newMetrics = computeDashboardMetrics(tempStudent, targetCareerId);
      updatedStudentData.readinessScore = newMetrics.overallJobReadiness;

      const savedStudent = await updateStudent(studentId, updatedStudentData);

      res.json({
        success: true,
        student: savedStudent,
        metrics: newMetrics,
        message: `Step "${skill}" marked as ${status}`
      });
    } catch (error: any) {
      console.error('Error updating roadmap status:', error);
      res.status(500).json({ success: false, error: 'Failed to update roadmap progress' });
    }
  });

  // ==========================================
  // PROGRESS & DASHBOARD API
  // ==========================================
  app.get('/api/progress/:studentId', async (req, res) => {
    try {
      const student = await getStudentById(req.params.studentId);
      if (!student) {
        return res.status(404).json({ success: false, error: 'Student not found' });
      }

      const careerId = (req.query.careerId as string) || student.selectedCareer;
      const metrics = computeDashboardMetrics(student, careerId);

      res.json({
        success: true,
        student,
        metrics
      });
    } catch (error: any) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ success: false, error: 'Failed to compute progress metrics' });
    }
  });

  // ==========================================
  // AI ENHANCEMENT API (Free-tier / rule-based fallback)
  // ==========================================
  app.post('/api/ai/tips', async (req, res) => {
    try {
      const { studentId, careerName, targetSkill } = req.body;
      let student: any = {
        name: 'Student',
        branch: 'CSE',
        year: '3rd Year',
        currentSkills: []
      };

      if (studentId) {
        const found = await getStudentById(studentId);
        if (found) student = found;
      }

      const insights = await generateAICareerInsights(
        student,
        careerName || 'Software Developer',
        targetSkill
      );

      res.json({ success: true, insights });
    } catch (error: any) {
      console.error('AI Tips error:', error);
      res.json({
        success: true,
        insights: {
          tips: [
            'Practice building end-to-end full-stack projects and deploying them online.',
            'Strengthen fundamental problem solving and data structures knowledge.',
            'Document your learning process publicly on LinkedIn and GitHub.'
          ],
          recommendedProjectIdea: 'Personal portfolio highlighting real problem-solving applications.',
          interviewPrepQuestion: 'Explain how you approach debugging a critical production defect.',
          source: 'rule-based'
        }
      });
    }
  });

  // ==========================================
  // VITE MIDDLEWARE (DEV) & STATIC SERVE (PROD)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CareerPath server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
});
