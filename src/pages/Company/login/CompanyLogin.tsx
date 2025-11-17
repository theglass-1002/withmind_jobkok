import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import ic_visibility_gray700_20 from "@/assets/icons/size20/ic_visibility_gray700_20.png";
import ic_visibility_off_gray700_20 from "@/assets/icons/size20/ic_visibility_off_gray700_20.png";
import "./CompanyLogin.css";


export default function CompanyLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="company-login">
      <span className="company-login__logo">잡콕_기업</span>
      <div className="company-login__container">
        <div className="company-login__title">로그인</div>
        <div className="company-login__form">
          <div className="company-login__field">
            <label className="company-login__label">아이디</label>
            <div className="company-login__input-wrapper">
              <input 
                className="company-login__input"
                type="text" 
                placeholder='아이디를 입력해 주세요.' 
                name="" 
                id="" 
              />
            </div>
          </div>
          <div className="company-login__field">
            <label className="company-login__label">비밀번호</label>
            <div className="company-login__input-wrapper">
              <input 
                className="company-login__input"
                type={showPassword ? "text" : "password"}
                placeholder='비밀번호를 입력해 주세요.' 
                name="" 
                id="" 
              />
              <img 
                className="company-login__toggle-password"
                src={showPassword ? ic_visibility_off_gray700_20 : ic_visibility_gray700_20}
                alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>
          <div className="company-login__options">
            <div className="company-login__remember">
              <input type="checkbox" name="" id="" />
              아이디 기억하기
            </div>
            <div className="company-login__links">
              <span className="company-login__link">아이디 찾기</span>
              <span className="company-login__link">비밀번호 찾기</span>
            </div>
          </div>
        </div>
        <div className="company-login__signup">
          <span className="company-login__signup-text">아직 회원이 아니세요?</span>
          <span 
            className="company-login__signup-link"
            onClick={() => { navigate('/company/signup') }}
          >
            회원가입
          </span>
        </div>
        <button 
          className='default_btn_gray_400'
          onClick={() => { navigate('/company') }}
        >
          로그인
        </button>
      </div>
    </div>
  )
}