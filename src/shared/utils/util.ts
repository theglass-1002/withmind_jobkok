import { useEffect, useState, useRef } from "react";
import data from '@/data/locations.json';


export function useStickyTabs(
  sectionId: string,        // ex: "section-description"
  tabsSelector: string,     // ex: ".default_tabs"
  headerSelector?: string   // ex: ".page-header" (없으면 skip)
) {

 
  // ex: 사용법
  // import {useStickyTabs} from '@/shared/utils/util'; 
  //  const isTabsSticky = useStickyTabs(
  //   "sticky-trigger", <거의공통 지나가면 어디서 고정할 것인지
  //   ".default_tabs",
  //   ".page-header")

  //   <Tabs
  //   tabs={tabItems}
  //   active={activeTab}
  //   onChange={handleTabClick}
  //   className={`resume-create-tabs default_tabs ${isTabsSticky?'is-sticky':''}`}
  //   itemClassName="resume-create-tabs__item"
  //   activeClassName="on"
  //   />



  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById(sectionId);
      const tabs = document.querySelector(tabsSelector) as HTMLElement | null;
      const header = headerSelector
        ? document.querySelector(headerSelector)
        : null;

      if (!section || !tabs) return;

      const sectionTop = section.offsetTop;
      const tabsHeight = tabs.offsetHeight;
      const scrollY = window.scrollY;

      const shouldStick = scrollY + tabsHeight > sectionTop;

      setIsSticky(shouldStick);

      if (header) {
        header.classList.toggle("sticky-active", shouldStick);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 1회 실행

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionId, tabsSelector, headerSelector]);

  return isSticky;
}









export function stripAllWhitespace(value: string): string {
    // 스페이스/탭/개행 등 모든 공백 제거
    return value.replace(/\s+/g, "");
  }
  // 영문/숫자/특수문자 각각 1개 이상 + 공백 금지 + 8~16자
  export const pwRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s])\S{8,16}$/;

  export function isValidPassword(pw: string): boolean {
    return pwRule.test(pw);
  }
  
  // src/shared/utils/date.ts

// 월 단위 ---------------------------------------
export type MonthValue = { year: number; month: number }; // 0~11


/** "YYYY-MM" 또는 "YYYY.MM" -> {year, month(0~11)} 엄격 파서 */
export const parseMonth = (s?: string | null): MonthValue | null => {
  if (!s) return null;
  const trimmed = s.trim();

  // 1순위: 새 포맷 "YYYY-MM"
  let m = trimmed.match(/^(\d{4})-(\d{2})$/);

  // 호환: 기존 포맷 "YYYY.MM"도 허용
  if (!m) {
    m = trimmed.match(/^(\d{4})\.(\d{2})$/);
  }

  if (!m) return null;

  const y = Number(m[1]);
  const mm = Number(m[2]);
  if (!y || mm < 1 || mm > 12) return null;

  return { year: y, month: (mm - 1) as MonthValue["month"] };
};



/** {year, month(0~11)} -> "YYYY-MM" */
export const fmtMonth = (d: { year: number; month: number }) =>
  `${d.year}-${String(d.month + 1).padStart(2, "0")}`;

// 일 단위 ---------------------------------------
export type DateValue = Date;

/** {Date} -> "YYYY.MM.DD" */
export const fmtDate = (d?: DateValue | null): string =>
  d
    ? `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
        d.getDate()
      ).padStart(2, "0")}`
    : "";

