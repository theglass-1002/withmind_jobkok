import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SettingsSidebar from "@/pages/MockInterview/MockSettings/components/SettingsSidebar";
import SettingsPanel from "@/pages/MockInterview/MockSettings/components/SettingsPanel";
import TestIntro from "./components/TestIntro";
import CameraTest from "./components/CameraTest";
import "./EnvironmentTestView.css";
import ic_chevron_left_gray900_24 from "@/assets/icons/size24/ic_chevron_left_gray900_24.png";
import ic_chevron_right_gray700_24 from "@/assets/icons/size24/ic_chevron_right_gray700_24.png";
import Modal from "@/shared/components/modal/Modal";

type LocationState = {
  envSpeech?:string;
  interviewRes?: any;
  jobDetail?: any;
  resumeDetail:any;
  jobId?: number;
  desiredJob?: string;
  jobPostingUrl?: string;
};

export default function EnvironmentTestView() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const [testStep, setTestStep] = useState<"intro" | "camera1" | "camera2" | "complete" | "failed">("intro");
  const [showDialog, setShowDialog] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    console.log("EnvironmentTestView location.state:", state);
  }, [state]);

  const handleExitRequest = () => {
    setShowExitConfirm(true);
  };

  const handleCloseExitConfirm = () => {
    setShowExitConfirm(false);
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    navigate("/mock-interview-report");
  };

  const handleBackClick = () => {
    setShowExitConfirm(true);
  };

  const handleStartTest = () => {
    setShowDialog(false);
    setTestStep("camera1");
  };

  const handleStartMockInterviewLive = () => {
    console.log("모의면접 시작하기 클릭 - 전달할 state:", state);
    console.log("envSpeech:", state.envSpeech);
    console.log("interviewRes:", state.interviewRes);
    console.log("jobDetail:", state.jobDetail);
    console.log("resumeDetail:", state.resumeDetail);
    console.log("jobId:", state.jobId);
    console.log("desiredJob:", state.desiredJob);
    console.log("jobPostingUrl:", state.jobPostingUrl);
  
    navigate("/mock-interview/mock-interview-live", {
      state: {
        ...state, // 받은 state 그대로 전달
      },
    });
  };
  

  return (
    <>
      <Modal
        open={showExitConfirm}
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
        onClose={handleCloseExitConfirm}
      />

      <div className="mock-settings-page environment">
        <SettingsSidebar activeStep={2}
        onStepChange={() => {}} />

        <div className="mock-settings__content">
          <div className="mock-settings__content-inner">
            {testStep === "intro" && (
              <div className="mock-settings__submit-btn-container">
                <button className="default_btn_white radius" onClick={handleBackClick}>
                  <img src={ic_chevron_left_gray900_24} alt="" />
                  이전으로
                </button>
                <button className="default_btn_gray radius" disabled>
                  모의면접 시작하기
                  <img src={ic_chevron_right_gray700_24} alt="" />
                </button>
              </div>
            )}

            {testStep === "camera1" && (
              <CameraTest
                speechText={state.envSpeech}
                testType="camera"
                onStartInterview={handleStartMockInterviewLive}
                onFail={() => setTestStep("failed")}
              />
            )}
          </div>
        </div>

        <SettingsPanel 
        onExit={handleExitRequest} 
        activeStep={2}
        interviewState={state}
        />

        {showDialog && testStep === "intro" && (
          <>
            <div className="env-test-overlay"></div>
            <div className="env-test-dialog">
              <TestIntro onStart={handleStartTest} />
            </div>
          </>
        )}

        <div className="mock-settings-page mobile environment">
          <div className="mock-settings__content">
            <div className="mock-settings__content-inner">
              {testStep === "intro" && (
                <div className="mock-settings__submit-btn-container">
                  <button className="default_btn_white radius" onClick={handleBackClick}>
                    <img src={ic_chevron_left_gray900_24} alt="" />
                    이전으로
                  </button>
                  <button className="default_btn_gray radius" disabled>
                    모의면접 시작하기
                    <img src={ic_chevron_right_gray700_24} alt="" />
                  </button>
                </div>
              )}

              {testStep === "camera1" && (
                <CameraTest
                  testType="camera"
                  onStartInterview={handleStartMockInterviewLive}
                  onFail={() => setTestStep("failed")}
                />
              )}
            </div>
          </div>

          {showDialog && testStep === "intro" && (
            <>
              <div className="env-test-overlay"></div>
              <div className="env-test-dialog">
                <TestIntro onStart={handleStartTest} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
