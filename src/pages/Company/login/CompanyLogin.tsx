import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ic_visibility_gray700_20 from "@/assets/icons/size20/ic_visibility_gray700_20.png";
import ic_visibility_off_gray700_20 from "@/assets/icons/size20/ic_visibility_off_gray700_20.png";
import "./CompanyLogin.css";

import { loginCompany } from "@/api/company/auth/companyAuth.api";
import { ApiErrorResponse } from "@/api/axios.instance";

function getDeviceId() {
  const key = "companyDeviceId";
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const created = `device_company_${Date.now()}`;
  localStorage.setItem(key, created);
  return created;
}

export default function CompanyLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleLogin = async () => {
    const trimmedUserId = userId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUserId) {
      toast.info("아이디를 입력해 주세요.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return;
    }

    if (!trimmedPassword) {
      toast.info("비밀번호를 입력해 주세요.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await loginCompany({
        companyUserId: trimmedUserId,
        password: trimmedPassword,
        deviceId: getDeviceId(),
      });

      console.log("기업 로그인 응답:", result);

      if (result.code === 200) {
        toast.success("로그인되었습니다.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
        });

        navigate("/company/ai-matching");
        return;
      }

      toast.info("아이디 및 비밀번호를 확인해주세요.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("기업 로그인 실패:", error);

      const e = error as ApiErrorResponse;
      toast.error(e?.msg || "아이디 및 비밀번호를 확인해주세요.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } finally {
      setIsSubmitting(false);
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
            <label className="company-login__label">이메일</label>
            <div className="company-login__input-wrapper">
              <input
                className="company-login__input"
                type="text"
                placeholder="이메일을 입력해 주세요."
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSubmitting) {
                    handleLogin();
                  }
                }}
              />
              <img
                className="company-login__toggle-password"
                src={
                  showPassword
                    ? ic_visibility_off_gray700_20
                    : ic_visibility_gray700_20
                }
                alt="비밀번호 토글"
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>
        </div>

        <div className="company-login__signup">
          <span className="company-login__signup-text">아직 회원이 아니세요?</span>
          <span
            className="company-login__signup-link"
            onClick={() => navigate("/company/signup")}
          >
            회원가입
          </span>
        </div>

        <button
          className="default_btn_gray_400"
          onClick={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </div>
    </div>
  );
}