/** "YYYY.MM.DD" -> Date (유효성 체크 포함) */
export const parseDate = (s?: string | null): DateValue | null => {
  if (!s) return null;
  const m = s.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const mm = Number(m[2]);
  const dd = Number(m[3]);
  if (!y || mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;

  const d = new Date(y, mm - 1, dd);
  // 잘못된 날짜(예: 2024.02.31) 방지: 역검증
  if (
    d.getFullYear() !== y ||
    d.getMonth() !== mm - 1 ||
    d.getDate() !== dd
  ) {
    return null;
  }
  return d;
};


export const DEFAULT_BREAKS = [20, 40, 60, 80, 100] as const;
export const DEFAULT_LABELS = ["매우 미흡", "미흡", "보통", "우수", "최우수"] as const;

// 긴장도 등급 (3단계)
export const TENSION_BREAKS = [33, 67, 100] as const;
export const TENSION_LABELS = ["높음", "보통", "낮음"] as const;



export function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function segmentsFromScore(score: number, breaks = DEFAULT_BREAKS as readonly number[]) {
  const segs = Array(breaks.length).fill(0) as number[];
  let prev = 0;
  for (let i = 0; i < breaks.length; i++) {
    const end = breaks[i];
    const filled = (score - prev) / (end - prev);
    segs[i] = score >= end ? 1 : clamp01(filled);
    if (score <= end) break;
    prev = end;
  }
  return segs.map(clamp01);
}

export function bucketOf(
  score: number,
  breaks = DEFAULT_BREAKS as readonly number[],
  labels = DEFAULT_LABELS as readonly string[]
) {
  for (let i = 0; i < breaks.length; i++) {
    if (score <= breaks[i]) return { index: i, label: labels[i] };
  }
  return { index: breaks.length - 1, label: labels[breaks.length - 1] };
}

export function modifierByBucket(i: number) {
  return ["poor", "improvement", "fair", "good", "excellent"][i] ?? "fair";
}

// 긴장도 전용 함수들
export function tensionModifierByBucket(i: number) {
  return ["low", "medium", "high"][i] ?? "medium";
}

export interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean | 'mobile-only' | 'desktop-only';
  showFooter?: boolean | 'mobile-only' | 'desktop-only';
  showBottomNav?: boolean;
  customHeader?: React.ReactNode;
  screen?:string
  onScreenAction?: (payload: { type: string, data?: any }) => void; 
}


export interface SortOption {
  label: string;
  value: string;
  emoji?: React.ReactNode; 
  className?: string; // 옵션별 커스텀 스타일링을 위한 클래스
}

export interface HeaderProps {
  leftElement?: React.ReactNode; 
  title?: string;
  rightIcons?: React.ReactNode; 
  onLeftElementClick?: () => void;
  onRightElementClick?: () => void;
  sort?: boolean;
  sortClassName?: string;
  sortValue?: string;
  sortOptions?: SortOption[]; 
  onSortChange?: (val: string) => void;
}



// resume

export const tabItems = [
  { key: "title", label:"이력서 제목" },
  { key: "basic", label:"기본 정보" },
  { key: "location", label:"희망 근무 지역" },
  { key: "career", label:"경력" },
  { key: "education", label:"학력" },
  { key: "desiredRole", label:"희망 직무" },
  { key: "hardSkills", label:"하드 스킬" },
  { key: "softSkills", label:"소프트 스킬" },
  { key: "activities", label:"활동ㆍ경험" },
  { key: "awards", label:"수상ㆍ자격증" },
  { key: "portfolio", label:"포트폴리오ㆍ기타 문서" },
  { key: "selfIntro", label:"자기소개서" },
  { key: "mockInterview", label:"모의면접 분석 결과" },
];


type Gender = "male" | "female" | null;
export type BasicInfo = {
  name: string;
  birth: string;
  gender: Gender;
  email: string;
  phone: string;
  photoUrl?: string;
};

export type BasicErrors = Partial<Record<keyof BasicInfo, string>>;


export const parseYMD = (s: string) => {
  const m = /^(\d{4})\.(\d{2})\.(\d{2})$/.exec((s || "").trim());
  if (!m) return null;
  return { year: +m[1], month: +m[2] - 1, day: +m[3] };
};
export const fmtYMD = (d: { year: number; month: number; day: number }) =>
  `${d.year}.${String(d.month + 1).padStart(2, "0")}.${String(d.day).padStart(2, "0")}`;






export type SectionId =
  | "title"
  | "basic"
  | "location"
  | "career"
  | "education"
  | "desiredRole"
  | "hardSkills"
  | "softSkills"
  | "activities"
  | "awards"
  | "portfolio"
  | "selfIntro"
  | "mockInterview";


export const ALL_SECTIONS: SectionId[] = [
  "title",
  "basic",
  "location",
  "career",
  "education",
  "desiredRole",
  "hardSkills",
  "softSkills",
  "activities",
  "awards",
  "portfolio",
  "selfIntro",
  "mockInterview",
];


// M_LocationSection


export type District = { id?: string; name: string };
export type Region = {
  id?: string;
  name: string;
  all?: string | { id?: string; label: string };
  districts: (string | District)[];
};


/**
 * selectedKeys를 실제 지역명 배열로 변환
 * "서울|ALL" → ["서울 전체", "강남구", "강동구", ...]
 * "서울|강남구" → ["강남구"]
 */
