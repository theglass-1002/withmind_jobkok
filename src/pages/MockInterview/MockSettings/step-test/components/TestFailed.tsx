import React from 'react'
import ic_exclamation_white_48 from "@/assets/icons/size48/ic_exclamation_white_48.png";


type TestFailedProps = {
  onRetry: () => void; // ← 부모에서 넘겨줄 함수
};


export default function TestFailed({ onRetry }: TestFailedProps) {
  return (
    <div className="env-test-result env-test-result--error show">
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

    <button className="default_btn_white radius retry_btn" onClick={onRetry}>다시하기</button>
</div>
  )
}
