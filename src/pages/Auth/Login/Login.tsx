import React, {
  useState,
  useMemo,
  useCallback,
  MouseEvent,
  ChangeEvent,
  useEffect,
} from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

import { deviceId, stripAllWhitespace } from "@/shared/utils/util";
import { loginUser, logout } from "@/api/auth/auth.api";
import { LoginRequest } from "@/api/auth/auth.types";
import { ApiErrorResponse } from "@/api/axios.instance";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";

import {
  PROVIDERS,
  findProviderByPath,
  createState,
  type ProviderKey,
} from "./oauthProviders";

const REMEMBER_ID_KEY = "rememberId";

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);

  const [emailErrorType, setEmailErrorType] = useState<number>(0);
  const [passwordErrorType, setPasswordErrorType] = useState<number>(0);

  const passwordType = showPassword ? "text" : "password";

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
      if (remember) localStorage.setItem(REMEMBER_ID_KEY, value);
    },
    [remember]
  );

  const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleClearEmail = useCallback(() => {
    setEmailErrorType(0);
    setEmail("");
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

  const handleToggleRemember = useCallback(() => {
    setRemember((prev) => {
      const next = !prev;
      if (next && email) localStorage.setItem(REMEMBER_ID_KEY, email);
      if (!next) localStorage.removeItem(REMEMBER_ID_KEY);
      return next;
    });
  }, [email]);

  const saveLoginTokens = useCallback((data: {
    accessToken: string;
    refreshToken: string;
    userName: string;
    userId: string;
    userIdx: number | string;
  }) => {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("userName", data.userName);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("userIdx", String(data.userIdx));
  }, []);

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

    setIsLoading(true);
    try {
      const loginRequest: LoginRequest = {
        userId: trimmedEmail,
        password: trimmedPassword,
        deviceId: deviceId(),
      };

      const result = await loginUser(loginRequest);
      console.log("[Login] 일반 로그인 응답:", result);

      if (result.code === 200) {
        saveLoginTokens({
          accessToken: result.token,
          refreshToken: result.refreshToken,
          userName: result.user.userName,
          userId: result.user.userId,
          userIdx: result.user.userIdx,
        });

        if (remember) localStorage.setItem(REMEMBER_ID_KEY, trimmedEmail);
        else localStorage.removeItem(REMEMBER_ID_KEY);

        setPasswordErrorType(0);
        navigate("/");
      }
    } catch (error) {
      const e = error as ApiErrorResponse;
      logout();
      console.error("[Login] 일반 로그인 에러:", e);

      if (e.code === 401) setPasswordErrorType(3);
      else toast.error("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const startOAuth = useCallback((providerKey: ProviderKey) => {
    const p = PROVIDERS[providerKey];
    if (!p?.buildAuthUrl) {
      toast.info("현재 해당 소셜 로그인은 준비 중입니다.");
      return;
    }

    setIsLoading(true);
    const state = createState();
    const url = p.buildAuthUrl(state);
    window.location.href = url;
  }, []);

  const handleKakaoLogin = useCallback(() => startOAuth("kakao"), [startOAuth]);
  const handleNaverLogin = useCallback(() => startOAuth("naver"), [startOAuth]);
  const handleGoogleLogin = useCallback(() => startOAuth("google"), [startOAuth]);

  useEffect(() => {
    const provider = findProviderByPath(location.pathname);
    if (!provider) return;

    const run = async () => {
      setIsLoading(true);
      try {
        if (!provider.precheck || !provider.loginWithPreauth) {
          toast.info("현재 해당 소셜 로그인은 준비 중입니다.");
          navigate("/login");
          return;
        }

        const query = new URLSearchParams(location.search);
        const code = query.get("code");
        const state = query.get("state") ?? "";
        const err = query.get("error");
        const errDesc = query.get("error_description");

        if (!code || err) {
          console.error("[Login] OAuth callback error:", {
            provider: provider.key,
            err,
            errDesc,
            code,
            state,
          });
          throw new Error("소셜 로그인 실패");
        }

        const did = deviceId();

        const precheckRes = await provider.precheck(code, state, did);
        console.log(`[Login] ${provider.key} precheck 응답:`, precheckRes);

        if (precheckRes.exists && !precheckRes.needTerms) {
          const loginRes = await provider.loginWithPreauth({
            preauthToken: precheckRes.preauthToken,
            termsAgreed: true,
            deviceId: did,
          });

          console.log(`[Login] ${provider.key} login(preauth) 응답:`, loginRes);

          if (loginRes?.code === 200) {
            saveLoginTokens({
              accessToken: loginRes.tokens.accessToken,
              refreshToken: loginRes.tokens.refreshToken,
              userName: loginRes.user.userName,
              userId: loginRes.user.userId,
              userIdx: loginRes.user.idx,
            });

            navigate("/");
            return;
          }
        }

        navigate(`/social-consent?snsType=${provider.key}`, {
          state: { snsAuth: precheckRes },
        });
      } catch (e) {
        console.error("[Login] 소셜 로그인 처리 에러:", e);
        toast.error("소셜 로그인 중 오류가 발생했습니다.");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [location.pathname, location.search, navigate, saveLoginTokens]);

  return (
    <div className="login-page">
      <LoadingOverlay isLoading={isLoading} isLogo text="처리 중..." />

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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <img src={cancel} onClick={handleClearPassword} alt="비밀번호 지우기" />
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
                disabled={isLoading}
              />
              <img src={cancel} onClick={handleClearPassword} alt="비밀번호 지우기" />
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
            disabled={isLoading}
          >
            로그인
          </button>
        </div>

        <div className="form-meta">
          <span
            className="remember"
            onClick={isLoading ? undefined : handleToggleRemember}
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
            <NavLink to="/recovery">아이디 찾기</NavLink>
            <NavLink to="/recovery">비밀번호 찾기</NavLink>
          </div>
        </div>
      </form>

      <div className="oauth">
        <span
          className="oauth-buttons__button oauth-buttons__button--kakao"
          onClick={isLoading ? undefined : handleKakaoLogin}
        >
          <img src={Icons.ic_kakao_login_20} alt="" /> 카카오로 시작하기
        </span>
        <span
          className="oauth-buttons__button oauth-buttons__button--naver"
          onClick={isLoading ? undefined : handleNaverLogin}
        >
          <img src={Icons.ic_naver_login_20} alt="" /> 네이버로 시작하기
        </span>
        <span
          className="oauth-buttons__button oauth-buttons__button--google"
          onClick={isLoading ? undefined : handleGoogleLogin}
        >
          <img src={Icons.ic_google_login_20} alt="" /> Google로 시작하기
        </span>
      </div>

      <div className="oauth mobile">
        <img
          className="login_btn"
          src={m_kakao_login52}
          alt=""
          onClick={isLoading ? undefined : handleKakaoLogin}
        />
        <img
          className="login_btn"
          src={m_naver_login52}
          alt=""
          onClick={isLoading ? undefined : handleNaverLogin}
        />
        <img
          className="login_btn"
          src={m_google_login52}
          alt=""
          onClick={isLoading ? undefined : handleGoogleLogin}
        />
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
