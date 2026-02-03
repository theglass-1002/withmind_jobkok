import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ic_logout_white_24 from "@/assets/icons/size24/ic_logout_white_24.png";
import ic_close_white_24 from "@/assets/icons/size24/ic_close_white_24.png";

import Modal from "@/shared/components/modal/Modal";
import { Icons } from "@/assets/icons";

type CurrentQuestion = {
  stage?: string;
  question?: string;
  order?: number;
  type?: string;
  difficulty?: string;
  answerHint?: string;
} | null;

type InterviewStageStatus = 0 | 1 | 2;

type LiveSidePanelProps = {
  onExit?: () => void;
  currentIndex?: number;
  totalCount?: number;
  interviewState?: any;
  interviewStageStatus?: InterviewStageStatus;
  currentQuestion?: CurrentQuestion;
};

type StageItemKey = "INTRO" | "CUSTOM" | "RESUME" | "JOB" | "CAPABILITY";

type StageItemText = {
  key: StageItemKey;
  name: string;
  desc: string;
};

const STAGE_ITEM_MASTER: Record<StageItemKey, Omit<StageItemText, "key">> = {
  INTRO: { name: "자기소개 및 지원 동기", desc: "본인의 강점과 지원 동기 확인" },
  CUSTOM: { name: "사용자 설정 질문", desc: "사용자 작성한 질문" },
  RESUME: { name: "이력서 기반 질문", desc: "작성한 경험과 경력 검증" },
  JOB: { name: "직무 질문", desc: "직무 이해도 평가" },
  CAPABILITY: { name: "역량 질문", desc: "업무에 필요한 핵심 역량 확인" },
};

const VISIBLE_KEYS_BY_STATUS: Record<InterviewStageStatus, StageItemKey[]> = {
  0: ["INTRO", "CUSTOM"],
  1: ["INTRO", "CUSTOM", "RESUME", "JOB", "CAPABILITY"],
  2: ["INTRO", "RESUME", "JOB", "CAPABILITY"],
};

function isFollowupType(t?: string) {
  return t === "FOLLOWUP";
}

function isMainType(t?: string) {
  return !!t && !isFollowupType(t);
}

