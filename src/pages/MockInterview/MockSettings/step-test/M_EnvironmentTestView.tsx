import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLayoutContext } from "@/app/LayoutContext";

import SettingsPanel from "@/pages/MockInterview/MockSettings/components/SettingsPanel";
import TestIntro from "./components/TestIntro";
import M_CameraTest from "./components/M_CameraTest";

import "./EnvironmentTestView.css";
import ic_mic_white_24x32 from "@/assets/icons/size24/ic_mic_white_24x32.png";
import Modal from "@/shared/components/modal/Modal";

type LocationState = {
  envSpeech?: string;
  interviewRes?: any;
  jobDetail?: any;
  resumeDetail: any;
  jobId?: number;
  desiredJob?: string;
  jobPostingUrl?: string;
  interviewStageStatus?: 0 | 1 | 2;
};

export default function M_EnvironmentTestView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { actionType, resetAction } = useLayoutContext();

  const state = (location.state || {}) as LocationState;

  const [activeStep] = useState(2);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [testStep, setTestStep] = useState<"intro" | "camera1" | "camera2" | "complete" | "failed">(
    "intro"
  );
  const [showDialog, setShowDialog] = useState(true);

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
    navigate("/");
  };

  const handleStartMockInterviewLive = () => {
    navigate("/mock-interview/m-mock-interview-live", { state: { ...state } });
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
                  <img src={ic_mic_white_24x32} alt="마이크" className="camera-test__mic-icon" />
                </span>
              </div>
            )}

            {testStep === "camera1" && (
              <M_CameraTest
                speechText={state.envSpeech}
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
    </>
  );
}
