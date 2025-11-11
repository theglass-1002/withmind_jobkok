// EnvironmentTestView.tsx
import React, { useState } from 'react';
import SettingsSidebar from '@/pages/MockInterview/MockSettings/components/SettingsSidebar';
import SettingsPanel from '@/pages/MockInterview/MockSettings/components/SettingsPanel';
import TestIntro from './components/TestIntro';
import CameraTest from './components/CameraTest';
import "./EnvironmentTestView.css";


export default function EnvironmentTestView() {
    const [testStep, setTestStep] = useState<'intro' | 'camera1' | 'camera2' | 'complete' | 'failed'>('intro');
    const [showDialog, setShowDialog] = useState(true);

    const handleStartTest = () => {
        setShowDialog(false);
        setTestStep('camera1');
    };

    return (
        <div className="mock-settings-page environment">
            <SettingsSidebar activeStep={2} onStepChange={() => {}} />
            
            <div className="mock-settings__content">
                <div className="mock-settings__content-inner">
                    {testStep === 'intro' && (
                        <></>
                    )}
                   {testStep === 'camera1' && <CameraTest testType="camera" onNext={() => setTestStep('camera2')} onFail={() => setTestStep('failed')} />}
                </div>
                <div className="mock-settings__submit-btn-container">
                    <button className='default_btn_white radius'>이전으로</button>
                    <button className='default_btn_black radius'>모의면접 시작하기</button>
                </div>
            </div>
           
            <SettingsPanel activeStep={2} />

            {showDialog && testStep === 'intro' && (
                <>
                    <div className="env-test-overlay"></div>
                    <div className="env-test-dialog">
                        <TestIntro onStart={handleStartTest} />
                    </div>
                </>
            )}
        </div>
    );
}