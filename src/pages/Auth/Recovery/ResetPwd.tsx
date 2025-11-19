import { useState } from "react";
import {useNavigate } from "react-router-dom";
import "./Recovery.css";


export default function ResetPwd() {
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);
    const [tempPassword] = useState("TempPwd1234!");

    const handleVerify = () => {
      setIsVerified(true);
    };

  return (
    <>
      <section className="recovery-panel">
         {!isVerified ? (
        // 인증 전: 아이디 입력 및 본인 인증 버튼 화면
        <>
          <div className="recovery-info result">
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
                {/* 인풋 값 처리는 생략하고 placeholder만 유지 */}
                <input type="text" placeholder="아이디(이메일)를 입력해 주세요." required />
              </div>
            </div>
          </div>
            
          <div className="form-actions">
            <button type="button" className="btn_w_full default_btn_white">취소</button>
            {/* 본인 인증 버튼 클릭 시 handleVerify 실행 */}
            <button type="submit" onClick={handleVerify} className="btn_w_full default_btn_black">본인 인증</button>
          </div>
        </>
      ) : (
        // 인증 후: 임시 비밀번호 결과 화면
        <>
          <div className="recovery-info result">
            <span className="recovery-info__head">
              <span className="recovery-info__title title__result">요청하신 임시 비밀번호는 다음과 같습니다.</span>
              <span className="form-tip_text_gray">개인정보 보호를 위해 로그인 후 비밀번호 변경을 권장합니다.</span>     
            </span>
            <span className="recovery-info__contents">
              {tempPassword}
            </span>
          </div>
          <div className="form-actions">
            {/* 로그인 버튼은 임시로 console log 처리 */}
            <button onClick={()=>{navigate(`/login`);}} className="btn_w_full default_btn_black">로그인</button>
          </div> 
        </>
      )}
      </section>
     <section className="recovery-panel mobile pwd">
     {!isVerified ? (
    // 인증 전: 아이디 입력 및 본인 인증 버튼 화면
    <>
      <div className="recovery-info result">
        <span className="recovery-info__head">
          <span className="recovery-info__title">잡콕 회원가입 정보로
            <br/>비밀번호 찾기를 진행해 주세요</span>
          <span className="form-tip_text_gray">아이디와 휴대폰 본인 인증을 통해서 <br/> 비밀번호를 찾을 수 있습니다.</span>     
        </span>

      </div>
      <div className="field">
          <label className="label">
            아이디(이메일)
          </label>
          <div className="input-row">
            {/* 인풋 값 처리는 생략하고 placeholder만 유지 */}
            <input type="text" placeholder="아이디(이메일)를 입력해 주세요." required />
          </div>
        </div>        
    </>
  ) : (
    // 인증 후: 임시 비밀번호 결과 화면
    <>
      <div className="recovery-info result">
        <span className="recovery-info__head">
          <span className="recovery-info__title title__result">요청하신 임시 비밀번호는 다음과 같습니다.</span>
          <span className="form-tip_text_gray">개인정보 보호를 위해 로그인 후 비밀번호 변경을 권장합니다.</span>     
        </span>
        <span className="recovery-info__contents">
          {tempPassword}
        </span>
      </div>
    </>
  )}
      </section>
      <div className="recovery-panel mobile btn_container">
          {!isVerified?(<button type="submit" onClick={handleVerify} className="default_btn_black">본인 인증</button>):(
                    <button type="submit" onClick={()=>{navigate(`/login`);}} className="default_btn_black">로그인</button>
          )}

        </div>
  </>
  );
}