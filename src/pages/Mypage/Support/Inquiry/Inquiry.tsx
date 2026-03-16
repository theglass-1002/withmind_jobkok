import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import Pagination from "@/shared/components/Pagination";
import arrow_left from "@/assets/icons/keyboard_arrow_left.png";
import arrow_right from "@/assets/icons/keyboard_arrow_right.png";
import "./Inquiry.css";

import { toast } from "react-toastify";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { fetchInquiryList } from "@/api/support/support.api";

type InquiryCategory = "howto" | "account" | "payment" | "etc";

type FaqItem = {
  id: string;
  cat: InquiryCategory;
  title: string;
  date: string;
  status: "pending" | "answered" | "hold";
};

const PAGE_SIZE = 10;
const MOBILE_BREAKPOINT = 760;
const MOBILE_BOTTOM_OFFSET = 80;

function labelOfStatus(s: FaqItem["status"]) {
  return s === "pending" ? "문의접수" : s === "answered" ? "답변완료" : "보류";
}

function labelOfCat(c: InquiryCategory) {
  return c === "howto"
    ? "이용방법"
    : c === "account"
      ? "회원정보"
      : c === "payment"
        ? "결제"
        : "기타";
}

function mapInquiryType(type: string): InquiryCategory {
  if (type === "이용방법") return "howto";
  if (type === "회원정보") return "account";
  if (type === "결제") return "payment";
  if (type === "기타") return "etc";
  if (type === "etc") return "etc";
  return "etc";
}

function mapReplyStatus(replyYn: string): FaqItem["status"] {
  return replyYn === "Y" ? "answered" : "pending";
}

function formatDate(date: string) {
  return date?.split(" ")[0]?.replaceAll("-", ".") ?? "";
}

function mapInquiryItem(it: {
  inquiryIdx: number;
  inquiryType: string;
  title: string;
  regDt: string;
  replyYn: string;
}): FaqItem {
  return {
    id: String(it.inquiryIdx),
    cat: mapInquiryType(it.inquiryType),
    title: it.title,
    date: formatDate(it.regDt),
    status: mapReplyStatus(it.replyYn),
  };
}

function mergeUniqueItems(prev: FaqItem[], next: FaqItem[]) {
  const map = new Map<string, FaqItem>();

  [...prev, ...next].forEach((item) => {
    map.set(item.id, item);
  });

  return Array.from(map.values());
}

