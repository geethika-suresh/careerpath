# CareerPath — Personalized Career Roadmap

> **Tagline:** Know your destination. Follow your path. Become job-ready.  
> **Target Audience:** Final-year & undergraduate engineering students (Computer Science & allied engineering branches).  
> **Project Type:** Final-Year Engineering AI Vibe Coding MVP Full-Stack Web Application.

---

## 1. Project Overview

**CareerPath** is a modern full-stack web application developed to bridge the gap between engineering academics and technical industry employment. It provides students with a tailored 5-step journey: assessing their existing skills, matching suitable technology career roles, analyzing their granular skill gaps, delivering an ordered learning roadmap, and monitoring their real-time job-readiness index.

---

## 2. Problem Statement

Engineering students frequently encounter major roadblocks when transitioning into the software and technology industry:
1. **Uncertainty of Direction:** Students do not know which tech job role aligns best with their academic branch, existing programming knowledge, and core interests.
2. **Opaque Industry Requirements:** Confusion regarding which tools, libraries, and frameworks are genuinely demanded by campus and off-campus recruiters.
3. **Unidentified Skill Gaps:** Inability to objectively diagnose what competencies they already possess versus what they are missing.
4. **Tutorial Paralysis & Disorganized Learning:** Lack of structured guidance on what fundamentals to study first and what to learn next.
5. **No Measure of Readiness:** No tangible metric to answer: *"How job-ready am I right now, and what should I do next?"*

---

## 3. Solution

CareerPath solves this through a unified 5-stage progressive flow:
```
Student Profile Assessment
          ↓
Personalized Career Recommendations
          ↓
Granular Skill Gap Analysis
          ↓
Personalized Career Roadmap
          ↓
Job-Readiness & Progress Dashboard
```
By combining transparent matching formulas, interactive milestone checklists, and real database persistence with MongoDB, CareerPath turns ambiguity into an actionable, confidence-building plan.

---

## 4. The 5 Core Features

### Feature 1: Student Profile & Career Assessment
- Collects: Full Name, Degree, Engineering Branch (CSE, IT, ECE, EEE, Mech, Civil, Other), Year of Study (1st, 2nd, 3rd, Final, Graduate), Current Skills (multi-select + custom tags), and Interests.
- Provides client-side validation, friendly error alerts, a loading state during analysis, and success feedback.
- Saves the student document to **MongoDB** via `POST /api/students` and triggers recommendation generation.

### Feature 2: Personalized Career Recommendations
- Displays 3–5 ranked career paths (e.g., Frontend Developer, Backend Developer, Data Analyst, UI/UX Designer, Software Developer, AI/ML Engineer).
- Shows transparent match percentages, matching skills (✓), and skills to develop (→).
- Includes the explicit educational disclaimer: *"Career recommendations are intended as guidance based on your inputs and are not professionally validated."*

### Feature 3: Skill Gap Analysis
- Categorizes competencies into three clear visual tiers:
  - **Skills You Have (✓ Have / Completed)**
  - **Skills In Progress (◐ In Progress)**
  - **Skills You Need (○ Needed / Not Started)**
- Displays a real-time calculated readiness percentage and an interactive competency matrix table.
- Features a **"Build My Roadmap"** CTA that transitions into the structured curriculum.

### Feature 4: Personalized Career Roadmap
- Generates a customized, ordered step-by-step curriculum customized for the student's existing skills.
- Allows students to toggle milestone statuses: *Completed*, *In Progress*, or *Not Started*.
- Includes **Recommended Projects** (e.g., Developer Portfolio, E-commerce Storefront, REST API, Analytics Dashboard) as supporting learning milestones.
- Toggling a milestone immediately syncs with MongoDB, updates the skill-gap matrix, and recalculates the job-readiness score.

### Feature 5: Job-Readiness & Progress Dashboard
- Answers the core student question: *"How ready am I for my target career, and what should I do next?"*
- Displays: Target Career, Overall Job-Readiness Estimate (0–100%), Skill Progress ratio, Visual Progress Bar, Skills Completed, Skills Remaining, Current Learning Focus, and Recommended Next Action.
- Includes modular AI / rule-based mentor advice, capstone project suggestions, and sample interview questions.

---

## 5. Technologies Used

- **Frontend:** React 19, TypeScript, Tailwind CSS (v4), Lucide React Icons.
- **Backend:** Node.js, Express.js REST API.
- **Database & ODM:** MongoDB, Mongoose (with automated In-Memory fallback for immediate local testing).
- **AI Enhancement:** Optional `@google/genai` integration with instant, high-quality rule-based fallback if no API key is provided.
- **Build & Dev Tooling:** Vite, TypeScript (`tsx`), ESBuild.

---

## 6. Architecture

```
┌────────────────────────────────────────────────────────┐
│               React Frontend (Single Page App)         │
│  Landing  •  Assessment  •  Recommendations  •  Roadmap│
└─────────────────────────┬──────────────────────────────┘
                          │ HTTP REST API (JSON)
┌─────────────────────────▼──────────────────────────────┐
│              Express.js Backend (server.ts)            │
│  /api/students   /api/recommendations   /api/roadmap   │
│  /api/careers    /api/skill-gap         /api/progress  │
└─────────────────────────┬──────────────────────────────┘
                          │ Mongoose ODM / In-Memory Fallback
┌─────────────────────────▼──────────────────────────────┐
│            MongoDB Atlas Database / Storage            │
│                 Collection: students                   │
└────────────────────────────────────────────────────────┘
```

