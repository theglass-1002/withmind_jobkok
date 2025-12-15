import React, { useEffect, useRef, useState } from "react";
import "./MockInterviewLive.css";
import SettingsSidebar from "@/pages/MockInterview/MockSettings/components/SettingsSidebar";
import LiveSidePanel from "@/pages/MockInterview/MockInterviewLive/components/LiveSidePanel";
import LiveThinkingSection from "@/pages/MockInterview/MockInterviewLive/components/LiveThinkingSection";
import LiveAnswerSection from "@/pages/MockInterview/MockInterviewLive/components/LiveAnswerSection";

const THINKING_SECONDS = 15;
type Phase = "thinking" | "answering";

const QUESTIONS = [
  // 1. 자기소개 및 지원 동기
  { stage: "자기소개 및 지원 동기", question: "1분 동안 본인을 간단히 소개해 주세요." },
  { stage: "자기소개 및 지원 동기", question: "위드마인드에 지원하게 된 동기는 무엇인가요?" },
  { stage: "자기소개 및 지원 동기", question: "지원한 직무를 선택하게 된 계기는 무엇인가요?" },

  // 2. 직무 질문
  { stage: "직무 질문", question: "서비스 기획에서 가장 중요하다고 생각하는 역량은 무엇인가요?" },
  { stage: "직무 질문", question: "요구사항을 정리하고 우선순위를 정할 때 어떤 기준을 사용하나요?" },
  { stage: "직무 질문", question: "기획 과정에서 개발자·디자이너와 의견이 다를 때 어떻게 조율하나요?" },

  // 3. 이력서 기반 질문
  { stage: "이력서 기반 질문", question: "이력서에 작성한 프로젝트 중 가장 기억에 남는 경험은 무엇인가요?" },
  { stage: "이력서 기반 질문", question: "해당 프로젝트에서 본인이 맡았던 역할과 기여도를 설명해 주세요." },
  { stage: "이력서 기반 질문", question: "프로젝트 진행 중 가장 어려웠던 점과 이를 해결한 방법은 무엇이었나요?" },

  // 4. 채용 공고 기반 질문
  { stage: "채용 공고 기반 질문", question: "해당 채용 공고에서 가장 중요하다고 생각한 요구사항은 무엇인가요?" },
  { stage: "채용 공고 기반 질문", question: "우리 팀에 합류한다면 어떤 부분에서 빠르게 기여할 수 있을까요?" },
  { stage: "채용 공고 기반 질문", question: "입사 후 3개월 동안 달성하고 싶은 목표는 무엇인가요?" },
] as const;

export default function MockInterviewLive() {
  const [phase, setPhase] = useState<Phase>("thinking");
  const [qIndex, setQIndex] = useState(0);

  const [timeLeft, setTimeLeft] = useState(THINKING_SECONDS);
  const [running, setRunning] = useState(true);
  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);

  const progress = Math.min(1, Math.max(0, (THINKING_SECONDS - timeLeft) / THINKING_SECONDS));
  const current = QUESTIONS[qIndex];
  const isLast = qIndex === QUESTIONS.length - 1;

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
        setPhase("answering");
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
    setPhase("answering");
  };

  // ✅ 답변 종료 → 다음 질문으로
  const handleAnswerEnd = () => {
    const last = qIndex >= QUESTIONS.length - 1;
    if (last) {
      // 마지막 질문은 LiveAnswerSection에서 완료 다이얼로그 처리
      return;
    }

    setQIndex((prev) => prev + 1);
    handleThinkingRestart();
  };

  return (
    <div className="mock-interview-live">
      <SettingsSidebar activeStep={3} onStepChange={() => {}} />

      {phase === "thinking" && (
        <LiveThinkingSection
          title={`${current.stage}ㆍ질문 ${qIndex + 1}`}
          question={current.question}
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
          onEnd={() => {
            // 답변 끝나면 다음 질문으로 넘어가고, UI를 다시 thinking으로
            setPhase("thinking");
            handleAnswerEnd();
          }}
          isLast={isLast}
        />
      )}

      <LiveSidePanel />
    </div>
  );
}
