import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState, useCallback } from "react";
import face_outline_guide from "@/assets/testImg/face_outline_guide.png";
import ic_mic_white_24x32 from "@/assets/icons/size24/ic_mic_white_24x32.png";
import ic_chevron_right_gray700_24 from "@/assets/icons/size24/ic_chevron_right_gray700_24.png";
import ic_chevron_left_gray900_24 from "@/assets/icons/size24/ic_chevron_left_gray900_24.png";
import ic_chevron_right_white_24 from "@/assets/icons/size24/ic_chevron_right_white_24.png";
import TestComplete from "./TestComplete";
import TestFailed from "./TestFailed";

import { uploadInterviewTestVideo } from "@/api/fileUpload.api";

type CameraTestProps = {
  testType: "camera" | "mask";
  onNext: () => void;
  onFail: () => void;
  speechText?: string;
};

const COUNTDOWN_SECONDS = 5;

type TestStatus = "testing" | "success" | "failed";

export default function CameraTest({
  testType,
  onNext,
  onFail,
  speechText = "안녕하세요, 반갑습니다.",
}: CameraTestProps) {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [count, setCount] = useState(COUNTDOWN_SECONDS);
  const [filledChars, setFilledChars] = useState(0);
  const [testStatus, setTestStatus] = useState<TestStatus>("testing");

  const text = speechText || "안녕하세요, 반갑습니다.";
  const totalChars = text.length;

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
        setTestStatus("failed");
      }
    };

    startCamera();

    return () => {
      try {
        recorderRef.current?.stop();
      } catch {}
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const stopRecordingAndUpload = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder) return;

    try {
      setIsUploading(true);

      const blob: Blob = await new Promise((resolve, reject) => {
        const onStop = () => {
          try {
            const mimeType =
              recorder.mimeType || "video/webm;codecs=vp8,opus";
            const recordedBlob = new Blob(chunksRef.current, { type: mimeType });
            resolve(recordedBlob);
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

      console.log("녹화 Blob 생성:", blob, "size:", blob.size);

      const uploadResult = await uploadInterviewTestVideo(
        blob,
        "env_test.webm",
        "interviewTest"
      );

      console.log("환경테스트 영상 업로드 결과:", uploadResult);

      setTestStatus("success");
    } catch (e) {
      console.error("녹화/업로드 실패:", e);
      setTestStatus("failed");
      onFail();
    } finally {
      setIsUploading(false);
      recorderRef.current = null;
      chunksRef.current = [];
    }
  }, [onFail]);

  const startRecording = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) {
      console.error("stream 없음");
      setTestStatus("failed");
      return;
    }

    chunksRef.current = [];

    const preferredMimeTypes = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];

    const mimeType = preferredMimeTypes.find((t) =>
      MediaRecorder.isTypeSupported(t)
    );

    try {
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      recorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.start(250);
    } catch (e) {
      console.error("MediaRecorder 시작 실패:", e);
      setTestStatus("failed");
    }
  }, []);

  const startCountdown = useCallback(() => {
    if (isRecording || isUploading) return;

    setTestStatus("testing");
    setIsRecording(true);
    setCount(COUNTDOWN_SECONDS);
    setFilledChars(0);

    startRecording();

    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount === 1) {
          clearInterval(interval);
          setIsRecording(false);

          void stopRecordingAndUpload();

          return COUNTDOWN_SECONDS;
        }
        return prevCount - 1;
      });
    }, 1000);

    const charInterval = setInterval(() => {
      setFilledChars((prev) => {
        if (prev >= totalChars) {
          clearInterval(charInterval);
          return totalChars;
        }
        return prev + 1;
      });
    }, (COUNTDOWN_SECONDS * 1000) / Math.max(1, totalChars));

    return () => {
      clearInterval(interval);
      clearInterval(charInterval);
    };
  }, [isRecording, isUploading, startRecording, stopRecordingAndUpload, totalChars]);

  const handleRetry = () => {
    setTestStatus("testing");
    setFilledChars(0);
    setCount(COUNTDOWN_SECONDS);
  };

  return (
    <>
      <div className="camera-test-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-test__video-feed"
        />

        {testStatus === "testing" && (
          <div className="camera-test">
            <div className="camera-test__overlay-text">
              <span className="camera-test__main-instruction">
                자세를 바르게 하고, 마이크 버튼을 누른 후 {COUNTDOWN_SECONDS}초간 문장을 따라 읽어주세요.
              </span>
              <span className="camera-test__sub-instruction">
                정확한 결과 분석을 위해 조용한 장소에서 테스트를 진행해 주세요.
              </span>
            </div>

            <div className="camera-test__guide-icon_container">
              <img
                className="camera-test__guide-icon"
                src={face_outline_guide}
                alt="얼굴 가이드"
              />
            </div>

            <div className="camera-test__controls-wrapper">
              <div
                className={`camera-test__mic-prompt ${
                  isRecording ? "is-recording" : ""
                }`}
              >
                <div className="camera-test__prompt-text">
                  {text.split("").map((char, index) => (
                    <span
                      key={index}
                      className={`char ${index < filledChars ? "filled" : ""}`}
                    >
                      {char}
                    </span>
                  ))}
                </div>

                <div
                  className={`camera-test__mic-button-wrapper ${
                    isRecording ? "recording" : ""
                  }`}
                  onClick={startCountdown}
                  style={{
                    pointerEvents: isUploading ? "none" : "auto",
                    opacity: isUploading ? 0.6 : 1,
                  }}
                >
                  {isRecording ? (
                    <span className="mic-counter">{count}</span>
                  ) : (
                    <img
                      src={ic_mic_white_24x32}
                      alt="마이크"
                      className="camera-test__mic-icon"
                    />
                  )}
                </div>
              </div>

              {isUploading && (
                <div style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
                  업로드 중...
                </div>
              )}
            </div>
          </div>
        )}

        {testStatus === "success" && <TestComplete />}
        {testStatus === "failed" && <TestFailed onRetry={handleRetry} />}

        <div className="mock-settings__submit-btn-container">
          <button
            className="default_btn_white radius"
            onClick={() => navigate("/mock-interview/settings")}
            disabled={isRecording || isUploading}
          >
            <img src={ic_chevron_left_gray900_24} alt="" />
            이전으로
          </button>

          {testStatus === "success" ? (
            <button
              className="mock_interview__start_btn"
              onClick={() => navigate("/mock-interview/mock-interview-live")}
            >
              모의면접 시작하기
              <img src={ic_chevron_right_white_24} alt="" />
            </button>
          ) : (
            <button className="default_btn_gray radius" disabled>
              모의면접 시작하기
              <img src={ic_chevron_right_gray700_24} alt="" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
