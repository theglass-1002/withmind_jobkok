// src/api/report/report.api.ts
import instance from "@/api/axios.instance";
import {
  InterviewReportDetailResponse,
  InterviewReportResponse,
} from "./report.types";

/**
 * 🔥 모의면접 종합 리포트 조회
 * @param qzGroup 모의면접 그룹 ID (예: 1)
 */
export async function fetchInterviewReport(
  qzGroup: number
): Promise<InterviewReportResponse> {
  const res = await instance.get<InterviewReportResponse>(
    `/api/report/total/${qzGroup}`
  );

  return res.data;
}

/**
 * 🔥 모의면접 상세 분석 리포트 조회
 * @param qzGroup 모의면접 그룹 ID (예: 1)
 */
export async function fetchInterviewReportDetail(
  qzGroup: number
): Promise<InterviewReportDetailResponse> {
  const res = await instance.get<InterviewReportDetailResponse>(
    `/api/report/detail/${qzGroup}`
  );

  return res.data;
}