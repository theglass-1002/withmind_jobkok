// src/pages/MockInterview/M_MockInterviewLive.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLayoutContext } from "@/app/LayoutContext";
import "./MockInterviewLive.css";

import LiveSidePanel from "@/pages/MockInterview/MockInterviewLive/components/LiveSidePanel";
import LiveThinkingSection from "@/pages/MockInterview/MockInterviewLive/components/LiveThinkingSection";
import LiveAnswerSection from "@/pages/MockInterview/MockInterviewLive/components/LiveAnswerSection";
import Modal from "@/shared/components/modal/Modal";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

import { uploadJobInterviewVideo } from "@/api/fileUpload.api";
import { fetchInterviewFollowup } from "@/api/interview/interview.api";

const THINKING_SECONDS = 15;

type Phase = "thinking" | "answering";
type InterviewStageStatus = 0 | 1 | 2;

type LocationState = {
  envSpeech?: string;
  interviewRes?: any;
  jobDetail?: any;
  resumeDetail?: any;
  jobId?: number | null;
  desiredJob?: string;
  jobPostingUrl?: string;
  interviewStageStatus?: InterviewStageStatus;
};

type LiveQuestion = {
  stage: string;
  title: string;
  question: string;
  order: number;
  type: string;
  difficulty?: string;
  answerHint?: string;
};

type FollowupQuestion = { text: string; reason: string } | null;

