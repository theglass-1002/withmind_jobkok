import instance from "@/api/axios.instance";
import type {
  CompanyJobAnalysisRequest,
  CompanyJobAnalysisResultResponse,
  CompanyJobAnalysisStartResponse,
  CompanyJobRecommendationDetailResponse,
  CompanyMatchHistoryRequest,
  CompanyMatchHistoryResponse,
  CompanyResumeDetailResponse,
} from "./companyJob.types";
import { AI_BASE_URL } from "@/config/config";

export async function startCompanyJobAnalysis(
  payload: CompanyJobAnalysisRequest
): Promise<CompanyJobAnalysisStartResponse> {
  const body = {
    url: payload.url,
    company_idx: payload.companyIdx,
  };

  const res = await instance.post<CompanyJobAnalysisStartResponse>(
    "/company/analysis",
    body,
    {  baseURL: AI_BASE_URL,
      requiresAuth: false,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    } as any
  );

  return res.data;
}

export async function getCompanyJobAnalysis(
  url: string
): Promise<CompanyJobAnalysisResultResponse> {
  const res = await instance.get<CompanyJobAnalysisResultResponse>(
    "/company/analysis",
    {
      params: {
        url,
      },
      baseURL: AI_BASE_URL,
      requiresAuth: false,
      headers: {
        Accept: "application/json",
      },
    } as any
  );

  return res.data;
}

export async function getCompanyRecommendationDetail(
  recommendationIdx: number | string
): Promise<CompanyJobRecommendationDetailResponse> {
  const res = await instance.get<CompanyJobRecommendationDetailResponse>(
    `/company/recommendations/${recommendationIdx}`,
    {
      baseURL: AI_BASE_URL,
      requiresAuth: false,
      headers: {
        Accept: "application/json",
      },
    } as any
  );

  return res.data;
}


// 매칭 히스토리 조회
export async function getCompanyMatchHistory({
  companyIdx,
  page = 1,
  size = 10,
  jobIdx,
  keyword,
}: CompanyMatchHistoryRequest): Promise<CompanyMatchHistoryResponse> {
  const res = await instance.get<CompanyMatchHistoryResponse>(
    "/company/history",
    {
      params: {
        company_idx: companyIdx,
        page,
        size,
        ...(jobIdx !== undefined && jobIdx !== null && jobIdx !== ""
          ? { job_idx: jobIdx }
          : {}),
        ...(keyword ? { keyword } : {}),
      },
      baseURL: AI_BASE_URL,
      requiresAuth: false,
      headers: {
        Accept: "application/json",
      },
    } as any
  );

  return res.data;
}


//구직자 이력서조회
export async function getCompanyResumeDetail(
  resumeIdx: number | string
): Promise<CompanyResumeDetailResponse> {
  const res = await instance.get<CompanyResumeDetailResponse>(
    `/company/api/resume/${resumeIdx}`,
    {
      tokenType: "company",
      headers: {
        Accept: "application/json",
      },
    } as any
  );

  return res.data;
}