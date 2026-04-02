// src/api/job/job.types.ts
import locations from "@/data/locationsV2.json";
import { Region } from "../resume/resume.types";

// 직군 직무 
export interface JobNode {
    idx: number;
    name: string;
    parentIdx?: number | null;
    depth: number;
    sortOrder: number;
    isActive: boolean;
    children: JobNode[];
  }
  
  // 선택 UI 등에 쓰기 좋게 평탄화된 옵션 타입 (선택사항)
  export interface JobOption {
    idx: number;
    label: string;
    depth: number;
    parentIdx: number | null;
  }
  
  // 공고 리스트 타입들

export type JobStatus = "active" | "closed" | "draft" | string;
export type EmploymentType = "regular" | "contract" | "intern" | "parttime" | string;
export type EmploymentEtc = "military" | "disabled" | "foreigner" | string;

export interface JobItem {
  /** 공고 id */
  jobIdx: number;

  /** 직무 카테고리 */
  categoryId: number;
  categoryName: string;

  /** 회사 */
  companyId: number;
  companyName: string;
  companyLogoUrl: string | null;
  companyDescription: string | null;
  companyUrl: string | null;

  /** 공고 상태 */
  status: JobStatus; // "active" 같은 값

  /** 연차/경력(응답 기준: annualFrom/annualTo) */
  annualFrom: number | null;
  annualTo: number | null;

  /** 마감 시간(없으면 null) */
  dueTime: string | null;

  /** 공고 제목/내용 */
  name: string;
  intro: string | null;
  mainTasks: string | null;
  requirements: string | null;
  preferredPoints: string | null;
  benefits: string | null;
  hireRounds: string | null;

  /** 원문 링크 */
  url: string | null;

  /** 경력 필드(응답에 null로 내려옴 → 유지) */
  career: string | null;
  careerFrom: number | null;
  careerTo: number | null;

  /** 생성/수정일 */
  createdAt: string;  // "2025-12-01T14:56:54"
  updatedAt: string;  // "2026-01-06T16:35:44"

  /** 저장/지원 여부 (0/1) */
  favorite: 0 | 1;
  applied: 0 | 1;

  /** 지역 */
  locationCode: string | null;
  location: string | null;

  /** 고용형태 / 학력 */
  employmentType: EmploymentType; // "regular"
  employmentEtc: EmploymentEtc; // "regular"
  educationCode: number | null;
  educationText: string | null;

  /** 태그/조회수 */
  companyTags: string[] | null;   // 응답은 null이었음 (배열 가능성 대비)
  viewCount: number;

  /** AI 추천 / 최근 본 공고 */
  aiPick: boolean;
  recentViewed: 0 | 1;
  recentViewedAt: string | null;
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

export interface JobFavoriteResponse {
  resumeIdx: number;  // 서버에서 이력서 번호를 내려준다고 했으니까
}

export interface JobAppliedResponse {
  code?: number;
  msg?: string;
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


export const SORT_CODE_MAP: Record<string, string> = {
  "오래된순": "old",
  "최신순": "latest",
  "마감임박순": "closing",
  "인기순": "popular",
 // "적합도순": "maching", // 준비중이면 우선 보내거나, 아래에서 막기
};

export const SIZE_MAP: Record<string, number> = {
  "15개씩": 15,
  "30개씩": 30,
  "45개씩": 45,
};

