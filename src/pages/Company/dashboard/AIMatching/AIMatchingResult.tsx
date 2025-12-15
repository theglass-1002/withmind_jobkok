import React from 'react'
import {useNavigate } from "react-router-dom";
import ic_close_gray500_24 from "@/assets/icons/size24/ic_close_gray500_24.png";
import ic_arrow_up_right_gray900_20 from "@/assets/icons/size20/ic_arrow_up_right_gray900_20.png";

export default function AIMatchingResult() {
    const navigate = useNavigate();
  return (
   <>
    {/* 1. AI 공고 진단 분석 섹션 */}
    <div className="diagnosis-box">
        
        {/* 진단 박스 헤더 */}
        <div className="diagnosis-box__header">
            <span className="diagnosis-box__title">AI 공고 진단 분석</span>
            <img 
              src={ic_close_gray500_24} 
              alt="닫기" 
              className="diagnosis-box__close-btn" 
            />
        </div>
        
        {/* 진단 항목 1: 연봉 수준 */}
        <div className="diagnosis-box__item">
            <div className="diagnosis-box__item-summary">
                <span className="diagnosis-box__item-label">연봉 수준</span>
                <span className="diagnosis-box__item-status diagnosis-box__item-status--low">낮음</span>
            </div>
            <span className="diagnosis-box__item-detail">업계 평균(3,500만원)보다 낮습니다.</span>
        </div>
        
        {/* 진단 항목 2: 모호한 표현 */}
        <div className="diagnosis-box__item">
            <div className="diagnosis-box__item-summary">
                <span className="diagnosis-box__item-label">모호한 표현 </span>
                <span className="diagnosis-box__item-status diagnosis-box__item-status--warn">개선 필요</span>
            </div>
            <span className="diagnosis-box__item-detail">“책임감 강한 인재” 명확한 역량 기재를 추천합니다.</span>
        </div>
        
        {/* 진단 항목 3: 부적절한 내용 */}
        <div className="diagnosis-box__item">
            <div className="diagnosis-box__item-summary">
                <span className="diagnosis-box__item-label">부적절한 내용 </span>
                <span className="diagnosis-box__item-status diagnosis-box__item-status--error">감지됨</span>
            </div>
            <span className="diagnosis-box__item-detail">“남성 지원자 우대” 차별 요소로 수정 권장, 제목 “경력 3년 이상”, 내용 “신입 가능” 모순으로 허위구인 공고로 의심될 소지가 있습니다.</span>
        </div>
    </div>

    {/* 2. AI 매칭 인재 목록/테이블 섹션 */}
    <div className="talent-list">
        
        {/* 목록/테이블 헤더 */}
        <div className="talent-list__header talent-list__row">
            <div className="talent-list__col talent-list__col--name"><span>이름</span></div>
            <div className="talent-list__col talent-list__col--info"><span>정보</span></div>
            <div className="talent-list__col talent-list__col--ai-status"><span>AI 면접</span></div>
            <div className="talent-list__col talent-list__col--rate"><span>적합률</span></div>
            <div className="talent-list__col talent-list__col--date"><span>등록일</span></div>
            <div className="talent-list__col talent-list__col--action"><span></span></div>
        </div>
        
        <div className="talent-list__item talent-list__row">
            <div className="talent-list__col talent-list__col--name"><span>정유리</span></div>
            
            <div className="talent-list__col talent-list__col--info">
                <span className="talent-list__summary">30대 초반ㆍ경력 5년 8개월</span>
                <div className="talent-list__detail-item">
                    <span className="talent-list__detail-label">학력 사항</span>
                    <span className="talent-list__detail-value">서울대학교 컴퓨터공학과</span>
                </div>
                
                <div className="talent-list__detail-item">
                    <span className="talent-list__detail-label">희망 직무</span>
                    <span className="talent-list__detail-value">웹 개발, 기술 기획, 웹 기획, UX 디자인</span>
                </div>
            </div>
            
            <div className="talent-list__col talent-list__col--ai-status">
                <span className="talent-list__status-text on">공개</span></div>
            <div className="talent-list__col talent-list__col--rate"><span className="talent-list__rate-value">92%</span></div>
            <div className="talent-list__col talent-list__col--date"><span className="talent-list__date-value">2025.02.10</span></div>
            <div className="talent-list__col talent-list__col--action">
             <button className='default_btn_white'
             onClick={()=>{navigate('/company/ai-matching/report')}}
             >자세히 보기 <img src={ic_arrow_up_right_gray900_20} alt="" /></button>
            </div>
        </div>
        <div className="talent-list__item talent-list__row">
            <div className="talent-list__col talent-list__col--name"><span>이택진</span></div>
            
            <div className="talent-list__col talent-list__col--info">
                <span className="talent-list__summary">30대 초반ㆍ경력 5년 8개월</span>
                <div className="talent-list__detail-item">
                    <span className="talent-list__detail-label">학력 사항</span>
                    <span className="talent-list__detail-value">서울대학교 컴퓨터공학과</span>
                </div>
                
                <div className="talent-list__detail-item">
                    <span className="talent-list__detail-label">희망 직무</span>
                    <span className="talent-list__detail-value">웹 개발, 기술 기획, 웹 기획, UX 디자인</span>
                </div>
            </div>
            
            <div className="talent-list__col talent-list__col--ai-status">
            <span className="talent-list__status-text on">공개</span></div>
            <div className="talent-list__col talent-list__col--rate"><span className="talent-list__rate-value">92%</span></div>
            <div className="talent-list__col talent-list__col--date"><span className="talent-list__date-value">2025.02.10</span></div>
            <div className="talent-list__col talent-list__col--action">
             <button className='default_btn_white'
             onClick={()=>{navigate('/company/ai-matching/report')}}
             >자세히 보기 <img src={ic_arrow_up_right_gray900_20} alt="" /></button>
            </div>
        </div>
        <div className="talent-list__item talent-list__row">
            <div className="talent-list__col talent-list__col--name"><span>임서하</span></div>
            
            <div className="talent-list__col talent-list__col--info">
                <span className="talent-list__summary">30대 초반ㆍ경력 5년 8개월</span>
                <div className="talent-list__detail-item">
                    <span className="talent-list__detail-label">학력 사항</span>
                    <span className="talent-list__detail-value">서울대학교 컴퓨터공학과</span>
                </div>
                
                <div className="talent-list__detail-item">
                    <span className="talent-list__detail-label">희망 직무</span>
                    <span className="talent-list__detail-value">웹 개발, 기술 기획, 웹 기획, UX 디자인</span>
                </div>
            </div>
            
            <div className="talent-list__col talent-list__col--ai-status">
            <span className="talent-list__status-text on">공개</span></div>
            <div className="talent-list__col talent-list__col--rate"><span className="talent-list__rate-value">92%</span></div>
            <div className="talent-list__col talent-list__col--date"><span className="talent-list__date-value">2025.02.10</span></div>
            <div className="talent-list__col talent-list__col--action">
             <button className='default_btn_white'
             onClick={()=>{navigate('/company/ai-matching/report')}}
             >자세히 보기 <img src={ic_arrow_up_right_gray900_20} alt="" /></button>
            </div>
        </div>
    
    </div>
    </>
  )
}