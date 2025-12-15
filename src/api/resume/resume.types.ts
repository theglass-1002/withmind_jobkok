import locations from "@/data/locationsV2.json";


export interface ResumeItem {
  resumeIdx: number;
  title: string;
  hopeJobs: string | null;          // ← 백엔드에서 null 올 수 있으니까 null 허용
  careerPeriod: string;
  educationSummary: string;
  createdAt: string;
  updatedAt: string;
  isDefault: number; // 1: 기본 이력서, 0: 일반
  temp:string;
}

export interface ResumeListApiResponse {
  page: number;
  size: number;
  totalCount: number;
  list: ResumeItem[];
}


  export interface Career {
    employmentType: string;
    companyName: string;
    startYm: string;
    endYm: string | null;
    roleName: string;
    positionName: string;
    workAndResult: string;
    employedYn: "Y" | "N";
  }
  
  export interface Education {
    schoolName: string;
    startYm: string;
    endYm: string;
    majorDegree: string;
    graduatedYn: string;
  }
  
  export interface Activity {
    category: string;
    activityTitle: string;
    startYm: string;
    endYm: string;
    description: string;
    linkUrl: string;
  }
  
  export interface AwardCert {
    category: string;
    name: string;
    issuer: string;
    acquiredYm: string;
    licenseNo: string;
    note: string;
  }
  
  export interface Portfolio {
    itemType: string;
    title: string;
    docName?: string;
    url?: string | null;
    fileRef?: string | null;
    description: string;
    sortOrder: number;
    portfolioFile?: PortfolioFile | null;
  }
  
  
  export interface SelfIntro {
    title: string;
    content: string;
    isAi: boolean;
  }

  export interface ProfilePhotoFile {
    filePath: string;
    originalName: string;
    storedName: string;
    sizeBytes: number;
    contentType: string;
  }


  export interface PortfolioFile {
    filePath: string;
    originalName: string;
    storedName: string;
    sizeBytes: number;
    contentType: string;
  }


  export interface CreateResumeRequest {
    userIdx: number;
    isDefault: number;
    temp: "Y" | "N";
    title: string;
    name: string;
    email: string;
    gender: "M" | "W";
    phone: string;
    birth: string;
    profilePhotoFile?: ProfilePhotoFile;
    regions: string[];
    careers?: Career[];
    educations: Education[];
    jobs: string[];
    hardSkills: string[];
    softSkills: string[];
    activities?: Activity[];
    awardCerts?: AwardCert[];
    portfolios?: Portfolio[];
    selfIntros?: SelfIntro[];
  }
  
  export interface CreateResumeResponse {
    // 백엔드 응답 스펙에 맞게 타입 정의
    resumeIdx: number;
    // ... 필요하면 추가
  }
  

  // 이력서 상세 조회 응답 타입
  export interface ResumeDetailResponse {
    resumeIdx: number;
    userIdx: number;
    isDefault: boolean;
    temp: "Y" | "N";
  
    title: string;
    name: string;
    email: string;
    phone: string;
    gender: "M" | "W";
    birth: string;
    profilePhotoFile?: ProfilePhotoFile | null;
    createdAt: string;
    updatedAt: string;
  
    regionList: string[];
    jobList: string[];
    hardSkillList: string[];
    softSkillList: string[];
  
    careerList: {
      companyName: string;
      startYm: string;
      endYm: string | null;
      roleName: string;
      positionName: string;
      workAndResult: string;
      employmentType: string | null;
      employedYn: string | null;
    }[];
  
    educationList: {
      schoolName: string;
      startYm: string;
      endYm: string;
      majorDegree: string;
      graduatedYn: string | null;
    }[];
  
    activityList: {
      category: string;
      activityTitle: string;
      startYm: string;
      endYm: string;
      description: string;
      linkUrl: string;
    }[] | null;
  
    licenseList: {
      category: string;
      name: string;
      acquiredYm: string;
      score: string | null;
      issuer: string;
      licenseNo: string;
      note: string;
    }[];
  
    portfolioList: {
      itemType: string;
      title: string;
      description: string;
      url: string | null;
      fileIdx: number | null;
      fileIdxsCsv: string | null;
      order: number | null;
      filePath?: string | null;
    }[];
  
    selfIntroList: {
      title: string;
      content: string;
      isAi: boolean;
    }[];
  }
  

