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
import {
  completeInterview,
  fetchInterviewFollowup,
  saveInterviewAnalysis,
} from "@/api/interview/interview.api";

const THINKING_SECONDS = 15;

type Phase = "thinking" | "answering";
type InterviewStageStatus = 0 | 1 | 2;

type ReceivedQuestion = {
  question_id?: string;
  question_code?: string;
  order: number;
  text: string;
  type: string;
  difficulty?: string;
  related_items?: any[];
  answer_hint?: string;
};

type ReceivedInterviewRes = {
  success?: boolean;
  data?: {
    qz_group?: number;
    blueprint_path?: string;
    questions?: ReceivedQuestion[];
    quality_flags?: string[];
  };
};

type LiveQuestion = {
  stage: string;
  title: string;
  question: string;
  order: number;
  type: string;
  difficulty: string;
  answerHint?: string;
  questionId?: string;
  questionCode?: string;
  relatedItems?: any[];
};

export default function M_MockInterviewLive() {
  const navigate = useNavigate();
  const location = useLocation();
  const { actionType, resetAction } = useLayoutContext();

  const state = location.state as any;

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
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    console.log("[M_MockInterviewLive] 면접보는화면", state);
    console.log("[M_MockInterviewLive] interviewStageStatus:", state?.interviewStageStatus);
    console.log("[M_MockInterviewLive] received interviewRes:", state?.interviewRes);
    console.log(
      "[M_MockInterviewLive] received interviewRes.data.questions:",
      state?.interviewRes?.data?.questions
    );
  }, [state]);

  const apiQuestions: ReceivedQuestion[] = useMemo(() => {
    const res = state?.interviewRes as
      | ReceivedInterviewRes
      | ReceivedQuestion[]
      | null
      | undefined;

    if (Array.isArray(res)) return res as ReceivedQuestion[];
    if (
      res?.success &&
      res?.data?.questions &&
      Array.isArray(res.data.questions)
    ) {
      return res.data.questions as ReceivedQuestion[];
    }
    return [];
  }, [state]);

  useEffect(() => {
    console.log("[M_MockInterviewLive] apiQuestions:", apiQuestions);
    console.log(
      "[M_MockInterviewLive] apiQuestions metadata:",
      apiQuestions.map((q) => ({
        question_id: q.question_id,
        question_code: q.question_code,
        order: q.order,
        text: q.text,
        type: q.type,
      }))
    );
  }, [apiQuestions]);

  const baseQuestions: LiveQuestion[] = useMemo(() => {
    const typeToStage = (type: string) => {
      switch (type) {
        case "EXPERIENCE":
          return "이력서 기반 ";
        case "TECHNICAL":
          return "직무 ";
        case "BEHAVIORAL":
        case "PEOPLE_FIT":
          return "역량 ";
        case "OPENING":
        case "INFORMATION":
          return "자기소개 및 지원 동기";
        case "CUSTOM":
          return "사용자 설정 ";
        case "ETC":
        default:
          return "기타 ";
      }
    };

    if (apiQuestions.length > 0) {
      return [...apiQuestions]
        .sort((a, b) => a.order - b.order)
        .map((q) => ({
          stage: typeToStage(q.type),
          title: `질문 ${q.order}`,
          question: q.text,
          order: q.order,
          type: q.type,
          difficulty: q.difficulty ?? "MEDIUM",
          answerHint: q.answer_hint,
          questionId: q.question_id,
          questionCode: q.question_code,
          relatedItems: q.related_items ?? [],
        }));
    }

    return [
      {
        stage: "알림",
        title: "질문 1",
        question: "질문 데이터를 불러오지 못했습니다.",
        order: 1,
        type: "ETC",
        difficulty: "EASY",
        questionId: undefined,
        questionCode: undefined,
        relatedItems: [],
      },
    ];
  }, [apiQuestions]);

  useEffect(() => {
    console.log("[M_MockInterviewLive] baseQuestions:", baseQuestions);
    console.log(
      "[M_MockInterviewLive] baseQuestions metadata:",
      baseQuestions.map((q) => ({
        questionId: q.questionId,
        questionCode: q.questionCode,
        order: q.order,
        question: q.question,
        type: q.type,
      }))
    );
  }, [baseQuestions]);

  // key: 원본 기본 질문 번호, value: 그 질문 다음 번호를 차지할 꼬리질문
  const [followUpMap, setFollowUpMap] = useState<Record<number, LiveQuestion>>(
    {}
  );

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
            questionId: nextBase.questionId,
            questionCode: nextBase.questionCode,
            answerHint: nextBase.answerHint,
            relatedItems: nextBase.relatedItems ?? [],
          });
          i += 1;
        }
      }
    }

    return out;
  }, [baseQuestions, followUpMap]);

  useEffect(() => {
    console.log("[M_MockInterviewLive] effectiveQuestions:", effectiveQuestions);
    console.log(
      "[M_MockInterviewLive] effectiveQuestions metadata:",
      effectiveQuestions.map((q) => ({
        questionId: q.questionId,
        questionCode: q.questionCode,
        order: q.order,
        question: q.question,
        type: q.type,
      }))
    );
  }, [effectiveQuestions]);

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
    if (qIndex >= effectiveQuestions.length) {
      setQIndex(0);
    }
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
    return (
      effectiveQuestions
        .slice(0, qIndex + 1)
        .filter((q) => q.type !== "SKIP").length - 1
    );
  }, [effectiveQuestions, qIndex]);

  const progress = Math.min(
    1,
    Math.max(0, (THINKING_SECONDS - timeLeft) / THINKING_SECONDS)
  );

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
      while (
        next < effectiveQuestions.length &&
        effectiveQuestions[next].type === "SKIP"
      ) {
        next += 1;
      }
      return next >= effectiveQuestions.length ? prev : next;
    });
  };

  const uploadRecordedFile = async (
    videoBlob: Blob,
    meta: { qIndex: number }
  ) => {
    const cur = effectiveQuestions[meta.qIndex];

    console.log("[M_uploadRecordedFile] 현재 qIndex:", meta.qIndex);
    console.log("[M_uploadRecordedFile] 현재 질문 번호:", cur?.order);
    console.log("[M_uploadRecordedFile] 현재 질문 코드:", cur?.questionCode);
    console.log("[M_uploadRecordedFile] 현재 질문 ID:", cur?.questionId);
    console.log("[M_uploadRecordedFile] 현재 질문 내용:", cur?.question);

    if (!cur) return { uploadResult: null, followupRes: null };
    if (cur.type === "SKIP") return { uploadResult: null, followupRes: null };

    const questionText = cur.question;
    const isFollowupNow = cur.type === "FOLLOWUP";

    setIsUploading(true);

    try {
      let uploadResult: any;

      try {
        uploadResult = await uploadJobInterviewVideo(videoBlob);
        console.log("[M_uploadRecordedFile] 영상업로드 후 면접영상 저장 api 날리기");

        const res = await saveInterviewAnalysis({
          qzGroup: state?.interviewGroupId,
          num: cur.order,
          qzTts: questionText,
          fileUrl: uploadResult.finalUrl,
          thumUrl: uploadResult.thumbUrl,
          category: "interview",
          originalName: uploadResult.uniqueFileName,
          storedName: uploadResult.uniqueFileName,
          sizeBytes: uploadResult.fileSize,
          contentType: "video/webm",
        });

        console.log("[M_uploadRecordedFile] 면접 영상 저장 API", res);
      } catch (err) {
        console.error("[M_uploadRecordedFile] video upload failed:", err);
        return { uploadResult: null, followupRes: null };
      }

      if (isFollowupNow) {
        console.log(
          "[M_uploadRecordedFile] 현재 질문은 FOLLOWUP 이라 추가 꼬리질문 생성 없이 종료"
        );
        return { uploadResult, followupRes: null };
      }

      const alreadyHasFollowup = !!followUpMap[cur.order];
      console.log(
        "[M_uploadRecordedFile] 이미 꼬리질문 있는지:",
        alreadyHasFollowup
      );

      if (alreadyHasFollowup) {
        return { uploadResult, followupRes: null };
      }

      const payload = {
        qz_group: Number(state?.interviewGroupId),
        question_code:
          cur.questionCode ?? `Q${String(cur.order).padStart(2, "0")}`,
        video_url: uploadResult.finalUrl,
      };

      console.log("[M_uploadRecordedFile] followup request payload:", payload);

      let followupRes: any;
      try {
        followupRes = await fetchInterviewFollowup(payload);
        console.log("[M_uploadRecordedFile] followup 응답:", followupRes);
      } catch (err) {
        console.error(
          "[M_uploadRecordedFile] followup API failed, keep original flow:",
          err
        );
        return { uploadResult, followupRes: null };
      }

      if (!followupRes?.success) {
        console.error(
          "[M_uploadRecordedFile] followup business error:",
          followupRes?.error
        );
        return { uploadResult, followupRes };
      }

      const followupData = followupRes?.data;
      const followupRequired = Boolean(followupData?.follow_up_required);
      const followupQuestionText = followupData?.follow_up_question ?? null;
      const followupIntent = followupData?.follow_up_intent ?? null;
      const missingEvidence = Array.isArray(followupData?.missing_evidence)
        ? followupData.missing_evidence
        : [];

      console.log("[M_uploadRecordedFile] follow_up_required:", followupRequired);
      console.log("[M_uploadRecordedFile] follow_up_question:", followupQuestionText);
      console.log("[M_uploadRecordedFile] follow_up_intent:", followupIntent);
      console.log("[M_uploadRecordedFile] missing_evidence:", missingEvidence);

      if (!followupRequired || !followupQuestionText) {
        return { uploadResult, followupRes };
      }

      const followupOrder = cur.order + 1;
      const followupHint =
        [
          followupIntent,
          missingEvidence.length
            ? `보완 필요: ${missingEvidence.join(", ")}`
            : "",
        ]
          .filter(Boolean)
          .join(" | ") || undefined;

      const followupLive: LiveQuestion = {
        stage: "꼬리 질문",
        title: `질문 ${followupOrder}`,
        question: followupQuestionText,
        order: followupOrder,
        type: "FOLLOWUP",
        difficulty: cur.difficulty,
        answerHint: followupHint,
        questionId: undefined,
        questionCode: `${
          cur.questionCode ?? `Q${String(cur.order).padStart(2, "0")}`
        }_FU`,
        relatedItems: [],
      };

      console.log("[M_uploadRecordedFile] 생성된 followupLive:", followupLive);
      console.log(
        `[M_uploadRecordedFile] 기본 질문 ${cur.order} 다음에 꼬리질문 ${followupOrder}번으로 삽입`
      );

      setFollowUpMap((prev) => ({ ...prev, [cur.order]: followupLive }));

      return { uploadResult, followupRes };
    } finally {
      setIsUploading(false);
    }
  };

  const startRecording = async () => {
    if (isRecording || mediaRecorderRef.current || mediaStreamRef.current) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      mediaStreamRef.current = stream;
      setPreviewStream(stream);
      recordedChunksRef.current = [];

      const mimeCandidates = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
      ];
      const mimeType =
        mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || "";

      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstart = () => {
        setIsRecording(true);
      };

      recorder.onstop = () => {
        setIsRecording(false);
      };

      recorder.start();
    } catch (err) {
      console.error("[M_Recorder] start failed:", err);
    }
  };

  const stopRecordingAndUpload = async (targetQIndex: number) => {
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
    setPreviewStream(null);

    await uploadRecordedFile(blob, { qIndex: targetQIndex });
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
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== "inactive"
        ) {
          console.log("[M_answering cleanup] recorder stop");
          mediaRecorderRef.current.stop();
        }
      } catch (e) {
        console.error("[M_answering cleanup] recorder stop error:", e);
      }

      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
      mediaRecorderRef.current = null;
      recordedChunksRef.current = [];
      setPreviewStream(null);
      setIsRecording(false);
    };
  }, [phase]);

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
          currentIndex={currentVisibleIndex}
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
          stream={previewStream}
          isLast={visibleIsLast}
          onEnd={async () => {
            if (isUploading) return;

            const currentQIndex = qIndex;
            const isLastQuestion = visibleIsLast;

            await stopRecordingAndUpload(currentQIndex);

            if (isLastQuestion) {
              try {
                const completePayload = {
                  qz_group: state?.interviewGroupId,
                };

                console.log(
                  "[M_MockInterviewLive] completeInterview request:",
                  completePayload
                );

                const completeRes = await completeInterview(completePayload);

                console.log(
                  "[M_MockInterviewLive] completeInterview response:",
                  completeRes
                );
              } catch (err) {
                console.error(
                  "[M_MockInterviewLive] completeInterview failed:",
                  err
                );
              }

              return;
            }

            setPhase("thinking");
            advanceToNextVisibleQuestion();
            handleThinkingRestart();
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