export default function Inquiry() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);

  const [page, setPage] = useState(1);
  const [desktopItems, setDesktopItems] = useState<FaqItem[]>([]);

  const [mobileItems, setMobileItems] = useState<FaqItem[]>([]);
  const [mobilePage, setMobilePage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const mobileRequestingRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const loadDesktopInquiry = async () => {
      try {
        setIsLoading(true);

        const res = await fetchInquiryList({
          page,
          size: PAGE_SIZE,
        });

        const mapped: FaqItem[] = (res.list ?? []).map(mapInquiryItem);

        setDesktopItems(mapped);
        setTotalCount(res.totalCnt ?? 0);
      } catch (error) {
        console.error("[Inquiry][PC] 문의 목록 조회 실패:", error);
        toast.error("문의 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDesktopInquiry();
  }, [page, isMobile]);

  useEffect(() => {
    if (!isMobile) return;

    const loadInitialMobileInquiry = async () => {
      try {
        setIsLoading(true);
        mobileRequestingRef.current = true;

        const res = await fetchInquiryList({
          page: 1,
          size: PAGE_SIZE,
        });

        const mapped: FaqItem[] = (res.list ?? []).map(mapInquiryItem);

        setMobileItems(mapped);
        setMobilePage(1);
        setTotalCount(res.totalCnt ?? 0);
      } catch (error) {
        console.error("[Inquiry][Mobile] 초기 문의 목록 조회 실패:", error);
        toast.error("문의 목록을 불러오지 못했습니다.");
      } finally {
        mobileRequestingRef.current = false;
        setIsLoading(false);
      }
    };

    loadInitialMobileInquiry();
  }, [isMobile]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const loadMoreMobileInquiry = async () => {
    if (!isMobile) return;
    if (isLoading) return;
    if (mobileRequestingRef.current) return;
    if (mobilePage >= totalPages) return;

    const nextPage = mobilePage + 1;

    try {
      mobileRequestingRef.current = true;
      setIsLoading(true);

 
      const res = await fetchInquiryList({
        page: nextPage,
        size: PAGE_SIZE,
      });

      console.log("[Inquiry][Mobile] 추가 목록 조회 응답", {
        requestedPage: nextPage,
        totalCnt: res.totalCnt,
        listLength: res.list?.length ?? 0,
        list: res.list,
      });

      const mapped: FaqItem[] = (res.list ?? []).map(mapInquiryItem);

      setMobileItems((prev) => mergeUniqueItems(prev, mapped));
      setMobilePage(nextPage);
      setTotalCount(res.totalCnt ?? 0);
    } catch (error) {
      console.error("[Inquiry][Mobile] 추가 문의 목록 조회 실패:", error);
      toast.error("문의 목록을 추가로 불러오지 못했습니다.");
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
        loadMoreMobileInquiry();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile, isLoading, mobilePage, totalPages]);

  const isDesktopEmpty = !isLoading && !isMobile && desktopItems.length === 0;
  const isMobileEmpty = !isLoading && isMobile && mobileItems.length === 0;

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <div className="inquiry">
        <header className="mypage__content-header">
          <h2 className="inquiry-title">1:1 문의</h2>
        </header>

        {!isDesktopEmpty ? (
          <>
            <section className="mypage__content-main inquiry-container">
              <div className="inquiry-history">
                <div className="inquiry-history__head">
                  <span className="inquiry-history__cell inquiry-history__cell--title">
                    제목
                  </span>
                  <span className="inquiry-history__cell inquiry-history__cell--date">
                    작성일
                  </span>
                  <span className="inquiry-history__cell inquiry-history__cell--status">
                    답변 상태
                  </span>
                </div>

                <div className="inquiry-history__body">
                  <ul className="inquiry-history__body-list">
                    {desktopItems.map((r) => (
                      <NavLink to={`${r.id}`} key={r.id}>
                        <li className="inquiry-history__item">
                          <span className="inquiry-history__cell inquiry-history__cell--title">
                            <span>[{labelOfCat(r.cat)}]</span>
                            {r.title}
                          </span>
                          <span className="inquiry-history__cell--date">{r.date}</span>
                          <span
                            className={`inquiry-history__cell inquiry-history__cell--status ${r.status}`}
                          >
                            {labelOfStatus(r.status)}
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
                prevIcon={<img src={arrow_left} alt="" aria-hidden="true" />}
                nextIcon={<img src={arrow_right} alt="" aria-hidden="true" />}
              />
            </section>

            <div className="btn_wrap">
              <NavLink className="default_btn_black" to="create">
                1:1 문의하기
              </NavLink>
            </div>
          </>
        ) : (
          <div className="inquiry-empty">
            <div className="inquiry-history__empty-text">문의 내역이 없습니다.</div>
            <div className="btn_wrap">
              <NavLink className="default_btn_black" to="create">
                1:1 문의하기
              </NavLink>
            </div>
          </div>
        )}
      </div>

      <div className="inquiry mobile">
        {!isMobileEmpty ? (
          <>
            <section className="mypage__content-main inquiry-container">
              <div className="inquiry-history">
                <div className="inquiry-history__body">
                  <ul className="inquiry-history__body-list">
                    {mobileItems.map((r) => (
                      <NavLink className="inquiry-history__item" to={`${r.id}`} key={r.id}>
                        <span
                          className={`inquiry-history__cell inquiry-history__cell--status ${r.status}`}
                        >
                          {labelOfStatus(r.status)}
                        </span>
                        <span className="inquiry-history__cell--title">{r.title}</span>
                        <div className="inquiry-history__meta-group">
                          <span className="inquiry-history__cell">{r.date}</span>
                          <span className="inquiry-history__cell inquiry-history__cell--category">
                            {labelOfCat(r.cat)}
                          </span>
                        </div>
                      </NavLink>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <div className="btn_wrap">
              <NavLink className="default_btn_black" to="create">
                1:1 문의하기
              </NavLink>
            </div>
          </>
        ) : (
          <div className="inquiry-empty">
            <div className="inquiry-history__empty-text">문의 내역이 없습니다.</div>
            <div className="btn_wrap">
              <NavLink className="default_btn_black" to="create">
                1:1 문의하기
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </>
  );
}