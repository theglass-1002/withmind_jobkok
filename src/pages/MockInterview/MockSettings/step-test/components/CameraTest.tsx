import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import face_outline_guide from "@/assets/testImg/face_outline_guide.png";
import ic_mic_white_24x32 from "@/assets/icons/size24/ic_mic_white_24x32.png";
import ic_chevron_right_gray700_24 from "@/assets/icons/size24/ic_chevron_right_gray700_24.png";
import ic_chevron_left_gray900_24 from "@/assets/icons/size24/ic_chevron_left_gray900_24.png";
import ic_chevron_right_white_24 from "@/assets/icons/size24/ic_chevron_right_white_24.png";
import TestComplete from './TestComplete';
import TestFailed from './TestFailed';

type CameraTestProps = {
    testType: 'camera' | 'mask';
    onNext: () => void;
    onFail: () => void;
};

const COUNTDOWN_SECONDS = 5;

type TestStatus = 'testing' | 'success' | 'failed';

export default function CameraTest({ testType, onNext, onFail }: CameraTestProps) {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [count, setCount] = useState(COUNTDOWN_SECONDS);
    const [filledChars, setFilledChars] = useState(0);
    const [testStatus, setTestStatus] = useState<TestStatus>('testing');

    const text = "안녕하세요, 반갑습니다.";
    const totalChars = text.length;

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
                    
                    handleTestComplete();
                    
                    return COUNTDOWN_SECONDS;
                }
                return prevCount - 1;
            });
        }, 1000);
    
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
    
    const handleTestComplete = () => {
        console.log('테스트 완료! 파일 업로드 시작');
        
        // TODO: 실제 API 호출 및 응답 처리
        // const result = await uploadTestData();
        // if (result.success) {
        //     setTestStatus('success');
        // } else {
        //     setTestStatus('failed');
        // }
        
        // 임시: 성공으로 설정 (테스트용)
        //setTestStatus('success');
       
        // 실패 테스트: 
        setTestStatus('failed');
    };

    const handleRetry = () => {
        setTestStatus('testing');
        setFilledChars(0);
    };

    return (
        <>
        <div className="camera-test-container">
            <video ref={videoRef} autoPlay playsInline muted className="camera-test__video-feed" />
            {testStatus === 'testing' && (
                <div className="camera-test"> 
                    <div className="camera-test__overlay-text">
                        <span className="camera-test__main-instruction">
                            자세를 바르게 하고, 마이크 버튼을 누른 후 5초간 문장을 따라 읽어주세요.
                        </span>
                        <span className="camera-test__sub-instruction">
                            정확한 결과 분석을 위해 조용한 장소에서 테스트를 진행해 주세요.
                        </span>
                    </div>
              
                    <div className='camera-test__guide-icon_container'>
                    <img className='camera-test__guide-icon' src={face_outline_guide} alt="얼굴 가이드" />
               
            
              
                    </div>
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
            )}

            {testStatus === 'success' && (
                <TestComplete/>
            )}
            {testStatus === 'failed' && (
             <TestFailed onRetry={handleRetry} />
            )}
            
             <div className="mock-settings__submit-btn-container">
                        <button className='default_btn_white radius'
                           onClick={() => navigate('/mock-interview/settings')}>
                            <img src={ic_chevron_left_gray900_24} alt="" />
                            이전으로</button>
            
                        {testStatus ==='success'?
                        <button className='mock_interview__start_btn'
                        onClick={() => navigate('/mock-interview/mock-interview-live')}>
                            모의면접 시작하기
                            <img src={ic_chevron_right_white_24} alt="" />
                            </button>: <button className='default_btn_gray radius' disabled>
                            모의면접 시작하기
                            <img src={ic_chevron_right_gray700_24} alt="" />
                            </button>}
                    
                    </div>
        </div>
        </>
    );
}