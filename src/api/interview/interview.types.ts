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

export type EnvTestSpeechResponse =
  | string
  | {
      success?: boolean;
      data?: string;
      message?: string;
      error?: any;
    };

  /**
 * 환경 테스트 분석 요청
 * - file_url: 업로드된 영상 접근용 URL
 * - speech: 읽은 문장
 */
export type EnvTestAnalyzeRequest = {
  file_url: string;
  speech: string;
};

/**
 * 환경 테스트 분석 응답
 */
export type EnvTestAnalyzeResponse = {
  status: number;        // 200
  message: "pass" | "fail"|"nopass";
  faceCheck: number;    
  soundCheck: number;    
};
