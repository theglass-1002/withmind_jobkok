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

  //temp 임시저장여부


  // const payload: CreateResumeRequest = {
  //   userIdx:Storage.getUserIdx(),
  //   isDefault: 1,
  //   temp: "N",
  //   title: form.title,
  //   name: Storage.getUserName(),
  //   email: form.basic.email,
  //   gender: form.basic.gender=="male"?"M":"W",
  //   phone:form.basic.phone,
  //   profilePhotoFile: {
  //     filePath: "jobkok/resume/profile-photo/2025/12/04/profile_photo_v1.jpg",
  //     originalName: "증명사진.pdf",
  //     storedName: "profile_photo_v1.pdf",
  //     sizeBytes: 123456,
  //     contentType: "image/jpeg"
  //   },
  //   birth:form.basic.birth,
  //   regions: ["마포구", "서대문구"],       // 👉 나중에 getLocationList(form.location)로 교체 가능
  //   jobs: ["AI엔지니어", "웹개발"],
  //   hardSkills: ["JavaScript", "Reect", "view"],
  //   softSkills: ["팀워크", "공감능력", "협업능력"],
  //   careers: [
  //     {
  //       employmentType: "정규직",
  //       companyName: "위드마인드",
  //       startYm: "2022-01",
  //       endYm: null,
  //       roleName: "백엔드",
  //       positionName: "매니저",
  //       workAndResult: "API 개발",
  //       employedYn: "Y"
  //     }
  //   ],
  //   educations: [
  //     { schoolName: "OO대", startYm: "2016-03", endYm: "2020-02", majorDegree: "컴공 학사", graduatedYn: "Y" },
  //     { schoolName: "성신대", startYm: "2020-03", endYm: "2022-02", majorDegree: "컴공 학사", graduatedYn: "Y" },
  //     { schoolName: "연세대", startYm: "2023-03", endYm: "2025-02", majorDegree: "컴공 학사", graduatedYn: "Y" }
  //   ],
  //   activities: [
  //     {
  //       category: "경험",
  //       activityTitle: "오픈소스 기여",
  //       startYm: "2021-01",
  //       endYm: "2021-12",
  //       description: "버그 수정",
  //       linkUrl: "https://github.com/user"
  //     }
  //   ],
  //   awardCerts: [
  //     {
  //       category: "수상",
  //       name: "정보처리기사",
  //       issuer: "큐넷",
  //       acquiredYm: "202006",
  //       licenseNo: "ABC-123",
  //       note: "합격"
  //     }
  //   ],
  //   portfolios: [
  //     {
  //       itemType: "URL",
  //       title: "깃랩",
  //       docName: "GitHub",
  //       url: "https://github.com/user",
  //       fileRef: null,
  //       description: "모음",
  //       sortOrder: 3
  //     }
  //   ],
  //   selfIntros: [
  //     { title: "소개", content: "안녕하세요.", isAi: false }
  //   ]
  // };
  
  export interface CreateResumeRequest {
    userIdx: number;
    isDefault: number;          // ← 실제로 0/1 쓰면 이렇게 정의하는 게 더 정확
    temp: "Y" | "N";           // ← 백엔드가 temp를 받으니까 추가
    title: string;
    name: string;
    email: string;
    gender: "M" | "W";
    phone: string; //010-1234-5678
    birth: string;             // "1990-12-27" 같은 형태
    profilePhotoFile?: ProfilePhotoFile;
    regions: string[];
    careers: Career[];
    educations: Education[];
    jobs: string[];
    hardSkills: string[];
    softSkills: string[];
    activities: Activity[];
    awardCerts: AwardCert[];
    portfolios: Portfolio[];
    selfIntros: SelfIntro[];
  }
  
  export interface CreateResumeResponse {
    // 백엔드 응답 스펙에 맞게 타입 정의
    resumeIdx: number;
    // ... 필요하면 추가
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
