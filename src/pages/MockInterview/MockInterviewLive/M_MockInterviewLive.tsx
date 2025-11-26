// src/pages/MockInterview/M_MockInterviewLive.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLayoutContext } from '@/app/LayoutContext';
import "./MockInterviewLive.css";
import SettingsSidebar from "@/pages/MockInterview/MockSettings/components/SettingsSidebar";
import LiveSidePanel from "@/pages/MockInterview/MockInterviewLive/components/LiveSidePanel";
import LiveThinkingSection from "@/pages/MockInterview/MockInterviewLive/components/LiveThinkingSection";
import LiveAnswerSection from "@/pages/MockInterview/MockInterviewLive/components/LiveAnswerSection";
import Modal from "@/shared/components/modal/Modal";


const THINKING_SECONDS = 300;

type Phase = "thinking" | "answering";

export default function M_MockInterviewLive() {
  const navigate = useNavigate();
  const { actionType, resetAction } = useLayoutContext();
  const [phase, setPhase] = useState<Phase>("thinking");
  const [timeLeft, setTimeLeft] = useState(THINKING_SECONDS);
  const [running, setRunning] = useState(true);
  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);
  const [showLivesPanel, setShowLivesPanel] = useState(false); 
  const [showConfirm, setShowConfirm] = useState(false);
  const progress = Math.min(1, Math.max(0, (THINKING_SECONDS - timeLeft) / THINKING_SECONDS));

  useEffect(() => {
    if (!actionType) return;   
    if (actionType === "view_status") {
          setShowLivesPanel(true);
    } else if (actionType === "exit") {
        setShowConfirm(true);
    }  
    resetAction?.();
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
  }, [actionType, phase, running, timeLeft]);

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

  const handleConfirmExit = () => {
    setShowConfirm(false);
    navigate('/'); // 원하는 경로로 이동
  };
  const handleCloseConfirm = () => setShowConfirm(false);



  return (
    <div className="mock-interview-live mobile">
      {/* <SettingsSidebar activeStep={3} onStepChange={() => {}} /> */}
      {showLivesPanel && <LiveSidePanel onExit={()=>{setShowLivesPanel(false)}}/>}
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
      <Modal 
      open={showConfirm}
      title="모의면접을 중단하시겠습니까?"
      desc={ <>해당 모의면접에 사용된 이용권은 차감되지 않으며,<br/>
                [모의면접 - 모의면접 내역] 페이지에서 이어서 진행할 수 있습니다.</>}
      confirmText="나가기"
      confirmClassName="btn_w_full default_btn_red radius"
      cancelText="취소"
      cancelClassName="btn_w_full default_btn_gray_100 radius"
      onConfirm={handleConfirmExit} 
      onClose={handleCloseConfirm}
            />

    </div>
  );
}
