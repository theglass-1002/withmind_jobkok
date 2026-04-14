export interface CompanyJobAnalysisRequest {
    url: string;
  }
  
  export interface CompanyJobAnalysisTaskData {
    taskId: number;
    jobIdx: number;
    status: "pending" | "processing" | "completed" | "failed" | string;
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
    jobIdx: number;
    title: string;
    companyIdx: number;
    companyName: string;
    url: string;
    updatedAt: string;
  }
  
  export interface CompanyJobAnalysisSectionItem {
    [key: string]: any;
  }
  
  export interface CompanyJobAnalysisSection {
    status: "pending" | "processing" | "completed" | "failed" | string;
    data: CompanyJobAnalysisSectionItem[];
  }
  
  export interface CompanyJobAnalysisSections {
    improvement: CompanyJobAnalysisSection;
    inappropriate: CompanyJobAnalysisSection;
    recommendation: CompanyJobAnalysisSection;
  }
  
  export interface CompanyJobAnalysisResultData {
    status: "pending" | "processing" | "completed" | "failed" | string;
    taskId: number;
    job: CompanyJobInfo;
    sections: CompanyJobAnalysisSections;
  }
  
  export interface CompanyJobAnalysisResultResponse {
    success: boolean;
    code: "JOB_POSTING_ANALYSIS_FOUND" | string;
    data: CompanyJobAnalysisResultData;
  }
  
  export interface CompanyJobAnalysisErrorResponse {
    detail: {
      code: "JOB_POSTING_NOT_FOUND" | string;
      message: string;
    };
  }