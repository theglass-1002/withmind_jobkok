import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { Icons } from "@/assets/icons";

import ic_arrow_back_ios_gray900_20 from "@/assets/icons/size20/ic_arrow_back_ios_gray900_20.png";
import ic_search_gray900_20 from "@/assets/icons/size20/ic_search_gray900_20.png";

import { logout } from "@/api/auth/auth.api";
import { fetchJobTree } from "@/api/job/job.api";
import { JobNode } from "@/api/job/job.types";

type AutoItem = {
  label: string;
  kind: "category" | "job";
  categoryIdx?: number | string;
  jobId?: number | string;
  parentLabel?: string;
};

type FlatJobNode = JobNode & {
  parentidx?: number | string;
  parentIdx?: number | string;
  children?: JobNode[];
};

function highlightSubstring(label: string, query: string): React.ReactNode {
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

interface NavbarProps {
  titleText?: string;
}

export default function Navbar({ titleText }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mypageMenuOpen, setMypageMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [inputValueDesktop, setInputValueDesktop] = useState("");
  const [openAutoDesktop, setOpenAutoDesktop] = useState(false);

  const [jobTree, setJobTree] = useState<JobNode[]>([]);

  const mypageRef = useRef<HTMLDivElement | null>(null);
  const searchPanelRef = useRef<HTMLDivElement | null>(null);
  const searchPanelDesktopRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const syncAuth = useCallback(() => {
    setLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);

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
          jobId: child.idx,
          parentLabel: parent.name,
        });
      }
    }

    return out;
  }, [jobTree]);

  const filteredAutoDesktop = useMemo(() => {
    const qRaw = (inputValueDesktop ?? "").trim();
    const q = normalizeText(qRaw);

    if (!q) return autoItems.slice(0, 10);

    const result = autoItems.filter((item) => {
      const labelNorm = normalizeText(item.label);
      const parentNorm = normalizeText(item.parentLabel ?? "");

      const selfMatched = labelNorm.includes(q);
      const parentMatched = !!parentNorm && parentNorm.includes(q);

      return selfMatched || parentMatched;
    });

    console.log("[Navbar] desktop query:", qRaw);
    console.log("[Navbar] desktop filtered list:", result);

    return result.slice(0, 10);
  }, [inputValueDesktop, autoItems]);

  const filteredAutoMobile = useMemo(() => {
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

    console.log("[Navbar] mobile query:", qRaw);
    console.log("[Navbar] mobile filtered list:", result);

    return result.slice(0, 10);
  }, [inputValue, autoItems]);

  const toggleSearch = () => {
    setSearchOpen((prev) => {
      const next = !prev;

      if (next) {
        setMypageMenuOpen(false);
        setInputValue("");
        setInputValueDesktop("");
        setOpenAutoDesktop(false);
      }

      return next;
    });
  };

  const toggleMypage = () => {
    setMypageMenuOpen((prev) => {
      const next = !prev;
      if (next) setSearchOpen(false);
      return next;
    });
  };

  const handleSearchDesktop = () => {
    const keyword = inputValueDesktop.trim();

    if (!keyword) {
      setOpenAutoDesktop(false);
      return;
    }

    console.log("[Navbar] 데스크톱 검색어 입력:", keyword);
    console.log("[Navbar] /jobs 로 전달하는 state:", {
      activeTab: "all",
      keyword,
    });

    setOpenAutoDesktop(false);
    setSearchOpen(false);
    navigate("/jobs", { state: { activeTab: "all", keyword } });
  };

  const handleSearchMobile = () => {
    const keyword = inputValue.trim();

    if (!keyword) return;

    console.log("[Navbar] 모바일 검색어 입력:", keyword);
    console.log("[Navbar] /jobs 로 전달하는 state:", {
      activeTab: "all",
      keyword,
    });

    setSearchOpen(false);
    navigate("/jobs", { state: { activeTab: "all", keyword } });
  };

  const handlePickAutoDesktop = (item: AutoItem) => {
    setInputValueDesktop(item.label);
    setOpenAutoDesktop(false);
    setSearchOpen(false);

    if (item.kind === "category" && item.categoryIdx != null) {
      console.log("[Navbar] 데스크톱 자동완성 카테고리 선택:", item);
      navigate("/jobs", {
        state: { activeTab: "all", categoryIdx: item.categoryIdx },
      });
      return;
    }

    if (item.jobId != null) {
      console.log("[Navbar] 데스크톱 자동완성 직무 선택:", item);
      navigate("/jobs", {
        state: {
          activeTab: "all",
          jobId: item.jobId,
          categoryIdx: item.categoryIdx,
        },
      });
      return;
    }

    console.log("[Navbar] 데스크톱 자동완성 키워드 선택:", item.label);
    navigate("/jobs", { state: { activeTab: "all", keyword: item.label } });
  };

  const handlePickAutoMobile = (item: AutoItem) => {
    setInputValue(item.label);
    setSearchOpen(false);

    if (item.kind === "category" && item.categoryIdx != null) {
      console.log("[Navbar] 모바일 자동완성 카테고리 선택:", item);
      navigate("/jobs", {
        state: { activeTab: "all", categoryIdx: item.categoryIdx },
      });
      return;
    }

    if (item.jobId != null) {
      console.log("[Navbar] 모바일 자동완성 직무 선택:", item);
      navigate("/jobs", {
        state: {
          activeTab: "all",
          jobId: item.jobId,
          categoryIdx: item.categoryIdx,
        },
      });
      return;
    }

    console.log("[Navbar] 모바일 자동완성 키워드 선택:", item.label);
    navigate("/jobs", { state: { activeTab: "all", keyword: item.label } });
  };

  const handleLogout = () => {
    logout();
    syncAuth();
    setMypageMenuOpen(false);
  };

  useEffect(() => {
    let alive = true;

    syncAuth();

    (async () => {
      try {
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
      } catch (err) {
        console.error("[Navbar] Failed to fetch job tree:", err);
      }
    })();

    return () => {
      alive = false;
    };
  }, [syncAuth]);

  useEffect(() => {
  }, [jobTree]);

  useEffect(() => {
  }, [autoItems]);

  useEffect(() => {
  }, [inputValueDesktop, openAutoDesktop, filteredAutoDesktop]);

  useEffect(() => {
    syncAuth();

    const onStorage = () => syncAuth();
    const onFocus = () => syncAuth();
    const onVisibility = () => {
      if (document.visibilityState === "visible") syncAuth();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    const id = window.setInterval(syncAuth, 500);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(id);
    };
  }, [location.pathname, syncAuth]);

  useEffect(() => {
    if (!mypageMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target || typeof target.closest !== "function") return;

      if (mypageMenuOpen && mypageRef.current && !mypageRef.current.contains(target)) {
        if (
          !(target.closest(".icon-btn") &&
            (target.closest(".login_on") || target.closest(".login_off")))
        ) {
          setMypageMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mypageMenuOpen]);

  return (
    <>
      <header className="masthead">
        <div className="masthead__inner">
          {titleText ? (
            <>{titleText}</>
          ) : (
            <Link className="masthead__brand" to="/">
              <img src={Icons.jobkok_logo_gray900} alt="" />
              <img src={Icons.jobkok_wordmark_gray900} alt="" />
            </Link>
          )}

          <ul className="masthead__menu">
            <li>
              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/jobs") ? "on" : undefined
                }
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/jobs", { state: { activeTab: "all" } });
                }}
              >
                채용공고
              </NavLink>
            </li>
            <li>
              <NavLink to="/resumes" className={({ isActive }) => (isActive ? "on" : undefined)}>
                이력서
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/mock-interview-report"
                className={({ isActive }) => (isActive ? "on" : undefined)}
              >
                모의면접
              </NavLink>
            </li>
          </ul>

          {loggedIn ? (
            <div className="login_on">
              <img
                className="icon-btn"
                aria-expanded={searchOpen}
                aria-controls="searchPanel"
                onClick={toggleSearch}
                src={Icons.ic_search_gray900_24}
                alt=""
              />

              <NavLink to="/saved-jobs">
                <img src={Icons.ic_bookmark_gray900_24} alt="" />
              </NavLink>

              <div className="mypage_icon" ref={mypageRef}>
                <img
                  className="icon-btn"
                  onClick={toggleMypage}
                  aria-haspopup="menu"
                  aria-expanded={mypageMenuOpen}
                  src={Icons.ic_account_circle_gray900_24}
                  alt=""
                />

                <div className={`mypage-menu ${mypageMenuOpen ? "is-open" : ""}`} role="menu">
                  <NavLink to="/mypage" onClick={() => setMypageMenuOpen(false)}>
                    마이페이지
                  </NavLink>
                  <NavLink to="/mypage/support/faq" onClick={() => setMypageMenuOpen(false)}>
                    고객 지원
                  </NavLink>
                  <NavLink to="/mypage/support/report-job" onClick={() => setMypageMenuOpen(false)}>
                    공고 제보하기
                  </NavLink>
                  <NavLink to="/login" onClick={handleLogout}>
                    로그아웃
                  </NavLink>
                </div>
              </div>
            </div>
          ) : (
            <div className="login_off">
              <span
                className="icon-btn"
                aria-expanded={searchOpen}
                aria-controls="searchPanel"
                onClick={toggleSearch}
              >
                <img src={Icons.ic_search_gray900_24} alt="" />
              </span>

              <NavLink to="/login">
                <div className="auth-cta">
                  <span>로그인 / 회원가입</span>
                </div>
              </NavLink>
            </div>
          )}
        </div>
      </header>

      <div className={`backdrop ${searchOpen ? "is-open" : ""}`} />

      <div id="searchPanel" className={`search-panel ${searchOpen ? "is-open" : ""}`}>
        <div className="panel-body" ref={searchPanelDesktopRef}>
          <div className="panel-search">
            <img className="jobs-search__icon" src={Icons.ic_search_gray900_20} alt="" />
            <input
              type="text"
              placeholder="직무, 기업명, 지역등을 입력해주세요"
              value={inputValueDesktop}
              onChange={(e) => {
                const v = e.target.value;
                console.log("[Navbar] desktop input change:", v);
                setInputValueDesktop(v);
                setOpenAutoDesktop(!!v.trim());
              }}
              onFocus={() => {
                console.log("[Navbar] desktop input focus:", inputValueDesktop);
                if (inputValueDesktop.trim()) setOpenAutoDesktop(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchDesktop();
                if (e.key === "Escape") setOpenAutoDesktop(false);
              }}
            />
            {inputValueDesktop && (
              <img
                className="jobs-search__clear_icon"
                src={Icons.ic_cancel_gray400_20}
                alt=""
                onClick={() => {
                  console.log("[Navbar] desktop input clear");
                  setInputValueDesktop("");
                  setOpenAutoDesktop(false);
                }}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>

          {openAutoDesktop ? (
            <div className="search-results-dropdown">
              <div className="search-results-dropdown__list">
                {inputValueDesktop.trim() && filteredAutoDesktop.length === 0 && (
                  <span className="search-results-dropdown__item search-results-dropdown__item--disabled">
                    추천 결과가 없습니다.
                  </span>
                )}

                {filteredAutoDesktop.map((item, index) => (
                  <span
                    key={`desktop-auto-${item.kind}-${item.categoryIdx ?? "x"}-${item.jobId ?? "x"}-${item.label}-${index}`}
                    className="search-results-dropdown__item"
                    role="button"
                    tabIndex={0}
                    onClick={() => handlePickAutoDesktop(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handlePickAutoDesktop(item);
                    }}
                  >
                    {highlightSubstring(item.label, inputValueDesktop)}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <>
              <section className="panel-section">
                <header className="section-head">
                  <span className="section-title">최근 검색어</span>
                  <button className="section-action">전체 삭제</button>
                </header>
                <div className="chip-list">
                  <button className="chip">
                    프론트엔드
                    <img src={Icons.ic_close_gray500_20} alt="" />
                  </button>
                  <button className="chip">
                    프로젝트 기획자
                    <img src={Icons.ic_close_gray500_20} alt="" />
                  </button>
                </div>
              </section>

              <section className="panel-section">
                <header className="section-head">
                  <span className="section-title">인기 키워드</span>
                </header>
                <div className="chip-list">
                  <button className="chip">프론트엔드</button>
                  <button className="chip">프로젝트 기획자</button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>

      <div id="searchPanelMobile" className={`search-panel-mobile ${searchOpen ? "is-open" : ""}`}>
        <div className="panel-body" ref={searchPanelRef}>
          <div className="panel-search-header">
            <img
              onClick={() => {
                toggleSearch();
                setInputValue("");
              }}
              src={ic_arrow_back_ios_gray900_20}
              alt="뒤로가기"
              className="panel-search-header__back-icon"
            />

            <div className="panel-search">
              <img className="panel-search__icon" src={ic_search_gray900_20} alt="검색" />
              <input
                type="text"
                placeholder="직무, 기업명, 지역등을 입력해주세요"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchMobile();
                }}
                className="panel-search__input"
              />
              {inputValue && (
                <img
                  onClick={() => setInputValue("")}
                  className="panel-search__clear-icon"
                  src={Icons.ic_cancel_gray400_20}
                  alt="검색어 지우기"
                />
              )}
            </div>
          </div>

          {inputValue.trim() ? (
            <div className="search-results-dropdown-mobile">
              <div className="search-results-dropdown__list">
                {filteredAutoMobile.length === 0 && (
                  <span className="search-results-dropdown__item search-results-dropdown__item--disabled">
                    추천 결과가 없습니다.
                  </span>
                )}

                {filteredAutoMobile.map((item, index) => (
                  <span
                    key={`mobile-auto-${item.kind}-${item.categoryIdx ?? "x"}-${item.jobId ?? "x"}-${item.label}-${index}`}
                    className="search-results-dropdown__item"
                    role="button"
                    tabIndex={0}
                    onClick={() => handlePickAutoMobile(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handlePickAutoMobile(item);
                    }}
                  >
                    {highlightSubstring(item.label, inputValue)}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <>
              <section className="panel-section">
                <header className="section-head">
                  <span className="section-title">최근 검색어</span>
                  <button className="section-action">전체 삭제</button>
                </header>
                <div className="chip-list">
                  <button className="chip recent">
                    프론트엔드
                    <img src={Icons.ic_close_gray500_20} alt="" />
                  </button>
                </div>
              </section>

              <section className="panel-section">
                <header className="section-head">
                  <span className="section-title">인기 검색 키워드</span>
                </header>
                <div className="chip-list">
                  <button className="chip popular">프론트엔드</button>
                  <button className="chip popular">프로젝트 기획자</button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}