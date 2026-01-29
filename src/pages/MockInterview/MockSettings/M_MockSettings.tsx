import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayoutContext } from "@/app/LayoutContext";
import "./MockSettings.css";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import InterviewInfoSection from "./step-setup/InterviewInfoSection";
import QuestionSettingsSection from "./step-setup/QuestionSettingsSection";
import SettingsPanel from "@/pages/MockInterview/MockSettings/components/SettingsPanel";
import { toast } from "react-toastify";
import Modal from "@/shared/components/modal/Modal";
import { extractJobId } from "@/shared/utils/util";
import { fetchResumeDetail } from "@/api/resume/resume.api";
import { fetchJobDetail } from "@/api/job/job.api";
import { fetchEnvTestSpeech, fetchInterviewQuestions } from "@/api/interview/interview.api";
import { logout } from "@/api/auth/auth.api";
import { InterviewQuestionsRequest } from "@/api/interview/interview.types";

type InterviewInfoErrors = {
  selectedResume?: string;
  desiredJob?: string;
  jobPostingUrl?: string;
};

export default function M_MockSettings() {
  const navigate = useNavigate();
  const { actionType, resetAction } = useLayoutContext();

  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [desiredJob, setDesiredJob] = useState("");
  const [jobPostingUrl, setJobPostingUrl] = useState("");
  const [selectedResume, setSelectedResume] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  const [showSubmitErrors, setShowSubmitErrors] = useState(false);
  const [infoErrors, setInfoErrors] = useState<InterviewInfoErrors>({});
  const [isQuestionFailModalOpen, setIsQuestionFailModalOpen] = useState(false);

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

  const isFormReady = useMemo(() => {
    return !!selectedResume.trim() && !!desiredJob.trim();
  }, [selectedResume, desiredJob]);

  useEffect(() => {
    if (!actionType) return;

    if (actionType === "view_status") {
      setShowSettingsPanel(true);
    } else if (actionType === "exit") {
      setShowConfirm(true);
    }

    resetAction?.();
  }, [actionType, resetAction]);

  const handleCloseQuestionFailModal = () => setIsQuestionFailModalOpen(false);

  const validateSubmitRequired = (): boolean => {
    const next: InterviewInfoErrors = {};

    if (!selectedResume.trim()) next.selectedResume = "이력서를 선택해 주세요.";
    if (!desiredJob.trim()) next.desiredJob = "희망 직무를 입력해 주세요.";

    setInfoErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCloseConfirm = () => setShowConfirm(false);

  const handleExitRequest = () => {
    setShowSettingsPanel(false);
  };

  const handleConfirmExit = () => {
    setShowConfirm(false);
    navigate("/");
  };

  const handleNextStep = async () => {
    if (isSubmitting) return;

    const ok = validateSubmitRequired();
    if (!ok) {
      setShowSubmitErrors(true);
      return;
    }

    setShowSubmitErrors(false);
    setInfoErrors({});

    const trimmedUrl = jobPostingUrl.trim();
    const jobIdStr = extractJobId(trimmedUrl);

    if (trimmedUrl && !jobIdStr) {
      setInfoErrors({
        jobPostingUrl: "올바른 채용 공고 URL이 아닙니다.",
      });
      setShowSubmitErrors(true);
      return;
    }

    const resumeIdxNum = Number(selectedResume);
    const jobIdNum = jobIdStr ? Number(jobIdStr) : null;

    if (Number.isNaN(resumeIdxNum)) {
      toast.error("이력서 ID가 올바르지 않습니다.");
      return;
    }

    if (jobIdNum !== null && Number.isNaN(jobIdNum)) {
      toast.error("공고 ID가 올바르지 않습니다.");
      return;
    }

    try {
      setIsSubmitting(true);

      const resumeDetail = await fetchResumeDetail(resumeIdxNum);
      const jobDetail = jobIdNum !== null ? await fetchJobDetail(jobIdNum) : null;
      const envSpeech = await fetchEnvTestSpeech();

      const payload: InterviewQuestionsRequest = {
        resume: JSON.stringify(resumeDetail),
        job_posting: jobDetail ? JSON.stringify(jobDetail) : null,
      };

      const interviewRes = await fetchInterviewQuestions(payload);

      navigate("/mock-interview/m-environment-test", {
        state: {
          envSpeech,
          interviewRes,
          jobDetail,
          resumeDetail,
          jobId: jobIdNum,
          desiredJob,
          jobPostingUrl,
        },
      });
    } catch (e: any) {
      if (e?.code === 999) {
        logout();
        navigate("/login");
        return;
      }

      setIsQuestionFailModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
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
    showErrors: showSubmitErrors,
    errors: infoErrors,
  };

  return (
    <>
      <LoadingOverlay isLoading={isSubmitting} />

      <div className="mock-settings-page">
        {showSettingsPanel && <SettingsPanel activeStep={activeStep} onExit={handleExitRequest} />}

        <div className={`mock-settings__content mock-settings--step-${activeStep}`}>
          <div className="mock-settings__content-inner">
            <InterviewInfoSection {...step1Props} />
            <QuestionSettingsSection {...step1Props} />
          </div>

          <div className="mock-settings__submit-btn-container">
            <button
              className={`btn_w_full mock-settings__submit-btn ${isFormReady ? "on" : "off"}`}
              onClick={handleNextStep}
              disabled={!isFormReady || isSubmitting}
            >
              설정 완료
            </button>
          </div>
        </div>

        <Modal
          open={showConfirm}
          title="모의면접을 중단하시겠습니까?"
          desc={
            <>
              해당 모의면접에 사용된 이용권은 차감되지 않으며,
              <br />
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

      <Modal
        className="m-settings"
        open={isQuestionFailModalOpen}
        title="질문 생성에 실패하였습니다."
        desc={
          <>
            입력하신 URL이 잘못되었거나 해당 페이지에 접근할 수 없습니다.
            <br />
            채용 공고 페이지 주소를 다시 확인해 주세요.
            <br />
            <span style={{ color: "red" }}>
              ※ 채용 공고가 이미지로만 등록된 경우에는 질문을 생성할 수 없습니다.
            </span>
          </>
        }
        confirmText="확인"
        confirmClassName="btn_w_full default_btn_black radius"
        showCancel={false}
        onConfirm={handleCloseQuestionFailModal}
        onClose={handleCloseQuestionFailModal}
      />
    </>
  );
}
