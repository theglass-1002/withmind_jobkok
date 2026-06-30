import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./MockInstructions.css";

import StepOne from "./part/StepOne";
import StepTwo from "./part/StepTwo";
import Modal from "@/shared/components/modal/Modal";
import { guardMockInterviewPage } from "@/shared/utils/mockInterviewGuard";

export default function MockInstructions() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        guardMockInterviewPage(setIsModalOpen);
    }, []);

    const handleNext = () => {
        setCurrentStep(2);
    };

    const handlePrev = () => {
        setCurrentStep(1);
    };

    return (
      <div className="mock-page">
      <div className="mock-instructions-page">
          {currentStep === 1 ? (
            <StepOne onNext={handleNext} />
          ) : (
            <StepTwo onPrev={handlePrev} />
          )}
        </div>

        <Modal
            open={isModalOpen}
            title="유효하지 않은 접근입니다."
            confirmText="확인"
            confirmClassName="btn_w_full default_btn_white"
            onConfirm={() => {
                setIsModalOpen(false);
                navigate("/");
            }}
            onClose={() => {
                setIsModalOpen(false);
                navigate("/");
            }}
            showCancel={false}
        />
      </div>

    );
}