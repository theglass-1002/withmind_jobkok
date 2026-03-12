import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import arrow_back_big from "@/assets/icons/arrow_back_big.png";
import chevron_left from "@/assets/icons/chevron_left.png";
import edit from "@/assets/icons/edit.png";
import deleteIcon from "@/assets/icons/delete.png";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { toast } from "react-toastify";
import { fetchInquiryDetail } from "@/api/support/support.api";
import type { InquiryDetailData } from "@/api/support/support.types";

function formatDate(date?: string | null) {
  return date?.split(" ")[0]?.replaceAll("-", ".") ?? "";
}

function labelOfStatus(replyYn?: "Y" | "N") {
  return replyYn === "Y" ? "답변완료" : "문의접수";
}

function badgeClass(replyYn?: "Y" | "N") {
  return replyYn === "Y" ? "badge--answered" : "badge--pending";
}

export default function InquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [detail, setDetail] = useState<InquiryDetailData | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadDetail = async () => {
      try {
        setIsLoading(true);
        const res = await fetchInquiryDetail(4);
        console.log(res);
        // const res = await fetchInquiryDetail(Number(id));
        setDetail(res.data);
      } catch (error) {
        console.error("문의 상세 조회 실패:", error);
        toast.error("문의 상세 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  const handleBack = () => {
    navigate("/mypage/support/inquiry");
  };

  function inquiryCardClass(replyYn?: "Y" | "N") {
    return replyYn === "Y" ? "answered" : "pending";
  }


  if (!detail && !isLoading) {
    return (
      <>
        <div className="inquiry">
          <header className="mypage__content-header detail">
            <h2 className="title">
              <span className="icon_wrap back_btn_icon" onClick={handleBack}>
                <img src={arrow_back_big} alt="" />
              </span>
              1:1 문의
            </h2>
          </header>
          <section className="mypage__content-main inquiry-detail-view__main">
            <div className="empty">문의 정보를 찾을 수 없습니다.</div>
          </section>
        </div>

        <div className="inquiry mobile">
          <header className="mypage__content-header detail">
            <h2 className="title">
              <span className="icon_wrap back_btn_icon" onClick={handleBack}>
                <img src={arrow_back_big} alt="" />
              </span>
              1:1 문의
            </h2>
          </header>
          <section className="mypage__content-main inquiry-detail-view__main">
            <div className="empty">문의 정보를 찾을 수 없습니다.</div>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <div className="inquiry">
        <header className="mypage__content-header detail">
          <h2 className="title">
            <span className="icon_wrap back_btn_icon" onClick={handleBack}>
              <img src={arrow_back_big} alt="" />
            </span>
            1:1 문의
          </h2>
        </header>

        <section className="mypage__content-main inquiry-detail-view__main">
          <article
              className={`inquiry-card question ${inquiryCardClass(detail?.replyYn)}`}
              aria-labelledby="inquiry-title"
            >
            <span className={`badge ${badgeClass(detail?.replyYn)}`}>
              {labelOfStatus(detail?.replyYn)}
            </span>

            <div className="inquiry-card__infos">
              <h1 id="inquiry-title" className="inquiry-card__title">
                {detail?.title ?? ""}
              </h1>

              <div className="inquiry-card__meta">
                <span className="inquiry-card__meta date">
                  {formatDate(detail?.regDt)}
                </span>
                <span className="inquiry-card__meta category">
                  {detail?.inquiryType ?? ""}
                </span>
              </div>
            </div>

            <div className="inquiry-card__content">{detail?.content ?? ""}</div>
          </article>

          {detail?.replyYn === "Y" && detail?.replyContent && (
            <article className="inquiry-card answer" aria-labelledby="answer-title">
              <div className="inquiry-card__meta">
                <span className="inquiry-card__meta date">
                  {formatDate(detail?.replyRegDt)}
                </span>
              </div>
              <div className="inquiry-card__content">{detail.replyContent}</div>
            </article>
          )}
        </section>

        <div className="inquiry-actions">
       
            <button className="default_btn_white" onClick={handleBack}>
              <img src={chevron_left} alt="" />
              목록으로
            </button>
        

          {/* 답변 없을 때만 수정/삭제 노출하고 싶으면 이렇게 */}
          {detail?.replyYn !== "Y" && (
            <div className="inquiry-actions__right">
              <button className="default_btn_white edit">
                <img src={edit} alt="" />
                수정
              </button>
              <button className="default_btn_white delete">
                <img src={deleteIcon} alt="" />
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="inquiry mobile">
        <header className="mypage__content-header detail">
          <h2 className="title">
            <span className="icon_wrap back_btn_icon" onClick={handleBack}>
              <img src={arrow_back_big} alt="" />
            </span>
            1:1 문의
          </h2>
        </header>

        <section className="mypage__content-main inquiry-detail-view__main">
            <article
            className={`inquiry-card question ${inquiryCardClass(detail?.replyYn)}`}
            aria-labelledby="inquiry-title"
          >
            <div className="inquiry-card__header">
              <span className={`badge ${badgeClass(detail?.replyYn)}`}>
                {labelOfStatus(detail?.replyYn)}
              </span>

              <h1 id="inquiry-title" className="inquiry-card__title">
                {detail?.title ?? ""}
              </h1>

              <div className="inquiry-card__meta">
                <span className="inquiry-card__meta date">
                  {formatDate(detail?.regDt)}
                </span>
                <span className="inquiry-card__meta category">
                  {detail?.inquiryType ?? ""}
                </span>
              </div>
            </div>

            <div className="inquiry-card__content">{detail?.content ?? ""}</div>
            {detail?.replyYn !== "Y" && (
          <div className="inquiry-card__actions">
             <span className="text-btn edit">수정</span>
             <span>ㆍ</span>
             <span className="text-btn delete">삭제</span>
            </div>
          )}
          </article>

          {detail?.replyYn === "Y" && detail?.replyContent && (
            <article className="inquiry-card answer" aria-labelledby="answer-title">
              <div className="inquiry-card__meta">
                <span className="inquiry-card__meta date">
                  {formatDate(detail?.replyRegDt)}
                </span>
              </div>
              <div className="inquiry-card__content">{detail.replyContent}</div>
            
            </article>
          )}
   
        </section>
      </div>
    </>
  );
}