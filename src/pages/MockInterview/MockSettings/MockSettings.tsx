import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./MockSettings.css";

import SettingsSidebar from './components/SettingsSidebar';
import SettingsPanel from './components/SettingsPanel';

import InterviewInfoSection from './step-setup/InterviewInfoSection';
import QuestionSettingsSection from './step-setup/QuestionSettingsSection';

import ic_chevron_right_gray700_24 from "@/assets/icons/size24/ic_chevron_right_gray700_24.png";
import ic_chevron_right_white_24 from "@/assets/icons/size24/ic_chevron_right_white_24.png";
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

    const handleExitRequest = () => setShowConfirm(true);

    const handleConfirmExit = () => {
        setShowConfirm(false);
        navigate('/'); // 원하는 경로로 이동
      };
    

    const handleNextStep = () => {
        navigate('/mock-interview/environment-test');
    };

    const step1Props = {
        selectedResume, onResumeChange: setSelectedResume,
        desiredJob, onDesiredJobChange: setDesiredJob,
        jobPostingUrl, onJobPostingUrlChange: setJobPostingUrl,
        questions, onQuestionsChange: setQuestions,
    };


    return (
        <div className="mock-settings-page">
             <SettingsSidebar activeStep={activeStep} onStepChange={setActiveStep} />
            <div className={`mock-settings__content mock-settings--step-${activeStep}`}>
                <div className="mock-settings__content-inner">
                    <InterviewInfoSection {...step1Props} />
                    <QuestionSettingsSection {...step1Props} />
                </div>
                <div className="mock-settings__submit-btn-container">
                 
                <button className='mock-settings__submit-btn' disabled>    
                        설정 완료
                        <img src={ic_chevron_right_gray700_24} alt="" />
                        </button>
              <button className='mock-settings__submit-btn on' onClick={handleNextStep}>    
                        설정 완료
                        <img src={ic_chevron_right_white_24} alt="" />
                        </button>    
                    </div>           
            </div>
            <SettingsPanel activeStep={activeStep} onExit={handleExitRequest} />

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
                cancelClassName="btn_w_full default_btn_gray_100 radius"
                onConfirm={handleConfirmExit} 
                onClose={handleCloseConfirm}
            />
        </div>
    );
}