export default function M_MockInterviewLive() {
  const navigate = useNavigate();
  const location = useLocation();
  const { actionType, resetAction } = useLayoutContext();

  const state = (location.state || {}) as LocationState;

  const [isUploading, setIsUploading] = useState(false);

  const [phase, setPhase] = useState<Phase>("thinking");
  const [timeLeft, setTimeLeft] = useState(THINKING_SECONDS);
  const [running, setRunning] = useState(true);

  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);

  const [showLivesPanel, setShowLivesPanel] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [qIndex, setQIndex] = useState(0);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const baseQuestions: LiveQuestion[] = useMemo(() => {
    const res = state?.interviewRes;
    const apiQuestions = res?.success ? res?.data?.questions : null;

    const typeToStage = (type: string) => {
      switch (type) {
        case "EXPERIENCE":
          return "이력서 기반 ";
        case "TECHNICAL":
          return "직무 ";
        case "BEHAVIORAL":
          return "역량 ";
        case "INFORMATION":
          return "자기소개 및 지원 동기";
        case "CUSTOM":
          return "사용자 설정 ";
        case "FOLLOWUP":
          return "꼬리 ";
        case "ETC":
        default:
          return "기타 ";
      }
    };

    if (Array.isArray(apiQuestions) && apiQuestions.length > 0) {
      const sorted = [...apiQuestions].sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));

      return sorted.map((q: any, idx: number) => {
        const order = Number(q?.order ?? idx + 1);
        const type = String(q?.type ?? "ETC");
        const difficulty = String(q?.difficulty ?? "EASY");

        return {
          stage: typeToStage(type),
          title: `질문 ${order}`,
          question: String(q?.text ?? ""),
          order,
          type,
          difficulty,
          answerHint: q?.answer_hint ? String(q.answer_hint) : undefined,
        };
      });
    }

    return [
      {
        stage: "알림",
        title: "질문 1",
        question: "질문 데이터를 불러오지 못했습니다.",
        order: 1,
        type: "ETC",
        difficulty: "EASY",
      },
    ];
  }, [state]);

  const [followUpMap, setFollowUpMap] = useState<Record<number, LiveQuestion>>({});

  const effectiveQuestions: LiveQuestion[] = useMemo(() => {
    const out: LiveQuestion[] = [];

    for (let i = 0; i < baseQuestions.length; i++) {
      const q = baseQuestions[i];
      out.push(q);

      const fu = followUpMap[q.order];
      if (fu) {
        out.push(fu);

        const nextBase = baseQuestions[i + 1];
        if (nextBase) {
          out.push({
            stage: "SKIP",
            title: "",
            question: "",
            order: nextBase.order,
            type: "SKIP",
            difficulty: nextBase.difficulty,
          });
          i += 1;
        }
      }
    }

    return out;
  }, [baseQuestions, followUpMap]);

  useEffect(() => {
    const cur = effectiveQuestions[qIndex];
    if (!cur) return;
    if (cur.type !== "SKIP") return;

    setQIndex((prev) => {
      const next = prev + 1;
      return next >= effectiveQuestions.length ? prev : next;
    });
  }, [effectiveQuestions, qIndex]);

  useEffect(() => {
    if (qIndex >= effectiveQuestions.length) setQIndex(0);
  }, [effectiveQuestions.length, qIndex]);

  const current = effectiveQuestions[qIndex] ?? baseQuestions[0];

  const visibleIsLast = (() => {
    for (let i = qIndex + 1; i < effectiveQuestions.length; i++) {
      if (effectiveQuestions[i].type !== "SKIP") return false;
    }
    return true;
  })();

  const totalVisibleCount = useMemo(() => {
    return effectiveQuestions.filter((q) => q.type !== "SKIP").length;
  }, [effectiveQuestions]);

  const currentVisibleIndex = useMemo(() => {
    if (totalVisibleCount <= 0) return 0;

    const visibleList = effectiveQuestions.filter((q) => q.type !== "SKIP");
    const cur = effectiveQuestions[qIndex];
    if (!cur || cur.type === "SKIP") return 0;

    const idx = visibleList.findIndex((v) => v.order === cur.order && v.type === cur.type);
    return idx >= 0 ? idx : 0;
  }, [effectiveQuestions, qIndex, totalVisibleCount]);

  const progress = Math.min(1, Math.max(0, (THINKING_SECONDS - timeLeft) / THINKING_SECONDS));

  useEffect(() => {
    if (!actionType) return;

    if (actionType === "view_status") {
      setShowLivesPanel(true);
    } else if (actionType === "exit") {
      setShowConfirm(true);
    }

    resetAction?.();
  }, [actionType, resetAction]);

  useEffect(() => {
    if (phase !== "thinking" || !running) return;

    startTsRef.current = performance.now();
    setTimeLeft(THINKING_SECONDS);

    const totalMs = THINKING_SECONDS * 1000;

    const tick = (now: number) => {
      const elapsed = now - startTsRef.current;
      const remainMs = Math.max(0, totalMs - elapsed);
      const nextLeft = Math.ceil(remainMs / 1000);

      setTimeLeft(nextLeft);

      if (remainMs > 0 && phase === "thinking" && running) {
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
      rafRef.current = null;
    };
  }, [phase, running]);

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

  const advanceToNextVisibleQuestion = () => {
    setQIndex((prev) => {
      let next = prev + 1;
      while (next < effectiveQuestions.length && effectiveQuestions[next].type === "SKIP") {
        next += 1;
      }
      return next >= effectiveQuestions.length ? prev : next;
    });
  };

  const uploadRecordedFile = async (videoBlob: Blob, meta: { qIndex: number }) => {
    const cur = effectiveQuestions[meta.qIndex];
    if (!cur) return { uploadResult: null, followupRes: null };
    if (cur.type === "SKIP") return { uploadResult: null, followupRes: null };

    const questionText = cur.question;
    const isFollowupNow = cur.type === "FOLLOWUP";

    setIsUploading(true);
    console.log('영상업로드??');
    try {
      let uploadResult: any;
      try {
        uploadResult = await uploadJobInterviewVideo(videoBlob);
        console.log('면접영상 업로드 결과',uploadResult);
      } catch (err) {
        console.error("[uploadRecordedFile] video upload failed:", err);
        return { uploadResult: null, followupRes: null };
      }

      if (isFollowupNow) return { uploadResult, followupRes: null };

      const alreadyHasFollowup = !!followUpMap[cur.order];
      if (alreadyHasFollowup) return { uploadResult, followupRes: null };

      const payload = { question: questionText, file_url: uploadResult.finalUrl };

      let followupRes: any;
      try {
        followupRes = await fetchInterviewFollowup(payload);
      } catch (err) {
        console.error("[uploadRecordedFile] followup API failed:", err);
        return { uploadResult, followupRes: null };
      }

      const fu: FollowupQuestion = followupRes?.data?.follow_up_question ?? null;
      if (!fu) return { uploadResult, followupRes };

      const followupLive: LiveQuestion = {
        stage: "꼬리 질문",
        title: "꼬리 질문",
        question: fu.text,
        order: cur.order + 0.01,
        type: "FOLLOWUP",
        difficulty: cur.difficulty,
        answerHint: fu.reason,
      };

      setFollowUpMap((prev) => ({ ...prev, [cur.order]: followupLive }));
      return { uploadResult, followupRes };
    } finally {
      setIsUploading(false);
    }
  };

  const startRecording = async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      recordedChunksRef.current = [];

      const mimeCandidates = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
      const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || "";

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstart = () => setIsRecording(true);
      recorder.onstop = () => setIsRecording(false);

      recorder.start();
    } catch (err) {
      console.error("[Recorder] start failed:", err);
    }
  };

  const stopRecordingAndUpload = async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    const blob = await new Promise<Blob>((resolve, reject) => {
      const onStop = () => {
        try {
          const mimeType = recorder.mimeType || "video/webm;codecs=vp8,opus";
          resolve(new Blob(recordedChunksRef.current, { type: mimeType }));
        } catch (e) {
          reject(e);
        }
      };

      recorder.addEventListener("stop", onStop, { once: true });

      try {
        recorder.stop();
      } catch (e) {
        recorder.removeEventListener("stop", onStop);
        reject(e);
      }
    });

    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;

    await uploadRecordedFile(blob, { qIndex });
  };

  useEffect(() => {
    if (phase !== "answering") return;

    const cur = effectiveQuestions[qIndex];
    if (cur?.type === "SKIP") {
      setPhase("thinking");
      setQIndex((prev) => Math.min(prev + 1, effectiveQuestions.length - 1));
      return;
    }

    startRecording();

    return () => {
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      } catch {}

      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
      mediaRecorderRef.current = null;
      recordedChunksRef.current = [];
      setIsRecording(false);
    };
  }, [phase, qIndex, effectiveQuestions]);

  const handleConfirmExit = () => {
    setShowConfirm(false);
    navigate("/");
  };

  const handleCloseConfirm = () => setShowConfirm(false);

  return (
    <div className="mock-interview-live mobile">
      <LoadingOverlay isLoading={isUploading} />

      {showLivesPanel && (
        <LiveSidePanel
          onExit={() => setShowLivesPanel(false)}
          currentIndex={qIndex}
          totalCount={totalVisibleCount}
          interviewState={state}
          interviewStageStatus={state?.interviewStageStatus}
          currentQuestion={{
            stage: current.stage,
            question: current.question,
            order: current.order,
            type: current.type,
            difficulty: current.difficulty ?? "EASY",
            answerHint: current.answerHint,
          }}
        />
      )}

      {phase === "thinking" && current.type !== "SKIP" && (
        <LiveThinkingSection
          stage={current.stage}
          title={current.title}
          question={current.question}
          timeLeft={timeLeft}
          progress={progress}
          running={running}
          onStartAnswer={handleStartAnswer}
          onPauseThinking={handleThinkingStop}
          onRestartThinking={handleThinkingRestart}
        />
      )}

      {phase === "answering" && current.type !== "SKIP" && (
        <LiveAnswerSection
          isLast={visibleIsLast}
          onEnd={async () => {
            if (isUploading) return;

            await stopRecordingAndUpload();

            setPhase("thinking");

            if (!visibleIsLast) {
              advanceToNextVisibleQuestion();
              handleThinkingRestart();
            }
          }}
        />
      )}

      <Modal
        open={showConfirm}
        title="모의면접을 중단하시겠습니까?"
        desc={
          <>
            해당 모의면접에 사용된 이용권은 차감되지 않으며,
            <br />
            [모의면접 - 모의면접 내역] 페이지에서 이어서 진행할 수 있습니다.
          </>
        }
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
