import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState, useCallback } from "react";
import face_outline_guide from "@/assets/testImg/face_outline_guide.png";
import ic_mic_white_24x32 from "@/assets/icons/size24/ic_mic_white_24x32.png";
import ic_chevron_right_gray700_24 from "@/assets/icons/size24/ic_chevron_right_gray700_24.png";
import ic_chevron_left_gray900_24 from "@/assets/icons/size24/ic_chevron_left_gray900_24.png";
import ic_chevron_right_white_24 from "@/assets/icons/size24/ic_chevron_right_white_24.png";
import TestComplete from "./TestComplete";
import TestFailed from "./TestFailed";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

import { uploadInterviewTestVideo } from "@/api/fileUpload.api";
import { fetchEnvTestAnalyze } from "@/api/interview/interview.api";

type CameraTestProps = {
  testType: "camera" | "mask";
  onStartInterview: () => void;
  onFail: () => void;
  speechText?: string;
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

const COUNTDOWN_SECONDS = 10;
const DEFAULT_SPEECH_TEXT = "안녕하세요, 반갑습니다.";

declare global {
  interface Window {
    __forceEnvTestPassOnly?: () => void;
    __forceEnvTestPassAndGo?: () => void;
    __forceEnvTestFail?: () => void;
    __cameraTestActiveInstanceId?: string;
  }
}

function makeInstanceId() {
  return `CameraTest#${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export default function CameraTest({
  testType,
  onStartInterview,
  onFail,
  speechText = DEFAULT_SPEECH_TEXT,
}: CameraTestProps) {
  const navigate = useNavigate();
  const instanceIdRef = useRef<string>(makeInstanceId());

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const countdownIntervalRef = useRef<number | null>(null);
  const charIntervalRef = useRef<number | null>(null);

  const devOverrideRef = useRef<null | "pass" | "fail">(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [count, setCount] = useState(COUNTDOWN_SECONDS);
  const [filledChars, setFilledChars] = useState(0);
  const [testStatus, setTestStatus] = useState<TestStatus>("testing");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [analyzeResult, setAnalyzeResult] = useState<EnvAnalyzeResult | null>(null);
  const [failureCode, setFailureCode] = useState<FailureCode | undefined>(undefined);
  const [isViewingVideo, setIsViewingVideo] = useState(false);

  const totalChars = speechText.length;

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
    devOverrideRef.current = null;
    setTestStatus("testing");
    setFailureCode(undefined);
    setAnalyzeResult(null);
    setVideoUrl("");
    setCount(COUNTDOWN_SECONDS);
    setFilledChars(0);
    setIsViewingVideo(false);
  }, []);

  useEffect(() => {

  }, [testStatus, isUploading, isRecording, isViewingVideo]);

  useEffect(() => {
    window.__cameraTestActiveInstanceId = instanceIdRef.current;
 
    const forceSuccessCommon = () => {
      devOverrideRef.current = "pass";
      clearTimers();
      setIsUploading(false);
      setIsRecording(false);
      setIsViewingVideo(false);
      setFailureCode(undefined);
      setAnalyzeResult(null);
      setTestStatus("success");
      onStartInterview();
    };

    window.__forceEnvTestPassOnly = () => {
      forceSuccessCommon();
      onStartInterview();
    };

    window.__forceEnvTestPassAndGo = () => {
      forceSuccessCommon();
      onStartInterview();
    };

    window.__forceEnvTestFail = () => {
      console.log(
        `[DEV CALL] __forceEnvTestFail active=${window.__cameraTestActiveInstanceId}, this=${instanceIdRef.current}`
      );

      devOverrideRef.current = "fail";
      clearTimers();

      setIsUploading(false);
      setIsRecording(false);
      setIsViewingVideo(false);

      setTestStatus("failed");
    };

    return () => {
      if (window.__cameraTestActiveInstanceId === instanceIdRef.current) {
        delete window.__cameraTestActiveInstanceId;
      }
      delete window.__forceEnvTestPassOnly;
      delete window.__forceEnvTestPassAndGo;
      delete window.__forceEnvTestFail;
    };
  }, [clearTimers, navigate]);

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
      } catch (error) {
        console.error("카메라 접근 오류:", error);
        if (devOverrideRef.current) return;
        
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

  const startRecording = useCallback(() => {
    if (devOverrideRef.current) return false;

    const stream = streamRef.current;
    if (!stream) {
      console.error("stream 없음");
      if (devOverrideRef.current) return false;

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
      if (devOverrideRef.current) return false;

      setFailureCode(0);
      setTestStatus("failed");
      onFail();
      return false;
    }
  }, [onFail]);

  const stopRecordingAndUpload = useCallback(async () => {
    if (devOverrideRef.current) return;

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

      if (devOverrideRef.current) return;

      let uploadResult: any;
      try {
        uploadResult = await uploadInterviewTestVideo(blob, "env_test.webm", "interviewTest");
      } catch (uploadErr) {
        console.error("영상 업로드 실패:", uploadErr);
        if (devOverrideRef.current) return;

        setFailureCode(0);
        setTestStatus("failed");
        onFail();
        return;
      }

      if (devOverrideRef.current) return;

      setVideoUrl(uploadResult.finalUrl);

      const result = await fetchEnvTestAnalyze({
        file_url: uploadResult.finalUrl,
        speech: speechText,
      });

      if (devOverrideRef.current) return;

      if (result.message === "nopass" || result.message === "fail") {
        const normalized: EnvAnalyzeResult = {
          speech: speechText,
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
      if (devOverrideRef.current) return;

      setFailureCode(0);
      setTestStatus("failed");
      onFail();
    } finally {
      setIsUploading(false);
      recorderRef.current = null;
      chunksRef.current = [];
    }
  }, [onFail, speechText]);

  const startCountdown = useCallback(() => {
    if (isRecording || isUploading) return;

    clearTimers();
    resetTestState();

    setIsRecording(true);

    const ok = startRecording();
    if (!ok) {
      setIsRecording(false);
      clearTimers();
      return;
    }

    countdownIntervalRef.current = window.setInterval(() => {
      setCount((prevCount) => {
        if (prevCount === 1) {
          clearTimers();
          setIsRecording(false);
          void stopRecordingAndUpload();
          return COUNTDOWN_SECONDS;
        }
        return prevCount - 1;
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

  const renderActionButtons = () => {
    const isDisabled = isRecording || isUploading;

    if (isViewingVideo) {
      return (
        <>
          <button className="default_btn_white radius" onClick={handleCloseVideoView}>
            <img src={ic_chevron_left_gray900_24} alt="" />
            돌아가기
          </button>
          <button className="mock_interview__start_btn" onClick={handleRetry}>
            테스트 다시하기
            <img src={ic_chevron_right_white_24} alt="" />
          </button>
        </>
      );
    }

    switch (testStatus) {
      case "failed":
        return (
          <>
            <button
              className="default_btn_white radius"
              onClick={handleViewVideo}
              disabled={isDisabled}
            >
              테스트 영상 확인하기
            </button>
            <button className="mock_interview__start_btn" onClick={handleRetry}>
              테스트 다시하기
              <img src={ic_chevron_right_white_24} alt="" />
            </button>
          </>
        );

      case "success":
        return (
          <>
            <button
              className="default_btn_white radius"
              onClick={() => navigate("/mock-interview/settings")}
              disabled={isDisabled}
            >
              <img src={ic_chevron_left_gray900_24} alt="" />
              이전으로
            </button>
            <button
              className="mock_interview__start_btn"
              onClick={onStartInterview}>
              모의면접 시작하기
              <img src={ic_chevron_right_white_24} alt="" />
            </button>
          </>
        );

      case "testing":
      default:
        return (
          <>
            <button
              className="default_btn_white radius"
              onClick={() => navigate("/mock-interview/settings")}
              disabled={isDisabled}
            >
              <img src={ic_chevron_left_gray900_24} alt="" />
              이전으로
            </button>
            <button className="default_btn_gray radius" disabled>
              모의면접 시작하기
              <img src={ic_chevron_right_gray700_24} alt="" />
            </button>
          </>
        );
    }
  };

  return (
    <div className="camera-test-container">
      <video ref={videoRef} autoPlay playsInline muted className="camera-test__video-feed" />

      {testStatus === "testing" && (
        <div className="camera-test">
          <div className="camera-test__overlay-text">
            <span className="camera-test__main-instruction">
              자세를 바르게 하고, 마이크 버튼을 누른 후 {COUNTDOWN_SECONDS}초간 문장을 따라
              읽어주세요.
            </span>
            <span className="camera-test__sub-instruction">
              정확한 결과 분석을 위해 조용한 장소에서 테스트를 진행해 주세요.
            </span>
          </div>

          <div className="camera-test__guide-icon_container">
            <img className="camera-test__guide-icon" src={face_outline_guide} alt="얼굴 가이드" />
          </div>

          <div className="camera-test__controls-wrapper">
            <div className={`camera-test__mic-prompt ${isRecording ? "is-recording" : ""}`}>
            <div className="camera-test__prompt-text">
              {speechText.split("").map((char, index) => {
                const safeChar = char === " " ? "\u00A0" : char; // 공백을 NBSP로
                return (
                  <span key={index} className={`char ${index < filledChars ? "filled" : ""}`}>
                    {safeChar}
                  </span>
                );
              })}
            </div>


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
      )}

      {testStatus === "success" && <TestComplete />}

      {testStatus === "failed" && (
        <TestFailed
          speechText={speechText}
          videoUrl={videoUrl}
          analyzeResult={analyzeResult}
          failureCode={failureCode}
          isViewingVideo={isViewingVideo}
        />
      )}

      <div className="mock-settings__submit-btn-container">{renderActionButtons()}</div>

      <LoadingOverlay isLoading={isUploading} text="영상을 분석하고 있습니다..." isLogo={true} />
    </div>
  );
}