export default function LiveSidePanel({
  onExit,
  currentIndex = 0,
  totalCount = 0,
  interviewState,
  interviewStageStatus = 2,
  currentQuestion = null,
}: LiveSidePanelProps) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);


  const lastMainTypeRef = useRef<string>("TECHNICAL");

  useEffect(() => {
    const t = currentQuestion?.type;
    if (isMainType(t)) lastMainTypeRef.current = t as string;
  }, [currentQuestion?.type]);

  const effectiveType = useMemo(() => {
    const t = currentQuestion?.type;
    if (isFollowupType(t)) return lastMainTypeRef.current;
    return t;
  }, [currentQuestion?.type]);

  const handleExitClick = () => setShowConfirm(true);
  const handleCloseConfirm = () => setShowConfirm(false);

  const handleConfirmExit = () => {
    setShowConfirm(false);
    navigate("/mock-interview-report");
  };

  const handleMobileCloseClick = () => {
    setShowConfirm(true);
    onExit?.();
  };

  const safeTotal = Math.max(0, totalCount);
  const safeCurrent = Math.min(Math.max(0, currentIndex), Math.max(0, safeTotal - 1));
  const displayCurrent = safeTotal > 0 ? safeCurrent + 1 : 0;
  const progressRatio = safeTotal > 0 ? displayCurrent / safeTotal : 0;

  const progressWidth = useMemo(() => {
    const pct = Math.max(0, Math.min(1, progressRatio)) * 100;
    return `${pct}%`;
  }, [progressRatio]);

  const resumeTitle =
    interviewState?.resumeDetail?.title ?? interviewState?.resumeDetail?.name ?? "이력서 제목";

  const desiredJob = interviewState?.desiredJob ?? "희망 직무";

  const jobPostingTitle =
    interviewState?.jobDetail?.job?.name ??
    interviewState?.jobDetail?.name ??
    interviewState?.jobDetail?.title ??
   "선택한 채용 공고 없음";

  // 아이콘은 "effectiveType" 기준으로 계산 (FOLLOWUP이 끼어도 기존 타입 아이콘으로 섞임)
  const stageIconSrc = useMemo(() => {
    switch (interviewStageStatus) {
      case 0:
        switch (effectiveType) {
          case "INFORMATION":
            return Icons.interview_step_custom_all_1;
          default:
            return Icons.interview_step_custom_all_2;
        }

      case 1:
        switch (effectiveType) {
          case "INFORMATION":
            return Icons.ic_interview_step_custom_some_1;
          case "CUSTOM":
            return Icons.ic_interview_step_custom_some_2;
          case "EXPERIENCE":
            return Icons.ic_interview_step_custom_some_3;
          case "TECHNICAL":
            return Icons.ic_interview_step_custom_some_4;
          case "BEHAVIORAL":
            return Icons.ic_interview_step_custom_some_5;
          default:
            return Icons.ic_interview_step_custom_some_5;
        }

      case 2:
        switch (effectiveType) {
          case "INFORMATION":
            return Icons.ic_interview_step_custom_none_1;
          case "EXPERIENCE":
            return Icons.ic_interview_step_custom_none_2;
          case "TECHNICAL":
            return Icons.ic_interview_step_custom_none_3;
          case "BEHAVIORAL":
            return Icons.ic_interview_step_custom_none_4;
          default:
            return Icons.ic_interview_step_custom_none_4;
        }

      default:
        return Icons.ic_interview_step_custom_none_4;
    }
  }, [interviewStageStatus, effectiveType]);

  const stageItems = useMemo<StageItemText[]>(() => {
    const keys = VISIBLE_KEYS_BY_STATUS[interviewStageStatus] ?? VISIBLE_KEYS_BY_STATUS[2];
    return keys.map((key) => ({ key, ...STAGE_ITEM_MASTER[key] }));
  }, [interviewStageStatus]);

  const StageItemsView = useMemo(() => {
    return (
      <div className="mock-interview__stage-items">
        {stageItems.map((it) => (
          <div className="mock-interview__stage-item" key={it.key}>
            <span className="mock-interview__stage-name">{it.name}</span>
            <span className="mock-interview__stage-desc">{it.desc}</span>
          </div>
        ))}
      </div>
    );
  }, [stageItems]);

  return (
    console.log('effectiveType',effectiveType),
    <>
      <Modal
        open={showConfirm}
        title="모의면접을 중단하시겠습니까?"
        confirmText="나가기"
        confirmClassName="btn_w_full default_btn_red radius"
        cancelText="취소"
        cancelClassName="btn_w_full default_btn_gray_100 radius"
        onConfirm={handleConfirmExit}
        onClose={handleCloseConfirm}
      />

      <div className="mock-interview__sidepanel">
        <div className="mock-interview__sidepanel-section info">
          <span className="mock-interview__sidepanel-title">면접 정보</span>
          <div className="mock-interview__info-list">
            <div className="mock-interview__info-item">
              <span className="mock-interview__info-label">이력서</span>
              <span className="mock-interview__info-value">{resumeTitle}</span>
            </div>
            <div className="mock-interview__info-item">
              <span className="mock-interview__info-label">희망 직무</span>
              <span className="mock-interview__info-value">{desiredJob}</span>
            </div>
            <div className="mock-interview__info-item">
              <span className="mock-interview__info-label">채용 공고</span>
              <span className="mock-interview__info-value">{jobPostingTitle}</span>
            </div>
          </div>
        </div>

        <div className="mock-interview__sidepanel-section stage">
          <div className="mock-interview__stage-header">
            <span className="mock-interview__stage-title">면접 단계</span>
            <div className="mock-interview__stage-list">
              <div className="mock-interview__stage-icons">
                <img src={stageIconSrc} alt="" />
              </div>
              {StageItemsView}
            </div>
          </div>

          <div className="mock-interview__progress">
            <div className="mock-interview__progress-header">
              <span className="mock-interview__progress-label">진행 현황</span>
              <span className="mock-interview__progress-count">
                질문 {displayCurrent} / {safeTotal}
              </span>
            </div>

            <div className="mock-interview__progress-bar">
              <span className="mock-interview__progress-fill" style={{ width: progressWidth }} />
            </div>
          </div>
        </div>

        <div className="mock-interview__sidepanel-footer">
          <button className="mock-interview__exit-btn" onClick={handleExitClick}>
            <img src={ic_logout_white_24} alt="" />
            나가기
          </button>
        </div>
      </div>

      <div className="mock-interview__sidepanel mobile">
      <div className="mock-settings__panel-header">
            <img
              onClick={handleMobileCloseClick}
              className="mock-settings_header_icon"
              src={ic_close_white_24}
              alt=""
            />
            <span className="mock-settings__panel-section-title">면접 진행 현황</span>
          </div>
          <div className="mock-settings__panel-body">
        <div className="mock-interview__sidepanel-section info">
        

        <span className="mock-interview__sidepanel-title">면접 정보</span>
        <div className="mock-interview__info-list">
          <div className="mock-interview__info-item">
            <span className="mock-interview__info-label">이력서</span>
            <span className="mock-interview__info-value">{resumeTitle}</span>
          </div>
          <div className="mock-interview__info-item">
            <span className="mock-interview__info-label">희망 직무</span>
            <span className="mock-interview__info-value">{desiredJob}</span>
          </div>
          <div className="mock-interview__info-item">
            <span className="mock-interview__info-label">채용 공고</span>
            <span className="mock-interview__info-value">{jobPostingTitle}</span>
          </div>
        </div>
      </div>

      <div className="mock-interview__sidepanel-section stage">
        <div className="mock-interview__stage-header">
          <span className="mock-interview__stage-title">면접 단계</span>
          <div className="mock-interview__stage-list">
            <div className="mock-interview__stage-icons">
              <img src={stageIconSrc} alt="" />
            </div>
            {StageItemsView}
          </div>
        </div>

        <div className="mock-interview__progress">
          <div className="mock-interview__progress-header">
            <span className="mock-interview__progress-label">진행 현황</span>
            <span className="mock-interview__progress-count">
              질문 {displayCurrent} / {safeTotal}
            </span>
          </div>

          <div className="mock-interview__progress-bar">
            <span className="mock-interview__progress-fill" style={{ width: progressWidth }} />
          </div>
        </div>
      </div>

        </div>
      
       
      </div>
    </>
  );
}
