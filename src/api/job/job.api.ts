// src/api/job/job.api.ts
import instance, { getAccessToken } from "@/api/axios.instance";
import type { JobNode, JobListApiResponse, JobItem, JobDetailApiResponse, JobFavoriteResponse } from "./job.types";

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

// export async function fetchJobList(
//   page: number,
//   size: number
// ): Promise<{
//   jobs: JobItem[];
//   page: number;
//   size: number;
//   totalCount: number;
//   totalPages: number;
//   hasNext: boolean;
// }> {
//   const res = await instance.get<JobListApiResponse>("/auth/jobs", {
//     requiresAuth: getAccessToken()?true:false,
//     params: {
//       page,
//       size,
//     },
//   });

//   const body = res.data;
//   const jobs = Array.isArray(body.jobs) ? body.jobs : [];

//   return {
//     jobs,
//     page: body.page ?? page,
//     size: body.size ?? size,
//     totalCount: body.totalCount ?? jobs.length,
//     totalPages: body.totalPages ?? 1,
//     hasNext: body.hasNext ?? false,
//   };
// }

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

  console.log("❌ 즐겨찾기 제거", res.data);
}

export async function toggleJobFavorite(
  jobId: number,
  isFavorite: boolean
): Promise<void | number> {
  
  console.log(isFavorite);
  if (isFavorite) {
  
    // 이미 즐겨찾기 → 제거
    return removeJobFavorite(jobId);
  } else {
    // 즐겨찾기 아님 → 추가
    return addJobFavorite(jobId);
  }
}