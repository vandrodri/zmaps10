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

export type AppView = 'dashboard' | 'posts' | 'reviews' | 'consultation' | 'faq';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  photoURL?: string; // Foto do perfil do Google
}