import mongoose, { Schema, Document, Model } from 'mongoose';
import { SkillStatus, RoadmapProgressItem } from '../../src/types.ts';

export interface IStudentDocument extends Document {
  name: string;
  degree: string;
  branch: string;
  year: string;
  currentSkills: string[];
  interests: string[];
  preferredDomain?: string;
  selectedCareer?: string;
  completedSkills: string[];
  skillStatuses: Map<string, SkillStatus> | Record<string, SkillStatus>;
  roadmapProgress: RoadmapProgressItem[];
  readinessScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudentDocument>(
  {
    name: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    currentSkills: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }],
    preferredDomain: { type: String, default: '' },
    selectedCareer: { type: String, default: 'frontend-developer' },
    completedSkills: [{ type: String, trim: true }],
    skillStatuses: { type: Map, of: String, default: {} },
    roadmapProgress: [
      {
        stepNumber: Number,
        skill: String,
        status: {
          type: String,
          enum: ['completed', 'in_progress', 'not_started'],
          default: 'not_started'
        },
        notes: String,
        updatedAt: { type: Date, default: Date.now }
      }
    ],
    readinessScore: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

export const StudentModel: Model<IStudentDocument> = 
  (mongoose.models.Student as Model<IStudentDocument>) || 
  mongoose.model<IStudentDocument>('Student', StudentSchema);
