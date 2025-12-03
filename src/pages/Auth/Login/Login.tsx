// Login.tsx
import React, {
  useState,
  useMemo,
  useCallback,
  MouseEvent,
  ChangeEvent,
  useEffect,
} from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import ic_visibility_gray700_20 from "@/assets/icons/size20/ic_visibility_gray700_20.png";
import ic_visibility_off_gray700_20 from "@/assets/icons/size20/ic_visibility_off_gray700_20.png";

import m_kakao_login52 from "@/assets/icons/size52/m_kakao_login52.png";
import m_naver_login52 from "@/assets/icons/size52/m_naver_login52.png";
import m_google_login52 from "@/assets/icons/size52/m_google_login52.png";

import chevron_forward_black8x12 from "@/assets/icons/chevron_forward_black8x12.png";
import cancel from "@/assets/icons/size20/ic_clear_btn_gray400_20.png";
import error_Item from "@/assets/icons/error_Item.png";

import "./Login.css";
import { Icons } from "@/assets/icons";

import { deviceId, parseJwt, stripAllWhitespace } from "@/shared/utils/util";
import {
  buildKakaoAuthUrl,
  buildNaverLoginUrl,
  loginUser,
  loginWithKakao,
  logout,
} from "@/api/auth.api";
import { LoginRequest } from "@/api/auth.types";
import { ApiErrorResponse } from "@/api/axios.instance";
import { toast } from "react-toastify";

