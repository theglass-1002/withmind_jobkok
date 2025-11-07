import React from "react";
import ic_light_bulb_24 from "@/assets/icons/size24/ic_light_bulb_24.png";
import ic_error_gray500_20 from "@/assets/icons/size20/ic_error_gray500_20.png";


export default function SuggestionSection() {
    return (
        <div className="report-section report-section--suggest">
          <span className="report-section__title">
            <img src={ic_light_bulb_24} alt="Magnifier Icon" className="analysis__icon" />
            이력서 보완 제안
          </span>
          
          <div className="suggest-analysis__container">
            
       
          <div className="analysis-table__header">
            <span className="analysis-table__col-title">누락된 역량/경험</span>
            <span className="analysis-table__col-title">제안 내용</span>
            <span className="analysis-table__col-title">기대 효과</span>
         </div>

         <div className="analysis-table__row">
              <div className="analysis-table__cell analysis-table__cell--label">
              갈등 해결 및 커뮤니케이션
              </div> 
              <div className="analysis-table__cell">
                <span className="guide__description">협업 중 마찰 상황을 중재하거나 갈등을 해결한 사례를 항목으로 작성</span>
                <span className="guide__example">예: "개발-기획 간 일정 충돌 조율 경험"</span>
                </div>
              <div className="analysis-table__cell">조직 내 커뮤니케이션 능력은 모든 직무에서 중요하게 평가되며, 실제 사례 제시는 설득력 10% 향상</div>
          </div>
          <div className="analysis-table__row">
              <div className="analysis-table__cell analysis-table__cell--label">
              사용자 피드백 기반 개선 경험
              </div> 
              <div className="analysis-table__cell">
                <span className="guide__description">서비스 개선 전/후의 수치 차이 포함</span>
                <span className="guide__example">예: "개발-기획 간 일정 충돌 조율 경험"</span>
                </div>
              <div className="analysis-table__cell">
              데이터 기반 의사결정 및 실행 능력을 보여주는 정량적 사례는 이력서 설득력을 12% 높임
              </div>
          </div>
          <div className="analysis-table__row">
              <div className="analysis-table__cell analysis-table__cell--label">
              직무 관련 도구 활용 사례
              </div> 
              <div className="analysis-table__cell">
                <span className="guide__description">Notion, Jira, GA 등 실제 사용 맥락과 함께 기술</span>
                <span className="guide__example">예: "Jira 기반 태스크 트래킹 및 업무 리포팅 경험"</span>
                </div>
              <div className="analysis-table__cell">도구 나열만 있는 경우 실사용 능력을 파악하기 어려우므로, 맥락 기반 기술 작성으로 설득력 5% 높임</div>
          </div>
          <div className="analysis-table__row">
              <div className="analysis-table__cell analysis-table__cell--label">
              문제 해결 능력
              </div> 
              <div className="analysis-table__cell">
                <span className="guide__description">피드백 수용 이후의 변화 및 개선 결과 기술</span>
                <span className="guide__example">예: "리뷰 지적사항 반영 후 작업 속도 20% 개선"</span>
                </div>
              <div className="analysis-table__cell">성장 가능성과 유연성을 강조할 수 있으며, 신입/주니어에게 특히 중요한 요소로 설득력 11% 향상</div>
          </div>

          </div>
          
          {/* 4. 섹션 주석 */}
          <div className="analysis__note">
            <img src={ic_error_gray500_20} alt="Error Icon" className="note__icon" />
            이력서에는 드러나지 않았지만, 실제 면접 응답에서 강하게 나타난 주요 역량/경험들을 기반으로 추가 기재가 필요한 항목을 제안드립니다.
          </div>
        </div>
    );
  }