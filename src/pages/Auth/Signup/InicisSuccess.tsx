import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function InicisSuccess() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log("[InicisSuccess] 콜백 도착");

    // 백엔드에서 쿼리 파라미터로 전달한 값 파싱
    const success = searchParams.get("success") === "true";
    
    if (success) {
      const name = searchParams.get("name") || "";
      const phone = searchParams.get("phone") || "";
      const birth = searchParams.get("birth") || "";
      const ci = searchParams.get("ci") || "";

      console.log("본인인증 성공 데이터:", { name, phone, birth, ci });

      // 부모창으로 메시지 전송
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "INICIS_AUTH_SUCCESS",
            data: { name, phone, birth, ci },
          },
          window.location.origin
        );

        console.log("부모창으로 메시지 전송 완료");
        
        // 팝업 닫기
        setTimeout(() => {
         // window.close();
        }, 500);
      } else {
        console.warn("window.opener가 없습니다. 팝업이 아닌 창에서 열렸습니다.");
      }
    } else {
      // 실패 처리
      const error = searchParams.get("error") || "알 수 없는 오류";
      console.error("본인인증 실패:", error);

      if (window.opener) {
        window.opener.postMessage(
          {
            type: "INICIS_AUTH_FAIL",
            error,
          },
          window.location.origin
        );

        setTimeout(() => {
         // window.close();
        }, 500);
      }
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