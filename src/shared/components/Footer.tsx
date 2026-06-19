import { Link, useNavigate } from "react-router-dom";
import { Icons } from "@/assets/icons";
import "./Footer.css";

import { isLoggedIn } from "@/api/auth/auth.api";

export default function Footer() {
  const navigate = useNavigate();

  const handleProtectedLink = (path: string) => (e: React.MouseEvent) => {
    if (!isLoggedIn()) {
      e.preventDefault();
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <>
      <footer className="site-footer pc_version">
        <div className="site-footer__inner">
          <div>
            <Link className="masthead__brand" to="/" aria-label="jobkok 홈">
         
              <img src={Icons.jobkok_logo_gray400} alt="jobkok" />
             
            </Link>
          </div>

          <div className="wrap" aria-label="푸터">
            <ul className="footer-links">
              <li>
                <a href="https://withmind.net/" target="_blank" rel="noopener noreferrer">
                  회사소개
                </a>
              </li>
              <li>
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  이용약관
                </a>
              </li>
              <li>
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  개인정보처리방침
                </a>
              </li>

              {/*  로그인 상태에 따라 이동 처리 */}
              <li>
                <a href="/mypage/support/notices" onClick={handleProtectedLink("/mypage/support/notices")}>
                  공지사항
                </a>
              </li>
              <li>
                <a href="/mypage/support/faq" onClick={handleProtectedLink("/mypage/support/faq")}>
                  고객지원
                </a>
              </li>
            </ul>

            <div className="info_wrap">
              <div>
                <span>(주)위드마인드 | 대표: 주민성</span>
              </div>
              <div>
                <span>부산광역시 강서구 미음산단5로41번길 71, 4층 405-A1호(미음동, 부산글로벌테크비즈센터)</span>
              </div>
              <div>
                <span>사업자등록번호: 794-87-00687 | 통신판매업신고번호: 제 2021-대전유성-0522호</span>
              </div>
              <div>
                <span>직업정보제공사업 신고번호: J1302020260002</span>
              </div>
              <div>Copyright Ⓒ 2025 WITHMIND. All rigths reserved.</div>
            </div>
          </div>
        </div>
      </footer>

      <footer className="site-footer mobile_version">
        <Link className="masthead__brand" to="/" aria-label="jobkok 홈">
          <img src={Icons.jobkok_logo_gray400} alt="jobkok" />
         
        </Link>

        <div className="wrap" aria-label="푸터">
          <ul className="footer-links">
            <li>
              <a href="https://withmind.net/" target="_blank" rel="noopener noreferrer">
                회사소개
              </a>
            </li>
            <li>
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                이용약관
              </a>
            </li>
            <li>
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                개인정보처리방침
              </a>
            </li>

            {/* 로그인 상태에 따라 이동 처리 */}
            <li>
              <a href="/mypage/support/notices" onClick={handleProtectedLink("/mypage/support/notices")}>
                공지사항
              </a>
            </li>
            <li>
              <a href="/mypage/support/faq" onClick={handleProtectedLink("/mypage/support/faq")}>
                고객지원
              </a>
            </li>
          </ul>

          <div className="info_wrap">
            <span>(주)위드마인드 | 대표: 주민성</span>
            <span>부산광역시 강서구 미음산단5로41번길 71, 4층 405-A1호(미음동, 부산글로벌테크비즈센터)</span>
            <span>사업자등록번호: 794-87-00687 | 통신판매업신고번호: 제 2021-대전유성-0522호</span>
            <span>직업정보제공사업 신고번호: J1302020260002</span>
            <span>Copyright Ⓒ 2025 WITHMIND. All rigths reserved.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
