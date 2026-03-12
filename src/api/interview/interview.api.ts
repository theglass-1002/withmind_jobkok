// interview.api.ts

import instance from "@/api/axios.instance";
import type {
  EnvTestAnalyzeRequest,
  EnvTestAnalyzeResponse,
  EnvTestSpeechResponse,
  InterviewQuestionsRequest,
  InterviewQuestionsResponse,
  InterviewFollowupRequest,
  InterviewFollowupResponse,
  InterviewReportListResponse,
} from "./interview.types";
import { AI_BASE_URL } from "@/config/config";

export async function fetchInterviewQuestions(
  payload: InterviewQuestionsRequest
): Promise<InterviewQuestionsResponse> {
  const res = await instance.post<InterviewQuestionsResponse>(
    "/interview/questions",
    payload,
    {
      baseURL: AI_BASE_URL,
      requiresAuth: false,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}

/**
 * 환경테스트 문구 출력 API
 * GET /api/interview/callTestSpeechQue
 * Authorization: Bearer <token> 필요 (requiresAuth: true)
 */
export async function fetchEnvTestSpeech(): Promise<string> {
  const res = await instance.get<EnvTestSpeechResponse>(
    "/api/interview/callTestSpeechQue",
    {
      headers: {
        accept: "application/json",
      },
    }
  );

  const data = res.data;

  // 1) 문자열로 바로 오는 경우
  if (typeof data === "string") return data;

  // 2) 객체 형태로 오는 경우
  if (data?.data && typeof data.data === "string") return data.data;
  if (data?.message && typeof data.message === "string") return data.message;

  // 3) 예외 케이스
  return "안녕하세요, 반갑습니다.";
}

export async function fetchEnvTestAnalyze(
  payload: EnvTestAnalyzeRequest
): Promise<EnvTestAnalyzeResponse> {
  const res = await instance.post<EnvTestAnalyzeResponse>("/", payload, {
    baseURL: "https://test.interview.api.withmind.net",
    requiresAuth: false,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return res.data;
}

/**
 * 꼬리질문 API
 * POST /interview/followup
 * baseURL: AI_BASE_URL (예: https://ai.api.jobkok.kr)
 */
export async function fetchInterviewFollowup(
  payload: InterviewFollowupRequest
): Promise<InterviewFollowupResponse> {
  const res = await instance.post<InterviewFollowupResponse>(
    "/interview/followup",
    payload,
    {
      baseURL: AI_BASE_URL,
      requiresAuth: false,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}

/**
 * 모의면접 리포트 리스트 조회 API
 * GET /api/report/list?page=1&size=10
 */
export async function fetchInterviewReportList(params?: {
  page?: number;
  size?: number;
}): Promise<InterviewReportListResponse> {
  const res = await instance.get<InterviewReportListResponse>(
    "/api/report/list",
    {
      params: {
        page: params?.page ?? 1,
        size: params?.size ?? 10,
      },
      headers: {
        accept: "application/json",
      },
    }
  );

  return res.data;
}