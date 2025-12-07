export interface ResumeItem {
    resumeIdx: number;
    title: string;
    hopeJobs: string;
    careerPeriod: string;
    educationSummary: string;
    createdAt: string;
    updatedAt: string;
    isDefault: number; // 1: 기본 이력서, 0: 일반
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
  
    // 🔥 여기 네 필드들을 optional로
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
export interface ResumeDetail {
  resumeIdx: number;
  isDefault: number;      // 1: 기본 이력서, 0: 일반
  temp: "Y" | "N";
  title: string;
  name: string;
  email: string;
  gender: "M" | "W";
  phone: string;
  birth: string;

  profilePhotoFile?: ProfilePhotoFile | null;

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


