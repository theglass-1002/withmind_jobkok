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
import {
  createQzGroup,
  fetchEnvTestSpeech,
  fetchInterviewQuestionsV2,
  saveUserInputQuestions,
} from "@/api/interview/interview.api";
import { logout } from "@/api/auth/auth.api";
import type {
  InterviewQuestionsV2Request,
  SaveUserInputQuestionsRequest,
} from "@/api/interview/interview.types";

type InterviewInfoErrors = {
  selectedResume?: string;
  desiredJob?: string;
  jobPostingUrl?: string;
};

type LocalQuestion = {
  id: number;
  isAiGenerated: boolean;
  customText: string;
};

type InterviewQuestionLike = {
  question_id?: string;
  question_code?: string;
  order: number;
  text: string;
  type: string;
  difficulty: string;
  related_items?: any[];
  answer_hint?: string;
};

type InterviewStageStatus = 0 | 1 | 2;
// 0: 유저 질문 전부 작성
// 1: 유저 질문 일부 작성
// 2: 유저 질문 미작성

type InterviewState = {
  envSpeech?: any;
  interviewRes?: any;
  jobDetail?: any;
  resumeDetail?: any;
  jobId?: number | null;
  desiredJob?: string;
  jobPostingUrl?: string;
  interviewStageStatus?: InterviewStageStatus;
  interviewGroupId: number;
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

  const [interviewState, setInterviewState] = useState<InterviewState | null>(null);

  const [questions, setQuestions] = useState<LocalQuestion[]>([
    { id: 1, isAiGenerated: true, customText: "" },
    { id: 2, isAiGenerated: true, customText: "" },
    { id: 3, isAiGenerated: true, customText: "" },
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

  useEffect(() => {
    console.log("[M_MockSettings] interviewState:", interviewState);
  }, [interviewState]);

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

    console.log("[M_MockSettings] ===== handleNextStep start =====");
    console.log("[M_MockSettings] selectedResume:", selectedResume);
    console.log("[M_MockSettings] desiredJob:", desiredJob);
    console.log("[M_MockSettings] jobPostingUrl:", jobPostingUrl);
    console.log("[M_MockSettings] questions state:", questions);

    const ok = validateSubmitRequired();
    console.log("[M_MockSettings] validateSubmitRequired result:", ok);

    if (!ok) {
      setShowSubmitErrors(true);
      console.log("[M_MockSettings] validation failed, stop.");
      return;
    }

    setShowSubmitErrors(false);
    setInfoErrors({});

    const trimmedUrl = jobPostingUrl.trim();
    const jobIdStr = extractJobId(trimmedUrl);

    console.log("[M_MockSettings] trimmedUrl:", trimmedUrl);
    console.log("[M_MockSettings] extracted jobIdStr:", jobIdStr);

    if (trimmedUrl && !jobIdStr) {
      setInfoErrors({
        jobPostingUrl: "올바른 채용 공고 URL이 아닙니다.",
      });
      setShowSubmitErrors(true);
      console.log("[M_MockSettings] invalid job posting url, stop.");
      return;
    }

    const resumeIdxNum = Number(selectedResume);
    const jobIdNum = jobIdStr ? Number(jobIdStr) : null;

    console.log("[M_MockSettings] resumeIdxNum:", resumeIdxNum);
    console.log("[M_MockSettings] jobIdNum:", jobIdNum);

    if (Number.isNaN(resumeIdxNum)) {
      toast.error("이력서 ID가 올바르지 않습니다.");
      console.log("[M_MockSettings] invalid resumeIdxNum");
      return;
    }

    if (jobIdNum !== null && Number.isNaN(jobIdNum)) {
      toast.error("공고 ID가 올바르지 않습니다.");
      console.log("[M_MockSettings] invalid jobIdNum");
      return;
    }

    const totalQuestionCount = questions.length;

    const userWrittenTexts = questions
      .filter((q) => !q.isAiGenerated && q.customText.trim().length > 0)
      .map((q) => q.customText.trim());

    const writtenQuestionCount = userWrittenTexts.length;

    console.log("[M_MockSettings] totalQuestionCount:", totalQuestionCount);
    console.log("[M_MockSettings] writtenQuestionCount:", writtenQuestionCount);
    console.log("[M_MockSettings] userWrittenTexts:", userWrittenTexts);

    try {
      setIsSubmitting(true);
      console.log("[M_MockSettings] isSubmitting -> true");

      console.log("[API] fetchResumeDetail request:", { resumeIdxNum });
      const resumeDetail = await fetchResumeDetail(resumeIdxNum);
      console.log("[API] fetchResumeDetail response:", resumeDetail);

      let jobDetail = null;
      if (jobIdNum !== null) {
        console.log("[API] fetchJobDetail request:", { jobIdNum });
        jobDetail = await fetchJobDetail(jobIdNum);
        console.log("[API] fetchJobDetail response:", jobDetail);
      } else {
        console.log("[API] fetchJobDetail skipped: no jobIdNum");
      }

      const createGroupPayload = {
        resumeIdx: resumeDetail.resumeIdx,
        job: desiredJob.trim(),
        ...(trimmedUrl ? { jobPostLink: trimmedUrl } : {}),
      };
      console.log("[API] createQzGroup request:", createGroupPayload);

      const groupRes = await createQzGroup(createGroupPayload);
      console.log("[API] createQzGroup response:", groupRes);

      const interviewGroupId = groupRes.qzGroup;
      console.log("[M_MockSettings] interviewGroupId:", interviewGroupId);

      console.log("[API] fetchEnvTestSpeech request");
      const envSpeech = await fetchEnvTestSpeech();
      console.log("[API] fetchEnvTestSpeech response:", envSpeech);

      const payload: InterviewQuestionsV2Request = {
        resume: JSON.stringify(resumeDetail),
        job_posting: jobDetail ? JSON.stringify(jobDetail) : undefined,
        target_role: desiredJob.toString(),
        qz_group: interviewGroupId,
      };

      console.log("[API] fetchInterviewQuestionsV2 request payload:", payload);

      const allCustomFilled =
        questions.length > 0 &&
        questions.every((q) => !q.isAiGenerated && q.customText.trim().length > 0);

      const interviewStageStatus: InterviewStageStatus = allCustomFilled
        ? 0
        : writtenQuestionCount > 0
        ? 1
        : 2;

      console.log("[M_MockSettings] allCustomFilled:", allCustomFilled);
      console.log("[M_MockSettings] interviewStageStatus:", interviewStageStatus);

      const interviewResRaw: any = await fetchInterviewQuestionsV2(payload);
      console.log("[API] fetchInterviewQuestionsV2 response:", interviewResRaw);
      console.log(
        "[M_MockSettings] raw API questions:",
        interviewResRaw?.data?.questions
      );

      let apiList: InterviewQuestionLike[] = [];

      if (
        interviewResRaw?.success &&
        interviewResRaw?.data?.questions &&
        Array.isArray(interviewResRaw.data.questions)
      ) {
        apiList = interviewResRaw.data.questions.map((q: any) => ({
          question_id: q.question_id,
          question_code: q.question_code,
          order: q.order,
          text: q.text,
          type: q.type,
          difficulty: "MEDIUM",
          related_items: [],
          answer_hint: "",
        }));
      }

      console.log("[M_MockSettings] apiList:", apiList);
      console.log("[M_MockSettings] apiList.length:", apiList.length);

      if (apiList.length === 0) {
        throw new Error("생성된 질문 리스트가 없습니다.");
      }

      const replaced = [...apiList];
      const replaceCount = Math.min(userWrittenTexts.length, replaced.length);

      console.log("[M_MockSettings] replaceCount:", replaceCount);
      console.log("[M_MockSettings] replaced(before):", replaced);

      for (let i = 0; i < replaceCount; i++) {
        const original = replaced[i];

        replaced[i] = {
          ...original,
          text: userWrittenTexts[i],
          type: "CUSTOM",
          difficulty: original?.difficulty ?? "MEDIUM",
          answer_hint: "",
          related_items: original?.related_items ?? [],
        };

        console.log(`[M_MockSettings] replaced[${i}] override:`, {
          before: original,
          after: replaced[i],
        });
      }

      console.log("[M_MockSettings] replaced(after):", replaced);

      const finalQuestions: InterviewQuestionLike[] = replaced.map((q, idx) => ({
        ...q,
        order: idx + 1,
      }));

      console.log("[M_MockSettings] finalQuestions:", finalQuestions);
      console.log(
        "[M_MockSettings] finalQuestions metadata:",
        finalQuestions.map((q) => ({
          question_id: q.question_id,
          question_code: q.question_code,
          order: q.order,
          text: q.text,
          type: q.type,
        }))
      );
      console.log("[M_MockSettings] finalQuestions.length:", finalQuestions.length);

      const savePayload: SaveUserInputQuestionsRequest = {
        qzGroup: interviewGroupId,
        queList: finalQuestions.map((q, idx) => ({
          num: q.order ?? idx + 1,
          que: q.text,
          questionCode: q.question_code,
          type: q.type,
        })),
      };

      console.log("[API] saveUserInputQuestions request payload:", savePayload);

      const saveRes = await saveUserInputQuestions(savePayload);
      console.log("[API] saveUserInputQuestions response:", saveRes);

      if (saveRes.code !== 200) {
        throw new Error(`질문 저장 실패: ${saveRes.msg}`);
      }

      const interviewRes = {
        ...(interviewResRaw ?? {}),
        success: true,
        data: {
          ...(interviewResRaw?.data ?? {}),
          questions: finalQuestions,
        },
      };

      const nextInterviewState: InterviewState = {
        envSpeech,
        interviewRes,
        jobDetail,
        resumeDetail,
        jobId: jobIdNum,
        desiredJob,
        jobPostingUrl,
        interviewStageStatus,
        interviewGroupId,
      };

      console.log("[M_MockSettings] final interviewRes:", interviewRes);
      console.log(
        "[M_MockSettings] navigate interview questions:",
        interviewRes?.data?.questions
      );
      console.log("[M_MockSettings] navigate state:", nextInterviewState);

      setInterviewState(nextInterviewState);

      navigate("/mock-interview/m-environment-test", {
        state: nextInterviewState,
      });
    } catch (e: any) {
      console.error("[M_MockSettings] handleNextStep error:", e);

      if (e?.code === 999) {
        console.log("[M_MockSettings] auth expired -> logout");
        logout();
        navigate("/login");
        return;
      }

      setIsQuestionFailModalOpen(true);
    } finally {
      setIsSubmitting(false);
      console.log("[M_MockSettings] isSubmitting -> false");
      console.log("[M_MockSettings] ===== handleNextStep end =====");
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
        {showSettingsPanel && (
          <SettingsPanel
            activeStep={activeStep}
            onExit={handleExitRequest}
            interviewState={interviewState ?? undefined}
          />
        )}

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