export interface AnalysisResult {
  markdown: string;
  groundingMetadata?: any;
}

export interface BusinessInput {
  name: string;
  location: string;
}

export interface PostResult {
  content: string;
  hashtags: string[];
  imagePrompt: string;
}

export interface ReviewResponseResult {
  responseText: string;
  strategy: string;
}

export interface FaqResult {
  answer: string;
  tone: string;
}

export type AppView = 'home' | 'editor' | 'profile' | 'privacy' | 'terms' | 'cookies' | 'onboarding' | 'posts' | 'reviews' | 'faq' | 'consultation' | 'admin';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  photoURL?: string;
}

// ✅ ADICIONE ESTA INTERFACE
export interface UserPlan {
  plan: string;
  subscriptionStatus: string;
  trialEndsAt: Date | null;
  isFounder: boolean;
  paidPlan: string | null;
  usageCount?: number;
  usageLimit?: number;
}