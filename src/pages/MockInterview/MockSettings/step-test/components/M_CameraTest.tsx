import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import face_outline_guide from "@/assets/testImg/face_outline_guide.png";
import ic_mic_white_24x32 from "@/assets/icons/size24/ic_mic_white_24x32.png";
import ic_keyboard_arrow_left_gray900_24 from "@/assets/icons/size24/ic_keyboard_arrow_left_gray900_24.png";
import ic_chevron_right_white_24 from "@/assets/icons/size24/ic_chevron_right_white_24.png";
import TestComplete from "./TestComplete";
import TestFailed from "./TestFailed";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

import { uploadInterviewTestVideo } from "@/api/fileUpload.api";
import { fetchEnvTestAnalyze } from "@/api/interview/interview.api";

type M_CameraTestProps = {
  testType: "camera" | "mask";
  onFail: () => void;
  speechText?: string;
  onStartInterview: () => void;
};

type TestStatus = "testing" | "success" | "failed";

type EnvAnalyzeResult = {
  speech: string;
  status: number;
  message: "pass" | "fail" | "nopass";
  faceCheck: number;
  soundCheck: number;
};

type FailureCode = 0 | 1 | 2 | 3;

const COUNTDOWN_SECONDS = 5;
const DEFAULT_SPEECH_TEXT = "안녕하세요, 반갑습니다.";

