import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MockSettings.css";

import SettingsSidebar from "./components/SettingsSidebar";
import SettingsPanel from "./components/SettingsPanel";

import InterviewInfoSection from "./step-setup/InterviewInfoSection";
import QuestionSettingsSection from "./step-setup/QuestionSettingsSection";

import ic_chevron_right_white_24 from "@/assets/icons/size24/ic_chevron_right_white_24.png";
import Modal from "@/shared/components/modal/Modal";
import { toast } from "react-toastify";

type InterviewInfoErrors = {
  selectedResume?: string;
  desiredJob?: string;
  jobPostingUrl?: string;
};

export default function MockSettings() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);

  const [desiredJob, setDesiredJob] = useState("");
  const [jobPostingUrl, setJobPostingUrl] = useState("");
  const [selectedResume, setSelectedResume] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ "설정완료" 눌렀을 때만 에러 표시
  const [showSubmitErrors, setShowSubmitErrors] = useState(false);
  const [infoErrors, setInfoErrors] = useState<InterviewInfoErrors>({});

  const [questions, setQuestions] = useState([
    { id: 1, isAiGenerated: true, customText: "" },
    { id: 2, isAiGenerated: true, customText: "" },
    { id: 4, isAiGenerated: true, customText: "" },
    { id: 5, isAiGenerated: true, customText: "" },
    { id: 6, isAiGenerated: true, customText: "" },
    { id: 7, isAiGenerated: true, customText: "" },
    { id: 8, isAiGenerated: true, customText: "" },
    { id: 9, isAiGenerated: true, customText: "" },
    { id: 10, isAiGenerated: true, customText: "" },
    { id: 11, isAiGenerated: true, customText: "" },
  ]);

  // ✅ 필수값 검증(설정완료용)
  const validateSubmitRequired = (): boolean => {
    const next: InterviewInfoErrors = {};

    if (!selectedResume.trim()) next.selectedResume = "이력서를 선택해 주세요.";
    if (!desiredJob.trim()) next.desiredJob = "희망 직무를 입력해 주세요.";
    if (!jobPostingUrl.trim())
      next.jobPostingUrl = "채용 공고 링크(URL)을 입력해 주세요.";

    setInfoErrors(next);
    return Object.keys(next).length === 0;
  };

  // 모달 닫기
  const handleCloseConfirm = () => setShowConfirm(false);

  // 나가기 요청(기존 그대로)
  const handleExitRequest = () => setShowConfirm(true);

  const handleConfirmExit = () => {
    setShowConfirm(false);
    navigate("/");
  };

  // ✅ 설정 완료 클릭
  const handleNextStep = () => {
    setShowSubmitErrors(true);

    const ok = validateSubmitRequired();
    if (!ok) {
      toast.info("필수 항목을 먼저 입력해 주세요.");
      return; // ❌ 다음 단계 이동 막기
    }

    // ✅ 통과하면 이동
    navigate("/mock-interview/environment-test");
  };

  const step1Props = {
    selectedResume,
    onResumeChange: (v: string) => {
      setSelectedResume(v);
      setInfoErrors((prev) => ({ ...prev, selectedResume: undefined }));
    },
    desiredJob,
    onDesiredJobChange: (v: string) => {
      setDesiredJob(v);
      setInfoErrors((prev) => ({ ...prev, desiredJob: undefined }));
    },
    jobPostingUrl,
    onJobPostingUrlChange: (v: string) => {
      setJobPostingUrl(v);
      setInfoErrors((prev) => ({ ...prev, jobPostingUrl: undefined }));
    },

    questions,
    onQuestionsChange: setQuestions,

    // ✅ 설정완료 눌렀을 때만 에러 노출
    showErrors: showSubmitErrors,
    errors: infoErrors,
  };

  return (
    <div className="mock-settings-page">
      <div className="mock-settings-page_container">
        <SettingsSidebar activeStep={activeStep} onStepChange={setActiveStep} />

        <div className={`mock-settings__content mock-settings--step-${activeStep}`}>
          <div className="mock-settings__content-inner">
            <InterviewInfoSection {...step1Props} />
            <QuestionSettingsSection {...step1Props} />
          </div>

          <div className="mock-settings__submit-btn-container">
            <button className="mock-settings__submit-btn on" onClick={handleNextStep}>
              설정 완료
              <img src={ic_chevron_right_white_24} alt="" />
            </button>
          </div>
        </div>

        <SettingsPanel activeStep={activeStep} onExit={handleExitRequest} />

        {/* 나가기 확인 모달(기존 그대로) */}
        <Modal
          open={showConfirm}
          title="모의면접을 중단하시겠습니까?"
          desc={
            <>
              해당 모의면접에 사용된 이용권은 차감되지 않으며,<br />
              [모의면접 - 모의면접 내역] 페이지에서 이어서 진행할 수 있습니다.
            </>
          }
          confirmText="나가기"
          confirmClassName="btn_w_full default_btn_red radius"
          cancelText="취소"
          cancelClassName="btn_w_full default_btn_gray_100 radius"
          onConfirm={handleConfirmExit}
          onClose={handleCloseConfirm}
        />
      </div>
    </div>
  );
}