export function expandLocationKeys(selectedKeys: string[]): string[] {
  const { regions } = data as unknown as { regions: Region[] };
  const result: string[] = [];

  selectedKeys.forEach((key) => {
    const [regionName, tail] = key.split('|');
    
    // 해당 지역 찾기
    const region = regions.find((r) => r.name === regionName || r.id === regionName);
    if (!region) return;

    if (tail === 'ALL') {
      // "서울|ALL" → 서울의 모든 구 추가
      const allLabel = typeof region.all === 'string' 
        ? region.all 
        : region.all?.label || `${regionName} 전체`;
      
      result.push(allLabel); // "서울 전체" 추가
      
      // 모든 구/시 추가
      region.districts.forEach((d) => {
        const districtName = typeof d === 'string' ? d : d.name;
        result.push(districtName);
      });
    } else {
      // "서울|강남구" → 강남구만 추가
      result.push(tail);
    }
  });

  return result;
}

/**
 * LocationValue를 실제 지역명 배열로 변환
 */
export function getLocationList(location: { nationwide: boolean; selectedKeys: string[] }): string[] {
  if (location.nationwide) {
    return ['전국'];
  }
  return expandLocationKeys(location.selectedKeys);
}

export interface LocationSectionProps {
  defaultValue?: LocationValue;
  onChange: (v: LocationValue) => void;
  sectionRef?: (el: HTMLDivElement | null) => void;
}

// CareerSection
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

export function parseJwt<T = any>(token: string): T {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export function deviceId(): string {
  let t = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (t + Math.random() * 16) % 16 | 0;
    t = Math.floor(t / 16);
    return (c === "x" ? r : ((r & 0x3) | 0x8)).toString(16);
  });
}

export function openAuthPopup(
  width = 430,
  height = 640,
  name = "sa_popup"
): Window | null {
  const dualScreenLeft = window.screenLeft ?? window.screenX;
  const dualScreenTop = window.screenTop ?? window.screenY;

  const screenWidth = window.innerWidth ?? document.documentElement.clientWidth;
  const screenHeight =
    window.innerHeight ?? document.documentElement.clientHeight;

  const left = dualScreenLeft + (screenWidth - width) / 2;
  const top = dualScreenTop + (screenHeight - height) / 2;

  return window.open(
    "",
    name,
    `scrollbars=yes,width=${width},height=${height},top=${top},left=${left}`
  );
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 날짜 "2025-12-03 15:09:14" → "2025.12.03."
export const formatDate = (dt?: string) => {
  if (!dt) return "";
  const [date] = dt.split(" "); // "2025-12-03"
  return date.replace(/-/g, ".") + "";
};

export const scrollToTop = () => {
  //스크롤위로
 return window.scrollTo({ top: 0, behavior: "smooth" });
};



export function createVideoThumbnail(videoUrl: string, time = 1): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      const safeTime = Math.min(Math.max(time, 0), Math.max(video.duration - 0.1, 0));
      video.currentTime = safeTime;
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 180;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("canvas ctx 없음"));

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    };

    video.onerror = () => reject(new Error("video load error"));
  });
}

export const extractJobId = (url: string): string | null => {
  try {
    const trimmed = (url ?? "").trim();
    if (!trimmed) return null; // 비어 있으면 null
    const match = trimmed.match(/\/jobs\/(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};


/**
 * 휴대폰 번호 포맷팅
 * 01040965625 → 010-4096-5625
 */
export function formatPhoneNumber(phone?: string): string {
  if (!phone) return "";

  const onlyNumber = phone.replace(/\D/g, "");

  // 010XXXXXXXX (11자리)
  if (onlyNumber.length === 11) {
    return onlyNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  // 010XXXXXXX (10자리, 예외)
  if (onlyNumber.length === 10) {
    return onlyNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  // 그 외는 원본 그대로
  return phone;
}


//---------------------------------------
// 2025-09=>2025.09 로 날짜 형태 변환
export const fmtMonthDisplay = (
  d: { year: number; month: number } | null | undefined
) => {
  if (!d) return "";
  return `${d.year}.${String(d.month + 1).padStart(2, "0")}`;
};

export const formatMonthStringToDisplay = (s?: string | null) => {
  const parsed = parseMonth(s);
  if (!parsed) return "";
  return fmtMonthDisplay(parsed);
};

//---------------------------------------