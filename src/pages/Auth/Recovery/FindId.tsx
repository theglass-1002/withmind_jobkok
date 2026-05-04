import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Recovery.css";

import { openAuthPopup } from "@/shared/utils/util";
import { findIdByCi, saConfirm, saInit } from "@/api/auth/auth.api";
import { InicisParams, VerifiedUserInfo } from "@/api/auth/auth.types";

export default function FindId() {
  const navigate = useNavigate();
  const saFormRef = useRef<HTMLFormElement | null>(null);

  const [isVerified, setIsVerified] = useState(false);

  // 인증 완료 후 확보되는 사용자 정보(원하면 화면에도 표시 가능)
  const [verifiedUserInfo, setVerifiedUserInfo] = useState<VerifiedUserInfo | null>(null);

  // 이니시스 hidden form 파라미터
  const [inicisParams, setInicisParams] = useState<InicisParams | null>(null);

  // 아이디 찾기 결과(여러 개 가능)
  const [foundIds, setFoundIds] = useState<string[]>([]);

  console.log("[FindId render]", { isVerified, foundIds, foundIdsLength: foundIds.length });

  useEffect(() => {
    const allowedOrigins = new Set([window.location.origin, "https://api.jobkok.kr"]);

    const handleMessage = async (event: MessageEvent) => {
      console.log("📩 [FindId] postMessage 수신:", { origin: event.origin, data: event.data });
      if (!allowedOrigins.has(event.origin)) {
        console.warn("📩 [FindId] origin 차단됨:", event.origin, "허용목록:", Array.from(allowedOrigins));
        return;
      }

      // 1) SA_RESULT 수신 → txId로 confirm → ci로 find-id
      if (event.data?.type === "SA_RESULT") {
        const { resultCode, txId } = event.data || {};

        if (!txId) {
          toast.error("본인인증 결과(txId)가 없습니다.");
          return;
        }

        if (resultCode !== "0000") {
          toast.error("본인인증에 실패했습니다.");
          return;
        }

        try {
          const confirmRes = await saConfirm(txId);
          
          console.log(confirmRes);
          if (!confirmRes?.verified) {
            toast.error("본인인증 검증에 실패했습니다.");
            return;
          }
       
          const userInfo: VerifiedUserInfo = {
            name: confirmRes.userName,
            phone: confirmRes.userPhone,
            birth: confirmRes.userBirth,
            ci: confirmRes.ci,
            gender:confirmRes.userSex
          };
       
          const idRes = await findIdByCi(confirmRes.ci);
          console.log("✅ [FindId] 아이디 찾기 응답:", idRes);
          console.log("✅ [FindId] 찾은 아이디 목록:", idRes.userIds);

          if (idRes.code !== 200) {
            toast.error("아이디 찾기에 실패했습니다.");
            return;
          }

          if (!idRes.userIds || idRes.userIds.length === 0) {
            toast.error("해당 정보로 가입된 아이디가 없습니다.");
            return;
          }

          // ✅ 상태 세팅 (결과 화면으로 전환)
          console.log("🎯 [FindId] state 업데이트 직전:", { userInfo, foundIds: idRes.userIds });
          setVerifiedUserInfo(userInfo);
          setFoundIds(idRes.userIds);
          setIsVerified(true);
          console.log("🎯 [FindId] state 업데이트 호출 완료");
        } catch (e) {
          console.error("[FindId] error:", e);
          toast.error("아이디 찾기 처리 중 오류가 발생했습니다.");
        }

        return;
      }

      // 2) 구버전 호환: 직접 성공/실패 메시지
      if (event.data?.type === "INICIS_AUTH_SUCCESS") {
        const { name, phone, birth, ci ,gender} = event.data.data || {};

        if (!name || !phone || !birth || !ci || !gender) {
          toast.error("본인인증 데이터가 올바르지 않습니다.");
          return;
        }

        try {
          const idRes = await findIdByCi(ci);
          console.log("✅ [FindId] 아이디 찾기 응답:", idRes);
          console.log("✅ [FindId] 찾은 아이디 목록:", idRes.userIds);

          if (idRes.code !== 200) {
            toast.error("아이디 찾기에 실패했습니다.");
            return;
          }

          if (!idRes.userIds || idRes.userIds.length === 0) {
            toast.error("해당 정보로 가입된 아이디가 없습니다.");
            return;
          }

          setVerifiedUserInfo({ name, phone, birth, ci,gender});
          setFoundIds(idRes.userIds);
          setIsVerified(true);

          toast.success("아이디 찾기가 완료되었습니다!");
        } catch (e) {
          console.error("[FindId] findIdByCi error:", e);
          toast.error("아이디 찾기 처리 중 오류가 발생했습니다.");
        }

        return;
      }

      if (event.data?.type === "INICIS_AUTH_FAIL") {
        toast.error("본인인증에 실패했습니다.");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleVerify = async () => {
    try {
      const init = await saInit();

      // TODO: 실제 서비스에서는 사용자 입력값을 쓰거나, 이니시스 페이지에서 입력받는 구조로 변경
      const userName = "홍길동";
      const userPhone = "01012345678";
      const userBirth = "19901101";

      const params: InicisParams = {
        mid: init.mid,
        reqSvcCd: init.reqSvcCd,
        mTxId: init.txId || "",
        authHash: init.authHash,
        flgFixedUser: init.flgFixedUser,
        userName,
        userPhone,
        userBirth,
        userHash: "",
        reservedMsg: init.reservedMsg ?? "isUseToken=N",
        directAgency: "",
        successUrl: init.returnUrl,
        failUrl: init.returnUrl,
      };

      setInicisParams(params);
      console.log(params);
      const popup = openAuthPopup();
      if (!popup) {
        alert("팝업이 차단되었습니다. 브라우저 팝업 허용을 확인해 주세요.");
        return;
      }

      requestAnimationFrame(() => {
        const form = saFormRef.current;
        if (!form) {
          toast.error("본인인증 폼을 찾을 수 없습니다.");
          return;
        }

        form.target = "sa_popup";
        form.setAttribute("method", "post");
        form.setAttribute("action", "https://sa.inicis.com/auth");
        form.submit();
      });
    } catch (e) {
      console.error("[FindId] saInit error:", e);
      toast.error("본인인증을 시작할 수 없습니다.");
    }
  };

  const resultTitle = useMemo(() => {
    return isVerified ? "요청하신 아이디는 다음과 같습니다." : "잡콕 회원가입 정보로\n아이디 찾기를 진행해 주세요";
  }, [isVerified]);

  return (
    <>
      {/* PC */}
      <section className="recovery-panel">
        {!isVerified ? (
          <>
            <div className="recovery-info">
              <span className="recovery-info__title">
                잡콕 회원가입 정보로
                <br />
                아이디 찾기를 진행해 주세요
              </span>
              <span className="form-tip_text_gray">
                휴대폰 본인 인증을 통해서 아이디를 찾을 수 있습니다.
              </span>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn_w_full default_btn_white"
                onClick={() => navigate("/login")}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleVerify}
                className="btn_w_full default_btn_black"
              >
                본인 인증
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="recovery-info result">
              <span className="recovery-info__title title__result">{resultTitle}</span>

              {/* 여러개일 수 있으니 리스트로 */}
              <div className="recovery-info__contents">
                {foundIds.length > 0 ? (
                  foundIds.map((id) => (
                    <div key={id}>{id}</div>
                  ))
                ) : (
                  "아이디 조회 결과가 없습니다."
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn_w_full default_btn_black"
                onClick={() => navigate(`/login`)}
              >
                로그인
              </button>
            </div>
          </>
        )}
      </section>

      {/* Mobile */}
      {!isVerified ? (
        <section className="recovery-panel mobile">
          <div className="recovery-info">
            <span className="recovery-info__title">
              잡콕 회원가입 정보로
              <br />
              아이디 찾기를 진행해 주세요
            </span>
            <span className="form-tip_text_gray">
              휴대폰 본인 인증을 통해서 <br />
              아이디를 찾을 수 있습니다.
            </span>
          </div>
        </section>
      ) : (
        <section className={`recovery-panel mobile id_${isVerified}`}>
          <div className="recovery-info result">
            <span className="recovery-info__title title__result">{resultTitle}</span>
            <div className="recovery-info__contents">
              {foundIds.length > 0 ? (
                foundIds.map((id) => (
                  <div key={id}>{id}</div>
                ))
              ) : (
                "아이디 조회 결과가 없습니다."
              )}
            </div>
          </div>
        </section>
      )}

      <div className="recovery-panel mobile btn_container">
        {!isVerified ? (
          <button type="button" onClick={handleVerify} className="default_btn_black">
            본인 인증
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate(`/login`)}
            className="default_btn_black"
          >
            로그인
          </button>
        )}
      </div>

      {/* 이니시스 본인인증 hidden form */}
      <form ref={saFormRef} name="saForm" style={{ display: "none" }}>
        <input type="hidden" name="mid" value={inicisParams?.mid || ""} />
        <input type="hidden" name="reqSvcCd" value={inicisParams?.reqSvcCd || ""} />
        <input type="hidden" name="identifier" value="테스트서명입니다." />
        <input type="hidden" name="mTxId" value={inicisParams?.mTxId || ""} />
        <input type="hidden" name="authHash" value={inicisParams?.authHash || ""} />
        <input type="hidden" name="flgFixedUser" value={inicisParams?.flgFixedUser || ""} />
        <input type="hidden" name="userName" value={inicisParams?.userName || ""} />
        <input type="hidden" name="userPhone" value={inicisParams?.userPhone || ""} />
        <input type="hidden" name="userBirth" value={inicisParams?.userBirth || ""} />
        <input type="hidden" name="userHash" value={inicisParams?.userHash || ""} />
        <input type="hidden" name="reservedMsg" value={inicisParams?.reservedMsg || ""} />
        <input type="hidden" name="directAgency" value={inicisParams?.directAgency || ""} />
        <input type="hidden" name="successUrl" value={inicisParams?.successUrl || ""} />
        <input type="hidden" name="failUrl" value={inicisParams?.failUrl || ""} />
      </form>
    </>
  );
}
