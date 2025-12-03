// src/api/resume.api.ts

import instance from "@/api/axios.instance";

export interface ResumeItem {
  resumeIdx: number;
  title: string;
  hopeJobs: string;
  careerPeriod: string;
  educationSummary: string;
  createdAt: string;
  updatedAt: string;
  isDefault: number; // 1: 기본 이력서, 0: 일반
}


export async function fetchResumeList(): Promise<ResumeItem[]> {
  // 백엔드 응답이 배열 그대로라면 이렇게:
  const res = await instance.get<ResumeItem[]>("/api/resume/list");
  console.log(res.data);
  return res.data;
}
