import mongoose from 'mongoose';
import { StudentProfile, SkillStatus, RoadmapProgressItem } from '../src/types.ts';
import { StudentModel } from './models/Student.ts';

// In-Memory store fallback if MONGODB_URI is not set or unreachable
const memoryStudents = new Map<string, StudentProfile>();

let isConnectedToMongo = false;
let connectionAttempted = false;
let lastDbError: string | null = null;

export async function initDatabase(): Promise<{ isConnected: boolean; message: string }> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<username>') || uri.includes('your_mongodb')) {
    console.log('ℹ️ MONGODB_URI not set or contains placeholder. Using robust Local In-Memory Data Store.');
    isConnectedToMongo = false;
    connectionAttempted = true;
    return {
      isConnected: false,
      message: 'Operating in Local In-Memory Mode. Set MONGODB_URI in .env to connect MongoDB Atlas.'
    };
  }

  try {
    if (mongoose.connection.readyState >= 1) {
      isConnectedToMongo = true;
      return { isConnected: true, message: 'Connected to MongoDB' };
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });

    isConnectedToMongo = true;
    connectionAttempted = true;
    lastDbError = null;
    console.log('✅ Successfully connected to MongoDB Atlas via Mongoose.');
    return { isConnected: true, message: 'Connected to MongoDB Atlas' };
  } catch (error: any) {
    isConnectedToMongo = false;
    connectionAttempted = true;
    lastDbError = error.message || 'Connection failed';
    console.warn('⚠️ MongoDB connection could not be established:', error.message);
    console.log('⚡ CareerPath is continuing with seamless Local In-Memory storage.');
    return {
      isConnected: false,
      message: `Running in Local Mode (MongoDB fallback active: ${lastDbError})`
    };
  }
}

export function getDatabaseStatus() {
  return {
    isConnected: isConnectedToMongo,
    readyState: mongoose.connection.readyState,
    usingFallback: !isConnectedToMongo,
    message: isConnectedToMongo
      ? 'MongoDB Atlas (Connected via Mongoose)'
      : 'Local In-Memory Mode (Zero setup required; configure MONGODB_URI anytime)',
    lastError: lastDbError
  };
}

// Unified student repository helpers
export async function createStudent(profileData: Partial<StudentProfile>): Promise<StudentProfile> {
  const token = profileData.token || `token_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

  if (isConnectedToMongo) {
    try {
      const doc = new StudentModel({
        ...profileData,
        token,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const saved = await doc.save();
      return formatStudentDoc(saved);
    } catch (err: any) {
      console.warn('Mongo create failed, writing to fallback memory store:', err.message);
    }
  }

  // In-memory fallback
  const id = `student_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newProfile: StudentProfile = {
    _id: id,
    id,
    token,
    name: profileData.name || 'Anonymous Student',
    degree: profileData.degree || 'B.Tech',
    branch: profileData.branch || 'Computer Science Engineering',
    year: profileData.year || '3rd Year',
    currentSkills: profileData.currentSkills || [],
    interests: profileData.interests || [],
    preferredDomain: profileData.preferredDomain || '',
    selectedCareer: profileData.selectedCareer || 'frontend-developer',
    completedSkills: profileData.completedSkills || profileData.currentSkills || [],
    skillStatuses: profileData.skillStatuses || {},
    roadmapProgress: profileData.roadmapProgress || [],
    readinessScore: profileData.readinessScore || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  memoryStudents.set(id, newProfile);
  if (token) {
    memoryStudents.set(token, newProfile);
  }
  return newProfile;
}

export async function getStudentById(idOrToken: string): Promise<StudentProfile | null> {
  if (!idOrToken) return null;

  if (isConnectedToMongo) {
    try {
      if (mongoose.Types.ObjectId.isValid(idOrToken)) {
        const doc = await StudentModel.findById(idOrToken).lean();
        if (doc) return formatStudentDoc(doc);
      }
      const tokenDoc = await StudentModel.findOne({
        $or: [{ token: idOrToken }, { _id: mongoose.Types.ObjectId.isValid(idOrToken) ? idOrToken : undefined }]
      }).lean();
      if (tokenDoc) return formatStudentDoc(tokenDoc);
    } catch (err: any) {
      console.warn('Mongo find error, checking memory store:', err.message);
    }
  }

  if (memoryStudents.has(idOrToken)) {
    return memoryStudents.get(idOrToken) || null;
  }

  // Check matching by token, _id, or id
  if (memoryStudents.size > 0) {
    const list = Array.from(memoryStudents.values());
    const matched = list.find(s => s._id === idOrToken || s.id === idOrToken || s.token === idOrToken);
    if (matched) return matched;
  }

  return null;
}

export async function updateStudent(idOrToken: string, updates: Partial<StudentProfile>): Promise<StudentProfile | null> {
  if (!idOrToken) return null;

  if (isConnectedToMongo) {
    try {
      let query: any = { token: idOrToken };
      if (mongoose.Types.ObjectId.isValid(idOrToken)) {
        query = { $or: [{ _id: idOrToken }, { token: idOrToken }] };
      }

      const updated = await StudentModel.findOneAndUpdate(
        query,
        { $set: { ...updates, updatedAt: new Date() } },
        { new: true, runValidators: true }
      ).lean();
      if (updated) return formatStudentDoc(updated);
    } catch (err: any) {
      console.warn('Mongo update error, checking memory store:', err.message);
    }
  }

  const existing = memoryStudents.get(idOrToken) || Array.from(memoryStudents.values()).find(s => s._id === idOrToken || s.id === idOrToken || s.token === idOrToken);
  if (existing) {
    const updated: StudentProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    memoryStudents.set(existing._id || existing.id || idOrToken, updated);
    if (existing.token) memoryStudents.set(existing.token, updated);
    return updated;
  }

  return null;
}

function formatStudentDoc(doc: any): StudentProfile {
  const obj = doc.toObject ? doc.toObject() : doc;
  const statuses = obj.skillStatuses instanceof Map
    ? Object.fromEntries(obj.skillStatuses)
    : (obj.skillStatuses || {});

  return {
    _id: obj._id?.toString() || obj.id,
    id: obj._id?.toString() || obj.id,
    token: obj.token || obj._id?.toString() || obj.id,
    name: obj.name,
    degree: obj.degree,
    branch: obj.branch,
    year: obj.year,
    currentSkills: obj.currentSkills || [],
    interests: obj.interests || [],
    preferredDomain: obj.preferredDomain,
    selectedCareer: obj.selectedCareer || 'frontend-developer',
    completedSkills: obj.completedSkills || [],
    skillStatuses: statuses,
    roadmapProgress: obj.roadmapProgress || [],
    readinessScore: obj.readinessScore || 0,
    createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : new Date().toISOString()
  };
}
