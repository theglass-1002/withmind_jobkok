import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import ic_search_white_24 from "@/assets/icons/size24/ic_search_white_24.png";

import { fetchJobTree } from "@/api/job/job.api";
import { JobNode } from "@/api/job/job.types";
import { logout } from "@/api/auth/auth.api";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import "./Home.css";
import { Icons } from "@/assets/icons";
import { Storage } from "@/shared/utils/StorageManager";

type AutoItem = {
  label: string;
  kind: "category" | "job";
  categoryIdx?: number | string;
  jobIdx?: number | string;
  parentLabel?: string;
};

type FlatJobNode = JobNode & {
  parentidx?: number | string;
  parentIdx?: number | string;
  children?: JobNode[];
};

const CATEGORIES = [
  { key: "dev", name: "개발", icon: Icons.code_icon_40px },
  { key: "design", name: "디자인", icon: Icons.palette_icon_40px },
  { key: "marketing-ads", name: "마케팅ㆍ광고", icon: Icons.megaphone_icon_40px },
  { key: "sales", name: "영업", icon: Icons.briefcase_icon_40px },
  { key: "management-business", name: "경영ㆍ비즈니스", icon: Icons.handshake_icon_40px },
  { key: "engineering-design", name: "엔지니어링ㆍ설계", icon: Icons.wrench_icon_40px },
  { key: "hr", name: "HR", icon: Icons.users_icon_40px },
  { key: "manufacturing", name: "제조ㆍ생산", icon: Icons.factory_icon_40px },
  { key: "construction-facility", name: "건설ㆍ시설", icon: Icons.hard_hat_icon_40px },
  { key: "healthcare-bio", name: "의료ㆍ제약ㆍ바이오", icon: Icons.health_icon_40px },
  { key: "media", name: "미디어", icon: Icons.video_icon_40px },
  { key: "game-dev", name: "게임 제작", icon: Icons.gamepad_icon_40px },
  { key: "finance", name: "금융", icon: Icons.dollar_sign_icon_40px },
  { key: "logistics-trade", name: "물류ㆍ무역", icon: Icons.globe_icon_40px },
  { key: "legal-law-enforcement", name: "법률ㆍ법집행기관", icon: Icons.scale_icon_40px },
  { key: "education", name: "교육", icon: Icons.graduation_cap_icon_40px },
  { key: "food-beverage", name: "식ㆍ음료", icon: Icons.chef_hat_icon_40px },
  { key: "public-welfare", name: "공공ㆍ복지", icon: Icons.heart_icon_40px },
  { key: "customer-service-retail", name: "고객서비스ㆍ리테일", icon: Icons.headphones_icon_40px },
  { key: "information-security", name: "정보 보호", icon: Icons.shield_icon_40px },
];

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
        <span key={`text-${lastIndex}-${start}`}>
          {label.slice(lastIndex, start)}
        </span>
      );
    }

    parts.push(
      <span key={`highlight-${start}-${end}`} className="select-highlight">
        {label.slice(start, end)}
      </span>
    );

    lastIndex = end;
  }

  if (lastIndex < label.length) {
    parts.push(
      <span key={`tail-${lastIndex}-${label.length}`}>
        {label.slice(lastIndex)}
      </span>
    );
  }

  return <>{parts}</>;
}

function normalizeText(value: string) {
  return (value ?? "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[·ㆍ]/g, "")
    .trim();
}

function normalizeCategoryName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[·ㆍ]/g, "")
    .replace(/[–—-]/g, "")
    .replace(/[&]/g, "and");
}