// 이력서 존재 여부 체크 응답
export interface ResumeCheckResponse {
  exists: boolean;
  resumeIdx: number | null;
  title: string | null;
}



 export const normalizeYm = (ym?: string | null): string | null => {
    //"2025.03" 헬퍼함수
    if (!ym) return null;
    // "2025.03" -> "2025-03"
    const m = ym.match(/^(\d{4})[.-](\d{2})$/);
    if (!m) return ym;
    return `${m[1]}-${m[2]}`;
  };
  

  // 학력 졸업 여부(status) -> 코드(A~F) 매핑
  export const mapEducationStatusToGraduatedYn = (status?: string): string | undefined => {
  switch (status) {
    case "졸업":
      return "A";
    case "졸업 예정":
      return "B";
    case "재학중":
      return "C";
    case "중퇴":
      return "D";
    case "수료":
      return "E";
    case "휴학":
      return "F";
    default:
      return "A"; // 
  }
};


// 수상·자격증 kind -> 한글 카테고리 라벨 매핑
export const mapAwardsKindToCategoryLabel = (status?: string): string => {
  switch (status) {
    case "Certification":
      return "자격증";
    case "LanguageTest":
      return "어학시험";
    case "Award":
      return "수상";
    default:
      return "기타";
  }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export function getGenderLabel(gender: "M" | "W"): string {
  return gender === "M" ? "남성" : "여성";
}

export function getKoreanBirthLabel(birth: string): string {
  // "2021-12-09" → 2021년생
  const year = birth.split("-")[0];
  return `${year}년생`;
}

export function getAge(birth: string): number {
  // 생년월일 기준 만 나이 계산
  const [year, month, day] = birth.split("-").map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;

  const hasHadBirthday =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!hasHadBirthday) {
    age -= 1; // 생일 안 지났으면 한 살 빼기
  }

  return age;
}

export function formatMeta(birth: string, gender: "M" | "W"): string {
  const birthLabel = getKoreanBirthLabel(birth);
  const age = getAge(birth);
  const genderLabel = getGenderLabel(gender);

  return `${birthLabel}(만 ${age}세), ${genderLabel}`;
}

// ===================================================
// 유틸: ResumeLocationList 
// ===================================================

// ---------- 지역 코드 매핑용 타입 & 헬퍼 ----------

export type District = {
  code: string; // "26-030"
  name: string; // "동구"
};

export type Region = {
  code: string; // "26"
  name: string; // "부산 전체"
  children: District[];
};

export const regionsData = locations as Region[];


export const mapRegionListToLocationItems = (
  codes: string[]
): { city: string; district: string }[] => {
  const items: { city: string; district: string }[] = [];

  codes.forEach((code) => {
    // 1) "27" 같은 지역 전체 코드
    const region = regionsData.find((r) => r.code === code);
    if (region) {
      const cityName = region.name.replace(" 전체", ""); // "대구 전체" -> "대구"
      items.push({ city: cityName, district: "전체" });
      return;
    }

    // 2) "26-030" 같은 구/군 코드
    const [regionCode] = code.split("-");
    const parentRegion = regionsData.find((r) => r.code === regionCode);
    const district = parentRegion?.children.find((d) => d.code === code);

    if (parentRegion && district) {
      const cityName = parentRegion.name.replace(" 전체", ""); // "부산 전체" -> "부산"
      items.push({ city: cityName, district: district.name }); // "동구", "동래구" 등
    }
  });

  return items;
};


// ===================================================
// 유틸: careerList -> ResumeCareerSection용 CareerItem[] 매핑
// ===================================================


