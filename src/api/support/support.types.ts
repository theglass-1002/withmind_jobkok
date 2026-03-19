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

export type NoticeImportantYn = "Y" | "N";
export type NoticePopupYn = "Y" | "N";
export type NoticeUseYn = "Y" | "N";

export type NoticeListItem = {
  noticeIdx: number;
  userIdx: number;
  userName: string;
  category: string;
  title: string;
  importantYn: NoticeImportantYn;
  popupYn: NoticePopupYn;
  viewCnt: number;
  useYn: NoticeUseYn;
  regDt: string;
};

export type NoticeListResponse = {
  code: number;
  totalCnt: number;
  list: NoticeListItem[];
};

export type FetchNoticeListParams = {
  page?: number;
  size?: number;
  category?: string;
  importantYn?: NoticeImportantYn;
  popupYn?: NoticePopupYn;
  useYn?: NoticeUseYn;
};

export type NoticeDetailData = {
  noticeIdx: number;
  userIdx: number;
  userName: string;
  category: string;
  title: string;
  content: string;
  importantYn: NoticeImportantYn;
  popupYn: NoticePopupYn;
  viewCnt: number;
  useYn: NoticeUseYn;
  regDt: string;
  modDt?: string | null;
};

export type NoticeDetailResponse = {
  code: number;
  data: NoticeDetailData;
};