// components/QuestionSettingsSection.tsx
import React from 'react';
import QuestionItem from './QuestionItem';

type Question = {
    id: number;
    isAiGenerated: boolean;
    customText: string;
};

type QuestionSettingsSectionProps = {
    questions: Question[];
    onQuestionsChange: (questions: Question[]) => void;
};

export default function QuestionSettingsSection({ 
    questions, 
    onQuestionsChange 
}: QuestionSettingsSectionProps) {
    
    const handleToggleAi = (questionId: number) => {
        const updatedQuestions = questions.map(q => 
            q.id === questionId 
                ? { ...q, isAiGenerated: !q.isAiGenerated }
                : q
        );
        onQuestionsChange(updatedQuestions);
    };

    const handleCustomTextChange = (questionId: number, text: string) => {
        const updatedQuestions = questions.map(q =>
            q.id === questionId
                ? { ...q, customText: text }
                : q
        );
        onQuestionsChange(updatedQuestions);
    };

    return (
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
                    <QuestionItem
                        key={question.id}
                        question={question}
                        onToggle={handleToggleAi}
                        onTextChange={handleCustomTextChange}
                    />
                ))}
            </div>
        </div>
    );
}