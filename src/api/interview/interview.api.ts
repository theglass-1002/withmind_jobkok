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
  CreateQzGroupResponse,
  CreateQzGroupRequest,
  SaveInterviewAnalysisResponse,
  SaveInterviewAnalysisRequest,
  InterviewQuestionsV2Request,
  InterviewQuestionsV2Response,
  SaveUserInputQuestionsResponse,
  SaveUserInputQuestionsRequest,
  CompleteInterviewResponse,
  CompleteInterviewRequest,
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

//질문리스트

export async function fetchInterviewQuestionsV2(
  payload: InterviewQuestionsV2Request
): Promise<InterviewQuestionsV2Response> {
  const res = await instance.post<InterviewQuestionsV2Response>(
    "/v2/interview/questions",
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
 * POST //v2/interview/followup
 * baseURL:  (예: https://ai.api.jobkok.kr)
 */
export async function fetchInterviewFollowup(
  payload: InterviewFollowupRequest
): Promise<InterviewFollowupResponse> {
  const res = await instance.post<InterviewFollowupResponse>(
    "/v2/interview/followup",
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


/**
 * qzGroup 생성 API
 * POST /api/interview/callQzGroup
 */
export async function createQzGroup(
  payload: CreateQzGroupRequest
): Promise<CreateQzGroupResponse> {
  const res = await instance.post<CreateQzGroupResponse>(
    "/api/interview/callQzGroup",
    payload,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}

/**
 * 면접 영상 저장 API
 * POST /api/interview/analysis
 */
export async function saveInterviewAnalysis(
  payload: SaveInterviewAnalysisRequest
): Promise<SaveInterviewAnalysisResponse> {
  const res = await instance.post<SaveInterviewAnalysisResponse>(
    "/api/interview/analysis",
    payload,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}

/**
 * 사용자 입력 면접 질문 저장 API
 * POST /api/interview/saveUserInputQue
 */
export async function saveUserInputQuestions(
  payload: SaveUserInputQuestionsRequest
): Promise<SaveUserInputQuestionsResponse> {
  const res = await instance.post<SaveUserInputQuestionsResponse>(
    "/api/interview/saveUserInputQue",
    payload,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}

/**
 * 면접 완료 API
 * POST /v2/interview/complete
 */
export async function completeInterview(
  payload: CompleteInterviewRequest
): Promise<CompleteInterviewResponse> {
  const res = await instance.post<CompleteInterviewResponse>(
    "/v2/interview/complete",
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