export interface CompanyJobAnalysisRequest {
  url: string;
  companyIdx: number | string;
}

export type AnalysisProcessStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "success";

export interface CompanyJobAnalysisTaskData {
  taskId: number;
  jobIdx?: number;
  status: AnalysisProcessStatus | string;
}

export interface CompanyJobAnalysisStartResponse {
  success: boolean;
  code:
    | "JOB_POSTING_ANALYSIS_ACCEPTED"
    | "JOB_POSTING_ANALYSIS_ALREADY_EXISTS"
    | string;
  data: CompanyJobAnalysisTaskData;
}

export interface CompanyJobInfo {
  jobIdx?: number;
  title?: string;
  companyIdx?: number;
  companyName?: string;
  url?: string;
  updatedAt?: string;
}

export interface ImprovementItem {
  originalText?: string;
  suggestionContent?: string;
  displayOrder?: number;
}

export interface InappropriateItem {
  originalText?: string;
  analysisContent?: string;
  displayOrder?: number;
}

export interface RecommendationItem {
  idx?: number;
  name?: string;
  age?: string;
  career?: string;
  education?: string;
  desiredJobs?: string[];
  aiInterview?: string;
  aiMatchPercent?: number;
  resumeUpdatedAt?: string;
  resumeIdx?: number;
  displayOrder?: number;
}

export interface CompanyJobAnalysisSection<T> {
  status?: AnalysisProcessStatus | string;
  data?: T[];
}

export interface CompanyJobAnalysisSections {
  improvement?: CompanyJobAnalysisSection<ImprovementItem>;
  inappropriate?: CompanyJobAnalysisSection<InappropriateItem>;
  recommendation?: CompanyJobAnalysisSection<RecommendationItem>;
}

export interface CompanyJobAnalysisResultData {
  status?: AnalysisProcessStatus | string;
  taskId?: number;
  job?: CompanyJobInfo;
  sections?: CompanyJobAnalysisSections;
}

export interface CompanyJobAnalysisResultResponse {
  success: boolean;
  code: "JOB_POSTING_ANALYSIS_FOUND" | string;
  data?: CompanyJobAnalysisResultData;
}

export interface CompanyJobAnalysisErrorResponse {
  detail?: {
    code?: "JOB_POSTING_NOT_FOUND" | string;
    message?: string;
  };
}


export interface CompanyJobRecommendationDetailData {
  recommendationIdx?: number;
  resumeIdx?: number;
  reportIdx?: number;
  aiMatchPercent?: number;
  technicalFitReason?: string;
  experienceAchievementReason?: string;
  problemSolvingReason?: string;
  teamworkCollaborationReason?: string;
}

export interface CompanyJobRecommendationDetailResponse {
  success: boolean;
  code: "JOB_POSTING_RECOMMENDATION_DETAIL_FOUND" | string;
  data?: CompanyJobRecommendationDetailData;
}

export interface CompanyJobRecommendationDetailErrorResponse {
  detail?: {
    code?: "JOB_POSTING_RECOMMENDATION_NOT_FOUND" | string;
    message?: string;
  };
}


export interface CompanyResumeCareerItem {
  companyName?: string | null;
  startYm?: string | null;
  endYm?: string | null;
  roleName?: string | null;
  positionName?: string | null;
  workAndResult?: string | null;
  employmentType?: string | null;
  employedYn?: string | null;
}

export interface CompanyResumeEducationItem {
  schoolName?: string | null;
  startYm?: string | null;
  endYm?: string | null;
  majorDegree?: string | null;
  graduatedYn?: string | null;
}

export interface CompanyResumeActivityItem {
  activityName?: string | null;
  startYm?: string | null;
  endYm?: string | null;
  description?: string | null;
}

export interface CompanyResumeLicenseItem {
  licenseName?: string | null;
  organization?: string | null;
  acquiredYm?: string | null;
}

export interface CompanyResumePortfolioItem {
  itemType?: string | null;
  title?: string | null;
  description?: string | null;
  filePath?: string | null;
  fileIdx?: number | null;
}

export interface CompanyResumeSelfIntroItem {
  title?: string | null;
  content?: string | null;
}

export interface CompanyResumeProfilePhotoFile {
  fileIdx?: number | null;
  category?: string | null;
  originalName?: string | null;
  storedName?: string | null;
  filePath?: string | null;
  sizeBytes?: number | null;
  contentType?: string | null;
  status?: string | null;
}

export interface CompanyResumeDetailData {
  resumeIdx?: number | null;
  userIdx?: number | null;
  profilePhotoFileIdx?: number | null;
  isDefault?: boolean | null;
  title?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  gender?: string | null;
  birth?: string | null;
  temp?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;

  regionList?: string[];
  jobList?: string[];
  hardSkillList?: string[];
  softSkillList?: string[];

  careerList?: CompanyResumeCareerItem[];
  educationList?: CompanyResumeEducationItem[];
  activityList?: CompanyResumeActivityItem[];
  licenseList?: CompanyResumeLicenseItem[];
  portfolioList?: CompanyResumePortfolioItem[];
  selfIntroList?: CompanyResumeSelfIntroItem[];

  profilePhotoFile?: CompanyResumeProfilePhotoFile | null;
}

export interface CompanyResumeDetailResponse {
  code: number;
  msg?: string;
  resume?: CompanyResumeDetailData | null;
}


export interface CompanyMatchHistoryItem {
  recommendationIdx?: number;
  name?: string;
  jobName?: string;
  aiMatchPercent?: number;
  aiInterview?: string;
  resumeUpdatedAt?: string;
}

export interface CompanyMatchHistoryPagination {
  page?: number;
  size?: number;
  totalCount?: number;
  totalPages?: number;
}

export interface CompanyMatchHistoryFilters {
  jobIdx?: number | null;
  keyword?: string | null;
}

export interface CompanyMatchHistoryData {
  items?: CompanyMatchHistoryItem[];
  pagination?: CompanyMatchHistoryPagination;
  filters?: CompanyMatchHistoryFilters;
}

export interface CompanyMatchHistoryResponse {
  success: boolean;
  code: "JOB_POSTING_MATCH_HISTORY_FOUND" | string;
  data?: CompanyMatchHistoryData;
}

export interface CompanyMatchHistoryRequest {
  companyIdx: number | string;
  page?: number;
  size?: number;
  jobIdx?: number | string;
  keyword?: string;
}