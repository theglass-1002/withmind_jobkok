
// TestIntro.tsx
import React, { useState, useRef, TouchEvent } from 'react';
import env_guide_face_position from "@/assets/testImg/env_guide_face_position.png";
import env_guide_voice_level from "@/assets/testImg/env_guide_voice_level.png";

type TestIntroProps = {
    onStart: () => void;
};

export default function TestIntro({ onStart }: TestIntroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const slides = [
        {
            number: '01',
            title: '자세를 바르게 해 주세요.',
            desc: '가이드라인에 얼굴 전체가 들어오도록 해 주세요.',
            image: env_guide_face_position
        },
        {
            number: '02',
            title: '적절한 크기의 목소리로 말해주세요.',
            desc: '조용한 장소에서 테스트를 진행해주세요.',
            image: env_guide_voice_level
        }
    ];

    const handleTouchStart = (e: TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
        
        if (isRightSwipe && currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    return (
        <>
            {/* 데스크톱 버전 */}
            <div className="env-guide">
                <span className="env-guide__description">
                    원활한 면접을 위해 환경 테스트를 먼저 진행합니다.
                </span>
                
                <div className="env-guide__content-wrapper">
                    <div className="env-guide__item-list">
                        <div className="env-guide__item env-guide__item--visual">
                            <div className="env-guide__text-group">
                                <span className="env-guide__item-title">
                                    <span className='env-guide__item-number'>01</span>
                                    자세를 바르게 해 주세요.
                                </span>
                                <span className="env-guide__item-desc">
                                    가이드라인에 얼굴 전체가 들어오도록 해 주세요.
                                </span>
                            </div>
                            <div className="env-guide__image-box">
                                <img src={env_guide_face_position} alt="" />
                            </div>
                        </div>
                        <div className="env-guide__item env-guide__item--audio">
                            <div className="env-guide__text-group">
                                <span className="env-guide__item-title">
                                    <span className='env-guide__item-number'>02</span>
                                    적절한 크기의 목소리로 말해주세요.
                                </span>
                                <span className="env-guide__item-desc">
                                    조용한 장소에서 테스트를 진행해 주세요.
                                </span>
                            </div>
                            <div className="env-guide__image-box">
                                <img src={env_guide_voice_level} alt="" />
                            </div>
                        </div>
                    </div>
                    <button className="env-guide__start-btn" onClick={onStart}>
                        환경 테스트 시작하기
                    </button>
                </div>
            </div>
                {/* 모바일 버전 - 슬라이드 */}
                <div className="env-guide mobile">
                    <span className="env-guide__description">
                        원활한 면접을 위해 환경 테스트를 먼저 진행합니다.
                    </span>
                    
                    <div className="env-guide__content-wrapper">
                        <div 
                            className="env-guide__slider"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div 
                                className="env-guide__slides"
                                style={{ transform: `translateX(-${currentSlide * 80}%)` }}
                            >
                                {slides.map((slide, index) => (
                                            <div
                                            key={index}
                                            className={`env-guide__slide ${
                                            index === 0
                                                ? "first"
                                                : index === 1
                                                ? "second"
                                                : ""
                                            }`}
                                        >
                                        <div className="env-guide__item">
                                            <div className="env-guide__text-group">
                                                <span className="env-guide__item-title">
                                                    <span className='env-guide__item-number'>{slide.number}</span>
                                                    {slide.title}
                                                </span>
                                                <span className="env-guide__item-desc">
                                                    {slide.desc}
                                                </span>
                                            </div>
                                            <div className="env-guide__image-box">
                                               
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                 {/* 인디케이터 - 슬라이더 밖으로 이동 */}
                    
                            </div>
                            <div className="env-guide__indicators">
                            {slides.map((_, index) => (
                                <span 
                                    key={index}
                                    className={`env-guide__indicator ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => setCurrentSlide(index)}
                                />
                            ))}
                        </div>
                        </div>

                       

                        <button className="env-guide__start-btn" onClick={onStart}>
                            환경 테스트 시작하기
                        </button>
                    </div>
                </div>
        </>
    );
}