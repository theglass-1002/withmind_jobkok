import instance from "@/api/axios.instance";
import type {
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