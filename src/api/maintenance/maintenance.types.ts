// src/api/maintenance/maintenance.types.ts

/**
 * 점검모드 설정 변경 요청
 * PUT /dev/maintenance
 *
 * OpenAPI schema 확인 결과: MaintenanceConfigVO의 모든 필드가 optional
 */
export interface UpdateMaintenanceConfigRequest {
  /** PK */
  idx?: number;
  /** 점검모드 ON/OFF */
  enabled?: boolean;
  /** 허용 IP 목록 (쉼표 구분)
   * @example "183.96.152.47,127.0.0.1"
   */
  allowedIps?: string;
  /** 점검 메시지
   * @example "현재 서비스 점검 중입니다. 잠시 후 다시 이용해 주세요."
   */
  message?: string;
  /** 수정일시
   * @example "2026-06-29 14:00:00"
   */
  updatedAt?: string;
}

/**
 * 점검모드 설정 변경 응답
 * PUT /dev/maintenance
 *
 * TODO(API 계약): OpenAPI 200 응답 schema가 additionalProperties: {}로만 정의되어 있어
 * 실제 응답 필드가 문서화되면 구체 타입으로 교체해야 한다.
 */
export type UpdateMaintenanceConfigResponse = Record<string, unknown>;

/**
 * 점검모드 상태 조회 응답
 * GET /dev/maintenance/status
 *
 * 실제 API 응답 구조에 따라 구체화
 */
export interface GetMaintenanceStatusResponse {
  /** 점검모드 활성화 여부 */
  enabled: boolean;
  /** 점검 안내 메시지 (선택) */
  message?: string | null;
  /** 허용 IP 목록 (선택) */
  allowedIps?: string | null;
}
