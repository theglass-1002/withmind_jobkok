import React from "react";
import ic_magnifier_24 from "@/assets/icons/size24/ic_magnifier_24.png";
import ic_error_gray500_20 from "@/assets/icons/size20/ic_error_gray500_20.png";


export default function MatchAnalysisSection() {
    return (
        <div className="report-section report-section--match">
          <span className="report-section__title">
            <img src={ic_magnifier_24} alt="Magnifier Icon" className="analysis__icon" />
            일치도 분석가
          </span>
          
          <div className="match-analysis__container">
            
       
          <div className="analysis-table__header">
            <span className="analysis-table__col-title analysis-table__col-title--empty"></span>
            <span className="analysis-table__col-title">일치도</span>
            <span className="analysis-table__col-title">평가</span>
            <span className="analysis-table__col-title analysis-table__col-title--detail">세부 분석</span>
         </div>

         <div className="analysis-table__row">
              <div className="analysis-table__cell analysis-table__cell--label">
                  <span className="analysis-table__cell-title">전체 응답 대비 일치도</span>
                  <span className="analysis-table__cell-subtitle">응답 내용이 이력서 기반 직무 설명과 일치하는 정도</span>
              </div>
              <div className="analysis-table__cell analysis-table__cell--data">88%</div>
              <div className="analysis-table__cell analysis-table__cell--grade">
               <span className="analysis-table__cell--grade-excellent">
               우수
               </span>
                </div>
              <div className="analysis-table__cell analysis-table__cell--detail">응답의 대부분이 이력서에서 주장한 역량과 밀접하게 연결되어 있어 신뢰도를 높입니다.</div>
          </div>

          <div className="analysis-table__row">
              <div className="analysis-table__cell analysis-table__cell--label">
                  <span className="analysis-table__cell-title">직무 역량 키워드 일치도</span>
                  <span className="analysis-table__cell-subtitle">응답 내용이 이력서 기반 직무 설명과 일치하는 정도</span>
              </div>
              <div className="analysis-table__cell analysis-table__cell--data">82%</div>
              <div className="analysis-table__cell analysis-table__cell--grade">
                <span className="analysis-table__cell--grade-average">보통</span>
                </div>
              <div className="analysis-table__cell analysis-table__cell--detail">응답의 대부분이 이력서에서 주장한 역량과 밀접하게 연결되어 있어 신뢰도를 높입니다.</div>
          </div>

          <div className="analysis-table__row">
              <div className="analysis-table__cell analysis-table__cell--label">
                  <span className="analysis-table__cell-title">경험 기반 일치도</span>
                  <span className="analysis-table__cell-subtitle">이력서의 에피소드가 실제 응답에 재현되거나
                  연계 설명된 비율</span>
              </div>
              <div className="analysis-table__cell analysis-table__cell--data">82%</div>
              <div className="analysis-table__cell analysis-table__cell--grade">
                <span className="analysis-table__cell--grade-average">보통</span>
                </div>
              <div className="analysis-table__cell analysis-table__cell--detail">응답의 대부분이 이력서에서 주장한 역량과 밀접하게 연결되어 있어 신뢰도를 높입니다.</div>
          </div>

          <div className="analysis-table__row">
              <div className="analysis-table__cell analysis-table__cell--label">
                  <span className="analysis-table__cell-title">서술 일관성 및 논리 흐름</span>
                  <span className="analysis-table__cell-subtitle">응답 내용이 이력서에 기반하여 자연스럽고
                  논리적인 흐름으로 이어졌는지 여부</span>
              </div>
              <div className="analysis-table__cell analysis-table__cell--data">82%</div>
              <div className="analysis-table__cell analysis-table__cell--grade">
                <span className="analysis-table__cell--grade-average">보통</span>
                </div>
              <div className="analysis-table__cell analysis-table__cell--detail">응답의 대부분이 이력서에서 주장한 역량과 밀접하게 연결되어 있어 신뢰도를 높입니다.</div>
          </div>


          </div>
          
          {/* 4. 섹션 주석 */}
          <div className="analysis__note">
            <img src={ic_error_gray500_20} alt="Error Icon" className="note__icon" />
            모의면접에서 실제 응답한 내용과 이력서에 작성된 경험 및 역량이 얼마나 일치하는지를 분석한 결과입니다.
          </div>
        </div>
    );
  }