export default function M_CameraTest({
  testType,
  onFail,
  speechText = DEFAULT_SPEECH_TEXT,
  onStartInterview,
}: M_CameraTestProps) {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const countdownIntervalRef = useRef<number | null>(null);
  const charIntervalRef = useRef<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [count, setCount] = useState(COUNTDOWN_SECONDS);
  const [filledChars, setFilledChars] = useState(0);

  const [testStatus, setTestStatus] = useState<TestStatus>("testing");
  const [showOverlay, setShowOverlay] = useState(true);

  const [videoUrl, setVideoUrl] = useState<string>("");
  const [analyzeResult, setAnalyzeResult] = useState<EnvAnalyzeResult | null>(null);
  const [failureCode, setFailureCode] = useState<FailureCode | undefined>(undefined);

  const [isViewingVideo, setIsViewingVideo] = useState(false);

  const text = speechText;
  const totalChars = text.length;

  const clearTimers = useCallback(() => {
    if (countdownIntervalRef.current !== null) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (charIntervalRef.current !== null) {
      window.clearInterval(charIntervalRef.current);
      charIntervalRef.current = null;
    }
  }, []);

  const resetTestState = useCallback(() => {
    setTestStatus("testing");
    setFailureCode(undefined);
    setAnalyzeResult(null);
    setVideoUrl("");
    setCount(COUNTDOWN_SECONDS);
    setFilledChars(0);
    setShowOverlay(true);
    setIsViewingVideo(false);
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      if (!videoRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
      } catch (error) {
        console.error("카메라 접근 오류:", error);
        setFailureCode(3);
        setTestStatus("failed");
        onFail();
      }
    };

    startCamera();

    return () => {
      clearTimers();
      try {
        recorderRef.current?.stop();
      } catch {}
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      recorderRef.current = null;
      chunksRef.current = [];
    };
  }, [clearTimers, onFail]);

  useEffect(() => {
    if (testStatus !== "testing") return;

    const timer = window.setTimeout(() => {
      setShowOverlay(false);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [testStatus]);

  const startRecording = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) {
      console.error("stream 없음");
      setFailureCode(3);
      setTestStatus("failed");
      onFail();
      return false;
    }

    chunksRef.current = [];

    const preferredMimeTypes = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];

    const mimeType = preferredMimeTypes.find((t) => MediaRecorder.isTypeSupported(t));

    try {
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      recorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.start(250);
      return true;
    } catch (e) {
      console.error("MediaRecorder 시작 실패:", e);
      setFailureCode(0);
      setTestStatus("failed");
      onFail();
      return false;
    }
  }, [onFail]);

  const stopRecordingAndUpload = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder) return;

    try {
      setIsUploading(true);

      const blob: Blob = await new Promise((resolve, reject) => {
        const onStop = () => {
          try {
            const mimeType = recorder.mimeType || "video/webm;codecs=vp8,opus";
            resolve(new Blob(chunksRef.current, { type: mimeType }));
          } catch (err) {
            reject(err);
          }
        };

        recorder.addEventListener("stop", onStop, { once: true });

        try {
          recorder.stop();
        } catch (err) {
          recorder.removeEventListener("stop", onStop);
          reject(err);
        }
      });

      let uploadResult: any;
      try {
        uploadResult = await uploadInterviewTestVideo(blob, "env_test.webm", "interviewTest");
        console.log('테스트영상 업로드 결과',uploadResult);
      } catch (uploadErr) {
        console.error("영상 업로드 실패:", uploadErr);
        setFailureCode(0);
        setTestStatus("failed");
        onFail();
        return;
      }

      setVideoUrl(uploadResult.finalUrl);

      const result = await fetchEnvTestAnalyze({
        file_url: uploadResult.finalUrl,
        speech: text,
      });

      if (result.message === "nopass" || result.message === "fail") {
        const normalized: EnvAnalyzeResult = {
          speech: text,
          status: result.status,
          message: result.message,
          faceCheck: result.faceCheck,
          soundCheck: result.soundCheck,
        };

        setAnalyzeResult(normalized);
        setTestStatus("failed");
        return;
      }

      setTestStatus("success");
    } catch (e) {
      console.error("녹화/업로드/분석 실패:", e);
      setFailureCode(0);
      setTestStatus("failed");
      onFail();
    } finally {
      setIsUploading(false);
      recorderRef.current = null;
      chunksRef.current = [];
    }
  }, [onFail, text]);

  const startCountdown = useCallback(() => {
    if (isViewingVideo) return;
    if (isRecording || isUploading) return;

    clearTimers();
    resetTestState();
    setShowOverlay(false);
    setIsRecording(true);

    const ok = startRecording();
    if (!ok) {
      setIsRecording(false);
      clearTimers();
      return;
    }

    countdownIntervalRef.current = window.setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearTimers();
          setIsRecording(false);
          void stopRecordingAndUpload();
          return COUNTDOWN_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    const stepMs = (COUNTDOWN_SECONDS * 1000) / Math.max(1, totalChars);
    charIntervalRef.current = window.setInterval(() => {
      setFilledChars((prev) => {
        if (prev >= totalChars) {
          if (charIntervalRef.current !== null) {
            window.clearInterval(charIntervalRef.current);
            charIntervalRef.current = null;
          }
          return totalChars;
        }
        return prev + 1;
      });
    }, stepMs);
  }, [
    clearTimers,
    isRecording,
    isUploading,
    isViewingVideo,
    resetTestState,
    startRecording,
    stopRecordingAndUpload,
    totalChars,
  ]);

  const handleRetry = useCallback(() => {
    clearTimers();
    resetTestState();
  }, [clearTimers, resetTestState]);

  const handleViewVideo = useCallback(() => setIsViewingVideo(true), []);
  const handleCloseVideoView = useCallback(() => setIsViewingVideo(false), []);

  return (
    <>
      <div className="camera-test-container mobile">
        <video ref={videoRef} autoPlay playsInline muted className="camera-test__video-feed" />

        {testStatus === "testing" && (
          <div className="camera-test">
            {showOverlay && (
              <div className="camera-test__overlay-text">
                <span className="camera-test__main-instruction">
                  자세를 바르게 하고, 마이크 버튼을 누른 후 {COUNTDOWN_SECONDS}초간 문장을 따라
                  읽어주세요.
                </span>
                <span className="camera-test__sub-instruction">
                  정확한 결과 분석을 위해 조용한 장소에서 테스트를 진행해 주세요.
                </span>
              </div>
            )}

            <div className="camera-test__guide-icon_container">
              <img className="camera-test__guide-icon" src={face_outline_guide} alt="얼굴 가이드" />
            </div>

            <div className="camera-test__controls-wrapper">
              <div className={`camera-test__mic-prompt ${isRecording ? "is-recording" : ""}`}>
                <div className="camera-test__prompt-text">
                  {text.split("").map((char, index) => {
                    const safeChar = char === " " ? "\u00A0" : char;
                    return (
                      <span key={index} className={`char ${index < filledChars ? "filled" : ""}`}>
                        {safeChar}
                      </span>
                    );
                  })}
                </div>

                <div className="mic-btn_container">
                  <div
                    className={`camera-test__mic-button-wrapper ${isRecording ? "recording" : ""}`}
                    onClick={startCountdown}
                    style={{
                      pointerEvents: isUploading ? "none" : "auto",
                      opacity: isUploading ? 0.6 : 1,
                    }}
                  >
                    {isRecording ? (
                      <span className="mic-counter">{count}</span>
                    ) : (
                      <img src={ic_mic_white_24x32} alt="마이크" className="camera-test__mic-icon" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {testStatus === "success" && (
          <>
            <TestComplete />
            <div className="env-test-result_btn-container">
              <button className="default_btn_white radius back_btn" onClick={() => navigate(-1)}>
                <img src={ic_keyboard_arrow_left_gray900_24} alt="" />
              </button>

              <button className="btn_w_full mock-instructions__btn--primary radius" onClick={onStartInterview}>
                모의면접 시작하기
                <img src={ic_chevron_right_white_24} alt="" />
              </button>
            </div>
          </>
        )}

        {testStatus === "failed" && (
          <>
            <TestFailed
              speechText={speechText}
              videoUrl={videoUrl}
              analyzeResult={analyzeResult}
              failureCode={failureCode}
              isViewingVideo={isViewingVideo}
            />

            <div className="env-test-result_btn-container">
              {isViewingVideo ? (
                <>
                  <button className="default_btn_white radius back_btn" onClick={handleCloseVideoView}>
                    <img src={ic_keyboard_arrow_left_gray900_24} alt="" />
                  </button>
                  <button className="btn_w_full default_btn_white radius" onClick={handleRetry}>
                    테스트 다시하기
                  </button>
                </>
              ) : (
                <>
                  <button className="btn_w_full default_btn_white radius" onClick={handleViewVideo}>
                    테스트 영상 확인하기
                  </button>
                  <button className="btn_w_full btn-retry-test radius" onClick={handleRetry}>
                    테스트 다시하기
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <LoadingOverlay isLoading={isUploading} text="영상을 분석하고 있습니다..." isLogo={true} />
    </>
  );
}
