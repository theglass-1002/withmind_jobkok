import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./MockInterviewLive.css";

import SettingsSidebar from "@/pages/MockInterview/MockSettings/components/SettingsSidebar";
import LiveSidePanel from "@/pages/MockInterview/MockInterviewLive/components/LiveSidePanel";
import LiveThinkingSection from "@/pages/MockInterview/MockInterviewLive/components/LiveThinkingSection";
import LiveAnswerSection from "@/pages/MockInterview/MockInterviewLive/components/LiveAnswerSection";

import { uploadJobInterviewVideo } from "@/api/fileUpload.api";
import {
  completeInterview,
  fetchInterviewFollowup,
  saveFollowOnQue,
  saveInterviewAnalysis,
} from "@/api/interview/interview.api";
import { lockAndCloneResume } from "@/api/resume/resume.api";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { retryRequest } from "@/shared/utils/util";
import { guardMockInterviewPage } from "@/shared/utils/mockInterviewGuard";
import Modal from "@/shared/components/modal/Modal";

const VIDEO_SAVE_FAIL_MESSAGE =
  "면접영상저장에 실패했습니다. 관리자에게 문의해주세요.";

const THINKING_SECONDS = 15;
type Phase = "thinking" | "answering";

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
  question: string;
  order: number;
  type: string;
  difficulty: string;
  answerHint?: string;
  questionId?: string;
  questionCode?: string;
  relatedItems?: any[];
};

type InterviewStageStatus = 0 | 1 | 2;

