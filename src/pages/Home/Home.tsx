import { useEffect, useMemo, useRef, useState } from "react";
import Select, { components, type OptionProps } from "react-select";
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

import "./Home.css";
import { JobNode } from "@/api/job/job.types";

type Opt = { value: string; label: string };


function highlightSubstring(label: string, query: string) {
  if (!query) return label;
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(q, "ig");
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(label)) !== null) {
    const start = m.index,
      end = start + m[0].length;
    if (start > lastIndex)
      parts.push(
        <span key={lastIndex + "n"}>{label.slice(lastIndex, start)}</span>
      );
    parts.push(
      <span key={start + "h"} className="select-highlight">
        {label.slice(start, end)}
      </span>
    );
    lastIndex = end;
  }
  if (lastIndex < label.length)
    parts.push(<span key={lastIndex + "t"}>{label.slice(lastIndex)}</span>);
  return <>{parts}</>;
}

const Option = (props: OptionProps<Opt, false>) => {
  const q = (props.selectProps as any).inputValue as string;
  return (
    <components.Option {...props}>
      {highlightSubstring(props.label as string, q)}
    </components.Option>
  );
};

// ✅ name 매칭을 위한 정규화(· / ㆍ, 공백, 하이픈 등 차이 흡수)
function normalizeCategoryName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "") // 공백 제거
    .replace(/[·ㆍ]/g, "") // 가운데 점 제거
    .replace(/[–—-]/g, "") // 하이픈 제거
    .replace(/[&]/g, "and"); // 혹시 모를 & 처리
}

