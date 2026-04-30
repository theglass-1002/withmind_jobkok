// interview.types.ts

export type InterviewQuestionType = "EXPERIENCE" | "TECHNICAL" | "BEHAVIORAL" | "ETC";
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
  error: unknown;
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
      error?: unknown;
    };

// v2
export type InterviewQuestionsV2Request = {
  resume?: string;
  job_posting?: string;
  target_role?: string;
  qz_group?: number;
  config?: {
    num_questions?: number;
    language?: string;
    difficulty_profile?: string;
    focus_types?: string[];
  };
};

export type InterviewQuestionsV2QuestionType =
  | "OPENING"
  | "TECHNICAL"
  | "EXPERIENCE"
  | "PEOPLE_FIT"
  | "ETC";

export type InterviewQuestionsV2Question = {
  question_id: string;
  question_code: string;
  order: number;
  text: string;
  type: InterviewQuestionsV2QuestionType;
};

export type InterviewQuestionsV2Data = {
  qz_group: number;
  blueprint_path: string;
  questions: InterviewQuestionsV2Question[];
  quality_flags: string[];
};

export type InterviewQuestionsV2Response = {
  success: boolean;
  data: InterviewQuestionsV2Data | null;
  error: unknown;
  meta: {
    request_id: string;
    timestamp: string;
  };
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
  status: number; // 200
  message: "pass" | "fail" | "nopass";
  faceCheck: number;
  soundCheck: number;
};

/**
 * 꼬리질문(답변 평가 + follow-up question 생성) 요청/응답
 * 새 응답 스펙 기준
 */
export type InterviewFollowupRequest = {
  qz_group: number;
  question_code: string;
  video_url: string;
};

export type InterviewFollowupData = {
  qz_group: number;
  question_code: string;
  question_text: string;
  follow_up_required: boolean;
  follow_up_question: string | null;
  follow_up_intent: string | null;
  missing_evidence: string[];
};

export type InterviewFollowupError = {
  code: string;
  message: string;
  details?: {
    reason?: string;
  };
};

export type InterviewFollowupMeta = {
  request_id: string;
  timestamp: string; // ISO string
};

export type InterviewFollowupSuccessResponse = {
  success: true;
  data: InterviewFollowupData;
  error?: null;
  meta: InterviewFollowupMeta;
};

export type InterviewFollowupFailureResponse = {
  success: false;
  data?: null;
  error: InterviewFollowupError;
  meta: InterviewFollowupMeta;
};

export type InterviewFollowupResponse =
  | InterviewFollowupSuccessResponse
  | InterviewFollowupFailureResponse;

export type InterviewReportItem = {
  interviewAllYn: "Y" | "N";
  photoUrl?: string;
  regdate: string; // YYYY-MM-DD (면접일)
  resumeDate?: string; // YYYY-MM-DD (이력서 작성일)
  qzGroup: number;
  jobGroup?: string;
  job: string;
  totalScore: number;
  resumeTitle: string;
  resumeIdx: number;
  jobPostTitle?: string;
  jobPostLink?: string;
  // 0: 면접 진행 중, 1: 분석 진행 중, 2: 진행 완료
  analysisStatus: 0 | 1 | 2;
};

export type InterviewReportListResponse = {
  size: number;
  page: number;
  totalCount: number;
  list: InterviewReportItem[];
};

export type CreateQzGroupRequest = {
  resumeIdx: number;
  job: string;
  jobPostLink?: string;
};

export type CreateQzGroupResponse = {
  qzGroup: number;
  status: number;
};

export type SaveInterviewAnalysisRequest = {
  qzGroup: number;
  num: number;
  qzTts: string;
  fileUrl: string;
  thumUrl: string;
  category: string;
  originalName: string;
  storedName: string;
  sizeBytes: number;
  contentType: string;
};

export type SaveInterviewAnalysisResponse = {
  status: number;
  message?: string;
  data?: unknown;
};

// 면접 질문 저장
export type SaveUserInputQuestionItem = {
  num: number;
  que: string;
  questionCode?: string;
  type?: string;
};

export type SaveUserInputQuestionsRequest = {
  qzGroup: number;
  queList: SaveUserInputQuestionItem[];
};

export type SaveUserInputQuestionsResponse = {
  code: number;
  msg: string;
  savedCount: number;
};

export type SaveFollowOnQueRequest = {
  qzGroup: number;
  num: number;
  que: string;
};

export type SaveFollowOnQueResponse = {
  status: number;
  msg: string;
};

export type RestartInterviewRequest = {
  qzGroup: number;
};

export type RestartInterviewQuestionItem = {
  num: number;
  qzTts: string;
  tailQueYn: "Y" | "N";
};

export type RestartInterviewResponse = {
  qzList: RestartInterviewQuestionItem[];
  qzGroup: number;
  reStartNum: number;
  status: number;
};
export type CompleteInterviewRequest = {
  qz_group: number;
};

export type CompleteInterviewError = {
  code: string;
  message: string;
  details?: {
    reason?: string;
  };
};

export type CompleteInterviewResponse = {
  success: boolean;
  data: string | null;
  error: CompleteInterviewError | null;
  meta: Record<string, unknown>;
};