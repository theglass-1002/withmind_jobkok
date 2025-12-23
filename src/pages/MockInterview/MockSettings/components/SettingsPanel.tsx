import React, { useEffect } from "react";
import ic_logout_white_24 from "@/assets/icons/size24/ic_logout_white_24.png";
import ic_close_white_24 from "@/assets/icons/size24/ic_close_white_24.png";

type InterviewState = {
    interviewRes?: any;
    jobDetail?: any;
    resumeDetail:any;
    jobId?: number;
    desiredJob?: string;
    jobPostingUrl?: string;
};

type SettingsPanelProps = {
  activeStep?: number;
  onExit?: () => void;
  interviewState?: InterviewState;
};

export default function SettingsPanel({
  activeStep = 1,
  onExit,
  interviewState,
}: SettingsPanelProps) {

  useEffect(() => {
    if (!interviewState) {
      console.log("SettingsPanel: interviewState 없음");
      return;
    }


    console.log("전체 interviewState:", interviewState);

  }, [interviewState]);

  const getPanelContent = () => {
    switch (activeStep) {
      case 1:
        return {
          info: "모의면접 설정을 완료해 주세요.",
          stage: "환경 테스트를 완료해 주세요.",
        };
      case 2:
        return {
          info: "환경 테스트 진행 중",
          stage: "환경 테스트를 완료해 주세요.",
        };
      case 3:
        return {
          info: "모의면접 진행 중",
          stage: "면접을 완료해 주세요.",
        };
      default:
        return {
          info: "설정을 완료해 주세요",
          stage: "환경 테스트를 완료해 주세요.",
        };
    }
  };

  const content = getPanelContent();

  const resumeTitle =
    interviewState?.resumeDetail.title ??
    "선택한 이력서";

  const desiredJob = interviewState?.desiredJob ?? "-";

  const jobTitle =
    interviewState?.jobDetail.job.name ??
    "선택한 채용 공고";

  const renderDesktopInfoSection = () => {
    if (activeStep === 2) {
      return (
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
              <span className="mock-interview__info-value">{jobTitle}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mock-settings__panel-section">
        <span className="mock-settings__panel-section-title">면접 정보</span>
        <div className="mock-settings__panel-section-description">
          {content.info}
        </div>
        {interviewState?.desiredJob && (
          <div className="mock-settings__panel-section-description">
            희망 직무: {interviewState.desiredJob}
          </div>
        )}
      </div>
    );
  };

  const renderDesktopStageSection = () => (
    <div className="mock-settings__panel-section">
      <span className="mock-settings__panel-section-title">면접 단계</span>
      <div className="mock-settings__panel-section-description">
        {content.stage}
      </div>
    </div>
  );

  const renderMobileInfoSection = () => {
    if (activeStep === 2) {
      return (
        <>
          <div className="mock-settings__panel-header">
            <img
              onClick={onExit}
              className="mock-settings_header_icon"
              src={ic_close_white_24}
              alt=""
            />
            <span className="mock-settings__panel-section-title">
              면접 진행 현황
            </span>
          </div>

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
                <span className="mock-interview__info-value">{jobTitle}</span>
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="mock-settings__panel-section">
        <div className="mock-settings__panel-header">
          <img
            onClick={onExit}
            className="mock-settings_header_icon"
            src={ic_close_white_24}
            alt=""
          />
          <span className="mock-settings__panel-section-title">
            면접 진행 현황
          </span>
        </div>

        <span className="mock-settings__panel-section-title">면접 정보</span>
        <div className="mock-settings__panel-section-description">
          {content.info}
        </div>

        {interviewState?.desiredJob && (
          <div className="mock-settings__panel-section-description">
            희망 직무: {interviewState.desiredJob}
          </div>
        )}
      </div>
    );
  };

  const renderMobileStageSection = () => (
    <div className="mock-settings__panel-section">
      <span className="mock-settings__panel-section-title">면접 단계</span>
      <div className="mock-settings__panel-section-description">
        {content.stage}
      </div>
    </div>
  );

  return (
    <>
      <div className="mock-settings__panel">
        {renderDesktopInfoSection()}
        {renderDesktopStageSection()}

        <span className="mock-settings__submit-btn-container">
          <button className="mock-settings__exit-btn" onClick={onExit}>
            <img src={ic_logout_white_24} alt="" />
            나가기
          </button>
        </span>
      </div>

      <div className="mock-settings__panel mobile">
        {renderMobileInfoSection()}
        {renderMobileStageSection()}
      </div>
    </>
  );
}
