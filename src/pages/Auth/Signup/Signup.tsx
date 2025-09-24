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
              <span>
              <img className="input-icon input-icon--error" src={error_Item} alt="" />
              </span>
            </div>
            <button type="button" className="default_btn_white">
              중복확인
            </button>
          </div>
          <p id="email-error" className="error_text_red">
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
             <span className="form-field__icon">
             <img src={error_Item} alt="" />
             </span>
             <span className="form-field__icon">
             <img src={visibility} alt="" />
             </span>
          </div>
          <div className="input-group">
            <input id="password" className="form-input" type="password" required />
            <span className="form-field__icon">
             <img src={error_Item} alt="" />
             </span>
             <span className="form-field__icon">
             <img src={visibility} alt="" />
             </span>
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
             <span className="form-field__icon">
              <img className="input-icon input-icon--error" src={error_Item} alt="" />
              </span>
                </div>
            <button type="button" className="default_btn_white">
              본인 인증
            </button>
          </div>
          <p id="email-error" className="error_text_red">
             본인 인증을 완료해 주세요.
            </p>
          </div>
          <div className="field">
          <label className="label">
            이름 <em>*</em>
          </label>
          <div className="input-row">
            <div className="date-group">
            <input id="password" className="form-input" type="text" readOnly required />
            </div>
          </div>
        </div>
        <div className="email-group">
          <label className="label" htmlFor="email">
          생년월일 <em>*</em>
          </label>
          <div className="input-row">
            <div className="date-group">
            <span className="form-field__icon">
              <img src={calendar_today} alt="" />
              </span>
              <input
                className="form-input"
                type="email"
                aria-invalid="true"
                aria-describedby="email-error"
              />
            </div>
          </div>
          </div>

          <div className="toggle-group">
          <label className="label" htmlFor="email">
          성별 <em>*</em>
          </label>
           <div className="gender-btn_wrap">
            <button className="default_btn_white on">남성</button>
            <button className="default_btn_white">여성</button>
           </div>
          </div>

        </div>
        <div className="consent-card">
          <div className="consent-item--all">
            <span><input type="checkbox" /></span>
            <span className="consent-label">전체 동의</span>
          </div>

          <div className="consent-item">
            <label className="consent-item__control">
              <input type="checkbox" />
              <span className="consent-item__label">
                <em className="consent-badge badge--required">(필수)</em>
                만 14세 이상
              </span>
            </label>
             <Link className="consent-item__view" to={""}>보기</Link>
            </div>
            <div className="consent-item">
            <label className="consent-item__control">
              <input type="checkbox" />
              <span className="consent-item__label">
                <em className="consent-badge badge--required">(필수)</em>
                유료 서비스 이용약관 동의
              </span>
            </label>
             <Link className="consent-item__view" to={""}>보기</Link>
            </div>
            <div className="consent-item">
            <label className="consent-item__control">
              <input type="checkbox" />
              <span className="consent-item__label">
                <em className="consent-badge badge--required">(필수)</em>
                이용약관 동의
              </span>
            </label>
             <Link className="consent-item__view" to={""}>보기</Link>
            </div>
            <div className="consent-item">
            <label className="consent-item__control">
              <input type="checkbox" />
              <span className="consent-item__label">
                <em className="consent-badge badge--required">(필수)</em>
                개인정보 수집 및 이용 동의
              </span>
            </label>
             <Link className="consent-item__view" to={""}>보기</Link>
            </div>
            <div className="consent-item--optional">
              <div className="consent-item">
                <label className="consent-item__control">
                  <input type="checkbox" />
                  <span className="consent-item__label">
                    <em className="badge--optional">(선택)</em>
                    이벤트 및 서비스 안내 수신 동의
                  </span>
                </label>
                <Link className="consent-item__view" to="/terms/marketing">보기</Link>
              </div>

              <div className="consent-item__options">
                <label className="consent-option">
                  <input type="checkbox" /> 이메일
                </label>
                <label className="consent-option">
                  <input type="checkbox" /> 앱 푸시 알림
                </label>
              </div>
            </div>


        </div>
        <div className="form-actions">
          <span className="btn_w_full">
            <button className="btn_w_full default_btn_white">취소</button>
          </span>
          <span className="btn_w_full">
            <button className="btn_w_full default_btn_black">가입하기</button>
          </span>
        </div>
      </div>

    </div>
  );
}

