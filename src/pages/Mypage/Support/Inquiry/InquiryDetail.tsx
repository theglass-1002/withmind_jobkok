import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import arrow_back_big from "@/assets/icons/arrow_back_big.png";
import chevron_left from "@/assets/icons/chevron_left.png";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { toast } from "react-toastify";
import Modal from "@/shared/components/modal/Modal";
import { deleteInquiry, fetchInquiryDetail } from "@/api/support/support.api";
import type { InquiryDetailData } from "@/api/support/support.types";
import { Icons } from "@/assets/icons";

const MOBILE_BREAKPOINT = 760;

function formatDate(date?: string | null) {
  return date?.split(" ")[0]?.replaceAll("-", ".") ?? "";
}

function labelOfStatus(replyYn?: "Y" | "N") {
  return replyYn === "Y" ? "답변완료" : "문의접수";
}

function badgeClass(replyYn?: "Y" | "N") {
  return replyYn === "Y" ? "badge--answered" : "badge--pending";
}

function inquiryCardClass(replyYn?: "Y" | "N") {
  return replyYn === "Y" ? "answered" : "pending";
}

export default function InquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [detail, setDetail] = useState<InquiryDetailData | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteCompleteOpen, setIsDeleteCompleteOpen] = useState(false);

  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

  const inquiryListPath = isMobile
    ? "/mypage/m-support/inquiry"
    : "/mypage/support/inquiry";

  const getInquiryEditPath = (inquiryId: number | string) =>
    isMobile
      ? `/mypage/m-support/inquiry/edit/${inquiryId}`
      : `/mypage/support/inquiry/edit/${inquiryId}`;

  useEffect(() => {
    if (!id) return;

    const loadDetail = async () => {
      try {
        setIsLoading(true);
        const res = await fetchInquiryDetail(Number(id));
        console.log(res);
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
    navigate(inquiryListPath);
  };

  const handleEdit = () => {
    if (!id) return;
    navigate(getInquiryEditPath(id));
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;

    try {
      setIsDeleteConfirmOpen(false);
      setIsLoading(true);

      const res = await deleteInquiry(Number(id));
      console.log("문의 삭제 응답:", res);

      if (res.code === 200) {
        setIsDeleteCompleteOpen(true);
      }
    } catch (error) {
      console.error("문의 삭제 실패:", error);
      toast.error("문의 삭제에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCompleteConfirm = () => {
    setIsDeleteCompleteOpen(false);
    navigate(inquiryListPath);
  };

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

          {detail?.replyYn !== "Y" && (
            <div className="inquiry-actions__right">
              <button className="default_btn_white edit" onClick={handleEdit}>
                <img src={Icons.ic_edit_gray900_20} alt="" />
                수정
              </button>
              <button className="default_btn_white delete" onClick={handleDeleteClick}>
                <img src={Icons.ic_delete_gray900_20} alt="" />
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
                <span className="text-btn edit" onClick={handleEdit}>
                  수정
                </span>
                <span>ㆍ</span>
                <span className="text-btn delete" onClick={handleDeleteClick}>
                  삭제
                </span>
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

      <Modal
        open={isDeleteConfirmOpen}
        title="1:1 문의 내역을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        showCancel
        confirmClassName="btn_w_full default_btn_red"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteConfirmOpen(false)}
      />

      <Modal
        open={isDeleteCompleteOpen}
        title="1:1 문의가 삭제되었습니다."
        confirmText="확인"
        showCancel={false}
        confirmClassName="btn_w_full default_btn_black"
        onConfirm={handleDeleteCompleteConfirm}
      />
    </>
  );
}