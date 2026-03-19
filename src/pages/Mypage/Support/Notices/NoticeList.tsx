import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Pagination from "@/shared/components/Pagination";
import arrow_left from "@/assets/icons/keyboard_arrow_left.png";
import arrow_right from "@/assets/icons/keyboard_arrow_right.png";
import search from "@/assets/icons/search.png";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { NoticeListItem } from "@/api/support/support.types";
import { fetchNoticeList } from "@/api/support/support.api";
import { useLayoutContext } from "@/app/LayoutContext";

const PAGE_SIZE = 10;
const MOBILE_BREAKPOINT = 760;
const MOBILE_BOTTOM_OFFSET = 80;
const NOTICE_BACK_PATH = "/mypage";

function formatDate(dateString: string) {
  if (!dateString) return "";

  const datePart = dateString.split(" ")[0];
  return datePart.replace(/-/g, ".");
}

function mergeUniqueItems(prev: NoticeListItem[], next: NoticeListItem[]) {
  const map = new Map<number, NoticeListItem>();

  [...prev, ...next].forEach((item) => {
    map.set(item.noticeIdx, item);
  });

  return Array.from(map.values());
}

export default function NoticeList() {
  const navigate = useNavigate();
  const { actionType, resetAction } = useLayoutContext();

  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= MOBILE_BREAKPOINT
  );
  const [page, setPage] = useState(1);
  const [desktopItems, setDesktopItems] = useState<NoticeListItem[]>([]);
  const [mobileItems, setMobileItems] = useState<NoticeListItem[]>([]);
  const [mobilePage, setMobilePage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [totalCnt, setTotalCnt] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const mobileRequestingRef = useRef(false);

  const applySearch = () => {
    setKeyword(searchText.trim());
    setPage(1);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const loadDesktopNotices = async () => {
      try {
        setIsLoading(true);

        const res = await fetchNoticeList({
          page,
          size: PAGE_SIZE,
        });

        setDesktopItems(res.list ?? []);
        setTotalCnt(res.totalCnt ?? 0);
      } catch (error) {
        console.error("[NoticeList][PC] 공지사항 목록 조회 실패:", error);
        setDesktopItems([]);
        setTotalCnt(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadDesktopNotices();
  }, [page, isMobile]);

  useEffect(() => {
    if (!isMobile) return;

    const loadInitialMobileNotices = async () => {
      try {
        setIsLoading(true);
        mobileRequestingRef.current = true;

        const res = await fetchNoticeList({
          page: 1,
          size: PAGE_SIZE,
        });

        setMobileItems(res.list ?? []);
        setMobilePage(1);
        setTotalCnt(res.totalCnt ?? 0);
      } catch (error) {
        console.error("[NoticeList][Mobile] 초기 공지사항 목록 조회 실패:", error);
        setMobileItems([]);
        setMobilePage(1);
        setTotalCnt(0);
      } finally {
        mobileRequestingRef.current = false;
        setIsLoading(false);
      }
    };

    loadInitialMobileNotices();
  }, [isMobile]);

  const totalPages = Math.max(1, Math.ceil(totalCnt / PAGE_SIZE));

  const loadMoreMobileNotices = async () => {
    if (!isMobile) return;
    if (isLoading) return;
    if (mobileRequestingRef.current) return;
    if (mobilePage >= totalPages) return;

    const nextPage = mobilePage + 1;

    try {
      mobileRequestingRef.current = true;
      setIsLoading(true);

      const res = await fetchNoticeList({
        page: nextPage,
        size: PAGE_SIZE,
      });

      setMobileItems((prev) => mergeUniqueItems(prev, res.list ?? []));
      setMobilePage(nextPage);
      setTotalCnt(res.totalCnt ?? 0);
    } catch (error) {
      console.error("[NoticeList][Mobile] 추가 공지사항 목록 조회 실패:", error);
    } finally {
      mobileRequestingRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      if (isLoading) return;
      if (mobileRequestingRef.current) return;
      if (mobilePage >= totalPages) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const isNearBottom =
        windowHeight + scrollTop >= documentHeight - MOBILE_BOTTOM_OFFSET;

      if (isNearBottom) {
        loadMoreMobileNotices();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile, isLoading, mobilePage, totalPages]);

  useEffect(() => {
    if (actionType === "NOTICE_BACK") {
      navigate(NOTICE_BACK_PATH);
      resetAction();
    }
  }, [actionType, navigate, resetAction]);

  const filteredDesktopItems = useMemo(() => {
    const q = keyword.toLowerCase();
    if (!q) return desktopItems;

    return desktopItems.filter((item) => {
      const title = item.title?.toLowerCase() ?? "";
      const category = item.category?.toLowerCase() ?? "";
      const userName = item.userName?.toLowerCase() ?? "";

      return title.includes(q) || category.includes(q) || userName.includes(q);
    });
  }, [desktopItems, keyword]);

  const filteredMobileItems = useMemo(() => {
    const q = keyword.toLowerCase();
    if (!q) return mobileItems;

    return mobileItems.filter((item) => {
      const title = item.title?.toLowerCase() ?? "";
      const category = item.category?.toLowerCase() ?? "";
      const userName = item.userName?.toLowerCase() ?? "";

      return title.includes(q) || category.includes(q) || userName.includes(q);
    });
  }, [mobileItems, keyword]);

  const isDesktopEmpty =
    !isLoading && !isMobile && filteredDesktopItems.length === 0;
  const isMobileEmpty =
    !isLoading && isMobile && filteredMobileItems.length === 0;

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <div className="notice">
        <header className="mypage__content-header">
          <h2 className="title">공지사항</h2>
        </header>

        <section className="mypage__content-main notice-container">
          <div className="mypage__top_search_field">
            <span className="icon-container">
              <img src={search} alt="검색" />
            </span>
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="검색어를 입력해 주세요."
              onKeyDown={(e) => {
                const isIme = (e.nativeEvent as any)?.isComposing;
                if (e.key === "Enter" && !isIme) applySearch();
              }}
            />
          </div>

          {!isDesktopEmpty ? (
            <>
              <div className="mypage__table">
                <div className="head">
                  <span className="cell--num">NO</span>
                  <span className="cell--title">제목</span>
                  <span className="cell--date">작성일</span>
                </div>

                <div className="body">
                  <ul className="body-list">
                    {filteredDesktopItems.map((item, index) => (
                      <NavLink
                        to={`${item.noticeIdx}`}
                        key={item.noticeIdx}
                        className="cell__item"
                      >
                        <li>
                          <span className="cell--num">
                            {totalCnt - (page - 1) * PAGE_SIZE - index}
                          </span>
                          <span className="cell--title start">
                            <span>[{item.category}]</span>
                            {item.title}
                          </span>
                          <span className="cell--date">
                            {formatDate(item.regDt)}
                          </span>
                        </li>
                      </NavLink>
                    ))}
                  </ul>
                </div>
              </div>

              <Pagination
                current={page}
                total={totalPages}
                onChange={setPage}
                pageWindow={5}
                prevIcon={
                  <img src={arrow_left} alt="이전 페이지" aria-hidden="true" />
                }
                nextIcon={
                  <img src={arrow_right} alt="다음 페이지" aria-hidden="true" />
                }
              />
            </>
          ) : (
            <div className="mypage__table">
              <div className="body">
                <ul className="body-list">
                  <li className="cell__item">
                    <span className="cell--title start">
                      등록된 공지사항이 없습니다.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="notice mobile">
        <header className="mypage__content-header">
          <h2 className="title">공지사항</h2>
        </header>

        <section className="mypage__content-main notice-container">
          {!isMobileEmpty ? (
            <div className="body">
              <ul className="body-list">
                {filteredMobileItems.map((item) => (
                  <NavLink
                    to={`${item.noticeIdx}`}
                    key={item.noticeIdx}
                    className="cell__item"
                  >
                    <span className="cell--title start">
                      [{item.category}] {item.title}
                    </span>
                    <span className="cell--date">
                      {formatDate(item.regDt)}
                    </span>
                  </NavLink>
                ))}
              </ul>
            </div>
          ) : (
            <div className="body">
              <ul className="body-list">
                <li className="cell__item">
                  <span className="cell--title start">
                    등록된 공지사항이 없습니다.
                  </span>
                </li>
              </ul>
            </div>
          )}
        </section>
      </div>
    </>
  );
}