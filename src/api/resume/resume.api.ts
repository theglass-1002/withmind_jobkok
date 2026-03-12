// src/api/resume/resume.api.ts
import instance, { ApiResponse } from "@/api/axios.instance";
import {
  CreateExperienceRequest,
  CreateExperienceResponse,
  CreateResumeRequest,
  CreateResumeResponse,
  ResumeCheckResponse,
  ResumeDetailResponse,
  ResumeHardSkillRequest,
  ResumeHardSkillResponse,
  ResumeItem,
  ResumeListApiResponse,
  ResumePositionRequest,
  ResumePositionResponse,
  ResumeSelfIntroRequest,
  ResumeSelfIntroResponse,
  ResumeSoftSkillRequest,
  ResumeSoftSkillResponse,
  ResumeTitleAIResponse,
  ResumeTitleRequest,
  SkillAutoCompleteItem,
} from "./resume.types";
import { AI_BASE_URL } from "@/config/config";

// 페이징 + 상태 기반 이력서 리스트 조회
// page: 1-based, size: 페이지당 개수, status: "ING" | "DONE" 등 (옵션)
export async function fetchResumeList(
  page: number,
  size: number,
  status?: string
): Promise<{ list: ResumeItem[]; totalCount: number; page: number; size: number }> {
  const res = await instance.get<ResumeListApiResponse>("/api/resume/list", {
    params: {
      page,   // 1페이지, 2페이지 ...
      size,   // 10개씩
      ...(status ? { status } : {}), // status 있으면만 붙이기
    },
  });

  const body = res.data;

  const list = Array.isArray(body.list) ? body.list : [];
  const totalCount =
    typeof body.totalCount === "number" ? body.totalCount : list.length;

  return {
    list,
    totalCount,
    page: body.page ?? page,
    size: body.size ?? size,
  };
}

export async function createResume(
  payload: CreateResumeRequest
): Promise<CreateResumeResponse> {
  const res = await instance.post<CreateResumeResponse>(
    "/api/resume/create",
    payload
  );
  return res.data;
}




export async function updateResume(
  resumeIdx: number,
  payload: CreateResumeRequest
): Promise<ApiResponse> {
  const res = await instance.put<ApiResponse>(`/api/resume/update/${resumeIdx}`, payload);
  return res.data;
}

export async function deleteResume(
  resumeIdx: number
): Promise<ApiResponse> {
  const res = await instance.delete<ApiResponse>(`/api/resume/delete/${resumeIdx}`);
  return res.data;
}

export async function fetchResumeDetail(
  resumeIdx: number
): Promise<ResumeDetailResponse> {
  const res = await instance.get<ResumeDetailResponse>(
    `/api/resume/detail/${resumeIdx}`
  );
  console.log(res.data);
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

export async function fetchResumeCheck(): Promise<ResumeCheckResponse> {
  const res = await instance.get<ResumeCheckResponse>("/api/resume/check", {
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
  console.log("AI 제목 추천 응답:", res);
  const body = res.data;
  console.log("AI 제목 추천 응답:", body);

  if (!body.success || !body.data) {
    const msg =
      (body.error && (body.error.message || body.error.msg)) ||
      "이력서 제목 추천 중 오류가 발생했습니다.";
    throw new Error(msg);
  }

  return body.data.titles;
}

export async function createExperience(
  payload: CreateExperienceRequest
): Promise<CreateExperienceResponse> {
  const res = await instance.post<CreateExperienceResponse>(
    "/resume/experience",
    payload,
    {
      baseURL: AI_BASE_URL, // AI 서버 URL
      requiresAuth: false,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  const body = res.data;

  console.log("AI 경력 bullet 생성 응답:", body);

  // 에러 처리
  if (!body.success) {
    const msg =
      (body.error && (body.error.message || body.error.msg)) ||
      "경력 Bullet 생성 중 오류가 발생했습니다.";

    throw new Error(msg);
  }

  return body;
}

// --- AI 희망직무 추천 API ---
export async function fetchResumePositionSuggestions(
  payload: ResumePositionRequest
): Promise<string[]> {
  const res = await instance.post<ResumePositionResponse>(
    "/resume/position",
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
  console.log("AI 직무 추천 응답:", body);

  if (!body.success || !body.data) {
    const msg =
      (body.error && (body.error.message || body.error.msg)) ||
      "AI 직무 추천 중 오류가 발생했습니다.";
    throw new Error(msg);
  }

  return body.data.positions;
}

export async function fetchResumeHardSkillSuggestions(
  payload: ResumeHardSkillRequest
): Promise<string[]> {
  const res = await instance.post<ResumeHardSkillResponse>(
    "/resume/skills/hard",
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

  if (!body.success || !body.data) {
    const msg =
      (body.error?.message ||
        body.error?.msg ||
        "AI 하드 스킬 추천 중 오류가 발생했습니다.") +
      (body.error?.details?.reason ? `\n${body.error.details.reason}` : "");

    throw new Error(msg);
  }

  return body.data.skills;
}

export async function fetchResumeSoftSkillSuggestions(
  payload: ResumeSoftSkillRequest
): Promise<string[]> {
  const res = await instance.post<ResumeSoftSkillResponse>(
    "/resume/skills/soft",
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
  console.log("🔥 AI 소프트 스킬 추천 응답:", body);

  if (!body.success || !body.data) {
    const msg =
      (body.error?.message ||
        body.error?.msg ||
        "AI 소프트 스킬 추천 중 오류가 발생했습니다.") +
      (body.error?.details?.reason ? `\n${body.error.details.reason}` : "");

    throw new Error(msg);
  }

  return body.data.skills;
}

export async function fetchResumeSelfIntro(
  payload: ResumeSelfIntroRequest
): Promise<string> {
  const res = await instance.post<ResumeSelfIntroResponse>(
    "/resume/selfintro",
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
  console.log("🔥 AI 자기소개서 응답:", body);

  // 실패 처리
  if (!body.success || !body.data) {
    const msg =
      (body.error?.message ||
        body.error?.msg ||
        "AI 자기소개서 생성 중 오류가 발생했습니다.") +
      (body.error?.details?.reason ? `\n${body.error.details.reason}` : "");

    throw new Error(msg);
  }

  // 성공 → 자기소개 문장 반환
  return body.data.selfintro;
}


// ✅ 하드 스킬 자동완성 (공개 GET)
export async function fetchHardSkillAutoComplete(
  q: string
): Promise<SkillAutoCompleteItem[]> {
  const res = await instance.get<SkillAutoCompleteItem[]>(
    "/auth/skills/hard/auto-complete",
    {
      params: { q },
      requiresAuth: false,
    } as any
  );

  return res.data;
}

// ✅ 소프트 스킬 자동완성 (공개 GET)
export async function fetchSoftSkillAutoComplete(
  q: string
): Promise<SkillAutoCompleteItem[]> {
  const res = await instance.get<SkillAutoCompleteItem[]>(
    "/auth/skills/soft/auto-complete",
    {
      params: { q },
      requiresAuth: false,
    } as any
  );

  return res.data;
}