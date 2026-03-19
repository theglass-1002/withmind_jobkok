import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import arrow_back_big from "@/assets/icons/arrow_back_big.png";
import chevron_left from "@/assets/icons/chevron_left.png";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { fetchNoticeDetail } from "@/api/support/support.api";
import { useLayoutContext } from "@/app/LayoutContext";
import type { NoticeDetailData } from "@/api/support/support.types";

function formatDate(dateString?: string | null) {
  if (!dateString) return "";

  const datePart = dateString.split(" ")[0];
  return datePart.replace(/-/g, ".");
}

function isMobileScreen() {
  return window.innerWidth <= 767;
}

export default function NoticeDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { actionType, resetAction } = useLayoutContext();
  const [notice, setNotice] = useState<NoticeDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getBackPath = () => {
    return isMobileScreen() ? "/mypage/m-support/notices" : "/mypage/notice";
  };

  const handleGoBack = () => {
    navigate(getBackPath());
  };

  useEffect(() => {
    const loadNoticeDetail = async () => {
      if (!id) return;

      try {
        setIsLoading(true);

        const res = await fetchNoticeDetail(Number(id));
        setNotice(res.data ?? null);
      } catch (error) {
        console.error("공지사항 상세 조회 실패:", error);
        setNotice(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadNoticeDetail();
  }, [id]);

  useEffect(() => {
    if (actionType === "NOTICE_BACK") {
      navigate(getBackPath());
      resetAction();
    }
  }, [actionType, navigate, resetAction]);

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <div className="inquiry">
        <header className="mypage__content-header detail">
          <h2 className="title">
            <span
              className="icon_wrap back_btn_icon"
              role="button"
              tabIndex={0}
              onClick={handleGoBack}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleGoBack();
              }}
            >
              <img src={arrow_back_big} alt="" />
            </span>
            공지사항 상세
          </h2>
        </header>

        <section className="mypage__content-main mypage__detail-view">
          <article className="card question">
            <div className="card__infos">
              <h1 className="card__title">
                {notice ? `[${notice.category}] ${notice.title}` : ""}
              </h1>
              <div className="card__meta">
                <span className="card__meta date">{formatDate(notice?.regDt)}</span>
              </div>
            </div>
            <div className="card__content">{notice?.content ?? ""}</div>
          </article>
        </section>

        <div className="inquiry-actions">
          <div className="inquiry-actions__left">
            <button className="btn default_btn_white" onClick={handleGoBack}>
              <img src={chevron_left} alt="" />
              목록으로
            </button>
          </div>
        </div>
      </div>

      <div className="inquiry mobile">
        <header className="mypage__content-header detail">
          <h2 className="title">
            <span
              className="icon_wrap back_btn_icon"
              role="button"
              tabIndex={0}
              onClick={handleGoBack}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleGoBack();
              }}
            >
              <img src={arrow_back_big} alt="" />
            </span>
            공지사항 상세
          </h2>
        </header>

        <section className="mypage__content-main mypage__detail-view notice__detail">
          <article className="card question">
            <div className="card__infos">
              <h1 className="card__title">
                {notice ? `[${notice.category}] ${notice.title}` : ""}
              </h1>
              <div className="card__meta">
                <span className="card__meta date">{formatDate(notice?.regDt)}</span>
              </div>
            </div>
            <div className="card__content">{notice?.content ?? ""}</div>
          </article>
        </section>
      </div>
    </>
  );
}