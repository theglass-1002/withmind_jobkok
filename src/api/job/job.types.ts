// src/api/job/job.types.ts

// 직군 직무 
export interface JobNode {
    id: number;
    name: string;
    parentId: number | null;
    depth: number;
    sortOrder: number;
    isActive: boolean;
    children: JobNode[];
  }
  
  // 선택 UI 등에 쓰기 좋게 평탄화된 옵션 타입 (선택사항)
  export interface JobOption {
    id: number;
    label: string;
    depth: number;
    parentId: number | null;
  }
  
  // ======================
// 🔥 공고 리스트 타입들
// ======================

export type JobStatus = "active" | "closed" | "draft" | string;

export type EmploymentType = "regular" | "contract" | "intern" | "parttime" | string;

export interface JobItem {
  id: number;
  categoryId: number;
  categoryName: string;

  companyId: number;
  companyName: string;
  companyLogoUrl: string | null;
  companyDescription: string | null;
  companyUrl: string | null;

  status: JobStatus;

  annualFrom: number | null;
  annualTo: number | null;

  name: string;              // 공고 제목
  intro: string | null;
  mainTasks: string | null;
  requirements: string | null;
  preferredPoints: string | null;
  benefits: string | null;
  hireRounds: string | null;

  url: string | null;

  createdAt: string;
  updatedAt: string;

  favorite: number;          // 0 or 1
  applied: number;           // 0 or 1

  locationCode: string | null;
  location: string | null;

  employmentType: EmploymentType;
  educationCode: number | null;
  educationText: string | null;
}

export interface JobListApiResponse {
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  jobs: JobItem[];
}