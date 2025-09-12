import { Link, NavLink } from "react-router-dom";
import error_Item from '@/assets/icons/error_Item.png';
import visibility from '@/assets/icons/visibility.png';
import visibility_off from '@/assets/icons/visibility_off.png';
import calendar_today from '@/assets/icons/calendar_today.png';
import "./Signup.css";


export default function Signup() {
  return (
    <div className="signup-page">
      <h1 className="signup-title">회원가입</h1>
      <div className="signup-card">
        <div className="field form-group form-group--with-icon">
          <div className="email-group">
          <label className="label" htmlFor="email">
            이메일 <em>*</em>
          </label>
          <div className="input-row">
            <div className="input-group">
              <input
                className="form-input"
                type="email"
                aria-invalid="true"
                aria-describedby="email-error"
              />
              <img className="input-icon input-icon--error" src={error_Item} alt="" />
            </div>
            <button type="button" className="default_btn_white">
              중복확인
            </button>
          </div>
          <p id="email-error" className="form-error_text_red">
            이메일을 입력해 주세요. / 이미 가입된 이메일입니다. 해당 이메일로 로그인해 주세요. / 중복 확인을 완료해 주세요.
          </p>
          </div>
          <div className="pwd-group">
          <div className="field in_icon">
          <label className="label" htmlFor="password">
            비밀번호
          </label>
          <div className="input-group">
            <input id="password" className="form-input" type="password" required />
             <img src={error_Item} alt="" />
             <img src={visibility} alt="" />
          </div>
          <div className="input-group">
            <input id="password" className="form-input" type="password" required />
             <img src={error_Item} alt="" />
             <img src={visibility} alt="" />
          </div>
          <p className="error_text_red">비밀번호를 입력해 주세요. / 입력한 비밀번호를 확인해 주세요.</p>
          <p className="form-tip_text_gray">※ 영문, 숫자, 특수문자를 모두 포함한 8~16자로 입력해 주세요.</p>
         </div>
          </div>
          <div className="number-group">
          <label className="label" htmlFor="email">
            휴대폰 번호 <em>*</em>
          </label>
          <div className="input-row">
            <div className="input-group">
              <input
                className="form-input"
                aria-invalid="true"
                aria-describedby="email-error"
              />
              <img className="input-icon input-icon--error" src={error_Item} alt="" />
            </div>
            <button type="button" className="default_btn_white">
              본인 인증
            </button>
          </div>
          <p id="email-error" className="form-error_text_red">
             본인 인증을 완료해 주세요.
            </p>
          </div>
          <div className="field">
          <label className="label">
            이름 <em>*</em>
          </label>
          <div className="input-row">
            <input id="password" className="form-input" type="text" readOnly required />
          </div>
        </div>
        <div className="email-group">
          <label className="label" htmlFor="email">
          생년월일 <em>*</em>
          </label>
          <div className="input-row">
            <div className="input-group">
              <img src={calendar_today} alt="" />
              <input
                className="form-input"
                type="email"
                aria-invalid="true"
                aria-describedby="email-error"
              />
            </div>
          </div>
          <p id="email-error" className="form-error_text_red">
            이메일을 입력해 주세요. / 이미 가입된 이메일입니다. 해당 이메일로 로그인해 주세요. / 중복 확인을 완료해 주세요.
          </p>
          </div>

        </div>
      </div>

      {/* <form className="login-card">
      <div className="field in_icon">
          <label className="label" >
            아이디(이메일)
          </label>
          <div className="input-group">
            <input id="password" className="form-input" type="text" required />
           
          </div>
          <p className="error_text_red">아이디를 입력해 주세요. / 입력한 아이디를 확인해 주세요.</p>
        </div>

        <div className="field in_icon">
          <label className="label" htmlFor="password">
            비밀번호
          </label>
          <div className="input-group">
            <input id="password" className="form-input" type="password" required />
             
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
      </form> */}

     
    <div className="auth-signup">
      <span className="auth-signup__text">아직 회원이 아니신가요?</span>
      <div className="auth-signup__action" >
        <span className="auth-signup__label">회원가입</span>
        <span className="auth-signup__icon">
        {/* <img  src={chevron_right} alt="" /> */}
        </span>
      </div>
    </div>
    </div>
  );
}

