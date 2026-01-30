// components/QuestionItem.tsx
import React, { useMemo, useState } from "react";
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
  questions: Question[];
  onToggle: (id: number) => void;
  onTextChange: (id: number, text: string) => void;
};

type BlockReason = { prevId: number; message: string } | null;

export default function QuestionItem({
  question,
  questions,
  onToggle,
  onTextChange,
}: QuestionItemProps) {
  const [blockedMessage, setBlockedMessage] = useState<string>("");

  const getBlockReason = (): BlockReason => {
    const idx = questions.findIndex((q) => q.id === question.id);
    if (idx <= 0) return null;

    for (let i = 0; i < idx; i++) {
      const prev = questions[i];

      if (prev.isAiGenerated) {
        return {
          prevId: prev.id,
          message: `순서대로 작성해 주세요. 먼저 질문 ${prev.id}의 AI 자동 생성을 끄고 작성해야 합니다.`,
        };
      }

      if (!prev.customText.trim()) {
        return {
          prevId: prev.id,
          message: `순서대로 작성해 주세요. 먼저 질문 ${prev.id}를 작성해야 합니다.`,
        };
      }
    }

    return null;
  };

  const isBlockedForCustom = useMemo(() => {
    if (!question.isAiGenerated) return false;
    return getBlockReason() !== null;
  }, [question.isAiGenerated, questions, question.id]);

  const aiDescriptionText = blockedMessage
    ? blockedMessage
    : "AI 자동 생성 질문이 제공됩니다.";

  const handleToggle = () => {
    if (question.isAiGenerated) {
      const reason = getBlockReason();
      if (reason) {
        console.log(reason.message);
        setBlockedMessage(reason.message);
        return;
      }
      setBlockedMessage("");
    } else {
      setBlockedMessage("");
    }

    onToggle(question.id);
  };

  const handleChange = (v: string) => {
    const idx = questions.findIndex((q) => q.id === question.id);
    if (idx < 0) return;

    for (let i = 0; i < idx; i++) {
      const prev = questions[i];

      if (prev.isAiGenerated) {
        const msg = `순서대로 작성해 주세요. 먼저 질문 ${prev.id}의 AI 자동 생성을 끄고 작성해야 합니다.`;
        console.log(msg);
        setBlockedMessage(msg);
        return;
      }

      if (!prev.customText.trim()) {
        const msg = `순서대로 작성해 주세요. 먼저 질문 ${prev.id}를 작성해야 합니다.`;
        console.log(msg);
        setBlockedMessage(msg);
        return;
      }
    }

    setBlockedMessage("");
    onTextChange(question.id, v);
  };

  return (
    <div
      className={`mock-settings__question-item ${
        question.isAiGenerated ? "ai-mode" : "custom-mode"
      }`}
    >
      <div className="mock-settings__question-header">
        <span className="mock-settings__question-label">질문 {question.id}</span>
        <div className="mock-settings__question-control">
          <span
            className={`mock-settings__control-label ${
              question.isAiGenerated ? "active" : ""
            }`}
          >
            <img
              src={question.isAiGenerated ? ic_star_green_20 : ic_star_gray500_20}
              alt=""
            />
            AI 자동 생성
          </span>
          <Switch
            checked={question.isAiGenerated}
            onChange={handleToggle}
            disabled={isBlockedForCustom}
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
        <div className="mock-settings__question-description">{aiDescriptionText}</div>
      ) : (
        <div className="mock-settings__question-input-area">
          <FormInput
            value={question.customText}
            onChange={handleChange}
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
