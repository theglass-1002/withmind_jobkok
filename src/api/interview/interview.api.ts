import instance from "@/api/axios.instance"; // 너희 프로젝트 axios instance 경로에 맞게 수정
import type {
  EnvTestAnalyzeRequest,
  EnvTestAnalyzeResponse,
  EnvTestSpeechResponse,
  InterviewQuestionsRequest,
  InterviewQuestionsResponse,
} from "./interview.types";
import { AI_BASE_URL } from "@/config/config";


export async function fetchInterviewQuestions(
  payload: InterviewQuestionsRequest
): Promise<InterviewQuestionsResponse> {
  const res = await instance.post<InterviewQuestionsResponse>(
    "/interview/questions",
    payload,
    {
      baseURL:AI_BASE_URL,
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

  // 1) 문자열로 바로 오는 경우: "소중한 대화였습니다, 고맙습니다."
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
  const res = await instance.post<EnvTestAnalyzeResponse>(
    "/",
    payload,
    {
      baseURL: "https://test.interview.api.withmind.net",
      requiresAuth: false,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}