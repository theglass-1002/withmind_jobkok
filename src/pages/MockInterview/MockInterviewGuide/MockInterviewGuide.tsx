import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./MockInterviewGuide.css";
import Modal from "@/shared/components/modal/Modal";
import { guardMockInterviewPage } from "@/shared/utils/mockInterviewGuard";

export default function MockInterviewGuide() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 페이지 진입 시 이력서 체크
    useEffect(() => {
        guardMockInterviewPage(setIsModalOpen);
    }, []);

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
                   
                        모의면접</span>
                    <span className="guide-content-area__subtitle">이력서 기반의 맞춤형 질문으로 더욱 실전처럼!</span>
                </div>
                <button className="guide-content-area__start-btn" onClick={handleStartClick}>
                    시작하기
                   
                </button>
            </div>

            <Modal
                open={isModalOpen}
                title="이력서가 등록되어 있지 않습니다."
                desc="모의면접을 진행하기 위해 먼저 이력서를 작성해 주세요."
                confirmText="이력서 작성하기"
                cancelText="취소"
                cancelClassName="btn_w_full default_btn_white"
                confirmClassName="btn_w_full default_btn_black"
                onConfirm={() => {
                    setIsModalOpen(false);
                    navigate("/resumes");
                }}
                onClose={() => {
                    setIsModalOpen(false);
                    navigate("/mock-interview-report");
                }}
                showCancel={true}
            />
        </div>
    );
}