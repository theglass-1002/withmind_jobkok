// src/api/resume.api.ts

import instance, { ApiResponse } from "@/api/axios.instance";
import { CreateResumeRequest, CreateResumeResponse, ResumeDetailResponse, ResumeItem, ResumeTitleAIResponse, ResumeTitleRequest } from "./resume.types";
import { AI_BASE_URL } from "@/config/config";

export async function fetchResumeList(): Promise<ResumeItem[]> {
  // 백엔드 응답이 배열 그대로라면 이렇게:
  const res = await instance.get<ResumeItem[]>("/api/resume/list");
  return res.data;
}


export async function createResume(payload: CreateResumeRequest): Promise<CreateResumeResponse> {
  const res = await instance.post<CreateResumeResponse>(
    "/api/resume/create",
    payload
  );
  return res.data;
}

export async function fetchResumeDetail(resumeIdx: number): Promise<ResumeDetailResponse> {
  const res = await instance.get<ResumeDetailResponse>(
    `/api/resume/detail/${resumeIdx}`
  );
  return res.data;
}

export async function updateDefaultResume(
  resumeIdx: number,
  isDefault: 0 | 1
): Promise<ApiResponse> {
  const res = await instance.put<ApiResponse>("/api/resume/update/default", {
    resumeIdx,  
    isDefault,
  });
  return res.data; 
}


export async function fetchResumeTitleSuggestions(
  payload: ResumeTitleRequest
): Promise<string[]> {
  const res = await instance.post<ResumeTitleAIResponse>(
    "/resume/title",  
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

  const body = res.data;
  console.log("✅ AI 제목 추천 응답:", body);

  if (!body.success || !body.data) {
    const msg =
      (body.error && (body.error.message || body.error.msg)) ||
      "이력서 제목 추천 중 오류가 발생했습니다.";
    throw new Error(msg);
  }

  return body.data.titles;
}
