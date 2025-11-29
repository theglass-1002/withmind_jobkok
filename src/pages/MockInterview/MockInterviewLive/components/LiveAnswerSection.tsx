import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ic_timer_white_20 from "@/assets/icons/size20/ic_timer_white_20.png";
import ic_play_arrow_gray700_24 from "@/assets/icons/size24/ic_play_arrow_gray700_24.png";
import ic_timer_red_18 from "@/assets/icons/size18/ic_timer_red_18.png";
import ic_stop_white_24 from "@/assets/icons/size24/ic_stop_white_24.png";
import ic_cheer_white_48 from "@/assets/icons/size48/ic_cheer_white_48.png";

const ANSWER_SECONDS = 10;

export default function LiveAnswerSection() {
  const videoRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(ANSWER_SECONDS);
  const [running, setRunning] = useState(true);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false); // ✨ 완료 다이얼로그
  const rafRef = useRef(null);
  const startTsRef = useRef(0);
  const remainingMsRef = useRef(ANSWER_SECONDS * 1000); 

  const navigate = useNavigate();
    
  const handleMain = () => {
    navigate('/');
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("카메라 접근 오류:", err);
      }
    };
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        if (stream && typeof stream.getTracks === 'function') {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    const totalMs = ANSWER_SECONDS * 1000;
    
    // 타이머 시작/재개 시, 현재 시간을 기준으로 잔여 시간(remainingMsRef)을 빼서 시작점(startTsRef)을 설정
    startTsRef.current = performance.now() - (totalMs - remainingMsRef.current);

    const tick = (now) => {
      const elapsed = now - startTsRef.current;
      const remainMs = Math.max(0, totalMs - elapsed);
      const newTimeLeft = Math.floor(remainMs / 1000);

      // 잔여 밀리초를 레퍼런스에 저장 (stop 시 사용)
      remainingMsRef.current = remainMs;

      // 1초 단위로만 상태를 업데이트하여 불필요한 리렌더링 방지
      setTimeLeft(newTimeLeft);

      if (remainMs > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        console.log("⏰ 답변 시간 종료 → 완료 다이얼로그 표시");
        rafRef.current = null;
        setRunning(false);
        setShowCompleteDialog(true); // ✅ 타이머 종료 시 다이얼로그 표시
        startTsRef.current = 0;
        remainingMsRef.current = ANSWER_SECONDS * 1000; // 초기화
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const startTimer = () => {
    if (!running) {
      // 타이머가 0초에서 시작될 경우 (새로 시작)
      if (timeLeft === 0) {
        setTimeLeft(ANSWER_SECONDS);
        remainingMsRef.current = ANSWER_SECONDS * 1000;
      }
      setRunning(true);
    }
  };

  const stopTimer = () => {
    console.log("🛑 답변 종료 버튼 클릭 → 완료 다이얼로그 표시");
    setRunning(false);
    setShowCompleteDialog(true); // ✅ 답변 종료 버튼 클릭 시 다이얼로그 표시
    stopCamera();
  };

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  const stopCamera = () => {
    console.log("📷 카메라 중지");
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      if (stream && typeof stream.getTracks === 'function') {
        stream.getTracks().forEach((track) => track.stop());
      }
      videoRef.current.srcObject = null; // ✅ srcObject도 null로 설정
    }
  };

  return (
    <>
      <div className="mock-interview-live__main">
        <div className="mock-interview-live__answer">
          <span className="mock-interview-live__answer-bg"></span>
          <div className="mock-interview-live__answer-content">
            <div 
              className={`mock-interview-live__answer-timer ${timeLeft <= 5 ? 'mock-interview-live__answer-timer--warning' : ''}`}
            >
              <img src={ic_timer_white_20} alt="타이머 아이콘" />
              <span 
                className={`mock-interview-live__answer-time ${timeLeft <= 5 ? 'mock-interview-live__answer-timer--warning' : ''}`}
              >
                {minutes} : {seconds}
              </span>
            </div>
            <div 
              className={`mock-interview-live__answer-timer mobile ${timeLeft <= 5 ? 'mock-interview-live__answer-timer--warning' : ''}`}
            >
              <img src={timeLeft <= 5 ? ic_timer_red_18 : ic_timer_white_20} alt="타이머 아이콘" />
              <span 
                className={`mock-interview-live__answer-time ${timeLeft <= 5 ? 'mock-interview-live__answer-timer--warning' : ''}`}
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
            <img src={ic_play_arrow_gray700_24} alt="답변 시작 아이콘" /> 답변 시작
          </button>
          <button
            className="mock-interview-live__btn default_btn_red radius"
            onClick={stopTimer}
            disabled={!running}
          >
            <img src={ic_stop_white_24} alt="답변 종료 아이콘" /> 답변 종료
          </button>
        </div>
      </div>

      {/* 완료 다이얼로그 */}
      {showCompleteDialog && (
        <div className="mock-interview-dialog">
          <div className="mock-interview-dialog__header">
            <span className="mock-interview-dialog__icon">
              <img src={ic_cheer_white_48} alt="" />
            </span>

            <div className="mock-interview-dialog__text-group">
              <span className="mock-interview-dialog__title">
                홍길동님, 수고하셨습니다!
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
              onClick={() => {
                navigate('/mock-interview-report');
              }}
            >
              분석 결과 보기
            </button>
          </div>
        </div>
      )}
    </>
  );
}