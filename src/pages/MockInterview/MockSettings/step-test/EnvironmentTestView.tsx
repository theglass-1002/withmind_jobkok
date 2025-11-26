// EnvironmentTestView.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsSidebar from '@/pages/MockInterview/MockSettings/components/SettingsSidebar';
import SettingsPanel from '@/pages/MockInterview/MockSettings/components/SettingsPanel';
import TestIntro from './components/TestIntro';
import CameraTest from './components/CameraTest';
import "./EnvironmentTestView.css";
import ic_chevron_left_gray900_24 from "@/assets/icons/size24/ic_chevron_left_gray900_24.png";
import ic_chevron_right_gray700_24 from "@/assets/icons/size24/ic_chevron_right_gray700_24.png";




export default function EnvironmentTestView() {
    const navigate = useNavigate();
    const [testStep, setTestStep] = useState<'intro' | 'camera1' | 'camera2' | 'complete' | 'failed'>('intro');
    const [showDialog, setShowDialog] = useState(true);


    const handleExitRequest = () => {
        navigate('/');
    };

    const handleStartTest = () => {
        console.log('받음 클릭');
        setShowDialog(false);
        setTestStep('camera1');
    };

    return (
        <>
        <div className="mock-settings-page environment">
            <SettingsSidebar activeStep={2} onStepChange={() => {}} />
            
            <div className="mock-settings__content">
                <div className="mock-settings__content-inner">
                    {testStep === 'intro' && (
                        <>
                    <div className="mock-settings__submit-btn-container">
                        <button className='default_btn_white radius'>
                            <img src={ic_chevron_left_gray900_24} alt="" />
                            이전으로</button>
                        <button className='default_btn_gray radius' disabled>
                            모의면접 시작하기
                            <img src={ic_chevron_right_gray700_24} alt="" />
                            </button>
                    </div>
                        </>
                    )}
                   {testStep === 'camera1' && <CameraTest testType="camera" onNext={() => setTestStep('camera2')} onFail={() => setTestStep('failed')} />}
                </div>
              
            </div>
           
            <SettingsPanel onExit={handleExitRequest} />

            {showDialog && testStep === 'intro' && (
                <>
                    <div className="env-test-overlay"></div>
                    <div className="env-test-dialog">
                        <TestIntro onStart={handleStartTest} />
                    </div>
                </>
            )}
        </div>
        <div className="mock-settings-page mobile environment">
            {/* <SettingsSidebar activeStep={2} onStepChange={() => {}} /> */}
            
            <div className="mock-settings__content">
                <div className="mock-settings__content-inner">
                    {testStep === 'intro' && (
                        <>
                    <div className="mock-settings__submit-btn-container">
                        <button className='default_btn_white radius'>
                            <img src={ic_chevron_left_gray900_24} alt="" />
                            이전으로</button>
                        <button className='default_btn_gray radius' disabled>
                            모의면접 시작하기
                            <img src={ic_chevron_right_gray700_24} alt="" />
                            </button>
                    </div>
                        </>
                    )}
                   {testStep === 'camera1' && <CameraTest testType="camera" onNext={() => setTestStep('camera2')} onFail={() => setTestStep('failed')} />}
                </div>
              
            </div>
           
            {/* <SettingsPanel onExit={handleExitRequest} /> */}

            {showDialog && testStep === 'intro' && (
                <>
                    <div className="env-test-overlay"></div>
                    <div className="env-test-dialog">
                        <TestIntro onStart={handleStartTest} />
                    </div>
                </>
            )}
            
        </div>

        </>
    );
}