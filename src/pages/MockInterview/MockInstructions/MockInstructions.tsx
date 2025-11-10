import React, { useState } from 'react';
import "./MockInstructions.css";

import StepOne from "./part/StepOne";
import StepTwo from "./part/StepTwo";

export default function MockInstructions() {
    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = () => {
        setCurrentStep(2);
    };

    const handlePrev = () => {
        setCurrentStep(1);
    };

    return (
      <div className="mock-instructions-page">
        {currentStep === 1 ? (
          <StepOne onNext={handleNext} />
        ) : (
          <StepTwo onPrev={handlePrev} />
        )}
      </div>
    );
}