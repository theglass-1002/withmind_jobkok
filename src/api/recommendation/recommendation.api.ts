// src/api/recommendation/recommendation.api.ts
import instance from "@/api/axios.instance";
import { AI_BASE_URL } from "@/config/config";
import type { ResumeRecommendationApiResponse } from "./recommendation.types";

/**
 * 이력서 기반 공고 추천 생성 및 저장
 * POST {AI_BASE_URL}/recommendation/resumes/{resumeIdx}
 */
export async function generateResumeRecommendations(
  resumeIdx: number
): Promise<ResumeRecommendationApiResponse> {
  const res = await instance.post<ResumeRecommendationApiResponse>(
    `/recommendation/resumes/${resumeIdx}`,
    null,
    {
      baseURL: AI_BASE_URL,
      requiresAuth: false,
      headers: {
        accept: "application/json",
      },
    }
  );

  console.log("[generateResumeRecommendations] response:", res.data);

  return res.data;
}
