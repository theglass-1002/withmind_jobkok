import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLayoutContext } from "@/app/LayoutContext";

import SettingsPanel from "@/pages/MockInterview/MockSettings/components/SettingsPanel";
import TestIntro from "./components/TestIntro";
import M_CameraTest from "./components/M_CameraTest";

import "./EnvironmentTestView.css";
import ic_mic_white_24x32 from "@/assets/icons/size24/ic_mic_white_24x32.png";
import Modal from "@/shared/components/modal/Modal";

type InterviewStageStatus = 0 | 1 | 2;

type LocationState = {
  envSpeech?: string;
  interviewRes?: any;
  jobDetail?: any;
  resumeDetail?: any;
  jobId?: number | null;
  desiredJob?: string;
  jobPostingUrl?: string;
  interviewStageStatus?: InterviewStageStatus;
  interviewGroupId?: number;
};

export default function M_EnvironmentTestView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { actionType, resetAction } = useLayoutContext();

  const state = (location.state || {}) as LocationState;

  const [activeStep] = useState(2);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [testStep, setTestStep] = useState<
    "intro" | "camera1" | "camera2" | "complete" | "failed"
  >("intro");
  const [showDialog, setShowDialog] = useState(true);

  useEffect(() => {
    console.log("[M_EnvironmentTestView] location.state:", state);
    console.log(
      "[M_EnvironmentTestView] interviewStageStatus:",
      state?.interviewStageStatus
    );
    console.log(
      "[M_EnvironmentTestView] interviewGroupId:",
      state?.interviewGroupId
    );
    console.log(
      "[M_EnvironmentTestView] interviewRes.data.questions:",
      state?.interviewRes?.data?.questions
    );

    switch (state?.interviewStageStatus) {
      case 0:
        console.log("상태 0: 유저 질문 전부 작성 (API 스킵)");
        break;
      case 1:
        console.log("상태 1: 유저 질문 일부 작성 (API + 일부 교체)");
        break;
      case 2:
        console.log("상태 2: 유저 질문 미작성 (API 그대로)");
        break;
      default:
        console.log("상태 없음 또는 알 수 없음");
    }
  }, [state]);

  useEffect(() => {
    if (!actionType) return;

    if (actionType === "view_status") {
      setShowSettingsPanel(true);
    } else if (actionType === "exit") {
      setShowConfirm(true);
    }

    resetAction?.();
  }, [actionType, resetAction]);

  const handleExitRequest = () => {
    setShowSettingsPanel(false);
  };

  const handleStartTest = () => {
    setShowDialog(false);
    setTestStep("camera1");
  };

  const handleCloseConfirm = () => setShowConfirm(false);

  const handleConfirmExit = () => {
    setShowConfirm(false);
    navigate("/mock-interview-report");
  };

  const handleStartMockInterviewLive = () => {
    console.log("[M_EnvironmentTestView] navigate to m-mock-interview-live:", {
      ...state,
    });

    navigate("/mock-interview/m-mock-interview-live", {
      state: {
        ...state,
      },
    });
  };

  return (
    <>
      <div className="mock-settings-page mobile environment">
        {showSettingsPanel && (
          <SettingsPanel
            activeStep={activeStep}
            onExit={handleExitRequest}
            interviewState={state}
          />
        )}

        <div className="mock-settings__content">
          <div className="mock-settings__content-inner">
            {testStep === "intro" && (
              <div className="mock-settings__submit-btn-container">
                <span className="camera-test__mic-button-wrapper">
                  <img
                    src={ic_mic_white_24x32}
                    alt="마이크"
                    className="camera-test__mic-icon"
                  />
                </span>
              </div>
            )}

            {testStep === "camera1" && (
              <M_CameraTest
                speechText={state?.envSpeech}
                testType="camera"
                onStartInterview={handleStartMockInterviewLive}
                onFail={() => setTestStep("failed")}
              />
            )}
          </div>
        </div>

        {showDialog && testStep === "intro" && (
          <>
            <div className="env-test-overlay" />
            <div className="env-test-dialog">
              <TestIntro onStart={handleStartTest} />
            </div>
          </>
        )}
      </div>

      <Modal
        open={showConfirm}
        title="환경 테스트를 종료하시겠습니까?"
        desc={
          <>
            환경 테스트를 종료하면 진행 중인 테스트가 저장되지 않습니다.
            <br />
            그래도 나가시겠습니까?
          </>
        }
        confirmText="나가기"
        confirmClassName="btn_w_full default_btn_red radius"
        cancelText="취소"
        cancelClassName="btn_w_full default_btn_gray_100 radius"
        onConfirm={handleConfirmExit}
        onClose={handleCloseConfirm}
      />
    </>
  );
}