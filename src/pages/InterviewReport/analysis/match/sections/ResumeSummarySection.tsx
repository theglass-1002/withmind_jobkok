import React from "react";
import ic_check_mark_24 from "@/assets/icons/size24/ic_check_mark_24.png";
import ic_tooltip_gray600_20 from "@/assets/icons/size20/ic_tooltip_gray600_20.png";



export default function ResumeSummarySection() {
    return (
        <div className="report-section report-section--sum">
          <span className="report-section__title">
            <img src={ic_check_mark_24} alt="" />
            이력서 종합 평가</span>
          <div className="summary__content">
         
            <span className="summary__key-takeaway">
              면접 응답에서 드러난 강점을 이력서에 반영하고, 성과 중심으로 내용을 재구성하면 보다 설득력 있는 이력서를 완성할 수 있습니다.
            </span>
            
          
            <div className="summary__detail-container">
              <span className="summary__detail-title">
                <img src={ic_tooltip_gray600_20} alt="" />
                해설</span>
              <span className="summary__detail-text">
                홍길동님 이력서는 전반적으로 지원 직무에 대한 경험과 이해도가 잘 드러나 있으며, 다양한 프로젝트 참여 경험은 차별화된 강점으로 보입니다.
                다만 경력 기술에서 성과 지표(매출 증가율, 사용률 향상 등)가 부족해 설득력이 약해질 수 있습니다. 구체적인 수치와 성과 중심의 서술을 보강한다면, 이력서는 보다 설득력 있고 전문적인 인상을 줄 수 있을 것입니다. 특히 문제 해결력, 협업 경험, 프로젝트 리딩과 관련한 서술은 면접 응답과도 높은 일치도를 보였습니다. 
                그러나 다음과 같은 보완 지점도 발견되었습니다:
                이력서에 명시되지 않은 강점이 응답에서 드러남 → 갈등 조정, 고객 응대 경험, 커뮤니케이션 리더십
                성과 중심 표현의 부족 → 단순 참여 → 수치 기반 결과 강조로 보완 가능
                직무 필수 키워드 누락 → 유사 이력서 대비 ‘기획’, ‘운영 최적화’, ‘사용자 분석’ 등 언급 부족
              </span>
            </div>
          </div>
        </div>
    );
  }