---

## 7. Database Structure (Mongoose Model: `Student`)

```typescript
{
  name: String,            // Student full name
  degree: String,          // e.g. "B.Tech"
  branch: String,          // e.g. "Computer Science Engineering"
  year: String,            // e.g. "3rd Year"
  currentSkills: [String], // Array of checked skills
  interests: [String],     // Array of chosen interest domains
  preferredDomain: String, // Optional user career goal
  selectedCareer: String,  // Active target role ID (e.g. "frontend-developer")
  completedSkills: [String],
  skillStatuses: Map,      // { "React": "in_progress", "HTML": "completed" }
  roadmapProgress: [
    {
      stepNumber: Number,
      skill: String,
      status: "completed" | "in_progress" | "not_started",
      notes: String,
      updatedAt: Date
    }
  ],
  readinessScore: Number,  // 0 to 100
  createdAt: Date,
  updatedAt: Date
}
```

---

## 8. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/students` | Validates, creates student profile, generates recommendations |
| `GET` | `/api/students/:id` | Retrieves saved student profile |
| `PUT` | `/api/students/:id` | Updates target career or profile properties |
| `GET` | `/api/careers` | Returns all predefined career paths with roadmaps & projects |
| `GET` | `/api/careers/:id` | Returns single career specification |
| `POST` | `/api/recommendations` | Calculates ranked career match scores |
| `POST` | `/api/skill-gap` | Evaluates verified skills vs. required skills |
| `GET` | `/api/roadmap/:careerId`| Returns standard roadmap milestones and capstones |
| `PUT` | `/api/roadmap/:studentId`| Updates milestone status, syncs MongoDB & readiness score |
| `GET` | `/api/progress/:studentId`| Computes dashboard metrics and recommended next actions |
| `POST` | `/api/ai/tips` | Generates mentor tips & interview questions (AI or rule-based) |
| `GET` | `/api/db-status` | Returns MongoDB Atlas vs. Local Mode connection state |

---

## 9. Scoring & Business Logic Formulas

### A. Career Matching Score
$$\text{Skill Match Ratio} = \left(\frac{\text{Number of Matching Skills}}{\text{Total Required Skills}}\right) \times 100$$
$$\text{Interest Bonus} = \min(\text{Matching Interests} \times 5\%, 15\%)$$
$$\text{Match Score} = \min(\text{Round}(\text{Skill Match Ratio} \times 0.85 + \text{Interest Bonus}), 100\%)$$

### B. Skill Gap Readiness Percentage
$$\text{Readiness Percentage} = \left(\frac{\text{Completed Skills} + (\text{In-Progress Skills} \times 0.5)}{\text{Total Required Skills}}\right) \times 100$$

### C. CareerPath Job-Readiness Estimate
$$\text{Job Readiness} = \text{Skill Readiness} \times 55\% + \text{Roadmap Completion} \times 35\% + \text{Project Milestone Bonus} \times 10\%$$

---

## 10. AI Implementation & Free-Tier Guarantees

- **Free-Tier Design:** CareerPath is 100% operational **without any paid APIs or credit cards**.
- The recommendation engine, roadmap generator, and readiness calculators run completely on transparent algorithmic logic.
- If `GEMINI_API_KEY` is present in `.env`, CareerPath can optionally generate contextual mentor study advice and interview questions. If missing or failing, it seamlessly falls back to pre-formulated rule-based tips with zero errors or downtime.

---

## 11. Environment Variables Configuration

Create a `.env` file in the root directory (based on `.env.example`):

```env
# Optional: MongoDB Atlas Free Tier connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/careerpath?retryWrites=true&w=majority

# Optional: Free Gemini API Key for AI career mentor tips
GEMINI_API_KEY=your_gemini_api_key_here
```

*Note: If `MONGODB_URI` is omitted, CareerPath automatically activates its built-in in-memory repository so that local evaluation works out of the box.*

---

## 12. How to Run Locally

### Prerequisites
- Node.js 18+ and npm installed.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/careerpath.git
   cd careerpath
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server (Express + Vite on port 3000):
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:3000`.

---

## 13. How to Connect MongoDB Atlas (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a free shared cluster (`M0 Sandbox` - $0 free forever).
3. Under **Database Access**, create a database user and password.
4. Under **Network Access**, add IP address `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** → **Drivers (Node.js)** and copy the connection string.
6. Replace `<password>` with your database user password, and set it in your `.env`:
   ```env
   MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/careerpath?retryWrites=true&w=majority
   ```
7. Restart the server. CareerPath's navigation bar will display: **"MongoDB Connected"**.

---

## 14. How to Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: CareerPath Full-Stack MVP"
git branch -M main
git remote add origin https://github.com/your-username/careerpath.git
git push -u origin main
```
*(Notice: `.env` is included in `.gitignore` to protect credentials.)*

---

## 15. How to Deploy to Vercel

1. Push your code to GitHub.
2. Sign in to [Vercel](https://vercel.com) using your GitHub account.
3. Click **Add New** → **Project** and select your `careerpath` repository.
4. In the Project Settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables in Vercel:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `GEMINI_API_KEY`: (Optional) Your Google AI Studio API key.
6. Click **Deploy**. Vercel will build and host your production web application.

---

## License & Academic Disclaimer
Developed for Computer Science & Engineering Final-Year Project Demonstration.  
*Disclaimer: CareerPath recommendations are intended for educational guidance and do not constitute professional career advice or employment guarantees.*
