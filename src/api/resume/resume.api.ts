// src/api/resume.api.ts

import instance from "@/api/axios.instance";
import { CreateResumeRequest, CreateResumeResponse, ResumeDetail, ResumeItem } from "./resume.types";

export async function fetchResumeList(): Promise<ResumeItem[]> {
  // 백엔드 응답이 배열 그대로라면 이렇게:
  const res = await instance.get<ResumeItem[]>("/api/resume/list");
  console.log(res.data);
  return res.data;
}


export async function createResume(payload: CreateResumeRequest): Promise<CreateResumeResponse> {
  const res = await instance.post<CreateResumeResponse>(
    "/api/resume/create",
    payload
  );
  return res.data;
}

export async function fetchResumeDetail(resumeIdx: number): Promise<ResumeDetail> {
  const res = await instance.get<ResumeDetail>(
    `/api/resume/detail/${resumeIdx}`
  );
  return res.data;
}
