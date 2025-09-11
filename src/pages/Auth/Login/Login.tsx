
import "./Login.css";


export default function Login() {
  return (
    <div className="login-page">
      <h1 className="login-title">로그인</h1>

      <form className="login-card">
        <div className="field">
          <label className="field-label" htmlFor="email">
            아이디(이메일) <em>*</em>
          </label>
          <input id="email" className="field-input" type="email" placeholder="" required />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="password">
            비밀번호 <em>*</em>
          </label>
          <input id="password" className="field-input" type="password" placeholder="" required />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit">로그인</button>
        </div>

        <div className="form-meta">
          <label className="remember">
            <input type="checkbox" /> 아이디 기억하기
          </label>
          <div className="links">
            <a className="auth-link" href="/auth/find-id">아이디 찾기</a>
            <span className="sep">·</span>
            <a className="auth-link" href="/auth/reset-password">비밀번호 찾기</a>
            <span className="sep">·</span>
            <a className="auth-link" href="/auth/signup">회원가입</a>
          </div>
        </div>
      </form>

      <div className="oauth">
        <button className="oauth-btn oauth-btn--kakao">카카오로 시작하기</button>
        <button className="oauth-btn oauth-btn--naver">네이버로 시작하기</button>
        <button className="oauth-btn oauth-btn--google">구글로 시작하기</button>
      </div>
    </div>
  );
}
