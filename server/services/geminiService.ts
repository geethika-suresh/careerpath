import { GoogleGenAI } from '@google/genai';
import { StudentProfile } from '../../src/types.ts';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err: any) {
      console.warn('Failed to initialize GoogleGenAI client:', err.message);
      return null;
    }
  }
  return aiClient;
}

export async function generateAICareerInsights(
  student: StudentProfile,
  careerName: string,
  targetSkill?: string
): Promise<{
  tips: string[];
  recommendedProjectIdea: string;
  interviewPrepQuestion: string;
  source: 'gemini' | 'rule-based';
}> {
  const client = getAIClient();

  // Rule-based fallback if AI is unavailable or no key is provided
  const fallbackResponse = {
    tips: [
      `Build real-world projects demonstrating your proficiency with ${targetSkill || careerName} and publish them to GitHub.`,
      `Practice explaining architectural and trade-off decisions clearly for technical interviews.`,
      `Contribute to open-source software or build public developer portfolio demos to stand out to campus recruiters.`
    ],
    recommendedProjectIdea: `Full-featured ${careerName} portfolio project with real API integration, responsive layout, and live demo deployed on Vercel.`,
    interviewPrepQuestion: `How would you architect a production-grade application for ${careerName}, and what performance or security considerations would you prioritize?`,
    source: 'rule-based' as const
  };

  if (!client) {
    return fallbackResponse;
  }

  try {
    const prompt = `You are a friendly senior Engineering Mentor helping a student named ${student.name || 'Student'} studying ${student.branch || 'CSE'} (${student.year || '3rd Year'}).
They are targeting the role: "${careerName}".
Their current skills: ${student.currentSkills?.join(', ') || 'Basics'}.
Their current learning focus: "${targetSkill || 'Core skills'}".

Return a concise JSON object with:
- "tips": Array of 3 specific, actionable, encouraging study/career tips (1-2 sentences each).
- "recommendedProjectIdea": A 1-sentence specific project title and description tailored to them.
- "interviewPrepQuestion": 1 standard technical interview question for this role and skill.

Return ONLY valid JSON without markdown fences.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      return {
        tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 3) : fallbackResponse.tips,
        recommendedProjectIdea: parsed.recommendedProjectIdea || fallbackResponse.recommendedProjectIdea,
        interviewPrepQuestion: parsed.interviewPrepQuestion || fallbackResponse.interviewPrepQuestion,
        source: 'gemini'
      };
    }
    return fallbackResponse;
  } catch (error: any) {
    console.warn('Gemini API call failed or timed out, falling back to rule-based tips:', error.message);
    return fallbackResponse;
  }
}
