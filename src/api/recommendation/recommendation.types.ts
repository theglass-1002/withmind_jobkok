// src/api/recommendation/recommendation.types.ts

/** 이력서 기반 공고 추천 응답 코드 */
export type ResumeRecommendationCode =
  | "RECOMMENDATION_CREATED"
  | "RECOMMENDATION_REUSED"
  | string;

/** 추천 실행 상태 */
export type RecommendationRunStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | string;

export interface ResumeRecommendationData {
  runIdx: number;
  resumeIdx: number;
  status: RecommendationRunStatus;
  reused: boolean;
  savedCount: number;
  /** YYYY-MM-DD */
  jobBaseDate: string;
}

export interface ResumeRecommendationApiResponse {
  success: boolean;
  code: ResumeRecommendationCode;
  message: string;
  data: ResumeRecommendationData;
}
