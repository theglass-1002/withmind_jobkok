import React from "react";
import "./MockInterview.css";
import ic_star_white_20 from "@/assets/icons/size20/ic_star_white_20.png";

export default function MockInterview() {
  return (
    <div className="mock-interview-page">
        
        <header className="mock-interview-page__hero">
        <div className="mock-interview-page__hero-headings">
            <span className="mock-interview-page__hero-title">AI 모의면접</span>
            <span className="mock-interview-page__hero-subtitle">
            이력서 기반의 맞춤형 질문으로
            <br /> 더욱 실전처럼 연습하세요!
            </span>
        </div>
        <button
            type="button"
            className="mock-interview-page__hero-cta default_btn_black radius"
            >
            <img
                className="mock-interview-page__hero-cta-icon"
                src={ic_star_white_20}
                alt=""
                aria-hidden="true"
            />
            <span className="mock-interview-page__hero-cta-label">모의면접 시작</span>
            </button>

        </header>


        <section className="mock-interview-page__section mock-interview-page__section--list">
          <div className="mock-interview-list">
            <div className="mock-interview-list__empty">모의면접리스트</div>
            {/* 아이템 있을 때 예시
            <article className="mock-interview-card">
              <h3 className="mock-interview-card__title">프론트엔드 직무 모의면접</h3>
              <span className="mock-interview-card__meta">최근 기록 · 2025.01.01</span>
            </article>
            */}
          </div>
        </section>
  
    </div>
  );
}
