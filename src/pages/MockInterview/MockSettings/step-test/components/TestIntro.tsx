// TestIntro.tsx
import React from 'react';
import env_guide_face_position from "@/assets/testImg/env_guide_face_position.png";
import env_guide_voice_level from "@/assets/testImg/env_guide_voice_level.png";

type TestIntroProps = {
    onStart: () => void;
};

export default function TestIntro({ onStart }: TestIntroProps) {
    return (
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
    );
}