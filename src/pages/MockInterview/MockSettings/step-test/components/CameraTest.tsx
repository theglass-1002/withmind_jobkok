import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import face_outline_guide from "@/assets/testImg/face_outline_guide.png";
import ic_mic_white_24x32 from "@/assets/icons/size24/ic_mic_white_24x32.png";
import ic_check_white_48 from "@/assets/icons/size48/ic_check_white_48.png";
import ic_exclamation_white_48 from "@/assets/icons/size48/ic_exclamation_white_48.png";

import TestComplete from './TestComplete';



type CameraTestProps = {
    testType: 'camera' | 'mask';
    onNext: () => void;
    onFail: () => void;
};

const COUNTDOWN_SECONDS = 5;

export default function CameraTest({ testType, onNext, onFail }: CameraTestProps) {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [count, setCount] = useState(COUNTDOWN_SECONDS);
    const [filledChars, setFilledChars] = useState(0);

    const text = "안녕하세요, 반갑습니다.";
    const totalChars = text.length;


//    1. 화면 진입시 아작스 멘트 받아오기
//    2. 멘트뿌리기
//    3. 5초지나면 파일업로드 
//    6. 결과에 따른 결과값 실패유무 


    useEffect(() => {
        const startCamera = async () => {
            if (videoRef.current) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true
                    });

                    videoRef.current.srcObject = stream;
                    videoRef.current.play();

                    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const analyser = audioContext.createAnalyser();
                    const microphone = audioContext.createMediaStreamSource(stream);
                    microphone.connect(analyser);

                    return () => {
                        stream.getTracks().forEach(track => track.stop());
                    };

                } catch (error) {
                    console.error("카메라 접근 오류:", error);
                }
            }
        };

        startCamera();
    }, []);
    const startCountdown = useCallback(() => {
        if (isRecording) return;
    
        setIsRecording(true);
        setCount(COUNTDOWN_SECONDS);
        setFilledChars(0);
    
        const interval = setInterval(() => {
            setCount(prevCount => {
                if (prevCount === 1) {
                    clearInterval(interval);
                    setIsRecording(false);
                    
                    // 5초 완료 시 실행되는 함수
                    handleTestComplete();
                    
                    return COUNTDOWN_SECONDS;
                }
                return prevCount - 1;
            });
        }, 1000);
    
        // 글자 채우기 애니메이션
        const charInterval = setInterval(() => {
            setFilledChars(prev => {
                if (prev >= totalChars) {
                    clearInterval(charInterval);
                    return totalChars;
                }
                return prev + 1;
            });
        }, (COUNTDOWN_SECONDS * 1000) / totalChars);
    
        return () => {
            clearInterval(interval);
            clearInterval(charInterval);
        };
    }, [isRecording, totalChars]);
    
    // 5초 완료 후 실행되는 함수
    const handleTestComplete = () => {
        console.log('테스트 완료! 파일 업로드 시작');
        // 여기에 파일 업로드 로직 추가
        // 예: uploadRecording();
        // 결과에 따라 onNext() 또는 onFail() 호출
        navigate('/mock-interview/environment-test/complete');
    };

    return (
        <div className="camera-test-container">
            <video ref={videoRef} autoPlay playsInline muted className="camera-test__video-feed" />
            <div className='camera-test'> 
            <div className="camera-test__overlay-text">
                <span className="camera-test__main-instruction">
                    자세를 바르게 하고, 마이크 버튼을 누른 후 5초간 문장을 따라 읽어주세요.
                </span>
                <span className="camera-test__sub-instruction">
                    정확한 결과 분석을 위해 조용한 장소에서 테스트를 진행해 주세요.
                </span>
            </div>
            <img className='camera-test__guide-icon' src={face_outline_guide} alt="얼굴 가이드" />
            <div className="camera-test__controls-wrapper">
                <div className={`camera-test__mic-prompt ${isRecording ? 'is-recording' : ''}`}>
                    <div className="camera-test__prompt-text">
                        {text.split('').map((char, index) => (
                            <span
                                key={index}
                                className={`char ${index < filledChars ? 'filled' : ''}`}
                            >
                                {char}
                            </span>
                        ))}
                    </div>

                    <div
                        className={`camera-test__mic-button-wrapper ${isRecording ? 'recording' : ''}`}
                        onClick={startCountdown}
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
            <div className="env-test-result">
             <div className="env-test-result__icon">
                <img src={ic_check_white_48} alt="" />
             </div>
                <div className="env-test-result__content">
                    <span className="env-test-result__title">정상적인 면접 환경입니다.</span>
                    <span className="env-test-result__description">[모의면접 시작]을 눌러 면접을 진행해 주세요.</span>
                </div>
            </div>

            <div className="env-test-result env-test-result--error">
            <div className="env-test-result__icon">
                <img src={ic_exclamation_white_48} alt="Exclamation icon" />
            </div>

            <div className="env-test-result__content">
                <span className="env-test-result__title">
                정상적이지 않은 면접 환경입니다.
                </span>
                <span className="env-test-result__description">
                환경 테스트 실패 시 <em>대처 매뉴얼 보기</em>
                </span>
            </div>

            <div className="env-test-result__details">
                <span className="env-test-result__detail">• 얼굴 인식이 정상적으로 이루어지지 않았습니다.</span>
                <span className="env-test-result__detail">• 음성 인식이 정상적으로 이루어지지 않았습니다.</span>
            </div>

            <button className="default_btn_white radius">다시하기</button>
            </div>

        </div>
    );
}