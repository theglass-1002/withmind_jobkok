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
              <img src={Icons.jobkok_wordmark_gray400} alt="jobkok" />
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
                <span>상호명: (주)위드마인드</span>
                <span>대표이사: 주민성</span>
                <span>사업자번호: 794-87-00687</span>
                <span>통신판매업신고번호: 제 2021-대전유성-0522호</span>
              </div>
              <div>
                <span>본점 주소: 대전광역시 유성구 가정로 218, 3층</span>
                <span>지점 주소: 서울특별시 마포구 신촌로4길 14, 4층</span>
              </div>
              <div>Copyright Ⓒ 2025 WITHMIND. All rigths reserved.</div>
            </div>
          </div>
        </div>
      </footer>

      <footer className="site-footer mobile_version">
        <Link className="masthead__brand" to="/" aria-label="jobkok 홈">
          <img src={Icons.jobkok_logo_gray400} alt="jobkok" />
          <img src={Icons.jobkok_wordmark_gray400} alt="jobkok" />
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
            <div>
              <span>상호명: (주)위드마인드</span>
              <span>대표이사: 주민성</span>
            </div>
            <span>사업자번호: 794-87-00687</span>
            <span>본점 주소: 대전광역시 유성구 가정로 218, 3층</span>
            <span>지점 주소: 서울특별시 마포구 신촌로4길 14, 4층</span>
            <span>Copyright Ⓒ 2025 WITHMIND. All rigths reserved.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
