import React from 'react'
import ic_check_white_48 from "@/assets/icons/size48/ic_check_white_48.png";



export default function TestComplete() {
  return (
        <>
           <div className="env-test-result show">
                    <div className="env-test-result__icon">
                        <img src={ic_check_white_48} alt="" />
                    </div>
                    <div className="env-test-result__content">
                        <span className="env-test-result__title">정상적인 면접 환경입니다.</span>
                        <span className="env-test-result__description">[모의면접 시작]을 눌러 면접을 진행해 주세요.</span>
                    </div>
                </div>
  </>
  )
}
