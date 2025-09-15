import { useState } from "react";
import "./Recovery.css";


export default function FindId() {

  return (
      <section className="recovery-panel">
        {/* <div className="recovery-info">
          <span className="recovery-info__title">잡콕 회원가입 정보로
           <br /> 아이디 찾기를 진행해 주세요</span>
          <span className="form-tip_text_gray">휴대폰 본인 인증을 통해서 아이디를 찾을 수 있습니다.</span>
        </div>

        <div className="form-actions">
          <button type="button" className="btn_w_full default_btn_white">취소</button>
          <button type="submit" className="btn_w_full default_btn_black">본인 인증</button>
        </div> */}

        <div className="recovery-info result">
          <span className="recovery-info__title title__result">요청하신 아이디는 다음과 같습니다.</span>
          <span className="recovery-info__contents">
          hong1234@withmind.net
          </span>
        </div>
        <div className="form-actions">
         <button className="btn_w_full default_btn_black">로그인</button>
        </div> 
      </section>

  );
}