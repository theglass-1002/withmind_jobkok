import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ic_search_white_24 from "@/assets/icons/size24/ic_search_white_24.png";

import code_icon from "@/assets/icons/category_icons/code_icon.png";
import palette_icon from "@/assets/icons/category_icons/palette_icon.png";
import megaphone_icon from "@/assets/icons/category_icons/megaphone_icon.png";
import briefcase_icon from "@/assets/icons/category_icons/briefcase_icon.png";
import handshake_icon from "@/assets/icons/category_icons/handshake_icon.png";
import wrench_icon from "@/assets/icons/category_icons/wrench_icon.png";
import users_icon from "@/assets/icons/category_icons/users_icon.png";
import factory_icon from "@/assets/icons/category_icons/factory_icon.png";
import hard_hat_icon from "@/assets/icons/category_icons/hard_hat_icon.png";
import health_icon from "@/assets/icons/category_icons/health_icon.png";
import video_icon from "@/assets/icons/category_icons/video_icon.png";
import gamepad_icon from "@/assets/icons/category_icons/gamepad_icon.png";
import dollar_sign_icon from "@/assets/icons/category_icons/dollar_sign_icon.png";
import globe_icon from "@/assets/icons/category_icons/globe_icon.png";
import scale_icon from "@/assets/icons/category_icons/scale_icon.png";
import graduation_cap_icon from "@/assets/icons/category_icons/graduation_cap_icon.png";
import chef_hat_icon from "@/assets/icons/category_icons/chef_hat_icon.png";
import heart_icon from "@/assets/icons/category_icons/heart_icon.png";
import headphones_icon from "@/assets/icons/category_icons/headphones_icon.png";
import shield_icon from "@/assets/icons/category_icons/shield_icon.png";

import { fetchJobTree, fetchJobList } from "@/api/job/job.api";
import { JobNode } from "@/api/job/job.types";
import { logout } from "@/api/auth/auth.api";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import "./Home.css";

type AutoItem = {
  label: string; // 화면 표시 텍스트
  kind: "category" | "job"; // 구분 (원하면 스타일링/이동 분기 가능)
  categoryId?: number | string; // 필요시
  jobId?: number | string; // 필요시
};

function highlightSubstring(label: string, query: string) {
  if (!query) return label;
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(q, "ig");
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(label)) !== null) {
    const start = m.index;
    const end = start + m[0].length;

    if (start > lastIndex) {
      parts.push(
        <span key={lastIndex + "n"}>{label.slice(lastIndex, start)}</span>
      );
    }

    parts.push(
      <span key={start + "h"} className="select-highlight">
        {label.slice(start, end)}
      </span>
    );

    lastIndex = end;
  }

  if (lastIndex < label.length) {
    parts.push(<span key={lastIndex + "t"}>{label.slice(lastIndex)}</span>);
  }

  return <>{parts}</>;
}

// ✅ name 매칭을 위한 정규화(· / ㆍ, 공백, 하이픈 등 차이 흡수)
function normalizeCategoryName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[·ㆍ]/g, "")
    .replace(/[–—-]/g, "")
    .replace(/[&]/g, "and");
}

