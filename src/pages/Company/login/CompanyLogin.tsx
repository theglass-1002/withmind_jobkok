import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ic_visibility_gray700_20 from "@/assets/icons/size20/ic_visibility_gray700_20.png";
import ic_visibility_off_gray700_20 from "@/assets/icons/size20/ic_visibility_off_gray700_20.png";
import "./CompanyLogin.css";

export default function CompanyLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const handleLogin = () => {
    if (userId === "company_tester01" && password === "1") {
      navigate("/company/ai-matching");
    } else {
      toast.info("아이디 및 비밀번호를 확인해주세요.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className="company-login">
      
      <ToastContainer
        limit={2}
        className="app-toast"
        position="top-center"
        autoClose={2000}
        newestOnTop
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        draggable
        theme="light"
      />

      <span className="company-login__logo">잡콕 기업</span>

      <div className="company-login__container">
        <div className="company-login__title">로그인</div>

        <div className="company-login__form">
          <div className="company-login__field">
            <label className="company-login__label">아이디</label>
            <div className="company-login__input-wrapper">
              <input
                className="company-login__input"
                type="text"
                placeholder="아이디를 입력해 주세요."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
          </div>

          <div className="company-login__field">
            <label className="company-login__label">비밀번호</label>
            <div className="company-login__input-wrapper">
              <input
                className="company-login__input"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력해 주세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                className="company-login__toggle-password"
                src={showPassword ? ic_visibility_off_gray700_20 : ic_visibility_gray700_20}
                alt="비밀번호 토글"
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>
        </div>

        <div className="company-login__signup">
          <span className="company-login__signup-text">아직 회원이 아니세요?</span>
          <span className="company-login__signup-link" onClick={() => navigate('/company/signup')}>
            회원가입
          </span>
        </div>

        <button className="default_btn_gray_400" onClick={handleLogin}>
          로그인
        </button>
      </div>
    </div>
  );
}
