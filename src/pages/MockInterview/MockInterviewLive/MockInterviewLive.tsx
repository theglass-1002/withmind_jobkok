import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./MockInterviewLive.css";

import SettingsSidebar from "@/pages/MockInterview/MockSettings/components/SettingsSidebar";
import LiveSidePanel from "@/pages/MockInterview/MockInterviewLive/components/LiveSidePanel";
import LiveThinkingSection from "@/pages/MockInterview/MockInterviewLive/components/LiveThinkingSection";
import LiveAnswerSection from "@/pages/MockInterview/MockInterviewLive/components/LiveAnswerSection";

import { InterviewQuestion, InterviewQuestionsResponse } from "@/api/interview/interview.types";
import { uploadJobInterviewVideo } from "@/api/fileUpload.api";
import { fetchInterviewFollowup } from "@/api/interview/interview.api";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

const THINKING_SECONDS = 15;
type Phase = "thinking" | "answering";

type LiveQuestion = {
  stage: string;
  question: string;
  order: number;
  type: string;
  difficulty: string;
  answerHint?: string;
};

type FollowupQuestion = { text: string; reason: string } | null;

type InterviewStageStatus = 0 | 1 | 2;

export default function MockInterviewLive() {
  const location = useLocation();
  const state = location.state as any;

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    console.log("[MockInterviewLive] location.state:", state);
    console.log("[MockInterviewLive] interviewStageStatus:", state?.interviewStageStatus);

    switch (state?.interviewStageStatus as InterviewStageStatus | undefined) {
      case 0:
        console.log("상태 0: 유저 질문 전부 작성 (API 스킵)");
        break;
      case 1:
        console.log("상태 1: 유저 질문 일부 작성 (API + 일부 교체)");
        break;
      case 2:
        console.log("상태 2: 유저 질문 미작성 (API 그대로)");
        break;
      default:
        console.log("상태 없음 또는 알 수 없음");
    }
  }, [state]);

  const apiQuestions: InterviewQuestion[] = useMemo(() => {
    const res = state?.interviewRes as InterviewQuestionsResponse | InterviewQuestion[] | null | undefined;

    if (Array.isArray(res)) return res as InterviewQuestion[];
    if (res?.success && res?.data?.questions && Array.isArray(res.data.questions)) {
      return res.data.questions as InterviewQuestion[];
    }
    return [];
  }, [state]);

  const baseQuestions: LiveQuestion[] = useMemo(() => {
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
        case "ETC":
        default:
          return "기타 ";
      }
    };

    return apiQuestions.length > 0
      ? [...apiQuestions]
          .sort((a, b) => a.order - b.order)
          .map((q) => ({
            stage: `${typeToStage(q.type)}`,
            question: q.text,
            order: q.order,
            type: q.type,
            difficulty: q.difficulty,
            answerHint: q.answer_hint,
          }))
      : [
          {
            stage: "알림",
            question: "질문 데이터를 불러오지 못했습니다.",
            order: 1,
            type: "ETC",
            difficulty: "EASY",
          },
        ];
  }, [apiQuestions]);

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

  const [phase, setPhase] = useState<Phase>("thinking");
  const [qIndex, setQIndex] = useState(0);

  const [timeLeft, setTimeLeft] = useState(THINKING_SECONDS);
  const [running, setRunning] = useState(true);

  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const cur = effectiveQuestions[qIndex];
    if (!cur) return;
    if (cur.type !== "SKIP") return;

    setQIndex((prev) => {
      const next = prev + 1;
      return next >= effectiveQuestions.length ? prev : next;
    });
  }, [effectiveQuestions, qIndex]);

  const uploadRecordedFile = async (videoBlob: Blob, meta: { qIndex: number }) => {
    const cur = effectiveQuestions[meta.qIndex];
    if (!cur) return { uploadResult: null, followupRes: null };
    if (cur.type === "SKIP") return { uploadResult: null, followupRes: null };

    const questionText = cur.question;
    const isFollowupNow = cur.type === "FOLLOWUP";

    setIsUploading(true);

    try {
      let uploadResult: any;
      try {
        uploadResult = await uploadJobInterviewVideo(videoBlob);
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
        console.error("[uploadRecordedFile] followup API failed, keep original flow:", err);
        return { uploadResult, followupRes: null };
      }

      const fu: FollowupQuestion = followupRes?.data?.follow_up_question ?? null;
      if (!fu) return { uploadResult, followupRes };

      const followupLive: LiveQuestion = {
        stage: "꼬리 질문",
        question: fu.text,
        order: cur.order,
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

      recorder.onstart = () => {
        setIsRecording(true);
      };

      recorder.onstop = () => {
        setIsRecording(false);
      };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

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

  const current = effectiveQuestions[qIndex] ?? baseQuestions[0];
  const visibleIsLast = (() => {
    for (let i = qIndex + 1; i < effectiveQuestions.length; i++) {
      if (effectiveQuestions[i].type !== "SKIP") return false;
    }
    return true;
  })();

  const progress = Math.min(1, Math.max(0, (THINKING_SECONDS - timeLeft) / THINKING_SECONDS));

  return (
    <div className="mock-interview-live">
      <div className="mock-interview-live-page_container">
        <LoadingOverlay isLoading={isUploading} />

        <SettingsSidebar activeStep={3} onStepChange={() => {}} />

        {phase === "thinking" && current.type !== "SKIP" && (
          <LiveThinkingSection
            stage={current.stage}
            title={`질문 ${current.order}`}
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

        <LiveSidePanel
          currentIndex={qIndex}
          totalCount={effectiveQuestions.filter((q) => q.type !== "SKIP").length}
          interviewState={state}
          interviewStageStatus={state?.interviewStageStatus}
          currentQuestion={current}
        />
      </div>
    </div>
  );
}
