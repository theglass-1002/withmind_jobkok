import React, { useState } from 'react'
import FormField from "@/shared/components/form/FormField";
import FormInput from "@/shared/components/form/FormInput";
import SelectDropdown from "@/shared/components/select-dropdown/SelectDropdown";
import "./MockSettings.css";
import ic_star_white_30 from "@/assets/icons/size30/ic_star_white_30.png";
import ic_star_gray500_20 from "@/assets/icons/size20/ic_star_gray500_20.png";
import ic_star_green_20 from "@/assets/icons/size20/ic_star_green_20.png";
import Switch from "react-switch";

export default function MockSettings() {
    const [selectedResume, setSelectedResume] = useState('');
    const [questions, setQuestions] = useState([
        { id: 1, isAiGenerated: true, customText: '' },
        { id: 2, isAiGenerated: true, customText: '' },
        { id: 3, isAiGenerated: true, customText: '' },
    ]);

    const handleToggleAi = (questionId: number) => {
        setQuestions(prev => 
            prev.map(q => 
                q.id === questionId 
                    ? { ...q, isAiGenerated: !q.isAiGenerated }
                    : q
            )
        );
    };

    const handleCustomTextChange = (questionId: number, text: string) => {
        setQuestions(prev =>
            prev.map(q =>
                q.id === questionId
                    ? { ...q, customText: text }
                    : q
            )
        );
    };

    return (
        <div className="mock-settings-page">
            <div className="mock-settings__sidebar">
                <div className="mock-settings__sidebar-title">
                    <img src={ic_star_white_30} alt="" />
                    모의면접
                </div>
                <div className="mock-settings__sidebar-menu">
                    <div className="mock-settings__menu-item on">
                        <span className="mock-settings__menu-number">01</span>
                        설정
                    </div>
                    <div className="mock-settings__menu-item">
                        <span className='mock-settings__menu-number'>02</span>
                        환경 테스트
                    </div>
                    <div className="mock-settings__menu-item">
                        <span className='mock-settings__menu-number'>03</span>
                        모의면접
                    </div>
                </div>
            </div>
            <div className="mock-settings__content">
                <div className="mock-settings__content-inner">
                    <div className="mock-settings__section">
                        <div className="mock-settings__section-header">
                            <span className="mock-settings__section-title">
                                모의면접 정보 설정 
                                <em className='badge--required_20'>*</em>
                            </span>
                            <p className="mock-settings__section-description">
                                설정한 정보를 기반으로 AI가 맞춤형 면접 질문을 자동 생성합니다.
                            </p>
                        </div>
                        <div className="mock-settings__section-body">
                            <SelectDropdown
                                label="이력서"
                                required
                                placeholder="이력서를 선택해 주세요."
                                options={[
                                    { value: '1', label: '프론트엔드 개발자 이력서' },
                                    { value: '2', label: '백엔드 개발자 이력서' },
                                ]}                                
                                value={selectedResume}
                                onChange={setSelectedResume}
                                className="mock-settings__field"
                            />

                            <FormField label={<>희망 직무 <em>*</em></>} className="in_icon">
                                <FormInput
                                    id='mock-settings__field'
                                    required
                                    value={""}
                                    onChange={(v) => {}}
                                    invalid={false}
                                    placeholder="희망 직무를 입력해 주세요."
                                />
                            </FormField>
                           
                            <FormField label={<>채용 공고 링크(URL)</>} className="in_icon">
                                <FormInput
                                    id='mock-settings__field'
                                    value={""}
                                    onChange={(v) => {}}
                                    invalid={false}
                                    placeholder="https://"
                                />
                                <span className="mock-settings__field-hint">
                                    지원하려는 공고의 URL을 입력하시면, 해당 공고에 맞춘 질문을 구성해 드립니다.
                                </span>
                            </FormField>
                        </div>
                    </div>
                    <div className="mock-settings__section">
                        <div className="mock-settings__section-header">
                            <span className="mock-settings__section-title">질문 설정</span>
                            <span className="mock-settings__section-description">
                                자동 생성된 질문을 사용하거나, 원하는 질문으로 직접 설정할 수 있습니다.
                            </span>
                        </div>
                        <div className="mock-settings__section-notice">
                            <span className="mock-settings__notice-text">
                                ※ 직접 설정하려면 [AI 자동 생성]을 끄고, 원하는 질문을 입력해 주세요.
                            </span>
                            <span className="mock-settings__notice-text">
                                ※ 한글은 공백 포함 80자 이내, 영문은 공백 포함 160자 이내로 작성해 주세요.
                            </span>
                        </div>
                        <div className="mock-settings__question-list">
                            {questions.map((question) => (
                                <div key={question.id} 
                                className={`mock-settings__question-item ${question.isAiGenerated ? 'ai-mode' : 'custom-mode'}`}>
                                    <div className="mock-settings__question-header">
                                        <span className="mock-settings__question-label">질문 {question.id}</span>
                                        <div className="mock-settings__question-control">
                                        <span className={`mock-settings__control-label ${question.isAiGenerated ? 'active' : ''}`}>
                                            <img src={question.isAiGenerated ? ic_star_green_20 : ic_star_gray500_20} alt="" />
                                            AI 자동 생성
                                        </span>
                                            <Switch
                                                checked={question.isAiGenerated}
                                                onChange={() => handleToggleAi(question.id)}
                                                onColor="#15D078"
                                                offColor="#E5E7EB"
                                                onHandleColor="#FFF"
                                                offHandleColor="#FFF"
                                                handleDiameter={18}
                                                height={22}
                                                width={42}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                aria-label="AI 자동 생성"
                                            />
                                        </div>
                                    </div>

                                    {question.isAiGenerated ? (
                                        <div className="mock-settings__question-description">
                                            AI 자동 생성 질문이 제공됩니다.
                                        </div>
                                    ) : (
                                        <div className="mock-settings__question-input-area">
                                            <FormInput
                                                value={question.customText}
                                                onChange={(v) => handleCustomTextChange(question.id, v)}
                                                placeholder="질문을 입력해 주세요."
                                            />
                                            <span className="mock-settings__char-count">
                                                공백 포함 {question.customText.length}자
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button className="mock-settings__submit-btn">설정 완료</button>
            </div>
            <div className="mock-settings__panel">
                <div className="mock-settings__panel-section">
                    <span className="mock-settings__panel-section-title">면접 정보</span>
                    <div className="mock-settings__panel-section-description">설정을 완료해 주세요</div>
                </div>
                <div className="mock-settings__panel-section">
                    <span className="mock-settings__panel-section-title">면접 단계</span>
                    <div className="mock-settings__panel-section-description">환경 테스트를 완료해 주세요.</div>
                </div>
                <button className="mock-settings__exit-btn">나가기</button>
            </div>
        </div>
    );
}