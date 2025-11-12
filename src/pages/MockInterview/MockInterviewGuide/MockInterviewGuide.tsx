import React from 'react'
import { useNavigate } from 'react-router-dom';
import "./MockInterviewGuide.css";
import ic_star_white_40 from "@/assets/icons/size40/ic_star_white_40.png";
import ic_arrow_right_white_24 from "@/assets/icons/size24/ic_arrow_right_white_24.png";

export default function MockInterviewGuide() {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/mock-interview/instructions');
    };

    return (
        <div className="mock-interview-guide-page">
            <div className="guide-background-deco">
                <span className="guide-background-deco__pattern"></span>  
                <span className="guide-background-deco__pattern"></span>  
                <span className="guide-background-deco__center-align"></span>
            </div>
            <div className="guide-content-area">
                <div className="guide-content-area__header-group">
                    <span className="guide-content-area__title">
                        <img src={ic_star_white_40} alt="" />
                        모의면접</span>
                    <span className="guide-content-area__subtitle">이력서 기반의 맞춤형 질문으로 더욱 실전처럼!</span>
                </div>
                <button className="guide-content-area__start-btn" onClick={handleStartClick}>
                    시작하기
                    <img src={ic_arrow_right_white_24} alt="" />
                </button>
            </div>
        </div>
    );
}