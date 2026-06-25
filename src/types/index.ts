export interface ProviderConfig {
  id: string;
  name: string;
  url: string;
  model: string;
  fallbackModel?: string;
  fallbackUrl?: string;
  type: 'openai' | 'gemini' | 'cohere';
  keyHint: string;
  keyUrl: string;
  note: string;
}

export interface BYOKState {
  keys: Record<string, string>;
  prefs: {
    preferredProvider: string;
  };
}

export interface ToolResult {
  result: string;
  provider: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
}

export interface ResumeData {
  id?: number;
  title: string;
  content: string;
  templateId: string;
  colors?: { primary: string; accent: string; background: string };
}

export interface JobPost {
  id?: number;
  jobTitle: string;
  companyName: string;
  sourceUrl?: string;
  jdText: string;
  tailoredResume?: string;
  coverLetter?: string;
  recruiterMessage?: string;
  prepChecklist?: string;
  followUpMessages?: string[];
}

export interface AtsScore {
  score: number;
  word_count: number;
  matched_keywords: string[];
  missing_keywords: string[];
  verb_hits: number;
  quant_hits: number;
  breakdown: {
    keyword_overlap: { score: number; max: number };
    length_density: { score: number; max: number };
    section_completeness: { score: number; max: number };
    action_verbs: { score: number; max: number };
    quantified_impact: { score: number; max: number };
  };
}

export type ToolId =
  | 'resume-fixer'
  | 'jd-matcher'
  | 'role-finder'
  | 'bullet-upgrader'
  | 'cover-letter'
  | 'recruiter-hook'
  | 'app-optimizer'
  | 'ats-checker'
  | 'recruiter-scan'
  | 'truth-lock'
  | 'app-pack'
  | 'company-tailor';

export type PlanTier = 'free' | 'starter' | 'pro' | 'lifetime';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  action?: string;
}
