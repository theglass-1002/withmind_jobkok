// src/api/job/job.api.ts
import instance, { getAccessToken } from "@/api/axios.instance";
import type { JobNode, JobListApiResponse, JobItem, JobDetailApiResponse, JobFavoriteResponse, PopularKeywordApiResponse } from "./job.types";

// 인기 키워드 조회
export async function fetchPopularKeywords(): Promise<{
  total: string[];
  hourly: string[];
  code: number;
}> {
  const res = await instance.get<PopularKeywordApiResponse>(
    "/auth/search/keyword/popular",
    {
      requiresAuth: false,
      params: {
        limit: 10,
      },
    }
  );

  const body = res.data;

  return {
    total: Array.isArray(body.total) ? body.total : [],
    hourly: Array.isArray(body.hourly) ? body.hourly : [],
    code: body.code ?? 200,
  };
}


// 직군/직무 트리
export async function fetchJobTree(): Promise<JobNode[]> {
  const res = await instance.get<JobNode[]>("/auth/job", {
    requiresAuth: false,
  });
  return res.data;
}

export async function fetchJobList(
  page: number,
  size: number,
  options?: { sort?: string; tabs?: string }
): Promise<{
  jobs: JobItem[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}> {
  const res = await instance.get<JobListApiResponse>("/auth/jobs", {
    requiresAuth: !!getAccessToken(),
    params: { page, size, ...options },
  });

  console.log("[fetchJobList] response:", res.data);

  const body = res.data;
  const jobs = Array.isArray(body.jobs) ? body.jobs : [];

  return {
    jobs,
    page: body.page ?? page,
    size: body.size ?? size,
    totalCount: body.totalCount ?? jobs.length,
    totalPages: body.totalPages ?? 1,
    hasNext: body.hasNext ?? false,
  };
}

export async function fetchJobDetail(
  jobId: number
): Promise<JobDetailApiResponse> {
  const res = await instance.get<JobDetailApiResponse>(`/auth/job/${jobId}`);
  return res.data;
}

export async function addJobFavorite(jobId: number): Promise<number> {
  const res = await instance.post<JobFavoriteResponse>(
    `/api/jobs/${jobId}/favorite`
  );
  return res.data.resumeIdx;
}


export async function removeJobFavorite(jobId: number): Promise<void> {
  const res = await instance.delete(
    `/api/jobs/${jobId}/favorite`
  );

}

export async function toggleJobFavorite(
  jobId: number,
  isFavorite: boolean
): Promise<void | number> {
  

  if (isFavorite) {
  
    // 이미 즐겨찾기 → 제거
    return removeJobFavorite(jobId);
  } else {
    // 즐겨찾기 아님 → 추가
    return addJobFavorite(jobId);
  }
}

export async function markJobApplied(jobId: number): Promise<void> {
  await instance.post(`/api/jobs/${jobId}/applied`, null as any);
}

export async function unmarkJobApplied(jobId: number): Promise<void> {
  await instance.delete(`/api/jobs/${jobId}/applied` as any);
}



export const toCareerParam = (range: { min: number; max: number }) => {
  const { min, max } = range;

  if (min === 0 && max === 1) return "0-1";      // 신입
  if (min === 0 && max === 10) return "0-100";   // 경력무관(전체)

  const serverMax = max === 10 ? 100 : max;      // 10이면 100으로 치환
  return `${min}-${serverMax}`;                  // 예: 2-8, 2-100
};

export const educationKeyToCode: Record<string, string> = {
  ANY: "0",
  HS_OR_LESS:"1",
  HS: "1,6",
  COLLEGE_2_3: "2,7",
  UNIV_4: "3,8",
  MASTER: "4,9", 
  PHD: "5",
};

export const toEducationCodeParam = (selected: string[]) => {
  const codes = selected
    .map((k) => educationKeyToCode[k])
    .filter(Boolean);

  // 중복 제거
  const uniq = Array.from(new Set(codes));

  // 백엔드가 콤마 string을 원함
  return uniq.length ? uniq.join(",") : undefined;
};

export type LocationSelectedItem = {
  code: string;
  regionName: string;
  districtName: string;
};

export const toLocationCodeParam = (selected: LocationSelectedItem[]) => {
  const codes = selected.map((s) => s.code).filter(Boolean);
  const uniq = Array.from(new Set(codes));
  return uniq.length ? uniq.join(",") : undefined;
};


export type EmpOptionKey =
  | "regular"
  | "contract"
  | "intern"
  | "militaryService"
  | "foreigner"
  | "disability";

export const EMPLOYMENT_TYPE_KEYS: EmpOptionKey[] = [
  "regular",
  "contract",
  "intern",
];

export const EMPLOYMENT_ETC_KEYS: EmpOptionKey[] = [
  "militaryService",
  "foreigner",
  "disability",
];