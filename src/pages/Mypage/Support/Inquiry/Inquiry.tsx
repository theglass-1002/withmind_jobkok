import { useState, useEffect } from "react";
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
  if (type === "etc") return "etc";
  return "etc";
}

function mapReplyStatus(replyYn: string): FaqItem["status"] {
  return replyYn === "Y" ? "answered" : "pending";
}

function formatDate(date: string) {
  return date?.split(" ")[0]?.replaceAll("-", ".") ?? "";
}

export default function Inquiry() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<FaqItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadInquiry = async () => {
      try {
        setIsLoading(true);

        const res = await fetchInquiryList({
          page,
          size: PAGE_SIZE,
        });

        console.log("문의 목록 응답", {
          page,
          totalCnt: res.totalCnt,
          list: res.list,
        });

        const mapped: FaqItem[] = (res.list ?? []).map((it) => ({
          id: String(it.inquiryIdx),
          cat: mapInquiryType(it.inquiryType),
          title: it.title,
          date: formatDate(it.regDt),
          status: mapReplyStatus(it.replyYn),
        }));

        setItems(mapped);
        setTotalCount(res.totalCnt ?? 0);
      } catch (error) {
        console.error("문의 목록 조회 실패:", error);
        toast.error("문의 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInquiry();
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const pageItems = items;
  const isEmpty = !isLoading && pageItems.length === 0;

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <div className="inquiry">
        <header className="mypage__content-header">
          <h2 className="inquiry-title">1:1 문의</h2>
        </header>

        {!isEmpty ? (
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
                    {pageItems.map((r) => (
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
              <NavLink className="default_btn_black" to={"create"}>
                1:1 문의하기
              </NavLink>
            </div>
          </>
        ) : (
          <div className="inquiry-empty">
            <div className="inquiry-history__empty-text">문의 내역이 없습니다.</div>
            <div className="btn_wrap">
              <NavLink className="default_btn_black" to={"create"}>
                1:1 문의하기
              </NavLink>
            </div>
          </div>
        )}
      </div>

      <div className="inquiry mobile">
        {!isEmpty ? (
          <>
            <section className="mypage__content-main inquiry-container">
              <div className="inquiry-history">
                <div className="inquiry-history__body">
                  <ul className="inquiry-history__body-list">
                    {pageItems.map((r) => (
                      <NavLink
                        className="inquiry-history__item"
                        to={`${r.id}`}
                        key={r.id}
                      >
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
              <NavLink className="default_btn_black" to={"create"}>
                1:1 문의하기
              </NavLink>
            </div>
          </>
        ) : (
          <div className="inquiry-empty">
            <div className="inquiry-history__empty-text">문의 내역이 없습니다.</div>
            <div className="btn_wrap">
              <NavLink className="default_btn_black" to={"create"}>
                1:1 문의하기
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </>
  );
}