const REMEMBER_ID_KEY = "rememberId";

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);

  const [emailErrorType, setEmailErrorType] = useState<number>(0);
  const [passwordErrorType, setPasswordErrorType] = useState<number>(0);
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const passwordType = showPassword ? "text" : "password";

  // 처음 진입 시 저장된 아이디가 있으면 불러오기
  useEffect(() => {
    const savedId = localStorage.getItem(REMEMBER_ID_KEY);
    if (savedId) {
      setEmail(savedId);
      setRemember(true);
    }
  }, []);

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

  const handleEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEmail(value);

      // 아이디 기억하기가 켜져 있으면 localStorage도 함께 업데이트
      if (remember) {
        localStorage.setItem(REMEMBER_ID_KEY, value);
      }
    },
    [remember]
  );

  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );

  const handleClearEmail = useCallback(() => {
    setEmailErrorType(0);
    setEmail("");
    // 아이디 기억하기 중에 지우면 저장된 값도 삭제
    localStorage.removeItem(REMEMBER_ID_KEY);
    setRemember(false);
  }, []);

  const handleClearPassword = useCallback(() => {
    setPasswordErrorType(0);
    setPassword("");
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // 아이디 기억하기 토글
  const handleToggleRemember = useCallback(() => {
    setRemember((prev) => {
      const next = !prev;

      if (next && email) {
        // 켜질 때 현재 이메일 저장
        localStorage.setItem(REMEMBER_ID_KEY, email);
      }

      if (!next) {
        // 꺼질 때 저장된 이메일 삭제
        localStorage.removeItem(REMEMBER_ID_KEY);
      }

      return next;
    });
  }, [email]);

  const handleLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let hasError = false;
    const trimmedEmail = stripAllWhitespace(email);
    const trimmedPassword = stripAllWhitespace(password);
    if (!trimmedEmail.trim()) {
      setEmailErrorType(1);
      hasError = true;
    } else {
      setEmailErrorType(0);
    }

    if (!trimmedPassword.trim()) {
      setPasswordErrorType(1);
      hasError = true;
    } else {
      setPasswordErrorType(0);
    }

    if (hasError) return;

    // 실제 로그인 API 호출
    console.log("로그인 시도:", trimmedEmail, trimmedPassword);

    try {
      const loginRequest: LoginRequest = {
        userId: trimmedEmail,
        password: trimmedPassword,
        deviceId: deviceId(),
      };
      const result = await loginUser(loginRequest);
      console.log("로그인 결과", result);
      console.log("리플", result.refreshToken);
      if (result.code === 200) {
        localStorage.setItem("accessToken", result.token);
        localStorage.setItem("refreshToken", result.refreshToken);
        localStorage.setItem("userName", result.user.userName);
        localStorage.setItem("userId", result.user.userId);
        localStorage.setItem("userIdx", String(result.user.userIdx));

        // remember 상태에 따라 아이디 저장/삭제
        if (remember) {
          localStorage.setItem(REMEMBER_ID_KEY, trimmedEmail);
        } else {
          localStorage.removeItem(REMEMBER_ID_KEY);
        }

        setPasswordErrorType(0);
        // TODO: 로그인 성공 후 이동할 경로
         navigate("/");
      }
    } catch (error) {
      const e = error as ApiErrorResponse;
      logout();

      if (e.code == 401) {
        setPasswordErrorType(3);
      }
    }
  };

  const handleKakaoLogin = useCallback(() => {
    const state = encodeURIComponent(
      Math.random().toString(36).substring(2, 15)
    );
    const url = buildKakaoAuthUrl(state);
    window.location.href = url;
  }, []);

  const handleNaverLogin = useCallback(() => {
    const state = encodeURIComponent(
      Math.random().toString(36).substring(2, 15)
    );

    const url = buildNaverLoginUrl(state);
    window.location.href = url;
  }, []);

  useEffect(() => {
    // 콜백 경로인지 확인
    console.log(location.pathname);

    if (location.pathname === "/auth/oauth/naver/callback") {
      const query = new URLSearchParams(location.search);
      const code = query.get("code");
      const stateFromNaver = query.get("state");
      const error = query.get("error");
      console.log("code", code);
      console.log("state", stateFromNaver);
      console.log("error", error);
      console.log("deviceId", deviceId());
    } else if (location.pathname === "/auth/oauth/kakao/callback") {
      const query = new URLSearchParams(location.search);
      const code = query.get("code");
      const state = query.get("state");
      const error = query.get("error");
      if (!code || error) {
        navigate("/login");
        return;
      }
      (async () => {
        console.log("code", code);
        console.log("state", state);
        const { kakaoToken } = await loginWithKakao(
          code,
          state,
          deviceId()
        );
        console.log("카카오 SNS가입여부체크:", kakaoToken);
        //동의화면
        navigate("/socialConsent?snsType=kakao");
      })();
    }
  }, [location.pathname, location.search, navigate]);

  return (
    <div className="login-page">
      <h1 className="login-title">로그인</h1>

      <form className="login-card">
        {emailErrorType === 0 ? (
          <div className="field in_icon">
            <label className="label">아이디(이메일)</label>
            <div className="input-group">
              <input
                className="form-input"
                type="text"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <img src={cancel} onClick={handleClearEmail} alt="" />
            </div>
          </div>
        ) : (
          <div className="field in_icon">
            <label className="label">아이디(이메일)</label>
            <div className="input-group error">
              <input
                className="form-input"
                type="text"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <img src={cancel} onClick={handleClearEmail} alt="" />
              <img src={error_Item} alt="" />
            </div>
            <p className="error_text_red">{emailErrorMessage}</p>
          </div>
        )}

        {passwordErrorType === 0 ? (
          <div className="field in_icon">
            <label className="label" htmlFor="password">
              비밀번호
            </label>
            <div className="input-group">
              <input
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="form-input"
                type={passwordType}
                required
              />
              <img
                src={cancel}
                onClick={handleClearPassword}
                alt="비밀번호 지우기"
              />
              <img
                src={
                  showPassword
                    ? ic_visibility_off_gray700_20
                    : ic_visibility_gray700_20
                }
                onClick={togglePasswordVisibility}
                alt=""
              />
            </div>
          </div>
        ) : (
          <div className="field in_icon">
            <label className="label" htmlFor="password">
              비밀번호
            </label>
            <div className="input-group error">
              <input
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="form-input"
                type={passwordType}
                required
              />
              <img
                src={cancel}
                onClick={handleClearPassword}
                alt="비밀번호 지우기"
              />
              <img
                src={
                  showPassword
                    ? ic_visibility_off_gray700_20
                    : ic_visibility_gray700_20
                }
                onClick={togglePasswordVisibility}
                alt=""
              />
              <img src={error_Item} alt="" />
            </div>
            <p className="error_text_red">{passwordErrorMessage}</p>
          </div>
        )}

        <div className="btn_w_full">
          <button
            className="btn_w_full default_btn_black"
            type="submit"
            onClick={handleLogin}
          >
            로그인
          </button>
        </div>

        <div className="form-meta">
          <span className="remember" onClick={handleToggleRemember}>
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
            <NavLink to="/recovery">아이디 찾기</NavLink>
            <NavLink to="/recovery">비밀번호 찾기</NavLink>
          </div>
        </div>
      </form>

      <div className="oauth">
        <span
          className="oauth-buttons__button oauth-buttons__button--kakao"
          onClick={handleKakaoLogin}
        >
          <img src={Icons.ic_kakao_login_20} alt="" /> 카카오로 시작하기
        </span>
        <span
          className="oauth-buttons__button oauth-buttons__button--naver"
          onClick={handleNaverLogin}
        >
          <img src={Icons.ic_naver_login_20} alt="" /> 네이버로 시작하기
        </span>
        <span className="oauth-buttons__button oauth-buttons__button--google">
          <img src={Icons.ic_google_login_20} alt="" /> Google로 시작하기
        </span>
      </div>

      <div className="oauth mobile">
        <img
          className="login_btn"
          src={m_kakao_login52}
          alt=""
          onClick={handleKakaoLogin}
        />
        <img
          className="login_btn"
          src={m_naver_login52}
          alt=""
          onClick={handleNaverLogin}
        />
        <img className="login_btn" src={m_google_login52} alt="" />
      </div>

      <NavLink to="/signup" className="auth-signup-wrap">
        <div className="auth-signup">
          <span className="auth-signup__text">아직 회원이 아니신가요?</span>
          <div className="auth-signup__action">
            <span className="auth-signup__label">회원가입</span>
            <span className="auth-signup__icon">
              <img src={chevron_forward_black8x12} alt="" />
            </span>
          </div>
        </div>
      </NavLink>
    </div>
  );
};

export default Login;
