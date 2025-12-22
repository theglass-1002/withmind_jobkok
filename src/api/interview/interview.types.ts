export type InterviewQuestionType =
  | "EXPERIENCE"
  | "TECHNICAL"
  | "BEHAVIORAL"
  | "ETC";

export type InterviewDifficulty = "EASY" | "MEDIUM" | "HARD";

export type InterviewQuestion = {
  order: number;
  text: string;
  type: InterviewQuestionType;
  difficulty: InterviewDifficulty;
  related_items: string[];
  answer_hint: string;
};

export type InterviewConfig = {
  num_questions: number;
  language: string; // "ko"
  difficulty_profile: string; // "MIXED"
  focus_types: InterviewQuestionType[];
};

export type InterviewQuestionsRequest = {
  resume: string;
  job_posting: string;
};

export type InterviewQuestionsData = {
  questions: InterviewQuestion[];
  config: InterviewConfig;
};

export type InterviewQuestionsResponse = {
  success: boolean;
  data: InterviewQuestionsData | null;
  error: any; // 서버 스펙 맞춰서 좁혀도 됨
  meta: {
    request_id: string;
    timestamp: string; // ISO string
  };
};
