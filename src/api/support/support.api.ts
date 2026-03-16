import instance from "@/api/axios.instance";
import type {
  DeleteInquiryResponse,
  FetchInquiryListParams,
  InquiryDetailResponse,
  InquiryListResponse,
  InsertInquiryRequest,
  InsertInquiryResponse,
  UpdateInquiryRequest,
  UpdateInquiryResponse,
} from "@/api/support/support.types";

/**
 * 문의 목록 조회
 * GET /api/inquiry/list?pageNo=1&pageSize=10
 */
export async function fetchInquiryList(
  params?: FetchInquiryListParams
): Promise<InquiryListResponse> {
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;

  const res = await instance.get<InquiryListResponse>("/api/inquiry/list", {
    params: {
      ...(params?.replyYn ? { replyYn: params.replyYn } : {}),
      pageNo: page,
      pageSize: size,
      page,
      size,
    },
    headers: {
      accept: "application/json",
    },
  });

  return res.data;
}

/**
 * 문의 상세 조회 (답변 포함)
 * GET /api/inquiry/detail/{inquiryId}
 */
export async function fetchInquiryDetail(
  inquiryIdx: number
): Promise<InquiryDetailResponse> {
  const res = await instance.get<InquiryDetailResponse>(
    `/api/inquiry/${inquiryIdx}`,
    {
      headers: {
        accept: "application/json",
      },
    }
  );

  return res.data;
}

/**
 * 문의 등록
 * POST /api/inquiry/insert
 */
export async function insertInquiry(
  data: InsertInquiryRequest
): Promise<InsertInquiryResponse> {
  const res = await instance.post<InsertInquiryResponse>(
    "/api/inquiry/insert",
    data,
    {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );

  return res.data;
}

/**
 * 문의 수정
 * POST /api/inquiry/update
 */
export async function updateInquiry(
  data: UpdateInquiryRequest
): Promise<UpdateInquiryResponse> {
  const res = await instance.put<UpdateInquiryResponse>(
    "/api/inquiry/update",
    data,
    {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  );

  return res.data;
}

/**
 * 문의 삭제
 * DELETE /api/inquiry/{inquiryIdx}
 */
export async function deleteInquiry(
  inquiryIdx: number
): Promise<DeleteInquiryResponse> {
  const res = await instance.delete<DeleteInquiryResponse>(
    `/api/inquiry/${inquiryIdx}`,
    {
      headers: {
        accept: "application/json",
      },
    }
  );

  return res.data;
}