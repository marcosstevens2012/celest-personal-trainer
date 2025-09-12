// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "trainer" | "student";
  createdAt: Date;
  updatedAt: Date;
}

export interface Trainer extends User {
  bio?: string;
  specialties: string[];
  certifications: string[];
  profileImage?: string;
  phone?: string;
  instagram?: string;
  whatsapp?: string;
}

// Student Types
export interface Student {
  id: string;
  trainerId: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: Date;
  goals: string[];
  medicalConditions?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Plan Types
export interface Plan {
  id: string;
  trainerId: string;
  studentId?: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  isTemplate: boolean;
  isActive: boolean;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanDay {
  id: string;
  planId: string;
  dayNumber: number;
  name: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanBlock {
  id: string;
  planDayId: string;
  name: string;
  order: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanItem {
  id: string;
  planBlockId: string;
  exercise: string;
  sets?: number;
  reps?: string;
  weight?: string;
  duration?: string;
  restTime?: string;
  notes?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
export interface Payment {
  id: string;
  trainerId: string;
  studentId: string;
  planId?: string;
  amount: number;
  currency: string;
  method: "CASH" | "TRANSFER" | "CARD" | "CRYPTO" | "OTHER";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "OVERDUE";
  transactionId?: string;
  notes?: string;
  dueDate: Date;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Workout Types
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscleGroups: string[];
  equipment?: string[];
  instructions: string[];
  imageUrl?: string;
  videoUrl?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps?: number;
  weight?: number;
  duration?: number; // in seconds
  restTime?: number; // in seconds
  notes?: string;
}

export interface Workout {
  id: string;
  trainerId: string;
  studentId?: string; // null for template workouts
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  estimatedDuration: number; // in minutes
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Progress Types
export interface Progress {
  id: string;
  studentId: string;
  workoutId?: string;
  date: Date;
  type: "weight" | "measurements" | "workout" | "photo";
  data: Record<string, any>; // flexible data structure
  notes?: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface CreateStudentDto {
  trainerId: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  goals: string[];
  medicalConditions?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface UpdateStudentDto {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  goals?: string[];
  medicalConditions?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  isActive?: boolean;
}

export interface CreatePlanDto {
  trainerId: string;
  studentId?: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isTemplate?: boolean;
  price?: number;
}

export interface UpdatePlanDto {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isTemplate?: boolean;
  isActive?: boolean;
  price?: number;
}

export interface CreatePlanDayDto {
  planId: string;
  dayNumber: number;
  name: string;
  notes?: string;
}

export interface CreatePlanBlockDto {
  planDayId: string;
  name: string;
  order: number;
  notes?: string;
}

export interface CreatePlanItemDto {
  planBlockId: string;
  exercise: string;
  sets?: number;
  reps?: string;
  weight?: string;
  duration?: string;
  restTime?: string;
  notes?: string;
  order: number;
}

export interface CreatePaymentDto {
  trainerId: string;
  studentId: string;
  planId?: string;
  amount: number;
  currency?: string;
  method: "CASH" | "TRANSFER" | "CARD" | "CRYPTO" | "OTHER";
  dueDate: string;
  notes?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  monthlyRevenue: number;
  pendingPayments: number;
  expiringPlans: number;
}

export interface MonthlyRevenueData {
  month: string;
  revenue: number;
  students: number;
}

// WhatsApp Integration Types
export interface WhatsAppMessage {
  to: string;
  message: string;
  type: "text" | "document" | "image";
  attachment?: {
    filename: string;
    content: string; // base64
    mimetype: string;
  };
}
