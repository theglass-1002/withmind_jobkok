// src/pages/MockInterview/MockInterviewLive/components/LiveThinkingSection.tsx
import React from "react";
import ic_play_arrow_white_24 from "@/assets/icons/size24/ic_play_arrow_white_24.png";
import ic_stop_gray700_24 from "@/assets/icons/size24/ic_stop_gray700_24.png";

type Props = {
  title: string;
  question: string;
  timeLeft: number;
  progress: number;      // 0 ~ 1
  running: boolean;
  onStartAnswer: () => void;   // 답변 시작 전환
  onPauseThinking?: () => void;
  onRestartThinking?: () => void;
};

export default function LiveThinkingSection({
  title,
  question,
  timeLeft,
  progress,
  running,
  onStartAnswer,
  onPauseThinking,
  onRestartThinking,
}: Props) {
  const R = 108;
  const CIRC = 2 * Math.PI * R;

  return (
    <div className="mock-interview-live__main">
      <div className="mock-interview-live__background">
        <div className="mock-interview-live__content">
          <div className="mock-interview-live__question">
            <span className="mock-interview-live__question-title">{title}</span>
            <span className="mock-interview-live__question-text">{question}</span>
          </div>

          <div className="mock-interview-live__thinking-timer">
            <svg className="mock-interview-live__timer-svg" width="240" height="240" viewBox="0 0 240 240">
              <circle className="mock-interview-live__timer-ring-bg" cx="120" cy="120" r={R} />
              <circle
                className="mock-interview-live__timer-ring-fill"
                cx="120"
                cy="120"
                r={R}
                style={{ strokeDasharray: `${CIRC}px`, strokeDashoffset: `${(1 - progress) * CIRC}px` }}
              />
            </svg>

            <div className="mock-interview-live__timer-info">
              <span className="mock-interview-live__timer-label">생각시간</span>
              <span className="mock-interview-live__timer-value">{timeLeft}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mock-interview-live__actions">
        <button className="mock-interview-live__btn mock-interview-live__btn--start" onClick={onStartAnswer}>
          <img src={ic_play_arrow_white_24} alt="" />
          답변 시작
        </button>
        <button
          className="mock-interview-live__btn mock-interview-live__btn--end"
          onClick={running ? onPauseThinking : onRestartThinking}
        >
          <img src={ic_stop_gray700_24} alt="" />
          {running ? "일시정지" : "다시 시작"}
        </button>
      </div>
    </div>
  );
}
