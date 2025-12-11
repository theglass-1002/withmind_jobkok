// src/api/job/job.api.ts
import instance from "@/api/axios.instance";
import type { JobNode, JobListApiResponse, JobItem } from "./job.types";

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
    requiresAuth: false,
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
