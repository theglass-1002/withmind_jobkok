import { Link, NavLink } from "react-router-dom";
import visibility from '@/assets/icons/visibility.png';
import visibility_off from '@/assets/icons/visibility_off.png';
import kakao_login from '@/assets/icons/kakao_login_btn.png';
import naver_login from '@/assets/icons/naver_login_btn.png';
import google_login from '@/assets/icons/google_login_btn.png';
import chevron_forward_black8x12 from '@/assets/icons/chevron_forward_black8x12.png';
import cancel from '@/assets/icons/cancel.png';
import error_Item from '@/assets/icons/error_Item.png';

import "./Login.css";


export default function Login() {
  return (
    <div className="login-page">
      <h1 className="login-title">로그인</h1>

      <form className="login-card">
      <div className="field in_icon">
          <label className="label" >
            아이디(이메일)
          </label>
          <div className="input-group">
            <input id="password" className="form-input" type="text" required />
              <span>
              <img src={error_Item} alt="" />
              </span>
          </div>
          <p className="error_text_red">아이디를 입력해 주세요. / 입력한 아이디를 확인해 주세요.</p>
        </div>

        <div className="field in_icon">
          <label className="label" htmlFor="password">
            비밀번호
          </label>
          <div className="input-group">
            <input id="password" className="form-input" type="password" required />
             <span>
              <img src={cancel} alt="" />
             </span>
             <span>
             <img src={visibility} alt="" /></span>
          </div>
          <p className="error_text_red">비밀번호를 입력해 주세요. / 입력한 비밀번호를 확인해 주세요.</p>
        </div>

        <div className="btn_w_full">
          <button className="btn_w_full default_btn_black" type="submit">로그인</button>
        </div>

        <div className="form-meta">
          <label className="remember">
            <input type="checkbox" /> 아이디 기억하기
          </label>
          <div className="links">
            <NavLink to="/jobs">아이디 찾기</NavLink>
            <NavLink to="/jobs">비밀번호 찾기</NavLink>
          </div>
        </div>
      </form>

      <div className="oauth">
        <img className="login_btn" src={kakao_login} alt="" />
        <img className="login_btn" src={naver_login} alt="" />
        <img className="login_btn" src={google_login} alt="" />
      </div>
     
    <div className="auth-signup">
      <span className="auth-signup__text">아직 회원이 아니신가요?</span>
      <div className="auth-signup__action" >
        <span className="auth-signup__label">회원가입</span>
        <span className="auth-signup__icon">
        <img  src={chevron_forward_black8x12} alt="" />
        </span>
      </div>
    </div>
    </div>
  );
}
