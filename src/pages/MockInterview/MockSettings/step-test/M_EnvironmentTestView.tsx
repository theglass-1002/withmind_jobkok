// M_EnvironmentTestView.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayoutContext } from '@/app/LayoutContext';
import SettingsSidebar from '@/pages/MockInterview/MockSettings/components/SettingsSidebar';
import SettingsPanel from '@/pages/MockInterview/MockSettings/components/SettingsPanel';
import TestIntro from './components/TestIntro';
import M_CameraTest from './components/M_CameraTest';
import "./EnvironmentTestView.css";
import ic_chevron_left_gray900_24 from "@/assets/icons/size24/ic_chevron_left_gray900_24.png";
import ic_chevron_right_gray700_24 from "@/assets/icons/size24/ic_chevron_right_gray700_24.png";
import ic_mic_white_24x32 from "@/assets/icons/size24/ic_mic_white_24x32.png";
import Modal from "@/shared/components/modal/Modal";




export default function M_EnvironmentTestView() {
    const { actionType, resetAction } = useLayoutContext();
    const [activeStep, setActiveStep] = useState(2);
    const [showSettingsPanel, setShowSettingsPanel] = useState(false); 
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const [testStep, setTestStep] = useState<'intro' | 'camera1' | 'camera2' | 'complete' | 'failed'>('intro');
    const [showDialog, setShowDialog] = useState(true);


    useEffect(() => {
        console.log(actionType);
        console.log('dpd');
        console.log(showSettingsPanel);
        if (!actionType) return;   
        if (actionType === "view_status") {
             setShowSettingsPanel(true);
        } else if (actionType === "exit") {
            setShowConfirm(true);
        }   
        resetAction?.();
    }, [actionType]);

    const handleExitRequest = () => {
        console.log('닫기');
        setShowSettingsPanel(false);
    };

    const handleStartTest = () => {
        console.log('받음 클릭');
        setShowDialog(false);
        setTestStep('camera1');
    };


    const handleCloseConfirm = () => setShowConfirm(false);
    const handleConfirmExit = () => {
        setShowConfirm(false);
        navigate('/'); // 원하는 경로로 이동
      };
    

    return (
        <>
        <div className="mock-settings-page mobile environment">
        {showSettingsPanel && <SettingsPanel activeStep={activeStep} onExit={handleExitRequest} />}
         
            
            <div className="mock-settings__content">
                <div className="mock-settings__content-inner">
                    {testStep === 'intro' && (
                        <>
                        <div className="mock-settings__submit-btn-container">
                        <span className='camera-test__mic-button-wrapper'>
                        <img src={ic_mic_white_24x32} alt="마이크" className="camera-test__mic-icon" />
                        </span>
                         </div>   
                        </>
                    )}
                   {testStep === 'camera1' && <M_CameraTest testType="camera" onNext={() => setTestStep('camera2')} onFail={() => setTestStep('failed')} />}
                </div>
              
            </div>
           
              
            {showDialog && testStep === 'intro' && (
                <>
                    <div className="env-test-overlay"></div>
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
        </>
    );
}