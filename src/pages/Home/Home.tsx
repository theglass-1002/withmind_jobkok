import { Link } from "react-router-dom";


export default function Home() {
  return (
    <section style={{ display: "grid", gap: 16 }}>
    <h2>잡콕 홈</h2>
    <div style={{ display: "flex", gap: 12 }}>
      <Link to="/jobs">채용 바로가기</Link>
      <Link to="/companies">기업 바로가기</Link>
    </div>
  </section>
  );
}
