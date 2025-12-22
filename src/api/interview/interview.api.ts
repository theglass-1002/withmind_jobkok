import instance from "@/api/axios.instance"; // 너희 프로젝트 axios instance 경로에 맞게 수정
import type {
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