export type CareerItem = {
  company: string;
  start: string;       // 예: "2020.04"
  end: string;         // 예: "재직중" or "2024.08"
  isCurrent?: boolean; // true면 .current 클래스 추가
  tenure: string;      // 예: "(0년 0개월)"
  employment?: string; // 예: "정규직"
  role?: string;       // 예: "프로젝트 기획자"
  level?: string;      // 예: "매니저"
  bullets: string[];   // 예: ["• ...", "• ..."]
};


// 근속기간 계산 -> "(x년 y개월)"
export const calcTenureLabel = (startYm: string, endYm: string | null): string => {
  if (!startYm) return "";

  const [sy, sm] = startYm.split("-").map(Number);
  const end = endYm ?? new Date().toISOString().slice(0, 7);
  const [ey, em] = end.split("-").map(Number);

  let years = ey - sy;
  let months = em - sm;

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) return "";

  return `(${years}년 ${months}개월)`;
};

// 전체 경력 기간 라벨 -> "(총 x년 y개월)"
export const calcTotalCareerLabel = (
  careerList: ResumeDetailResponse["careerList"] | undefined
): string => {
  if (!careerList || careerList.length === 0) {
    return "(총 0년 0개월)";
  }

  const sorted = [...careerList].sort((a, b) =>
    a.startYm.localeCompare(b.startYm)
  );

  const firstStart = sorted[0].startYm;
  const lastEnd =
    sorted[sorted.length - 1].endYm ?? new Date().toISOString().slice(0, 7);

  const label = calcTenureLabel(firstStart, lastEnd); // "(x년 y개월)"
  return `(총 ${label.replace(/[()]/g, "")})`; // 괄호 제거 후 "(총 x년 y개월)"
};

// BE careerList → FE CareerItem[]
export const mapCareerListToCareerItems = (
  careerList: ResumeDetailResponse["careerList"] | undefined
): CareerItem[] => {
  if (!careerList) return [];

  return careerList.map((c) => {
    const isCurrent = c.employedYn === "Y" || c.endYm === null;

    const endLabel = isCurrent ? "재직중" : c.endYm;
    const tenureLabel = calcTenureLabel(c.startYm, c.endYm);

    return {
      company: c.companyName,
      start: c.startYm,
      end: endLabel,
      isCurrent,
      tenure: tenureLabel,
      employment: c.employmentType || undefined,
      role: c.roleName || undefined,
      level: c.positionName || undefined,
      bullets: c.workAndResult
        ? c.workAndResult.split("\n").map((line) => `• ${line}`)
        : [],
    };
  });
};



// ResumeEducationSection

export const mapGraduatedYnToLabel = (
  code: string | null | undefined
): string => {
  switch (code) {
    case "A":
      return "졸업";
    case "B":
      return "졸업 예정";
    case "C":
      return "재학";
    case "D":
      return "중퇴";
    case "E":
      return "수료";
    case "F":
      return "휴학";
    default:
      return "";
  }
};




// ResumeAwardsSection

// "202108" -> "2021.08"
export const formatAcquiredYm = (yyyymm?: string | null): string => {
  if (!yyyymm) return "";
  if (yyyymm.length === 6) {
    const year = yyyymm.slice(0, 4);
    const month = yyyymm.slice(4, 6);
    return `${year}.${month}`;
  }
  return yyyymm;
};

export const mapLicenseListToAwardItems = (
  licenseList: ResumeDetailResponse["licenseList"] | undefined
): { title: string; start: string; issuer?: string }[] => {
  if (!licenseList) return [];

  return licenseList.map((lic) => ({
    title: `[${lic.category}] ${lic.name}`,          // 예: "[어학시험] 어시험"
    start: formatAcquiredYm(lic.acquiredYm),         // "202108" -> "2021.08"
    issuer: lic.issuer || undefined,                 // 빈 문자열이면 undefined 처리
  }));
};



export type PortfolioFileItem = {
  kind: "file";
  name: string; // 예: "정유리_포트폴리오.pdf"
  iconSrc?: string; // 없으면 defaultIcons.file 사용
  filePath?:string;
};

