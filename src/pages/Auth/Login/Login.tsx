import React, { useState, useMemo, useCallback } from 'react';
import { Link, NavLink } from "react-router-dom";
import ic_visibility_gray700_20 from '@/assets/icons/size20/ic_visibility_gray700_20.png';
import ic_visibility_off_gray700_20 from '@/assets/icons/size20/ic_visibility_off_gray700_20.png';
import kakao_login from '@/assets/icons/kakao_login_btn.png';
import naver_login from '@/assets/icons/naver_login_btn.png';
import google_login from '@/assets/icons/google_login_btn.png';

import m_kakao_login52 from '@/assets/icons/size52/m_kakao_login52.png';
import m_naver_login52 from '@/assets/icons/size52/m_naver_login52.png';
import m_google_login52 from '@/assets/icons/size52/m_google_login52.png';

import chevron_forward_black8x12 from '@/assets/icons/chevron_forward_black8x12.png';
import cancel from '@/assets/icons/size20/ic_clear_btn_gray400_20.png'
import error_Item from '@/assets/icons/error_Item.png';

import "./Login.css";
import { Icons } from '@/assets/icons';


export default function Login() {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [emailErrorType, setEmailErrorType] = useState(0); 
  //0: 오류 없음 이메일을 입력해 주세요. / 이미 가입된 이메일입니다. 해당 이메일로 로그인해 주세요. / 중복 확인을 완료해 주세요.
  const [passwordErrorType, setPasswordErrorType] = useState(0); 
  //0: 오류 없음  비밀번호를 입력해 주세요. / 입력한 비밀번호를 확인해 주세요. / 비밀번호가 일치하지 않습니다.
 
  const [loginStatus, setLoginStatus] = useState(null); 
  //로그인

  const emailErrorMessage = useMemo(() => {
    switch (emailErrorType) {
      case 1:
        return "이메일을 입력해 주세요. ";
      case 2:
        return "이미 가입된 이메일입니다. 해당 이메일로 로그인해 주세요.";
      case 3:
        return "중복 확인을 완료해 주세요.";
      default:
        return "";
    }
  }, [emailErrorType]);


  const passwordErrorMessage = useMemo(() => {
    switch (passwordErrorType) {
      case 1:
        return "비밀번호를 입력해 주세요.";
      case 2:
        return "입력한 비밀번호를 확인해 주세요.";
      case 3:
        return "비밀번호가 일치하지 않습니다.";
      default:
        return "";
    }
  }, [passwordErrorType]);


  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);


  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);


  // 이메일 초기화 핸들러 (입력값이 있을 때만 초기화)
  const handleClearEmail = useCallback(() => {
    setEmail(''); 
  }, []);

  // 비밀번호 초기화 핸들러 (입력값이 있을 때만 초기화)
  const handleClearPassword = useCallback(() => {
    // password.length>0 체크는 JSX에서 조건부 렌더링으로 처리하므로, 여기서는 무조건 초기화
    setPassword(''); 
  }, []);

  // 비밀번호 표시/숨김 토글 핸들러
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const passwordType = showPassword ? 'text' : 'password';

  const handleLogin = () => {
    setEmailErrorType(1);
    setPasswordErrorType(2);
    // setLoginStatus(null); // 상태 초기화

  }

  return (
    <div className="login-page">
      <h1 className="login-title">로그인</h1>

      <form className="login-card">
      {emailErrorType==0?<div className="field in_icon">
          <label className="label" >
            아이디(이메일)
          </label>
          <div className="input-group">
            <input className="form-input" type="text" value={email} onChange={handleEmailChange} required />
              <img src={cancel} onClick={handleClearEmail} alt="" />
          </div>
        </div>
        :<div className="field in_icon">
        <label className="label" >
          아이디(이메일)
        </label>
        <div className="input-group error">
        <input className="form-input" type="text" value={email} onChange={handleEmailChange} required />
            <img src={cancel} onClick={handleClearEmail} alt="" />
            <img src={error_Item} alt="" />
        </div>
        <p className="error_text_red">{emailErrorMessage}</p>
        </div>
        }  
      {passwordErrorType==0?<div className="field in_icon">
          <label className="label" htmlFor="password">
            비밀번호
          </label>
          <div className="input-group">
            <input id="password"  value={password}  onChange={handlePasswordChange} className="form-input" type={passwordType}  required />
             <img src={cancel} onClick={handleClearPassword} alt="비밀번호 지우기" />
             <img src={showPassword ? ic_visibility_off_gray700_20 : ic_visibility_gray700_20}  onClick={togglePasswordVisibility} alt="" />
          </div>
        </div>:<div className="field in_icon">
          <label className="label" htmlFor="password">
            비밀번호
          </label>
          <div className="input-group error">
            <input id="password"  value={password}  onChange={handlePasswordChange} className="form-input" type={passwordType}  required />
            <img src={cancel} onClick={handleClearPassword} alt="비밀번호 지우기" />
             <img src={showPassword ? ic_visibility_off_gray700_20 : ic_visibility_gray700_20}  onClick={togglePasswordVisibility} alt="" />
             <img src={error_Item} alt="" />
          </div>
          <p className="error_text_red">{passwordErrorMessage}</p>
        </div>}


        <div className="btn_w_full">
          <button className="btn_w_full default_btn_black" type="submit" onClick={handleLogin}>로그인</button>
        </div>

        <div className="form-meta">
         <span className="remember" onClick={() => setRemember(!remember)}>
            <img src={remember?Icons.ic_check_box_purple24:Icons.ic_check_box_blank_gray400_24} alt="" />
            아이디 기억하기</span>
          {/* <label className="remember">
            <input type="checkbox" /> 아이디 기억하기
          </label> */}
          <div className="links">
            <NavLink to="/recovery">아이디 찾기</NavLink>
            <NavLink to="/recovery">비밀번호 찾기</NavLink>
          </div>
        </div>
      </form>

      <div className="oauth">
        <img className="login_btn" src={kakao_login} alt="" />
        <img className="login_btn" src={naver_login} alt="" />
        <img className="login_btn" src={google_login} alt="" />
      </div>

      <div className="oauth mobile">
        <img className="login_btn" src={m_kakao_login52} alt="" />
        <img className="login_btn" src={m_naver_login52} alt="" />
        <img className="login_btn" src={m_google_login52} alt="" />
      </div>

    <NavLink to="/signup" className="auth-signup-wrap">
    <div className="auth-signup">
      <span className="auth-signup__text">아직 회원이 아니신가요?</span>
      <div className="auth-signup__action" >
        <span className="auth-signup__label">회원가입</span>
        <span className="auth-signup__icon">
        <img  src={chevron_forward_black8x12} alt="" />
        </span>
      </div>
    </div>
    </NavLink>
    </div>
  );
}