export default function MockInterviewLive() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as any;

  const [isUploading, setIsUploading] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  useEffect(() => {
    guardMockInterviewPage(setIsResumeModalOpen);
  }, []);

  useEffect(() => {
    console.log("[MockInterviewLive] 면접보는화면", state);
    console.log("[MockInterviewLive] interviewStageStatus:", state?.interviewStageStatus);
    console.log("[MockInterviewLive] received interviewRes:", state?.interviewRes);
    console.log(
      "[MockInterviewLive] received interviewRes.data.questions:",
      state?.interviewRes?.data?.questions
    );

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
    console.log("[MockInterviewLive] apiQuestions:", apiQuestions);
    console.log(
      "[MockInterviewLive] apiQuestions metadata:",
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

    return apiQuestions.length > 0
      ? [...apiQuestions]
          .sort((a, b) => a.order - b.order)
          .map((q) => ({
            stage: `${typeToStage(q.type)}`,
            question: q.text,
            order: q.order,
            type: q.type,
            difficulty: q.difficulty ?? "MEDIUM",
            answerHint: q.answer_hint,
            questionId: q.question_id,
            questionCode: q.question_code,
            relatedItems: q.related_items ?? [],
          }))
      : [
          {
            stage: "알림",
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
    console.log("[MockInterviewLive] baseQuestions:", baseQuestions);
    console.log(
      "[MockInterviewLive] baseQuestions metadata:",
      baseQuestions.map((q) => ({
        questionId: q.questionId,
        questionCode: q.questionCode,
        order: q.order,
        question: q.question,
        type: q.type,
      }))
    );
  }, [baseQuestions]);

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
    console.log("[MockInterviewLive] effectiveQuestions:", effectiveQuestions);
    console.log(
      "[MockInterviewLive] effectiveQuestions metadata:",
      effectiveQuestions.map((q) => ({
        questionId: q.questionId,
        questionCode: q.questionCode,
        order: q.order,
        question: q.question,
        type: q.type,
      }))
    );
  }, [effectiveQuestions]);

  const [phase, setPhase] = useState<Phase>("thinking");
  const [qIndex, setQIndex] = useState<number>(() => {
    const raw = state?.reStartNum;
    const r = typeof raw === "string" ? Number(raw) : raw;
    console.log("[MockInterviewLive] reStartNum raw/parsed:", raw, r);
    if (typeof r !== "number" || !Number.isFinite(r) || r <= 0) return 0;
    const qs = state?.interviewRes?.data?.questions as
      | { order?: number }[]
      | undefined;
    if (Array.isArray(qs)) {
      const sorted = [...qs].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      const idx = sorted.findIndex((q) => q.order === r);
      console.log(
        "[MockInterviewLive] reStart findIndex:",
        idx,
        "of",
        sorted.length
      );
      if (idx >= 0) return idx;
      if (r > sorted.length) return sorted.length - 1;
    }
    return r - 1;
  });

  const [timeLeft, setTimeLeft] = useState(THINKING_SECONDS);
  const [running, setRunning] = useState(true);

  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const cur = effectiveQuestions[qIndex];
    if (!cur) return;
    if (cur.type !== "SKIP") return;

    setQIndex((prev) => {
      const next = prev + 1;
      return next >= effectiveQuestions.length ? prev : next;
    });
  }, [effectiveQuestions, qIndex]);

  const uploadRecordedFile = async (
    videoBlob: Blob,
    meta: { qIndex: number }
  ) => {
    const cur = effectiveQuestions[meta.qIndex];

    console.log("[uploadRecordedFile] 현재 qIndex:", meta.qIndex);
    console.log("[uploadRecordedFile] 현재 질문 번호:", cur?.order);
    console.log("[uploadRecordedFile] 현재 질문 코드:", cur?.questionCode);
    console.log("[uploadRecordedFile] 현재 질문 ID:", cur?.questionId);
    console.log("[uploadRecordedFile] 현재 질문 내용:", cur?.question);

    if (!cur) return { uploadResult: null, followupRes: null };
    if (cur.type === "SKIP") return { uploadResult: null, followupRes: null };

    const questionText = cur.question;
    const isFollowupNow = cur.type === "FOLLOWUP";

    setIsUploading(true);

    try {
      let uploadResult: any;

      try {
        uploadResult = await retryRequest(
          () => uploadJobInterviewVideo(videoBlob),
          { label: "uploadJobInterviewVideo" }
        );
        console.log("영상업로드 후 면접영상 저장 api 날리기");

        const res = await retryRequest(
          () =>
            saveInterviewAnalysis({
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
            }),
          { label: "saveInterviewAnalysis" }
        );

        console.log("면접 영상 저장 API", res);
      } catch (err) {
        console.error(
          "[uploadRecordedFile] video upload failed after retries:",
          err
        );
        toast.error(VIDEO_SAVE_FAIL_MESSAGE);
        navigate("/");
        return { uploadResult: null, followupRes: null };
      }

      if (isFollowupNow) {
        console.log(
          "[uploadRecordedFile] 현재 질문은 FOLLOWUP 이라 추가 꼬리질문 생성 없이 종료"
        );
        return { uploadResult, followupRes: null };
      }

      if (cur.order === 1) {
        console.log(
          "[uploadRecordedFile] 1번 질문(자기소개)은 꼬리질문 생성 스킵"
        );
        return { uploadResult, followupRes: null };
      }

      const alreadyHasFollowup = !!followUpMap[cur.order];
      console.log("[uploadRecordedFile] 이미 꼬리질문 있는지:", alreadyHasFollowup);

      if (alreadyHasFollowup) {
        return { uploadResult, followupRes: null };
      }

      const payload = {
        qz_group: Number(state?.interviewGroupId),
        question_code:
          cur.questionCode ?? `Q${String(cur.order).padStart(2, "0")}`,
        video_url: uploadResult.finalUrl,
      };

      console.log("[uploadRecordedFile] followup request payload:", payload);

      let followupRes: any;
      try {
        followupRes = await retryRequest(
          () => fetchInterviewFollowup(payload),
          { label: "fetchInterviewFollowup" }
        );
        console.log("[uploadRecordedFile] followup 응답:", followupRes);
      } catch (err) {
        console.error(
          "[uploadRecordedFile] followup API failed after retries, keep original flow:",
          err
        );
        return { uploadResult, followupRes: null };
      }

      if (!followupRes?.success) {
        console.error("[uploadRecordedFile] followup business error:", followupRes?.error);
        return { uploadResult, followupRes };
      }

      const followupData = followupRes?.data;
      const followupRequired = Boolean(followupData?.follow_up_required);
      const followupQuestionText = followupData?.follow_up_question ?? null;
      const followupIntent = followupData?.follow_up_intent ?? null;
      const missingEvidence = Array.isArray(followupData?.missing_evidence)
        ? followupData.missing_evidence
        : [];

      console.log("[uploadRecordedFile] follow_up_required:", followupRequired);
      console.log("[uploadRecordedFile] follow_up_question:", followupQuestionText);
      console.log("[uploadRecordedFile] follow_up_intent:", followupIntent);
      console.log("[uploadRecordedFile] missing_evidence:", missingEvidence);

      if (!followupRequired || !followupQuestionText) {
        return { uploadResult, followupRes };
      }

      const followupOrder = cur.order + 1;
      const followupHint =
        [followupIntent, missingEvidence.length ? `보완 필요: ${missingEvidence.join(", ")}` : ""]
          .filter(Boolean)
          .join(" | ") || undefined;

      const followupLive: LiveQuestion = {
        stage: "꼬리 질문",
        question: followupQuestionText,
        order: followupOrder,
        type: "FOLLOWUP",
        difficulty: cur.difficulty,
        answerHint: followupHint,
        questionId: undefined,
        questionCode: `${cur.questionCode ?? `Q${String(cur.order).padStart(2, "0")}`}_FU`,
        relatedItems: [],
      };

      console.log("[uploadRecordedFile] 생성된 followupLive:", followupLive);
      console.log(
        `[uploadRecordedFile] 기본 질문 ${cur.order} 다음에 꼬리질문 ${followupOrder}번으로 삽입`
      );

      setFollowUpMap((prev) => ({ ...prev, [cur.order]: followupLive }));

      try {
        const saveRes = await retryRequest(
          () =>
            saveFollowOnQue({
              qzGroup: Number(state?.interviewGroupId),
              num: followupOrder,
              que: followupQuestionText,
            }),
          { label: "saveFollowOnQue" }
        );
        console.log("✅ [uploadRecordedFile] 꼬리질문 저장 성공:", saveRes);
        console.log("✅ [uploadRecordedFile] 저장된 꼬리질문:", {
          qzGroup: Number(state?.interviewGroupId),
          num: followupOrder,
          que: followupQuestionText,
        });
      } catch (err) {
        console.error(
          "[uploadRecordedFile] saveFollowOnQue 실패 after retries:",
          err
        );
      }

      return { uploadResult, followupRes };
    } finally {
      setIsUploading(false);
    }
  };

  const ensureStream = async (): Promise<MediaStream | null> => {
    if (mediaStreamRef.current) return mediaStreamRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      mediaStreamRef.current = stream;
      setPreviewStream(stream);
      return stream;
    } catch (err) {
      console.error("[Recorder] getUserMedia failed:", err);
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        mediaStreamRef.current = stream;
        setPreviewStream(stream);
      } catch (err) {
        console.error("[MockInterviewLive] camera init failed:", err);
      }
    })();

    return () => {
      cancelled = true;
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
      setPreviewStream(null);
    };
  }, []);

  const startRecording = async () => {
    if (isRecording || mediaRecorderRef.current) {
      return;
    }

    const stream = await ensureStream();
    if (!stream) return;

    recordedChunksRef.current = [];

    const mimeCandidates = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];
    const mimeType =
      mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || "";

    try {
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
      console.error("[Recorder] start failed:", err);
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

    mediaRecorderRef.current = null;

    await uploadRecordedFile(blob, { qIndex: targetQIndex });
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
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== "inactive"
        ) {
          console.log("[answering cleanup] recorder stop");
          mediaRecorderRef.current.stop();
        }
      } catch (e) {
        console.error("[answering cleanup] recorder stop error:", e);
      }

      mediaRecorderRef.current = null;
      recordedChunksRef.current = [];
      setIsRecording(false);
    };
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
      while (
        next < effectiveQuestions.length &&
        effectiveQuestions[next].type === "SKIP"
      ) {
        next += 1;
      }
      return next >= effectiveQuestions.length ? prev : next;
    });
  };

  const current = effectiveQuestions[qIndex] ?? baseQuestions[0];

  const visibleCurrentIndex = useMemo(() => {
    return (
      effectiveQuestions
        .slice(0, qIndex + 1)
        .filter((q) => q.type !== "SKIP").length - 1
    );
  }, [effectiveQuestions, qIndex]);

  const visibleTotalCount = useMemo(() => {
    return effectiveQuestions.filter((q) => q.type !== "SKIP").length;
  }, [effectiveQuestions]);

  const visibleIsLast = (() => {
    for (let i = qIndex + 1; i < effectiveQuestions.length; i++) {
      if (effectiveQuestions[i].type !== "SKIP") return false;
    }
    return true;
  })();

  const progress = Math.min(
    1,
    Math.max(0, (THINKING_SECONDS - timeLeft) / THINKING_SECONDS)
  );

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
            stream={previewStream}
            isLast={visibleIsLast}
            onEnd={async () => {
              if (isUploading) return;

              const currentQIndex = qIndex;
              const isLastQuestion = visibleIsLast;

              await stopRecordingAndUpload(currentQIndex);

              if (isLastQuestion) {
                setIsUploading(true);
                try {
                  const completePayload = {
                    qz_group: state?.interviewGroupId,
                  };

                  console.log(
                    "[MockInterviewLive] completeInterview request:",
                    completePayload
                  );

                  const completeRes = await retryRequest(
                    () => completeInterview(completePayload),
                    { label: "completeInterview" }
                  );

                  console.log(
                    "[MockInterviewLive] completeInterview response:",
                    completeRes
                  );

                  const resumeIdxForLock = Number(state?.resumeDetail?.resumeIdx);
                  if (Number.isFinite(resumeIdxForLock)) {
                    console.log(
                      "[MockInterviewLive] lockAndCloneResume request:",
                      resumeIdxForLock
                    );
                    const lockRes = await lockAndCloneResume(resumeIdxForLock);
                    console.log(
                      "[MockInterviewLive] lockAndCloneResume response:",
                      lockRes
                    );
                  } else {
                    console.warn(
                      "[MockInterviewLive] lockAndCloneResume skipped: invalid resumeIdx",
                      state?.resumeDetail
                    );
                  }
                } catch (err) {
                  console.error(
                    "[MockInterviewLive] completeInterview failed after retries:",
                    err
                  );
                  toast.error(VIDEO_SAVE_FAIL_MESSAGE);
                  navigate("/");
                } finally {
                  setIsUploading(false);
                }

                return;
              }

              setPhase("thinking");
              advanceToNextVisibleQuestion();
              handleThinkingRestart();
            }}
          />
        )}

        <LiveSidePanel
          currentIndex={visibleCurrentIndex}
          totalCount={visibleTotalCount}
          interviewState={state}
          interviewStageStatus={state?.interviewStageStatus}
          currentQuestion={current}
        />
      </div>

      <Modal
        open={isResumeModalOpen}
        title="유효하지 않은 접근입니다."
        confirmText="확인"
        confirmClassName="btn_w_full default_btn_white"
        onConfirm={() => {
          setIsResumeModalOpen(false);
          navigate("/");
        }}
        onClose={() => {
          setIsResumeModalOpen(false);
          navigate("/");
        }}
        showCancel={false}
      />
    </div>
  );
}