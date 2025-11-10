// components/QuestionItem.tsx
import React from 'react';
import FormInput from "@/shared/components/form/FormInput";
import Switch from "react-switch";
import ic_star_green_20 from "@/assets/icons/size20/ic_star_green_20.png";
import ic_star_gray500_20 from "@/assets/icons/size20/ic_star_gray500_20.png";

type Question = {
    id: number;
    isAiGenerated: boolean;
    customText: string;
};

type QuestionItemProps = {
    question: Question;
    onToggle: (id: number) => void;
    onTextChange: (id: number, text: string) => void;
};

export default function QuestionItem({ question, onToggle, onTextChange }: QuestionItemProps) {
    return (
        <div 
            className={`mock-settings__question-item ${question.isAiGenerated ? 'ai-mode' : 'custom-mode'}`}
        >
            <div className="mock-settings__question-header">
                <span className="mock-settings__question-label">질문 {question.id}</span>
                <div className="mock-settings__question-control">
                    <span className={`mock-settings__control-label ${question.isAiGenerated ? 'active' : ''}`}>
                        <img 
                            src={question.isAiGenerated ? ic_star_green_20 : ic_star_gray500_20} 
                            alt="" 
                        />
                        AI 자동 생성
                    </span>
                    <Switch
                        checked={question.isAiGenerated}
                        onChange={() => onToggle(question.id)}
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
                        onChange={(v) => onTextChange(question.id, v)}
                        placeholder="질문을 입력해 주세요."
                    />
                    <span className="mock-settings__char-count">
                        공백 포함 {question.customText.length}자
                    </span>
                </div>
            )}
        </div>
    );
}
