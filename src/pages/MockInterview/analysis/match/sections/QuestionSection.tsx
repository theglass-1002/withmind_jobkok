import React from "react";
import ic_light_bulb_24 from "@/assets/icons/size24/ic_light_bulb_24.png";
import ic_error_gray500_20 from "@/assets/icons/size20/ic_error_gray500_20.png";


export default function QuestionSection() {
    return (
        <div className="report-section report-section--question">
          <span className="report-section__title">
            <img src={ic_light_bulb_24} alt="Magnifier Icon" className="analysis__icon" />
            이력서 기반 예상 질문
          </span>
          
          <div className="question-analysis__container">
            
       
          <div className="analysis-table__header">
            <span className="analysis-table__col-title">질문 구분</span>
            <span className="analysis-table__col-title">질문</span>
         </div>

            <div className="analysis-table__row">
                <div className="analysis-table__cell analysis-table__cell--label">
                    학력ㆍ전공
                </div> 
                
                <div className="analysis-table__cell analysis-table__cell--content">
                    <div className="content__item-wrapper">
                        <span className="item__label">학력</span>
                        <span className="item__text">팀 프로젝트에서 의견이 서로 다를 때 어떻게 소통하고 문제를 해결하셨나요?</span>
                    </div>  
                    <div className="content__item-wrapper">
                        <span className="item__label">전공</span>
                        <span className="item__text">다양한 팀 구성원(예: 개발자, 디자이너 등)과 협업할 때 각기 다른 요구사항을 어떻게 조율하셨나요?</span>
                    </div>  
                    <div className="content__item-wrapper">
                        <span className="item__label">전공</span>
                        <span className="item__text">상대방에게 자신의 의견을 설득해야 했던 경험을 말씀해 주세요. 어떻게 효과적으로 전달하셨나요?</span>
                    </div>   
                </div>
            </div>
            <div className="analysis-table__row">
                <div className="analysis-table__cell analysis-table__cell--label">
                경력
                <br />
                ㆍ<br />
                프로젝트 경험
                </div> 
                <div className="analysis-table__cell analysis-table__cell--content">
                    <div className="content__item-wrapper">
                        <span className="item__label">협업 커뮤니케이션</span>
                        <span className="item__text">프로젝트를 이끌면서 어려움을 겪었던 상황이 있다면 무엇이었고, 어떻게 해결하셨나요?</span>
                    </div>  
                    <div className="content__item-wrapper">
                        <span className="item__label">기술 스킬</span>
                        <span className="item__text">리더 역할을 맡았을 때, 주도권을 효과적으로 발휘하지 못한 사례가 있다면 어떻게 개선하고 싶으신가요?</span>
                    </div>  
                    <div className="content__item-wrapper">
                        <span className="item__label">성과-기여도</span>
                        <span className="item__text">리더 역할을 맡았을 때, 주도권을 효과적으로 발휘하지 못한 사례가 있다면 어떻게 개선하고 싶으신가요?</span>
                    </div>   
                </div>
            </div>
            <div className="analysis-table__row">
                <div className="analysis-table__cell analysis-table__cell--label">
                직무 역량
                <br />
                    ㆍ
                    <br />
                    기술 스킬
                </div> 
                <div className="analysis-table__cell analysis-table__cell--content">
                    <div className="content__item-wrapper">
                        <span className="item__label">문제 해결 및 응용</span>
                        <span className="item__text">프로젝트를 이끌면서 어려움을 겪었던 상황이 있다면 무엇이었고, 어떻게 해결하셨나요?</span>
                    </div>  
                    <div className="content__item-wrapper">
                        <span className="item__label">도구 활용</span>
                        <span className="item__text">리더 역할을 맡았을 때, 주도권을 효과적으로 발휘하지 못한 사례가 있다면 어떻게 개선하고 싶으신가요?</span>
                    </div>  
                    <div className="content__item-wrapper">
                        <span className="item__label">실무 적용 능력</span>
                        <span className="item__text">리더 역할을 맡았을 때, 주도권을 효과적으로 발휘하지 못한 사례가 있다면 어떻게 개선하고 싶으신가요?</span>
                    </div>   
                </div>
            </div>
        
            <div className="analysis-table__row">
                <div className="analysis-table__cell analysis-table__cell--label">
                일관성
                </div> 
                <div className="analysis-table__cell analysis-table__cell--content">
                    <div className="content__item-wrapper">
                        <span className="item__label">일관성</span>
                        <span className="item__text">프로젝트를 이끌면서 어려움을 겪었던 상황이 있다면 무엇이었고, 어떻게 해결하셨나요?</span>
                    </div>  
                </div>
            </div>
           
            <div className="analysis-table__row">
                <div className="analysis-table__cell analysis-table__cell--label">
                    학력ㆍ전공
                </div> 
                
                <div className="analysis-table__cell analysis-table__cell--content">
                    <div className="content__item-wrapper">
                        <span className="item__label">학력</span>
                        <span className="item__text">팀 프로젝트에서 의견이 서로 다를 때 어떻게 소통하고 문제를 해결하셨나요?</span>
                    </div>  
                    <div className="content__item-wrapper">
                        <span className="item__label">전공</span>
                        <span className="item__text">다양한 팀 구성원(예: 개발자, 디자이너 등)과 협업할 때 각기 다른 요구사항을 어떻게 조율하셨나요?</span>
                    </div>  
                    <div className="content__item-wrapper">
                        <span className="item__label">전공</span>
                        <span className="item__text">상대방에게 자신의 의견을 설득해야 했던 경험을 말씀해 주세요. 어떻게 효과적으로 전달하셨나요?</span>
                    </div>   
                </div>
            </div>
            <div className="analysis-table__row">
                <div className="analysis-table__cell analysis-table__cell--label">
                경력
                <br />
                ㆍ<br />
                프로젝트 경험
                </div> 
                <div className="analysis-table__cell analysis-table__cell--content">
                    <div className="content__item-wrapper">
                        <span className="item__label">협업 커뮤니케이션</span>
                        <span className="item__text">프로젝트를 이끌면서 어려움을 겪었던 상황이 있다면 무엇이었고, 어떻게 해결하셨나요?</span>
                    </div>  
                    <div className="content__item-wrapper">
                        <span className="item__label">기술 스킬</span>
                        <span className="item__text">리더 역할을 맡았을 때, 주도권을 효과적으로 발휘하지 못한 사례가 있다면 어떻게 개선하고 싶으신가요?</span>
                    </div>  
                    <div className="content__item-wrapper">
                        <span className="item__label">성과-기여도</span>
                        <span className="item__text">리더 역할을 맡았을 때, 주도권을 효과적으로 발휘하지 못한 사례가 있다면 어떻게 개선하고 싶으신가요?</span>
                    </div>   
                </div>
            </div>
            <div className="analysis-table__row">
                <div className="analysis-table__cell analysis-table__cell--label">
                직무 역량
                <br />
                    ㆍ
                    <br />
                    기술 스킬
                </div> 
                <div className="analysis-table__cell analysis-table__cell--content">
                    <div className="content__item-wrapper">
                        <span className="item__label">문제 해결 및 응용</span>
                        <span className="item__text">프로젝트를 이끌면서 어려움을 겪었던 상황이 있다면 무엇이었고, 어떻게 해결하셨나요?</span>
                    </div>  
                    <div className="content__item-wrapper">
                        <span className="item__label">도구 활용</span>
                        <span className="item__text">리더 역할을 맡았을 때, 주도권을 효과적으로 발휘하지 못한 사례가 있다면 어떻게 개선하고 싶으신가요?</span>
                    </div>  
                    <div className="content__item-wrapper">
                        <span className="item__label">실무 적용 능력</span>
                        <span className="item__text">리더 역할을 맡았을 때, 주도권을 효과적으로 발휘하지 못한 사례가 있다면 어떻게 개선하고 싶으신가요?</span>
                    </div>   
                </div>
            </div>
        
            <div className="analysis-table__row">
                <div className="analysis-table__cell analysis-table__cell--label">
                일관성
                </div> 
                <div className="analysis-table__cell analysis-table__cell--content">
                    <div className="content__item-wrapper">
                        <span className="item__label">일관성</span>
                        <span className="item__text">프로젝트를 이끌면서 어려움을 겪었던 상황이 있다면 무엇이었고, 어떻게 해결하셨나요?</span>
                    </div>  
                </div>
            </div>
        </div>
          
        
          <div className="analysis__note">
            <img src={ic_error_gray500_20} alt="Error Icon" className="note__icon" />
            이력서에 작성된 경력과 희망 직무를 기반으로, 실제 면접에서 자주 물어볼 수 있는 예상 질문입니다.
          </div>
        </div>
    );
  }