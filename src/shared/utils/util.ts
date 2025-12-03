import { useEffect, useState, useRef } from "react";


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

/** "YYYY.MM" -> {year, month(0~11)} 엄격 파서 */
export const parseMonth = (s?: string | null): MonthValue | null => {
  if (!s) return null;
  const m = s.match(/^(\d{4})\.(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const mm = Number(m[2]);
  if (!y || mm < 1 || mm > 12) return null;
  return { year: y, month: (mm - 1) as MonthValue["month"] };
};

/** {year, month(0~11)} -> "YYYY.MM" */
export const fmtMonth = (v: MonthValue): string =>
  `${v.year}.${String(v.month + 1).padStart(2, "0")}`;


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

export type LocationValue = {
  nationwide: boolean;
  selectedKeys: string[]; // "RegionName|DistrictName" or "RegionName|ALL"
};

export type Education = {
  school_name?: string;
  major_degree?: string;
  startDate?: string;
  endDate?: string;
};


export type FormState = {
  title: string;
  basic: BasicInfo;
  location: LocationValue;
  education: Education[];
};

export const initial: FormState = {
  title: "",
  basic: { name: "", birth: "", gender: null, email: "", phone: "", photoUrl: "" },
  location: { nationwide: false, selectedKeys: [] },
  education:[]
};

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
  role?: string;       // 예: "프론트엔드 개발자"
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
  return date.replace(/-/g, ".") + ".";
};

export const scrollToTop = () => {
  //스크롤위로
 return window.scrollTo({ top: 0, behavior: "smooth" });
};