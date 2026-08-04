// src/api/maintenance/maintenance.api.ts
import instance from "@/api/axios.instance";
import type {
  GetMaintenanceStatusResponse,
  UpdateMaintenanceConfigRequest,
  UpdateMaintenanceConfigResponse,
} from "./maintenance.types";

/**
 * 점검모드 설정 변경
 * PUT /dev/maintenance
 *
 * @param body - 변경할 점검모드 설정 (idx, enabled, allowedIps, message, updatedAt)
 * @returns 설정 변경 결과
 */
export async function updateMaintenanceConfig(
  body: UpdateMaintenanceConfigRequest
): Promise<UpdateMaintenanceConfigResponse> {
  const res = await instance.put<UpdateMaintenanceConfigResponse>(
    "/dev/maintenance",
    body,
    {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );

  console.log("========================================");
  console.log("📡 [API Response] PUT /dev/maintenance");
  console.log("========================================");
  console.log(res.data);
  console.log("========================================");

  return res.data;
}

/**
 * 점검모드 상태 조회
 * GET /dev/maintenance/status
 *
 * @param requiresAuth - 인증 필요 여부 (기본값: false, MaintenanceGuard에서 인증 없이 호출)
 * @returns 현재 점검모드 상태
 */
export async function getMaintenanceStatus(
  requiresAuth: boolean = false
): Promise<GetMaintenanceStatusResponse> {
  const res = await instance.get<GetMaintenanceStatusResponse>(
    "/dev/maintenance/status",
    {
      requiresAuth,
    } as any
  );

  console.log("========================================");
  console.log("📡 [API Response] GET /dev/maintenance/status");
  console.log("========================================");
  console.log(res.data);
  console.log("========================================");

  return res.data;
}