function buildTreeFromFlatList(list: FlatJobNode[]): JobNode[] {
  if (!Array.isArray(list)) return [];

  const parents = list
    .filter((item) => item.depth === 0)
    .map((item) => ({
      ...item,
      children: [] as JobNode[],
    }));

  const parentMap = new Map<
    number | string,
    JobNode & { parentidx?: number | string; parentIdx?: number | string }
  >();

  parents.forEach((parent) => {
    parentMap.set(parent.idx, parent);
  });

  list
    .filter((item) => item.depth === 1)
    .forEach((child) => {
      const parentKey = child.parentIdx ?? child.parentidx;
      const parent = parentMap.get(parentKey as number | string);
      if (!parent) return;

      parent.children.push({
        ...child,
        children: Array.isArray(child.children) ? child.children : [],
      });
    });

  return parents
    .map((parent) => ({
      ...parent,
      children: (parent.children ?? []).sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
      ),
    }))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export default function Home() {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [openAuto, setOpenAuto] = useState(false);
  const [activeAutoIdx, setActiveAutoIdx] = useState<number>(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const autoListRef = useRef<HTMLDivElement>(null);

  const [jobTree, setJobTree] = useState<JobNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setErrorMsg] = useState<string | null>(null);

  const saveRecentKeyword = useCallback((keyword: string) => {
    const trimmed = (keyword ?? "").trim();
    if (!trimmed) return;

    Storage.addRecentSearchKeyword(trimmed);
  }, []);

  const handleMovePage = (type: string) => {
    if (type === "resume") navigate("/resumes/create");
    if (type === "interview") navigate("/mock-interview-report");
  };

  const iconMap = useMemo(() => {
    const m = new Map<string, string>();
    CATEGORIES.forEach((c) => {
      m.set(normalizeCategoryName(c.name), c.icon);
    });
    return m;
  }, []);

  const getCategoryIcon = (name: string) => {
    const normalized = normalizeCategoryName(name);
    return iconMap.get(normalized) ?? Icons.code_icon_40px;
  };

  const topCategories = useMemo(() => {
    if (!Array.isArray(jobTree)) return [];

    return jobTree
      .filter((n) => n.depth === 0 && n.isActive !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [jobTree]);

  const autoItems: AutoItem[] = useMemo(() => {
    const out: AutoItem[] = [];
    if (!Array.isArray(jobTree)) return out;

    const topSorted = [...jobTree].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    );

    for (const parent of topSorted) {
      if (parent?.isActive === false) continue;
      if (!parent?.name) continue;

      out.push({
        label: parent.name,
        kind: "category",
        categoryIdx: parent.idx,
        parentLabel: parent.name,
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
          categoryIdx: parent.idx,
          jobIdx: child.idx,
          parentLabel: parent.name,
        });
      }
    }

    return out;
  }, [jobTree]);

  const filteredAuto = useMemo(() => {
    const qRaw = (inputValue ?? "").trim();
    const q = normalizeText(qRaw);

    if (!q) return autoItems.slice(0, 10);

    const result = autoItems.filter((item) => {
      const labelNorm = normalizeText(item.label);
      const parentNorm = normalizeText(item.parentLabel ?? "");

      const selfMatched = labelNorm.includes(q);
      const parentMatched = !!parentNorm && parentNorm.includes(q);

      return selfMatched || parentMatched;
    });


    return result.slice(0, 10);
  }, [inputValue, autoItems]);

  useEffect(() => {
    setActiveAutoIdx(-1);
  }, [inputValue, openAuto]);

  useEffect(() => {
    if (activeAutoIdx < 0) return;
    const list = autoListRef.current;
    if (!list) return;
    const active = list.children[activeAutoIdx] as HTMLElement | undefined;
    if (active) active.scrollIntoView({ block: "nearest" });
  }, [activeAutoIdx]);

  const handleSearch = () => {
    const keyword = inputValue.trim();
    if (!keyword) {
      setOpenAuto(false);
      return;
    }

    console.log("[Home] 검색어 입력:", keyword);
    console.log("[Home] /jobs 로 전달하는 state:", {
      activeTab: "all",
      keyword,
    });

    saveRecentKeyword(keyword);
    setOpenAuto(false);
    navigate("/jobs", { state: { activeTab: "all", keyword } });
  };

  const handlePickAuto = (item: AutoItem) => {
    setInputValue(item.label);
    setOpenAuto(false);
    saveRecentKeyword(item.label);

    if (item.kind === "category" && item.categoryIdx != null) {
      console.log("[Home] 자동완성 카테고리 선택:", item);
      navigate("/jobs", {
        state: {
          activeTab: "all",
          keyword: item.label,
          categoryIdx: item.categoryIdx,
        },
      });
      return;
    }

    if (item.jobIdx != null) {
      console.log("[Home] 자동완성 직무 선택:", item);
      navigate("/jobs", {
        state: {
          activeTab: "all",
          keyword: item.label,
          jobId: item.jobIdx,
          categoryIdx: item.categoryIdx,
        },
      });
      return;
    }

    console.log("[Home] 자동완성 키워드 선택:", item.label);
    navigate("/jobs", { state: { activeTab: "all", keyword: item.label } });
  };

  const handleClickCategory = (cat: JobNode) => {
    console.log("[Home] 카테고리 클릭:", cat);

    navigate("/jobs", {
      state: {
        activeTab: "all",
        categoryIdx: cat.idx,
        childrenCount: cat.children?.length ?? 0,
        children: cat.children,
      },
    });
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const response: any = await fetchJobTree();

        if (!alive) return;

        const nestedList = Array.isArray(response?.list) ? response.list : [];
        const flatList = Array.isArray(response)
          ? response
          : Array.isArray(response?.list)
          ? response.list
          : [];

        let tree: JobNode[] = [];

        if (
          nestedList.length > 0 &&
          Array.isArray(nestedList[0]?.children)
        ) {
          tree = nestedList as JobNode[];
        } else {
          tree = buildTreeFromFlatList(flatList as FlatJobNode[]);
        }
        setJobTree(tree);
      } catch (e: any) {
        if (!alive) return;
        setErrorMsg(e?.message ?? "홈 데이터 로딩 실패");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [navigate]);

  useEffect(() => {
  }, [jobTree]);

  useEffect(() => {
  }, [autoItems]);

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
      <LoadingOverlay isLoading={loading} isLogo />

      <div className="hero">
        <header className="hero-head">
          <div className="text">
            <span className="subtitle">모든 채용 공고를 한 자리에</span>
            <span className="titles">이제, 잡콕에서 검색만 하세요</span>
          </div>

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
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (openAuto && filteredAuto.length > 0) {
                    setActiveAutoIdx((prev) =>
                      prev >= filteredAuto.length - 1 ? 0 : prev + 1
                    );
                  }
                  return;
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (openAuto && filteredAuto.length > 0) {
                    setActiveAutoIdx((prev) =>
                      prev <= 0 ? filteredAuto.length - 1 : prev - 1
                    );
                  }
                  return;
                }
                if (e.key === "Enter") {
                  if (
                    openAuto &&
                    activeAutoIdx >= 0 &&
                    activeAutoIdx < filteredAuto.length
                  ) {
                    handlePickAuto(filteredAuto[activeAutoIdx]);
                  } else {
                    handleSearch();
                  }
                  return;
                }
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
                <div
                  className="search-results-dropdown__list"
                  ref={autoListRef}
                >
                  {inputValue.trim() && filteredAuto.length === 0 && (
                    <span className="search-results-dropdown__item search-results-dropdown__item--disabled">
                      추천 결과가 없습니다.
                    </span>
                  )}

                  {filteredAuto.map((item, index) => (
                    <span
                      key={`auto-${item.kind}-${item.categoryIdx ?? "x"}-${item.jobIdx ?? "x"}-${item.label}-${index}`}
                      className={`search-results-dropdown__item${
                        index === activeAutoIdx ? " is-active" : ""
                      }`}
                      role="button"
                      tabIndex={0}
                      onMouseEnter={() => setActiveAutoIdx(index)}
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

        <div className="categories">
          {loading && topCategories.length === 0
            ? CATEGORIES.map((_, index) => (
                <div
                  className="category is-skeleton"
                  key={`cat-skel-${index}`}
                  aria-hidden="true"
                >
                  <span className="icon skeleton" />
                  <span className="name skeleton" />
                </div>
              ))
            : topCategories.map((cat, index) => (
                <div
                  className="category"
                  key={`cat-${cat.idx ?? cat.name ?? index}-${index}`}
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