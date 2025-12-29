import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function InicisSuccess() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log("[InicisSuccess] 콜백 도착");
  
    console.log(
      "[InicisSuccess] 전체 쿼리 파라미터:",
      Object.fromEntries(searchParams.entries())
    );
  
    const successParam = searchParams.get("success");
    console.log("[InicisSuccess] success raw:", successParam);
  
    const success = successParam === "true";
  
    if (success) {
      const name = searchParams.get("name") || "";
      const phone = searchParams.get("phone") || "";
      const birth = searchParams.get("birth") || "";
      const ci = searchParams.get("ci") || "";
  
      console.log("[InicisSuccess] 본인인증 성공 데이터:", {
        name,
        phone,
        birth,
        ci,
      });
  
      console.log("[InicisSuccess] window.opener:", window.opener);
  
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "INICIS_AUTH_SUCCESS",
            data: { name, phone, birth, ci },
          },
          window.location.origin
        );
  
        console.log("[InicisSuccess] 부모창으로 메시지 전송 완료");
      }
    } else {
      const error = searchParams.get("error") || "알 수 없는 오류";
      console.error("[InicisSuccess] 본인인증 실패:", error);
    }
  }, [searchParams]);
  
  return (
    <div style={{ 
      padding: 24, 
      textAlign: "center",
      fontFamily: "sans-serif" 
    }}>
      <h2>본인인증 처리 중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
}