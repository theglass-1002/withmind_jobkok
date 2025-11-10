// components/SettingsSidebar.tsx
import React from 'react';
import ic_star_white_30 from "@/assets/icons/size30/ic_star_white_30.png";

type SettingsSidebarProps = {
    activeStep: number;
    onStepChange: (step: number) => void;
};

export default function SettingsSidebar({ activeStep, onStepChange }: SettingsSidebarProps) {
    const menuItems = [
        { id: 1, number: '01', label: '설정' },
        { id: 2, number: '02', label: '환경 테스트' },
        { id: 3, number: '03', label: '모의면접' }
    ];

    return (
        <div className="mock-settings__sidebar">
            <div className="mock-settings__sidebar-title">
                <img src={ic_star_white_30} alt="" />
                모의면접
            </div>
            <div className="mock-settings__sidebar-menu">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        // onClick 이벤트 제거됨
                        className={`mock-settings__menu-item ${activeStep === item.id ? 'on' : ''}`}
                        // onClick={() => onStepChange(item.id)}  <- 이 부분이 제거되었습니다.
                    >
                        <span className="mock-settings__menu-number">{item.number}</span>
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
}