export type PortfolioLinkItem = {
  kind: "link";
  url: string; // 예: "https://interview.kr"
  displayText?: string; // 표시 텍스트 커스텀 (없으면 url 그대로)
  iconSrc?: string; // 없으면 defaultIcons.link 사용
};

export type PortfolioItem = PortfolioFileItem | PortfolioLinkItem;



export function mapPortfolioListToPortfolioItems(
  portfolioList: ResumeDetailResponse["portfolioList"] | undefined
): PortfolioItem[] {
  if (!portfolioList) return [];

  return portfolioList.flatMap<PortfolioItem>((p) => {
    const items: PortfolioItem[] = [];
    // 1) URL 타입인 경우 -> link 아이템
    if (p.itemType === "URL" && p.url) {
      items.push({
        kind: "link",
        url: p.url,
        displayText: p.title || p.url,
      });
      return items;
    }
    // 2) FILE 타입인 경우 -> file 아이템
    if (p.itemType === "FILE") {
      // 실제 파일 정보를 못 가져오니까, title을 파일명처럼 사용
      const name =
        p.title ||
        "포트폴리오 파일"; // title 없으면 기본값 (거의 title에 파일명이 들어오겠죠)
      

      items.push({
        kind: "file",
        name,
        filePath:p.filePath||""
      });

      return items;
    }

    // 3) 그 외 타입은 일단 스킵
    return items;
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AI 이력서 제목 추천 API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 요청 바디 타입 (API 스펙 그대로 - postion 오타 주의)
export interface ResumeTitleRequest {
  position: string;      // 예: "디자이너"
  experiences: string;  // 예: "협업"
  activities: string;   // 예: "동아리 활동"
  awards: string;       // 예: "수상 내역"
}

// 응답 타입
export interface ResumeTitleAIResponse {
  success: boolean;
  data: {
    titles: string[];
  } | null;
  error: any;
  meta: {
    request_id: string;
    timestamp: string;
    [key: string]: any;
  };
}


export interface CreateExperienceRequest {
  role_name: string;   
  user_input: string;
}

export interface CreateExperienceResponse {
  success: boolean;
  data: {
    mode: "NEED_MORE_INPUT" | "DONE" | string;
    bullets: string[];
    missing_info: string[];
  };
  error: null | {
    message?: string;
    msg?: string;
  };
  meta: {
    request_id: string;
    timestamp: string;
  };
}


// resume.types.ts

export interface ResumePositionRequest {
  experiences: string;
  educations: string;
  activities: string;
  awards: string;
}

export interface ResumePositionResponse {
  success: boolean;
  data: {
    positions: string[];
  } | null;
  error: {
    message?: string;
    msg?: string;
  } | null;
  meta?: any;
}



export interface ResumeHardSkillRequest {
  position: string;
  experiences: string;
  activities: string;
  awards: string;
}

export interface ResumeHardSkillResponse {
  success: boolean;
  data: {
    skills: string[];
  } | null;
  error: {
    code?: string;
    message?: string;
    msg?: string;
    details?: any;
  } | null;
  meta?: any;
}



export interface ResumeSoftSkillRequest {
  position: string;
  experiences: string;
  activities: string;
  awards: string;
}

export interface ResumeSoftSkillResponse {
  success: boolean;
  data: {
    skills: string[];
  } | null;
  error: {
    code?: string;
    message?: string;
    msg?: string;
    details?: any;
  } | null;
  meta?: any;
}

export interface ResumeSelfIntroRequest {
  position: string;
  experiences: string;
  activities: string;
  awards: string;
}

export interface ResumeSelfIntroResponse {
  success: boolean;
  data: {
    selfintro: string;
  } | null;
  error: {
    code?: string;
    message?: string;
    msg?: string;
    details?: any;
  } | null;
  meta?: any;
}

// resume.types.ts (맨 아래 아무데나 추가)

export type SkillAutoCompleteItem = {
  id: number;
  name: string;
  type: "HARD" | "SOFT";
};

