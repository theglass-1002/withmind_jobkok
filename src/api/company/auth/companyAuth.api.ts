import instance from "@/api/axios.instance";
import type {
  CompanyEmailCheckResponse,
  CompanyFindIdResponse,
  CompanyIssueTempPasswordResponse,
  CompanyLoginRequest,
  CompanyLoginResponse,
  CompanyMeResponse,
  CompanyRegisterRequest,
  CompanyRegisterResponse,
} from "./companyAuth.types";

export async function registerCompany(
  payload: CompanyRegisterRequest
): Promise<CompanyRegisterResponse> {
  const res = await instance.post<CompanyRegisterResponse>(
    "/company/auth/register",
    payload,
    {
      requiresAuth: false,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    } as any
  );

  return res.data;
}



export async function checkCompanyEmail(
  email: string
): Promise<CompanyEmailCheckResponse> {
  const res = await instance.get<CompanyEmailCheckResponse>(
    "/company/auth/emailCheck",
    {
      params: {
        email,
      },
      requiresAuth: false,
      headers: {
        Accept: "application/json",
      },
    } as any
  );

  return res.data;
}


export async function loginCompany(
  payload: CompanyLoginRequest
): Promise<CompanyLoginResponse> {
  const res = await instance.post<CompanyLoginResponse>(
    "/company/auth/login",
    payload,
    {
      requiresAuth: false,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    } as any
  );

  return res.data;
}

/**
 * 기업 아이디 찾기
 * POST /company/auth/find-id
 * 본인인증으로 받은 ci 값을 전달하면 매칭되는 companyUserIds 배열을 반환
 */
export async function findCompanyIdByCi(
  ci: string,
  deviceId: string
): Promise<CompanyFindIdResponse> {
  const payload = {
    companyUserId: "",
    password: "",
    managerPhone: "",
    managerName: "",
    birthdate: "",
    gender: "",
    password2: "",
    deviceId,
    companyName: "",
    bizRegNo: 0,
    ceoName: "",
    agreeOver14Yn: 0,
    agreePaidTermsYn: 0,
    agreeTermsYn: 0,
    agreePrivacyYn: 0,
    agreeMarketingYn: 0,
    marketingEmailYn: 0,
    marketingPushYn: 0,
    ci,
  };

  const res = await instance.post<CompanyFindIdResponse>(
    "/company/auth/find-id",
    payload,
    {
      requiresAuth: false,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    } as any
  );

  console.log("[findCompanyIdByCi] response:", res.data);
  return res.data;
}

/**
 * 기업 임시 비밀번호 발급
 * POST /company/auth/password/issue-temp
 * companyUserId + 본인인증으로 받은 ci로 임시 비밀번호 발급
 */
export async function issueCompanyTempPassword(
  companyUserId: string,
  ci: string,
  deviceId: string
): Promise<CompanyIssueTempPasswordResponse> {
  const payload = {
    companyUserId,
    password: "",
    managerPhone: "",
    managerName: "",
    birthdate: "",
    gender: "",
    password2: "",
    deviceId,
    companyName: "",
    bizRegNo: 0,
    ceoName: "",
    agreeOver14Yn: 0,
    agreePaidTermsYn: 0,
    agreeTermsYn: 0,
    agreePrivacyYn: 0,
    agreeMarketingYn: 0,
    marketingEmailYn: 0,
    marketingPushYn: 0,
    ci,
  };

  const res = await instance.post<CompanyIssueTempPasswordResponse>(
    "/company/auth/password/issue-temp",
    payload,
    {
      requiresAuth: false,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    } as any
  );

  console.log("[issueCompanyTempPassword] response:", res.data);
  return res.data;
}

export async function getCompanyMe(): Promise<CompanyMeResponse> {
  const res = await instance.get<CompanyMeResponse>("/company/api/me", {
    tokenType: "company",
    headers: {
      Accept: "application/json",
    },
  } as any);

  return res.data;
}