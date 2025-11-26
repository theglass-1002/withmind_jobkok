// components/SettingsPanel.tsx
import React from 'react';
import ic_logout_white_24 from "@/assets/icons/size24/ic_logout_white_24.png";
import ic_close_white_24 from "@/assets/icons/size24/ic_close_white_24.png";




type SettingsPanelProps = {
    activeStep?: number;
    onExit?: () => void; 
  };
  
export default function SettingsPanel({ activeStep,onExit}: SettingsPanelProps) {


    const getPanelContent = () => {
        switch (activeStep) {
            case 1:
                return {
                    info: '모의면접 설정을 완료해 주세요.',
                    stage: '환경 테스트를 완료해 주세요.'
                };
            case 2:
                return {
                    info: '환경 테스트 진행 중',
                    stage: '모의면접을 시작해 주세요.'
                };
            case 3:
                return {
                    info: '모의면접 진행 중',
                    stage: '면접을 완료해 주세요.'
                };
            default:
                return {
                    info: '설정을 완료해 주세요',
                    stage: '환경 테스트를 완료해 주세요.'
                };
        }
    };

    const content = getPanelContent();

    return (
        <>
        <div className="mock-settings__panel">
            <div className="mock-settings__panel-section">
                <span className="mock-settings__panel-section-title">면접 정보</span>
                <div className="mock-settings__panel-section-description">
                    {content.info}
                </div>
            </div>
            <div className="mock-settings__panel-section">
                <span className="mock-settings__panel-section-title">면접 단계</span>
                <div className="mock-settings__panel-section-description">
                    {content.stage}
                </div>
            </div>
            <span className='mock-settings__submit-btn-container'>
            <button className="mock-settings__exit-btn" onClick={onExit}>
                <img src={ic_logout_white_24} alt="" />
                   나가기             
                    </button>
                </span>
        </div>
        <div className="mock-settings__panel mobile">
            <div className="mock-settings__panel-section">
            <div className="mock-settings__panel-header">
            <img onClick={onExit} className='mock-settings_header_icon' src={ic_close_white_24} alt="" />
             <span className='mock-settings__panel-section-title'>면접 진행 현황</span>
            </div>
                <span className="mock-settings__panel-section-title">면접 정보</span>
                <div className="mock-settings__panel-section-description">
                    {content.info}
                </div>
            </div>
            <div className="mock-settings__panel-section">
                <span className="mock-settings__panel-section-title">면접 단계</span>
                <div className="mock-settings__panel-section-description">
                    {content.stage}
                </div>
            </div>
        </div>
        </>
        
    );
}