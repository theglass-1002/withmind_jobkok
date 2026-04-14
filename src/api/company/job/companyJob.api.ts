import instance from "@/api/axios.instance";
import type {
  CompanyJobAnalysisRequest,
  CompanyJobAnalysisResultResponse,
  CompanyJobAnalysisStartResponse,
} from "./companyJob.types";
import { AI_BASE_URL } from "@/config/config";

export async function startCompanyJobAnalysis(
  payload: CompanyJobAnalysisRequest
): Promise<CompanyJobAnalysisStartResponse> {
  const res = await instance.post<CompanyJobAnalysisStartResponse>(
    "/company/analysis",
    payload,
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