export default function Home() {
  const navigate = useNavigate();

  // 검색
  const [inputValue, setInputValue] = useState("");
  const [openAuto, setOpenAuto] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 데이터
  const [jobTree, setJobTree] = useState<JobNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleMovePage = (type: string) => {
    if (type === "resume") navigate("/resumes/create");
    if (type === "interview") navigate("/mock-interview-report");
  };

  // ✅ 아이콘 매핑 테이블
  const CATEGORIES = [
    { key: "dev", name: "개발", icon: code_icon },
    { key: "design", name: "디자인", icon: palette_icon },
    { key: "marketing-ads", name: "마케팅ㆍ광고", icon: megaphone_icon },
    { key: "sales", name: "영업", icon: briefcase_icon },
    { key: "management-business", name: "경영ㆍ비즈니스", icon: handshake_icon },
    { key: "engineering-design", name: "엔지니어링ㆍ설계", icon: wrench_icon },
    { key: "hr", name: "HR", icon: users_icon },
    { key: "manufacturing", name: "제조ㆍ생산", icon: factory_icon },
    { key: "construction-facility", name: "건설ㆍ시설", icon: hard_hat_icon },
    { key: "healthcare-bio", name: "의료ㆍ제약ㆍ바이오", icon: health_icon },
    { key: "media", name: "미디어", icon: video_icon },
    { key: "game-dev", name: "게임 제작", icon: gamepad_icon },
    { key: "finance", name: "금융", icon: dollar_sign_icon },
    { key: "logistics-trade", name: "물류ㆍ무역", icon: globe_icon },
    { key: "legal-law-enforcement", name: "법률ㆍ법집행기관", icon: scale_icon },
    { key: "education", name: "교육", icon: graduation_cap_icon },
    { key: "food-beverage", name: "식ㆍ음료", icon: chef_hat_icon },
    { key: "public-welfare", name: "공공ㆍ복지", icon: heart_icon },
    { key: "customer-service-retail", name: "고객서비스ㆍ리테일", icon: headphones_icon },
    { key: "information-security", name: "정보 보호", icon: shield_icon },
  ];

  // ✅ name -> icon 매핑
  const iconMap = useMemo(() => {
    const m = new Map<string, string>();
    CATEGORIES.forEach((c) => m.set(normalizeCategoryName(c.name), c.icon));
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCategoryIcon = (name: string) => {
    const normalized = normalizeCategoryName(name);
    return iconMap.get(normalized) ?? code_icon;
  };

  // ✅ depth=0 카테고리만
  const topCategories = useMemo(() => {
    return jobTree
      .filter((n) => n.depth === 0 && n.isActive !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [jobTree]);

  // ✅ 자동완성용 flat 리스트 만들기 (카테고리 + 직무)
  const autoItems: AutoItem[] = useMemo(() => {
    const out: AutoItem[] = [];
    if (!Array.isArray(jobTree)) return out;

    const topSorted = [...jobTree].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    );

    for (const parent of topSorted) {
      if (parent?.isActive === false) continue;
      if (!parent?.name) continue;

      // 카테고리도 검색 대상에 포함
      out.push({
        label: parent.name,
        kind: "category",
        categoryId: parent.id,
      });

      const childrenSorted = Array.isArray(parent.children)
        ? [...parent.children].sort(
            (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
          )
        : [];

      for (const child of childrenSorted) {
        if (child?.isActive === false) continue;
        if (!child?.name) continue;

        out.push({
          label: child.name,
          kind: "job",
          categoryId: parent.id,
          jobId: child.id,
        });
      }
    }

    return out;
  }, [jobTree]);

  // ✅ 입력값 기반 필터
  const filteredAuto = useMemo(() => {
    const q = (inputValue ?? "").trim().toLowerCase();
    if (!q) return autoItems.slice(0, 10);

    return autoItems
      .filter((item) => item.label.toLowerCase().includes(q))
      .slice(0, 10);
  }, [inputValue, autoItems]);

  // 검색 실행(아이콘 클릭/Enter)
  const handleSearch = () => {
    const keyword = inputValue.trim();
    if (!keyword) {
      setOpenAuto(false);
      return;
    }

    setOpenAuto(false);

    // ✅ 원하는 방식으로 전달
    // 1) state로 전달
    navigate("/jobs", { state: { activeTab: "all", keyword } });

    // 2) querystring이 필요하면 이렇게:
    // navigate(`/jobs?keyword=${encodeURIComponent(keyword)}`);
  };

  // 자동완성 선택
  const handlePickAuto = (item: AutoItem) => {
    setInputValue(item.label);
    setOpenAuto(false);
    console.log("[Home] 자동완성 선택:", {
      kind: item.kind,
      label: item.label,
      categoryId: item.categoryId,
      jobId: item.jobId,
    });
  
    // ✅ 클릭 시 바로 이동시키고 싶으면:
    // - 직무(job)면 jobId로 필터
    // - 카테고리(category)면 categoryId로 필터
    if (item.kind === "category" && item.categoryId != null) {
      navigate("/jobs", {
        state: { activeTab: "all", categoryId: item.categoryId },
      });
      return;
    }

    // job
    if (item.jobId != null) {
      navigate("/jobs", {
        state: { activeTab: "all", jobId: item.jobId, categoryId: item.categoryId },
      });
      return;
    }

    // fallback: 키워드 검색
    navigate("/jobs", { state: { activeTab: "all", keyword: item.label } });
  };

  const handleClickCategory = (cat: JobNode) => {
    navigate("/jobs", {
      state: {
        activeTab: "all",
        categoryId: cat.id,
        childrenCount: cat.children?.length ?? 0,
        children: cat.children,
      },
    });
  };

  // ✅ Home 진입 시 API 실행 (둘 다 끝날 때까지 로딩)
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const [tree] = await Promise.all([
          fetchJobTree(),
          fetchJobList(1, 10),
        ]);

        if (!alive) return;
        setJobTree(tree as any);
      } catch (e: any) {
        if (!alive) return;
        setErrorMsg(e?.message ?? "홈 데이터 로딩 실패");
        logout();
        navigate("/login");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [navigate]);

  // ✅ 스크롤 + 외부 클릭 감지 + 자동완성 닫기
  useEffect(() => {
    const masthead = document.querySelector(".masthead");
    if (!masthead) return;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) masthead.classList.remove("masthead-transparent");
      else masthead.classList.add("masthead-transparent");
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpenAuto(false);
      }
    };

    masthead.classList.add("masthead-transparent");
    window.addEventListener("scroll", onScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      masthead.classList.remove("masthead-transparent");
    };
  }, []);

  return (
    <div className="home">
      <LoadingOverlay isLoading={loading} isLogo text="홈 데이터를 불러오는 중..." />

      <div className="hero">
        <header className="hero-head">
          <div className="text">
            <p className="subtitle">모든 채용 공고를 한 자리에</p>
            <span className="titles">
              <h1>이제, 잡콕에서 검색만 하세요!</h1>
            </span>

            {errorMsg && <p style={{ marginTop: 8, color: "red" }}>{errorMsg}</p>}
          </div>

          {/* ✅ 자동완성 검색 */}
          <div className="search" ref={searchRef}>
            <input
              type="text"
              placeholder="직무, 기업명, 지역 등을 검색해 보세요."
              className="search-bar__input"
              value={inputValue}
              onFocus={() => {
                if (inputValue.trim()) setOpenAuto(true);
              }}
              onChange={(e) => {
                const v = e.target.value;
                setInputValue(v);
                setOpenAuto(!!v.trim());
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
                if (e.key === "Escape") setOpenAuto(false);
              }}
            />

            <span
              className="search-icon-wrap"
              onClick={handleSearch}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSearch();
              }}
            >
              <img src={ic_search_white_24} alt="" />
            </span>

            {openAuto && (
              <div className="search-results-dropdown">
                <div className="search-results-dropdown__list">
                  {/* 결과 없음 */}
                  {inputValue.trim() && filteredAuto.length === 0 && (
                    <span className="search-results-dropdown__item search-results-dropdown__item--disabled">
                      추천 결과가 없습니다.
                    </span>
                  )}

                  {/* 결과 */}
                  {filteredAuto.map((item) => (
                    <span
                      key={`${item.kind}-${item.categoryId ?? "x"}-${item.jobId ?? "x"}-${item.label}`}
                      className="search-results-dropdown__item"
                      role="button"
                      tabIndex={0}
                      onClick={() => handlePickAuto(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") handlePickAuto(item);
                      }}
                    >
                      {highlightSubstring(item.label, inputValue)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ✅ 카테고리 */}
        <div className="categories">
          {topCategories.map((cat) => (
            <div
              className="category"
              key={cat.id}
              onClick={() => handleClickCategory(cat)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleClickCategory(cat);
              }}
            >
              <span className="icon">
                <img src={getCategoryIcon(cat.name)} alt={cat.name} />
              </span>
              <span className="name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 배너 */}
      <div className="banner-slider-container">
        <div className="banner-slider-track">
          <div className="home-cta-banner resume">
            <div className="banner-content">
              <span className="banner-title">
                이력서 작성하고 잡콕의 모든 서비스를 경험해 보세요.
              </span>
              <span className="banner-desc">
                AI 기반의 문장 및 키워드 추천 기능으로 간편하게 작성하세요.
              </span>
            </div>
            <button className="default_btn_white" onClick={() => handleMovePage("resume")}>
              이력서 작성 바로하기
            </button>
          </div>

          <div className="home-cta-banner interview">
            <div className="banner-content">
              <span className="banner-title">
                실전보다 더 실전같은 AI 모의면접으로 면접 준비 끝!
              </span>
              <span className="banner-desc">
                면접 시뮬레이션ㆍ이력서 및 직무 기반 맞춤 질문ㆍ분석 리포트ㆍ결과 기반 피드백까지 전부 모았어요.
              </span>
            </div>
            <button className="default_btn_white" onClick={() => handleMovePage("interview")}>
              AI 모의면접 바로하기
            </button>
          </div>
        </div>
      </div>

      <div className="banner-slider-container mobile">
        <div className="banner-slider-track">
          <div className="home-cta-banner resume">
            <div className="banner-content" onClick={() => handleMovePage("resume")}>
              <span className="banner-title">
                이력서 작성하고 잡콕의 모든 서비스를 경험해 보세요.
              </span>
              <span className="banner-desc">
                AI 기반의 문장 및 키워드 추천 기능으로 간편하게 작성하세요.
              </span>
            </div>
          </div>

          <div className="home-cta-banner interview">
            <div className="banner-content" onClick={() => handleMovePage("interview")}>
              <span className="banner-title">
                실전보다 더 실전같은 AI 모의면접으로 면접 준비 끝!
              </span>
              <span className="banner-desc">
                면접 시뮬레이션ㆍ이력서 및 직무 기반 맞춤 질문ㆍ분석 리포트ㆍ결과 기반 피드백까지 전부 모았어요.
              </span>
            </div>
            <button className="default_btn_white">AI 모의면접 바로하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
