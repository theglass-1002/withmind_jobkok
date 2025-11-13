// src/pages/MockInterview/MockInterviewLive.tsx
import React, { useEffect, useRef, useState } from "react";
import "./MockInterviewLive.css";
import SettingsSidebar from "@/pages/MockInterview/MockSettings/components/SettingsSidebar";
import LiveSidePanel from "@/pages/MockInterview/MockInterviewLive/components/LiveSidePanel";
import LiveThinkingSection from "@/pages/MockInterview/MockInterviewLive/components/LiveThinkingSection";
import LiveAnswerSection from "@/pages/MockInterview/MockInterviewLive/components/LiveAnswerSection";

const THINKING_SECONDS = 15;

type Phase = "thinking" | "answering";

export default function MockInterviewLive() {
  const [phase, setPhase] = useState<Phase>("thinking");

  const [timeLeft, setTimeLeft] = useState(THINKING_SECONDS);
  const [running, setRunning] = useState(true);
  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);

  const progress = Math.min(1, Math.max(0, (THINKING_SECONDS - timeLeft) / THINKING_SECONDS));

  useEffect(() => {
    if (phase !== "thinking" || !running) return;

    const totalMs = THINKING_SECONDS * 1000;
    startTsRef.current = performance.now() - (THINKING_SECONDS - timeLeft) * 1000;

    const tick = (now: number) => {
      const elapsed = now - startTsRef.current;
      const remainMs = Math.max(0, totalMs - elapsed);
      setTimeLeft(Math.ceil(remainMs / 1000));

      if (remainMs > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        setRunning(false);
        setPhase("answering"); // ① 15초 종료 → 답변시간으로 전환
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, running, timeLeft]);

  const handleThinkingRestart = () => {
    setTimeLeft(THINKING_SECONDS);
    setRunning(true);
    setPhase("thinking");
  };

  const handleThinkingStop = () => {
    setRunning(false);
  };

  const handleStartAnswer = () => {
    setPhase("answering"); // ② ‘답변 시작’ 클릭 → 답변시간으로 전환
  };

  const handleAnswerEnd = () => {
    // 답변 종료 후의 다음 동작을 여기서 처리 (예: 다음 질문으로, 결과 저장 등)
    // 예시: 다음 질문의 생각시간으로 다시 시작
    handleThinkingRestart();
  };

  return (
    <div className="mock-interview-live">
      <SettingsSidebar activeStep={3} onStepChange={() => {}} />

      {phase === "thinking" && (
        <LiveThinkingSection
          title="자기소개 및 지원 동기ㆍ질문 1"
          question="위드마인드에 지원한 동기는 무엇입니까?"
          timeLeft={timeLeft}
          progress={progress}
          running={running}
          onStartAnswer={handleStartAnswer}
          onPauseThinking={handleThinkingStop}
          onRestartThinking={handleThinkingRestart}
        />
      )}

      {phase === "answering" && (
        <LiveAnswerSection
        />
      )}

      <LiveSidePanel />
    </div>
  );
}
