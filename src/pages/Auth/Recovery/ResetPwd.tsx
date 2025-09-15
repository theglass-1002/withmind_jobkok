import { useState } from "react";
import "./Recovery.css";


export default function ResetPwd() {

  return (
      <section className="recovery-panel">
        {/* <div className="recovery-info result">
            <span className="recovery-info__head">
                <span className="recovery-info__title">잡콕 회원가입 정보로
            <br/>비밀번호 찾기를 진행해 주세요</span>
            <span className="form-tip_text_gray">아이디와 휴대폰 본인 인증을 통해서 비밀번호를 찾을 수 있습니다.</span>     
        </span>
        <div className="field">
          <label className="label">
            아이디(이메일)
          </label>
          <div className="input-row">
            <input type="text" placeholder="아이디(이메일)를 입력해 주세요." required />
          </div>
        </div>
        </div>
          
        <div className="form-actions">
          <button type="button" className="btn_w_full default_btn_white">취소</button>
          <button type="submit" className="btn_w_full default_btn_black">본인 인증</button>
        </div> */}
           <div className="recovery-info result">
           <span className="recovery-info__head">
                <span className="recovery-info__title title__result">요청하신 임시 비밀번호는 다음과 같습니다.</span>
            <span className="form-tip_text_gray">개인정보 보호를 위해 로그인 후 비밀번호 변경을 권장합니다.</span>     
            </span>
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