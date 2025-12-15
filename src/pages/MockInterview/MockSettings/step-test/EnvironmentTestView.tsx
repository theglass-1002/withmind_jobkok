// EnvironmentTestView.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsSidebar from "@/pages/MockInterview/MockSettings/components/SettingsSidebar";
import SettingsPanel from "@/pages/MockInterview/MockSettings/components/SettingsPanel";
import TestIntro from "./components/TestIntro";
import CameraTest from "./components/CameraTest";
import "./EnvironmentTestView.css";
import ic_chevron_left_gray900_24 from "@/assets/icons/size24/ic_chevron_left_gray900_24.png";
import ic_chevron_right_gray700_24 from "@/assets/icons/size24/ic_chevron_right_gray700_24.png";

// ✅ 모달 컴포넌트 경로 맞게 수정
import Modal from "@/shared/components/modal/Modal";

export default function EnvironmentTestView() {
  const navigate = useNavigate();
  const [testStep, setTestStep] = useState<"intro" | "camera1" | "camera2" | "complete" | "failed">("intro");
  const [showDialog, setShowDialog] = useState(true);

  // ✅ 나가기 확인 모달
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // ✅ "나가기" 요청(사이드패널 X/나가기 버튼 등) → 모달만 띄움
  const handleExitRequest = () => {
    setShowExitConfirm(true);
  };

  const handleCloseExitConfirm = () => {
    setShowExitConfirm(false);
  };

  // ✅ 모달에서 확인 누르면 이동
  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    navigate("/mock-interview-report"); // 원하는 경로로 변경 가능
  };

  // ✅ "이전으로" 버튼도 동일하게 모달 띄우게
  const handleBackClick = () => {
    setShowExitConfirm(true);
  };

  const handleStartTest = () => {
    setShowDialog(false);
    setTestStep("camera1");
  };

  return (
    <>
      {/* ✅ 나가기 확인 모달 */}
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
        <SettingsSidebar activeStep={2} onStepChange={() => {}} />

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
                onNext={() => setTestStep("camera2")}
                onFail={() => setTestStep("failed")}
              />
            )}
          </div>
        </div>

        <SettingsPanel onExit={handleExitRequest} />

        {showDialog && testStep === "intro" && (
          <>
            <div className="env-test-overlay"></div>
            <div className="env-test-dialog">
              <TestIntro onStart={handleStartTest} />
            </div>
          </>
        )}

        {/* 모바일 */}
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
                  onNext={() => setTestStep("camera2")}
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
