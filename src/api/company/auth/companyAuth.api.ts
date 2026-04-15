import instance from "@/api/axios.instance";
import type {
  CompanyEmailCheckResponse,
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

export async function getCompanyMe(): Promise<CompanyMeResponse> {
  const res = await instance.get<CompanyMeResponse>("/company/api/me", {
    tokenType: "company",
    headers: {
      Accept: "application/json",
    },
  } as any);

  return res.data;
}