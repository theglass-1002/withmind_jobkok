import React, { useState, useCallback, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ic_visibility_gray700_20 from "@/assets/icons/size20/ic_visibility_gray700_20.png";
import ic_visibility_off_gray700_20 from "@/assets/icons/size20/ic_visibility_off_gray700_20.png";
import "./CompanyLogin.css";

import { loginCompany, getCompanyMe } from "@/api/company/auth/companyAuth.api";
import { ApiErrorResponse } from "@/api/axios.instance";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { Icons } from "@/assets/icons";

const COMPANY_REMEMBER_ID_KEY = "companyRememberId";

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
  const [remember, setRemember] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    const savedId = localStorage.getItem(COMPANY_REMEMBER_ID_KEY);
    if (savedId) {
      setUserId(savedId);
      setRemember(true);
    }
  }, []);

  const handleToggleRemember = useCallback(() => {
    setRemember((prev) => {
      const next = !prev;
      if (next && userId) localStorage.setItem(COMPANY_REMEMBER_ID_KEY, userId);
      if (!next) localStorage.removeItem(COMPANY_REMEMBER_ID_KEY);
      return next;
    });
  }, [userId]);

  const saveCompanyLoginTokens = useCallback(
    (data: {
      token: string;
      refreshToken: string;
      companyAccountIdx: number | string;
      companyIdx: number | string;
      companyUserId: string;
    }) => {
      localStorage.setItem("companyAccessToken", data.token);
      localStorage.setItem("companyRefreshToken", data.refreshToken);
      localStorage.setItem("companyAccountId", String(data.companyAccountIdx));
      localStorage.setItem("companyIdx", String(data.companyIdx));
      localStorage.setItem("companyUserId", data.companyUserId);
    },
    []
  );

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
        saveCompanyLoginTokens({
          token: result.token,
          refreshToken: result.refreshToken,
          companyAccountIdx: result.companyAccount.companyAccountIdx,
          companyIdx: result.companyAccount.companyIdx,
          companyUserId: result.companyAccount.companyUserId,
        });

        if (remember) localStorage.setItem(COMPANY_REMEMBER_ID_KEY, trimmedUserId);
        else localStorage.removeItem(COMPANY_REMEMBER_ID_KEY);

        const meResult = await getCompanyMe();
        console.log("기업정보 조회 응답:", meResult);

        if (meResult.code === 200 && meResult.companyAccount) {
          localStorage.setItem(
            "companyName",
            meResult.companyAccount.companyName ?? ""
          );
        }

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
      <LoadingOverlay isLoading={isSubmitting} isLogo />

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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                onClick={isSubmitting ? undefined : togglePasswordVisibility}
              />
            </div>
          </div>
        </div>

        <div className="form-meta">
          <span
            className="remember"
            onClick={isSubmitting ? undefined : handleToggleRemember}
          >
            <img
              src={
                remember
                  ? Icons.ic_check_box_purple24
                  : Icons.ic_check_box_blank_gray400_24
              }
              alt=""
            />
            아이디 기억하기
          </span>
          <div className="links">
            <NavLink to="/company/recovery">아이디 찾기</NavLink>
            <NavLink to="/company/recovery">비밀번호 찾기</NavLink>
          </div>
        </div>
        <div className="company-login__signup">
          <span className="company-login__signup-text">아직 회원이 아니세요?</span>
          <span
            className="company-login__signup-link"
            onClick={() => {
              if (!isSubmitting) navigate("/company/signup");
            }}
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