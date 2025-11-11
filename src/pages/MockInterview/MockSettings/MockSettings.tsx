import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./MockSettings.css";

// 공통 컴포넌트 (./components/common/으로 폴더 구조를 가정하여 수정)
import SettingsSidebar from './components/SettingsSidebar';
import SettingsPanel from './components/SettingsPanel';

// Step 1 컴포넌트 (./components/step-setup/ 으로 폴더 구조를 가정하여 수정)
import InterviewInfoSection from './step-setup/InterviewInfoSection';
import QuestionSettingsSection from './step-setup/QuestionSettingsSection';

// Step 2 컴포넌트 (./components/step-test/ 으로 폴더 구조를 가정하여 수정)

// 아이콘 및 모달
import ic_chevron_right_gray700_24 from "@/assets/icons/size24/ic_chevron_right_gray700_24.png";
import Modal from "@/shared/components/modal/Modal";


export default function MockSettings() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(1);
    const [desiredJob, setDesiredJob] = useState('');
    const [jobPostingUrl, setJobPostingUrl] = useState('');
    const [selectedResume, setSelectedResume] = useState('');
    const [showConfirm, setShowConfirm] = useState(false); 
    const [questions, setQuestions] = useState([
        { id: 1, isAiGenerated: true, customText: '' },
        { id: 2, isAiGenerated: true, customText: '' },
        { id: 3, isAiGenerated: true, customText: '' },
    ]);

    // 모달 닫기
    const handleCloseConfirm = () => setShowConfirm(false);

    // 다음 단계로 이동하거나 면접을 시작하는 함수
    const handleNextStep = () => {
        navigate('/mock-interview/environment-test');
    };

    const step1Props = {
        selectedResume, onResumeChange: setSelectedResume,
        desiredJob, onDesiredJobChange: setDesiredJob,
        jobPostingUrl, onJobPostingUrlChange: setJobPostingUrl,
        questions, onQuestionsChange: setQuestions,
    };

// MockSettings 함수 내부 (renderStepContent 함수 다음에 추가)
const renderSubmitButton = () => {
    switch (activeStep) {
        case 1:
            // Step 1: 다음 단계로 넘어가는 버튼
            return (
                <button 
                    className="mock-settings__submit-btn"
                    onClick={handleNextStep}
                >
                    다음 단계
                    <img src={ic_chevron_right_gray700_24} alt="" />
                </button>
            );
        case 2:
            // Step 2: 환경 테스트 시작/다음 단계 버튼 (예시: 테스트 결과에 따라 활성화/비활성화 로직 추가 가능)
            return (
                <>
                <button 
                    className="mock-settings__submit-btn"
                    onClick={handleNextStep}
                    // disabled={!isTestSuccessful} // 테스트 성공 여부에 따라 비활성화 가능
                >
                   이전으로
                    <img src={ic_chevron_right_gray700_24} alt="" />
                </button>
                <button 
                    className="mock-settings__submit-btn"
                    onClick={handleNextStep}
                    // disabled={!isTestSuccessful} // 테스트 성공 여부에 따라 비활성화 가능
                >
                   모의면접 시작하기
                    <img src={ic_chevron_right_gray700_24} alt="" />
                </button>  
                </>
              
            );
        case 3:
            // Step 3: 면접 시작 버튼 (가장 중요한 버튼)
            return (
                <button 
                    className="mock-settings__submit-btn mock-settings__submit-btn--start"
                    onClick={handleNextStep} // handleNextStep은 이제 면접 시작 로직을 실행
                >
                    면접 시작
                    <img src={ic_chevron_right_gray700_24} alt="" />
                </button>
            );
        default:
            return null;
    }
};

    // 현재 activeStep에 따라 다른 UI를 렌더링
    const renderStepContent = () => {
        // Step 1에 필요한 props를 객체로 묶어 전달합니다.
        const step1Props = {
            selectedResume, onResumeChange: setSelectedResume,
            desiredJob, onDesiredJobChange: setDesiredJob,
            jobPostingUrl, onJobPostingUrlChange: setJobPostingUrl,
            questions, onQuestionsChange: setQuestions,
        };

        switch (activeStep) {
            case 1:
                // Step 1: 면접 정보 설정 + 질문 설정
                return (
                    <>
                        <InterviewInfoSection {...step1Props} />
                        <QuestionSettingsSection {...step1Props} />
                    </>
                );
            case 2:
                // Step 2: 환경 테스트
                // MockEnvironmentPage는 자체 상태를 가질 가능성이 높아 props를 따로 전달하지 않습니다.
                return <></>
            case 3:
                // Step 3: 면접 시작 최종 확인 화면
                return (
                    <div className="mock-settings__step-final">
                        <h2>모든 설정이 완료되었습니다.</h2>
                        <p>하단 '면접 시작' 버튼을 눌러 실전 모의면접을 시작하세요.</p>
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="mock-settings-page">
            {/* onStepChange prop은 사이드바에서 클릭 이벤트가 제거되었으므로, activeStep만 전달해도 무방합니다. */}
            <SettingsSidebar activeStep={activeStep} onStepChange={setActiveStep} />
            <div className={`mock-settings__content mock-settings--step-${activeStep}`}>
                <div className="mock-settings__content-inner">
                    <InterviewInfoSection {...step1Props} />
                    <QuestionSettingsSection {...step1Props} />
                </div>
                
                
                <div className={`mock-settings__submit-btn-container step-${activeStep}`}>
                <button 
                    className="mock-settings__submit-btn"
                    onClick={handleNextStep}
                >
                    다음 단계
                    <img src={ic_chevron_right_gray700_24} alt="" />
                </button>
                {/* {renderSubmitButton()} */}
                </div>
            </div>
            <SettingsPanel activeStep={activeStep} />

            {/* 중단 확인 모달 */}
            <Modal
                open={showConfirm}
                title="모의면접을 중단하시겠습니까?"
                desc={
                    <>
                        해당 모의면접에 사용된 이용권은 차감되지 않으며,<br/>
                        [모의면접 - 모의면접 내역] 페이지에서 이어서 진행할 수 있습니다.
                    </>
                }
                confirmText="나가기"
                confirmClassName="btn_w_full default_btn_red radius"
                cancelText="취소"
                cancelClassName="btn_w_full default_btn_gray radius"
                onConfirm={()=>{}} 
                onClose={handleCloseConfirm}
            />
        </div>
    );
}