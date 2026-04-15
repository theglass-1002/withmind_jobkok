import React from "react";
import { useNavigate } from "react-router-dom";
import ic_close_gray500_24 from "@/assets/icons/size24/ic_close_gray500_24.png";
import ic_arrow_up_right_gray900_20 from "@/assets/icons/size20/ic_arrow_up_right_gray900_20.png";
import type { CompanyJobAnalysisResultData } from "@/api/company/job/companyJob.types";

type AIMatchingResultProps = {
  analysisResult?: CompanyJobAnalysisResultData | null;
};

type ImprovementItem = {
  originalText?: string;
  suggestionContent?: string;
  displayOrder?: number;
};

type InappropriateItem = {
  originalText?: string;
  analysisContent?: string;
  displayOrder?: number;
};

type RecommendationItem = {
  idx?: number;
  name?: string;
  age?: string;
  career?: string;
  education?: string;
  desiredJobs?: string[];
  aiInterview?: string;
  aiMatchPercent?: number;
  resumeUpdatedAt?: string;
  resumeIdx?: number;
  displayOrder?: number;
};

export default function AIMatchingResult({
  analysisResult,
}: AIMatchingResultProps) {
  const navigate = useNavigate();

  const improvementList =
    (analysisResult?.sections?.improvement?.data as ImprovementItem[] | undefined) ?? [];
  const inappropriateList =
    (analysisResult?.sections?.inappropriate?.data as InappropriateItem[] | undefined) ?? [];
  const recommendationList =
    (analysisResult?.sections?.recommendation?.data as RecommendationItem[] | undefined) ?? [];

  const diagnosisItems = [
    ...improvementList.map((item, index) => ({
      key: `improvement-${item?.displayOrder ?? index}`,
      label: item?.originalText?.trim() || "원문 없음",
      detail: item?.suggestionContent?.trim() || "개선 의견이 없습니다.",
    })),
    ...inappropriateList.map((item, index) => ({
      key: `inappropriate-${item?.displayOrder ?? index}`,
      label: item?.originalText?.trim() || "원문 없음",
      detail: item?.analysisContent?.trim() || "분석 내용이 없습니다.",
    })),
  ];

  return (
    <>
      <div className="diagnosis-box">
        <div className="diagnosis-box__header">
          <span className="diagnosis-box__title">AI 공고 진단 분석</span>
          <img
            src={ic_close_gray500_24}
            alt="닫기"
            className="diagnosis-box__close-btn"
          />
        </div>

        {diagnosisItems.length > 0 ? (
          diagnosisItems.map((item) => (
            <div className="diagnosis-box__item" key={item.key}>
              <div className="diagnosis-box__item-summary">
                <span className="diagnosis-box__item-label">{item.label}</span>
              </div>
              <span className="diagnosis-box__item-detail">{item.detail}</span>
            </div>
          ))
        ) : (
          <div className="diagnosis-box__item">
            <div className="diagnosis-box__item-summary">
              <span className="diagnosis-box__item-label">분석 결과 없음</span>
            </div>
            <span className="diagnosis-box__item-detail">
              표시할 공고 진단 분석 데이터가 없습니다.
            </span>
          </div>
        )}
      </div>

      <div className="talent-list">
        <div className="talent-list__header talent-list__row">
          <div className="talent-list__col talent-list__col--name">
            <span>이름</span>
          </div>
          <div className="talent-list__col talent-list__col--info">
            <span>정보</span>
          </div>
          <div className="talent-list__col talent-list__col--ai-status">
            <span>AI 면접</span>
          </div>
          <div className="talent-list__col talent-list__col--rate">
            <span>적합률</span>
          </div>
          <div className="talent-list__col talent-list__col--date">
            <span>등록일</span>
          </div>
          <div className="talent-list__col talent-list__col--action">
            <span></span>
          </div>
        </div>

        {recommendationList.length > 0 ? (
          recommendationList.map((item, index) => (
            <div
              key={item?.resumeIdx ?? item?.idx ?? index}
              className="talent-list__item talent-list__row"
            >
              <div className="talent-list__col talent-list__col--name">
                <span>{item?.name?.trim() || "-"}</span>
              </div>

              <div className="talent-list__col talent-list__col--info">
                <span className="talent-list__summary">
                  {[item?.age?.trim(), item?.career?.trim()]
                    .filter(Boolean)
                    .join("ㆍ") || "-"}
                </span>

                <div className="talent-list__detail-item">
                  <span className="talent-list__detail-label">학력 사항</span>
                  <span className="talent-list__detail-value">
                    {item?.education?.trim() || "-"}
                  </span>
                </div>

                <div className="talent-list__detail-item">
                  <span className="talent-list__detail-label">희망 직무</span>
                  <span className="talent-list__detail-value">
                    {Array.isArray(item?.desiredJobs) && item.desiredJobs.length > 0
                      ? item.desiredJobs.filter(Boolean).join(", ")
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="talent-list__col talent-list__col--ai-status">
                <span
                  className={`talent-list__status-text ${
                    item?.aiInterview === "공개" ? "on" : ""
                  }`}
                >
                  {item?.aiInterview?.trim() || "-"}
                </span>
              </div>

              <div className="talent-list__col talent-list__col--rate">
                <span className="talent-list__rate-value">
                  {typeof item?.aiMatchPercent === "number"
                    ? `${item.aiMatchPercent}%`
                    : "-"}
                </span>
              </div>

              <div className="talent-list__col talent-list__col--date">
                <span className="talent-list__date-value">
                  {item?.resumeUpdatedAt
                    ? item.resumeUpdatedAt.slice(0, 10).replace(/-/g, ".")
                    : "-"}
                </span>
              </div>

              <div className="talent-list__col talent-list__col--action">
                <button
                  className="default_btn_white"
                  onClick={() => {
                 
                    navigate(
                      `/company/ai-matching/report/${item?.resumeIdx ?? item?.idx ?? index}`,
                      {
                        state: {
                          recommendationItem: item,
                          analysisResult,
                          activeTab: "RESUME",
                        },
                      }
                    );
                  
                  }}
                >
                  자세히 보기 <img src={ic_arrow_up_right_gray900_20} alt="" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="talent-list__item talent-list__row">
            <div
              className="talent-list__col"
              style={{ width: "100%", padding: "24px", textAlign: "center" }}
            >
              추천 인재 데이터가 없습니다.
            </div>
          </div>
        )}
      </div>
    </>
  );
}