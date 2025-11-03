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
                <span className="analysis-table__col-title analysis-table__col-title--empty"></span> {/* 공백 / 메인 레이블 */}
                <span className="analysis-table__col-title">일치도</span>
                <span className="analysis-table__col-title">평가</span>
                <span className="analysis-table__col-title">세부 분석</span>
            </div>


            <div className="analysis-table__row">
                <div className="table-row__main-label">
                    <span>전체 응답 대비 일치도</span>
                    <span className="table-row__sub-text">응답 내용이 이력서 기반 직무 설명과 일치하는 정도</span>
                </div>
                <div className="table-row__data">88%</div>
                <div className="table-row__grade">우수</div>
                <div className="table-row__detail">응답의 대부분이 이력서에서 주장한 역량과 밀접하게 연결되어 있어 신뢰도를 높입니다.</div>
            </div>

            {/* 3. 기타 분석 목록 (필요시 별도 스타일링) */}
            <div className="match-analysis__item">직무 역량 키워드 일치도</div>
            <div className="match-analysis__item">경험 기반 일치도</div>
            <div className="match-analysis__item">시술 일관성 및 논리 흐름</div>

          </div>
          
          {/* 4. 섹션 주석 */}
          <div className="analysis__note">
            <img src={ic_error_gray500_20} alt="Error Icon" className="note__icon" />
            모의면접에서 실제 응답한 내용과 이력서에 작성된 경험 및 역량이 얼마나 일치하는지를 분석한 결과입니다.
          </div>
        </div>
    );
  }