import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ic_timer_white_20 from "@/assets/icons/size20/ic_timer_white_20.png";
import ic_play_arrow_gray700_24 from "@/assets/icons/size24/ic_play_arrow_gray700_24.png";
import ic_timer_red_18 from "@/assets/icons/size18/ic_timer_red_18.png";
import ic_stop_white_24 from "@/assets/icons/size24/ic_stop_white_24.png";
import ic_cheer_white_48 from "@/assets/icons/size48/ic_cheer_white_48.png";

const ANSWER_SECONDS = 91;

type Props = {
  stream: MediaStream | null;
  onEnd?: () => void;
  isLast?: boolean;
};

export default function LiveAnswerSection({
  stream,
  onEnd,
  isLast = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [timeLeft, setTimeLeft] = useState(ANSWER_SECONDS);
  const [running, setRunning] = useState(true);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);
  const remainingMsRef = useRef<number>(ANSWER_SECONDS * 1000);

  const navigate = useNavigate();

  const handleMain = () => {
    navigate("/");
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }

    const playVideo = async () => {
      try {
        await video.play();
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error("카메라 접근 오류:", err);
        }
      }
    };

    playVideo();

    return () => {
      if (video) {
        video.pause();
        video.srcObject = null;
      }
    };
  }, [stream]);

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    const totalMs = ANSWER_SECONDS * 1000;
    startTsRef.current = performance.now() - (totalMs - remainingMsRef.current);

    const tick = (now: number) => {
      const elapsed = now - startTsRef.current;
      const remainMs = Math.max(0, totalMs - elapsed);
      const newTimeLeft = Math.floor(remainMs / 1000);

      remainingMsRef.current = remainMs;
      setTimeLeft(newTimeLeft);

      if (remainMs > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        setRunning(false);

        if (isLast) {
          setShowCompleteDialog(true);
        } else {
          onEnd?.();
        }

        startTsRef.current = 0;
        remainingMsRef.current = ANSWER_SECONDS * 1000;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [running, isLast, onEnd]);

  const startTimer = () => {
    if (!running) {
      if (timeLeft === 0) {
        setTimeLeft(ANSWER_SECONDS);
        remainingMsRef.current = ANSWER_SECONDS * 1000;
      }
      setRunning(true);
    }
  };

  const stopTimer = () => {
    setRunning(false);

    if (isLast) {
      setShowCompleteDialog(true);
    } else {
      onEnd?.();
    }
  };

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <>
      <div className="mock-interview-live__main">
        <div className="mock-interview-live__answer">
          <span className="mock-interview-live__answer-bg"></span>
          <div className="mock-interview-live__answer-content">
            <div
              className={`mock-interview-live__answer-timer ${
                timeLeft <= 5 ? "mock-interview-live__answer-timer--warning" : ""
              }`}
            >
              <img src={ic_timer_white_20} alt="타이머 아이콘" />
              <span
                className={`mock-interview-live__answer-time ${
                  timeLeft <= 5 ? "mock-interview-live__answer-timer--warning" : ""
                }`}
              >
                {minutes} : {seconds}
              </span>
            </div>

            <div
              className={`mock-interview-live__answer-timer mobile ${
                timeLeft <= 5 ? "mock-interview-live__answer-timer--warning" : ""
              }`}
            >
              <img
                src={timeLeft <= 5 ? ic_timer_red_18 : ic_timer_white_20}
                alt="타이머 아이콘"
              />
              <span
                className={`mock-interview-live__answer-time ${
                  timeLeft <= 5 ? "mock-interview-live__answer-timer--warning" : ""
                }`}
              >
                {minutes} : {seconds}
              </span>
            </div>

            <div className="mock-interview-live__camera">
              <video
                ref={videoRef}
                className="mock-interview-live__camera-feed"
                autoPlay
                muted
                playsInline
              />
            </div>
          </div>
        </div>

        <div className="mock-interview-live__actions">
          <button
            className="mock-interview-live__btn mock-interview-live__btn--end"
            onClick={startTimer}
            disabled={running}
          >
            <img src={ic_play_arrow_gray700_24} alt="답변 시작 아이콘" />
            답변 시작
          </button>

          <button
            className="mock-interview-live__btn default_btn_red radius"
            onClick={stopTimer}
            disabled={!running}
          >
            <img src={ic_stop_white_24} alt="답변 종료 아이콘" />
            답변 종료
          </button>
        </div>
      </div>

      {showCompleteDialog && (
        <div className="mock-interview-dialog">
          <div className="mock-interview-dialog__header">
            <span className="mock-interview-dialog__icon">
              <img src={ic_cheer_white_48} alt="" />
            </span>

            <div className="mock-interview-dialog__text-group">
              <span className="mock-interview-dialog__title">
                정유리님, 수고하셨습니다!
              </span>
              <span className="mock-interview-dialog__description">
                모의면접이 종료되었습니다. 분석 결과를 확인해 보세요.
              </span>
            </div>
          </div>

          <div className="mock-interview-dialog__actions">
            <button
              className="mock-interview-dialog__btn default_btn_white radius"
              onClick={handleMain}
            >
              메인 페이지로
            </button>
            <button
              className="mock-interview-dialog__btn--primary"
              onClick={() => navigate("/mock-interview-report")}
            >
              분석 결과 보기
            </button>
          </div>
        </div>
      )}
    </>
  );
}