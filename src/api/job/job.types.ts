// src/api/job/job.types.ts
import locations from "@/data/locationsV2.json";
import { Region } from "../resume/resume.types";

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

  career: string | null;        // "5~10년" 같은 표시용 문자열일 수 있음
  careerFrom: number | null;    // 최소 경력 (년)
  careerTo: number | null;      // 최대 경력 (년)

  name: string;                 // 공고 제목
  intro: string | null;
  mainTasks: string | null;
  requirements: string | null;
  preferredPoints: string | null;
  benefits: string | null;
  hireRounds: string | null;

  url: string | null;

  createdAt: string;
  updatedAt: string;

  // 마감 정보 (없으면 상시)
  dueTime: string | null;

  favorite: number;             // 0 or 1
  applied: number;              // 0 or 1

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


export interface JobDetailApiResponse {
  userIdx: number | null;
  job: JobItem;
}

export function getEducationLabel(code?: number | null): string {
  switch (code) {
    case 0: return "학력무관";
    case 1: return "고등학교졸업";
    case 2: return "대학졸업(2,3년)";
    case 3: return "대학교졸업(4년)";
    case 4: return "석사졸업";
    case 5: return "박사졸업";
    case 6: return "고등학교졸업 이상";
    case 7: return "대학졸업(2,3년) 이상";
    case 8: return "대학교졸업(4년) 이상";
    case 9: return "석사졸업 이상";
    default: return "학력무관";
  }
}

export function getEmploymentTypeLabel(type?: string | null): string {
  switch (type) {
    case "regular": return "정규직";
    case "contract": return "계약직";
    case "intern": return "인턴";
    default: return "고용형태 무관";
  }
}


const regions: Region[] = locations as Region[];

export function getLocationLabel(code?: string | null): string {
  if (!code) return "지역 무관";

  // ex: "11-240" → ["11", "240"]
  const [cityCode] = code.split("-");

  const region = regions.find((r) => r.code === cityCode);
  if (!region) return "지역 무관";

  // 시 이름 ("서울 전체" → "서울")
  const cityName = region.name.replace(" 전체", "");

  // 하위 구/군 찾기
  const district = region.children.find((d) => d.code === code);

  if (!district) return cityName;

  return `${cityName} ${district.name}`;
}

export function getCareerLabel(from?: number | null, to?: number | null): string {
  if (from == null || to == null) return "경력 무관";

  // 1) 경력 무관
  if (from === 0 && to === 100) {
    return "경력 무관";
  }

  // 2) 신입
  if (from === 0 && to === 1) {
    return "신입";
  }

  // 3) X년 이상
  if (from > 0 && to === 100) {
    return `${from}년 이상`;
  }

  // 4) X년 이상 Y년 미만
  if (from > 0 && to < 100) {
    return `${from}년 이상 ${to}년 미만`;
  }

  // 기타 예외 처리
  return "경력 무관";
}
