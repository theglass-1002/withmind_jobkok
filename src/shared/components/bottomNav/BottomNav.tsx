import React from 'react'
import { NavLink, useLocation } from "react-router-dom"; // NavLink와 useLocation 추가
import "./BottomNav.css";

// Gray 900 (활성화 상태) 아이콘
import ic_home_gray900_24 from "@/assets/icons/size24/ic_home_gray900_24.png";
import ic_work_gray900_24 from "@/assets/icons/size24/ic_work_gray900_24.png";
import ic_draft_gray900_24 from "@/assets/icons/size24/ic_draft_gray900_24.png";
import ic_mock_interview_gray900_24 from "@/assets/icons/size24/ic_mock_interview_gray900_24.png";
import ic_account_circle_gray900_24 from "@/assets/icons/size24/ic_account_circle_gray900_24.png";

// Gray 400 (비활성화 상태) 아이콘
import ic_home_gray400_24 from "@/assets/icons/size24/ic_home_gray400_24.png";
import ic_work_gray400_24 from "@/assets/icons/size24/ic_work_gray400_24.png";
import ic_draft_gray400_24 from "@/assets/icons/size24/ic_draft_gray400_24.png";
import ic_mock_interview_gray400_24 from "@/assets/icons/size24/ic_mock_interview_gray400_24.png";
import ic_account_circle_gray400_24 from "@/assets/icons/size24/ic_account_circle_gray400_24.png";

// 네비게이션 항목 데이터 정의
const NAV_ITEMS = [
    {
        label: '홈',
        path: '/', // 홈 경로는 보통 '/'
        iconInactive: ic_home_gray400_24,
        iconActive: ic_home_gray900_24,
    },
    {
        label: '채용 공고',
        path: '/jobs', 
        iconInactive: ic_work_gray400_24,
        iconActive: ic_work_gray900_24,
    },
    {
        label: '이력서',
        path: '/resumes', 
        iconInactive: ic_draft_gray400_24,
        iconActive: ic_draft_gray900_24,
    },
    {
        label: '모의면접',
        path: '/mock-interview-report', // Navbar 예시에서 가져온 경로
        iconInactive: ic_mock_interview_gray400_24,
        iconActive: ic_mock_interview_gray900_24,
    },
    {
        label: 'MY',
        path: '/mypage', 
        iconInactive: ic_account_circle_gray400_24,
        iconActive: ic_account_circle_gray900_24,
    },
];

export default function BottomNav() {
    const location = useLocation();

    return (
        <div className="bottom-nav-container">
            <div className="bottom-nav-bar">
                
                {NAV_ITEMS.map((item) => {
                    // NavLink를 사용하여 활성화 상태를 확인하고 경로 이동을 처리합니다.
                    // to={`/경로명`}으로 설정하며, 끝에 슬래시(/) 유무에 유의해야 합니다.
                    const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '');

                    return (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive: navLinkIsActive }) => 
                                `bottom-nav-bar__item ${navLinkIsActive ? 'on' : ''}`
                            }
                            // NavLink의 isActive prop을 사용하여 렌더링을 처리해도 되지만, 
                            // 여기서는 location.pathname을 사용하여 명시적으로 아이콘을 선택합니다.
                        >
                            <img 
                                src={isActive ? item.iconActive : item.iconInactive} 
                                alt={`${item.label} 아이콘`} 
                                className="bottom-nav-bar__icon"
                            />
                            <span className="bottom-nav-bar__label">{item.label}</span>
                        </NavLink>
                    );
                })}
                
            </div>
        </div>
    );
}