export default function Home() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [isSearchExecuted, setIsSearchExecuted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // ✅ 홈 진입 시 API 데이터 저장
  const [jobTree, setJobTree] = useState<JobNode[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onInputChange = (val: string) => {
    setInputValue(val);
    return val;
  };

  const handleMovePage = (type: string) => {
    if (type == "resume") {
      navigate(`/resumes/create`);
    } else if (type == "interview") {
      navigate(`/mock-interview-report`);
    }
  };

  // ✅ 기존 CATEGORIES는 "아이콘 매핑 테이블"로만 사용
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

  // ✅ name -> icon 매핑 Map 생성
  const iconMap = useMemo(() => {
    const m = new Map<string, string>();
    CATEGORIES.forEach((c) => {
      m.set(normalizeCategoryName(c.name), c.icon);
    });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ depth=0만 뽑아서 직군 카테고리로 사용(정렬까지)
  const topCategories = useMemo(() => {
    return jobTree
      .filter((n) => n.depth === 0 && n.isActive !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [jobTree]);

  const getCategoryIcon = (name: string) => {
    const normalized = normalizeCategoryName(name);
    return iconMap.get(normalized) ?? code_icon; // 매칭 실패 시 기본 아이콘
  };

  const options: Opt[] = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
    { value: "strawberry2", label: "Strawberry" },
    { value: "vanilla2", label: "Vanilla" },
    { value: "strawberry3", label: "Strawberry" },
    { value: "vanilla3", label: "Vanilla" },
    { value: "strawberry2", label: "Strawberry" },
    { value: "vanilla2", label: "Vanilla" },
    { value: "strawberry3", label: "Strawberry" },
    { value: "vanilla3", label: "Vanilla" },
    { value: "strawberry2", label: "Strawberry" },
    { value: "vanilla2", label: "Vanilla" },
    { value: "strawberry3", label: "Strawberry" },
    { value: "vanilla3", label: "Vanilla" },
    { value: "vanilla3", label: "Vanilla" },
    { value: "vanilla3", label: "Vanilla" },
    { value: "vanilla3", label: "Vanilla" },
  ];

  const handleSearch = () => {
    if (inputValue.trim()) {
      setIsSearchExecuted(true);
      console.log(`검색 실행: ${inputValue}`);
    } else {
      setIsSearchExecuted(false);
      console.log("검색어가 없어 드롭다운을 닫습니다.");
    }
  };

  // ✅ 카테고리 클릭 시: 어떤 직군 선택했는지 콘솔 로그
  // const handleClickCategory = (cat: JobNode) => {
  //   // console.log("[선택한 직군]", {
  //   //   id: cat.id,
  //   //   name: cat.name,
  //   //   depth: cat.depth,
  //   //   sortOrder: cat.sortOrder,
  //   //   childrenCount: cat.children?.length ?? 0,
  //   //   children: cat.children, // 필요하면 제거
  //   // });
    
  // };

  const handleClickCategory = (cat: JobNode) => {
    navigate("/jobs", {
      state: {
        activeTab: "all",
        categoryId: cat.id,
        childrenCount: cat.children?.length ?? 0,
        children: cat.children, // 필요하면 제거
      },
    });
  };

  // ✅ Home 들어오자마자 API 실행
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const [tree, list] = await Promise.all([
          fetchJobTree(),
          fetchJobList(1, 10),
        ]);

        if (!alive) return;

        setJobTree(tree as any);
        setJobs(list.jobs as any);

        console.log("[Home] fetchJobTree:", tree);
        console.log("[Home] fetchJobList:", list);
      } catch (e: any) {
        if (!alive) return;
        console.error("[Home] API error:", e);
        setErrorMsg(e?.message ?? "홈 데이터 로딩 실패");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    // 1. 스크롤 로직
    const masthead = document.querySelector(".masthead");
    if (masthead) {
      const onScroll = () => {
        const scrollTop = window.scrollY;
        if (scrollTop > 50) masthead.classList.remove("masthead-transparent");
        else masthead.classList.add("masthead-transparent");
      };
      masthead.classList.add("masthead-transparent");
      window.addEventListener("scroll", onScroll);

      // 클린업 함수
      const removeScrollListener = () => {
        window.removeEventListener("scroll", onScroll);
        masthead.classList.remove("masthead-transparent");
      };

      // 2. 외부 클릭 감지 로직
      function handleClickOutside(event: MouseEvent) {
        if (
          searchRef.current &&
          !searchRef.current.contains(event.target as Node)
        ) {
          setIsSearchExecuted(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        removeScrollListener();
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [searchRef]);

  return (
    <div className="home">
      <div className="hero">
        <header className="hero-head">
          <div className="text">
            <p className="subtitle">모든 채용 공고를 한 자리에</p>
            <span className="titles">
              <h1>이제, 잡콕에서 검색만 하세요!</h1>
            </span>

            {loading && <p style={{ marginTop: 8 }}>로딩중...</p>}
            {errorMsg && (
              <p style={{ marginTop: 8, color: "red" }}>{errorMsg}</p>
            )}
          </div>

          <div className="search" ref={searchRef}>
            <input
              type="text"
              placeholder="직무, 기업명, 지역 등을 검색해 보세요."
              className="search-bar__input"
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value;
                setInputValue(value);
                if (value.trim() === "") {
                  setIsSearchExecuted(false);
                }
              }}
            />
            <span
              className="search-icon-wrap"
              onClick={handleSearch}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSearch();
                }
              }}
            >
              <img src={ic_search_white_24} alt="" />
            </span>

            {isSearchExecuted && (
              <div className="search-results-dropdown">
                <div className="search-results-dropdown__list">
                  {options
                    .filter((opt) =>
                      opt.label.toLowerCase().includes(inputValue.toLowerCase())
                    )
                    .slice(0, 10)
                    .map((option, index) => (
                      <span
                        key={index}
                        className="search-results-dropdown__item"
                      >
                        {highlightSubstring(option.label, inputValue)}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ✅ 여기부터: fetchJobTree 기반으로 카테고리 렌더링 */}
        <div className="categories">
          {topCategories.map((cat) => (
            <div
              className="category"
              key={cat.id}
              onClick={() => handleClickCategory(cat)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClickCategory(cat);
                }
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
            <button
              className="default_btn_white"
              onClick={() => {
                handleMovePage("resume");
              }}
            >
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
            <button
              className="default_btn_white"
              onClick={() => {
                handleMovePage("interview");
              }}
            >
              AI 모의면접 바로하기
            </button>
          </div>
        </div>
      </div>

      <div className="banner-slider-container mobile">
        <div className="banner-slider-track">
          <div className="home-cta-banner resume">
            <div
              className="banner-content"
              onClick={() => {
                handleMovePage("/m-create");
              }}
            >
              <span className="banner-title">
                이력서 작성하고 잡콕의 모든 서비스를 경험해 보세요.
              </span>
              <span className="banner-desc">
                AI 기반의 문장 및 키워드 추천 기능으로 간편하게 작성하세요.
              </span>
            </div>
          </div>

          <div className="home-cta-banner interview">
            <div
              className="banner-content"
              onClick={() => {
                handleMovePage("interview");
              }}
            >
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
