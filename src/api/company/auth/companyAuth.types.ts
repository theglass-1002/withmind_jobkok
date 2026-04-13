import { ApiResponse } from "@/api/axios.instance";

export interface CompanyRegisterRequest {
  deviceId: string;
  companyUserId: string;
  password: string;
  password2: string;
  managerName: string;
  managerPhone: string;
  birthdate: string;
  gender: "M" | "W" | string;
  companyName: string;
  bizRegNo: string;
  ceoName: string;
  agreeOver14Yn: 0 | 1;
  agreePaidTermsYn: 0 | 1;
  agreeTermsYn: 0 | 1;
  agreePrivacyYn: 0 | 1;
  agreeMarketingYn: 0 | 1;
  marketingEmailYn: 0 | 1;
  marketingPushYn: 0 | 1;
}

export interface CompanyAccountInfo {
  companyAccountIdx: number;
  companyId: number;
  companyUserId: string;
}

export interface CompanyRegisterResponse {
  code: number;
  tokenType: string;
  token: string;
  refreshToken: string;
  companyAccount: CompanyAccountInfo;
}