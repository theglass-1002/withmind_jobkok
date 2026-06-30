import "./ComingSoon.css";
import Footer from "@/shared/components/Footer";

interface ComingSoonProps {
  message?: string;
}

export default function ComingSoon({ message }: ComingSoonProps) {
  return (
    <div className="coming-soon-wrapper">
      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <h1>사이트 준비중입니다</h1>
          <p>{message || "현재 사이트는 준비중으로 접속할 수 없습니다."}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
