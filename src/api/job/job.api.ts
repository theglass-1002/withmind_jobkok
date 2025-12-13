// src/api/job/job.api.ts
import instance from "@/api/axios.instance";
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
  size: number
): Promise<{
  jobs: JobItem[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}> {
  const res = await instance.get<JobListApiResponse>("/auth/jobs", {
    params: {
      page,
      size,
    },
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

export async function fetchJobDetail(
  jobId: number
): Promise<JobDetailApiResponse> {
  const res = await instance.get<JobDetailApiResponse>(`/auth/job/${jobId}`);
  console.log('red',res.data);
  return res.data;
}

export async function toggleJobFavorite(jobId: number): Promise<number> {
  const res = await instance.post<JobFavoriteResponse>(
    `/api/jobs/${jobId}/favorite`,
  );
  console.log('즐겨찾기',res);

  return res.data.resumeIdx;
}