export type InquiryReplyYn = "Y" | "N";
export type InquirySecretYn = "Y" | "N";

export type InquiryListItem = {
  inquiryIdx: number;
  userIdx: number;
  userName: string;
  inquiryType: string;
  title: string;
  replyYn: InquiryReplyYn;
  secretYn: InquirySecretYn;
  regDt: string;
  pageNo: number;
  pageSize: number;
  offset: number;
};

export type InquiryListResponse = {
  code: number;
  totalCnt: number;
  list: InquiryListItem[];
};

export type FetchInquiryListParams = {
  replyYn?: InquiryReplyYn;
  page?: number;
  size?: number;
};

export type InquiryDetailData = {
  inquiryIdx: number;
  userIdx: number;
  userName: string;
  inquiryType: string;
  title: string;
  content: string;
  replyYn: InquiryReplyYn;
  secretYn: InquirySecretYn;
  regDt: string;
  modDt: string;
  replyId: number | null;
  replyContent: string | null;
  replyUserIdx: number | null;
  replyRegDt: string | null;
  replyModDt: string | null;
  pageNo: number;
  pageSize: number;
  offset: number;
};

export type InquiryDetailResponse = {
  code: number;
  data: InquiryDetailData;
};

export type InsertInquiryRequest = {
  userId: string;
  inquiryType: string;
  title: string;
  content: string;
  secretYn: InquirySecretYn;
};

export type InsertInquiryResponse = {
  code: number;
  msg: string;
  inquiryIdx: number;
};

export type UpdateInquiryRequest = {
  userId: string;
  inquiryIdx: number;
  inquiryType: string;
  title: string;
  content: string;
  secretYn: InquirySecretYn;
};

export type UpdateInquiryResponse = {
  code: number;
  msg: string;
};

export type DeleteInquiryResponse = {
  code: number;
  msg: string;
};

export type InsertJobReportRequest = {
  userIdx: string | number;
  jobUrl: string;
  memo: string;
  email: string;
};

export type InsertJobReportResponse = {
  code: number;
  msg: string;
  data?: number | string | null;
};