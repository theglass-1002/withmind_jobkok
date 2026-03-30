import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Recovery.css";

import { openAuthPopup } from "@/shared/utils/util";
import {
  saInit,
  saConfirm,
  issueTempPasswordLocal,
} from "@/api/auth/auth.api";
import { InicisParams } from "@/api/auth/auth.types";

export default function ResetPwd() {
  const navigate = useNavigate();
  const saFormRef = useRef<HTMLFormElement | null>(null);

  const [userId, setUserId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [tempPassword, setTempPassword] = useState("");

  const [inicisParams, setInicisParams] = useState<InicisParams | null>(null);

  /* ===============================
     이니시스 postMessage 수신
  =============================== */
  useEffect(() => {
    const allowedOrigins = new Set([
      window.location.origin,
      "https://api.jobkok.kr",
    ]);

    const handleMessage = async (event: MessageEvent) => {
      if (!allowedOrigins.has(event.origin)) return;

      if (event.data?.type === "SA_RESULT") {
        const { resultCode, txId } = event.data || {};

        if (resultCode !== "0000" || !txId) {
          toast.error("본인인증에 실패했습니다.");
          return;
        }

        try {
          // 1️⃣ 본인인증 confirm
          const confirmRes = await saConfirm(txId);
          console.log("[ResetPwd] saConfirm:", confirmRes);

          if (!confirmRes.verified) {
            toast.error("본인인증 검증 실패");
            return;
          }

          // 2️⃣ 임시 비밀번호 발급
          const pwdRes = await issueTempPasswordLocal(
            userId,
            confirmRes.ci
          );

          console.log("[ResetPwd] issueTempPassword:", pwdRes);

          if (pwdRes.code !== 200) {
            toast.error("임시 비밀번호 발급에 실패했습니다.");
            return;
          }

          setTempPassword(pwdRes.tempPassword);
          setIsVerified(true);

          toast.success("임시 비밀번호가 발급되었습니다.");
        } catch (e) {
          console.error("[ResetPwd] error:", e);
          toast.error("비밀번호 재설정 중 오류가 발생했습니다.");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [userId]);

  /* ===============================
     본인인증 시작
  =============================== */
  const handleVerify = async () => {
    if (!userId) {
      toast.error("아이디(이메일)를 입력해 주세요.");
      return;
    }

    try {
      const init = await saInit();

      // 실제 서비스에서는 이 값들 이니시스 입력 화면에서 받음
      const params: InicisParams = {
        mid: init.mid,
        reqSvcCd: init.reqSvcCd,
        mTxId: init.txId,
        authHash: init.authHash,
        flgFixedUser: init.flgFixedUser,
        userName: "홍길동",
        userPhone: "01012345678",
        userBirth: "19901101",
        userHash: "",
        reservedMsg: init.reservedMsg ?? "isUseToken=N",
        directAgency: "",
        successUrl: init.returnUrl,
        failUrl: init.returnUrl,
      };

      setInicisParams(params);

      const popup = openAuthPopup();
      if (!popup) {
        alert("팝업 차단을 해제해 주세요.");
        return;
      }

      requestAnimationFrame(() => {
        const form = saFormRef.current;
        if (!form) return;

        form.target = "sa_popup";
        form.method = "post";
        form.action = "https://sa.inicis.com/auth";
        form.submit();
      });
    } catch (e) {
      console.error("[ResetPwd] saInit error:", e);
      toast.error("본인인증을 시작할 수 없습니다.");
    }
  };

  return (
    <>
      <section className="recovery-panel">
        {!isVerified ? (
          <>
            <div className="recovery-info result">
              <span className="recovery-info__head">
                <span className="recovery-info__title">
                  잡콕 회원가입 정보로
                  <br />
                  비밀번호 찾기를 진행해 주세요
                </span>
                <span className="form-tip_text_gray">
                  아이디와 휴대폰 본인 인증을 통해서 비밀번호를 찾을 수 있습니다.
                </span>
              </span>

              <div className="field">
                <label className="label">아이디(이메일)</label>
                <div className="input-row">
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="아이디(이메일)를 입력해 주세요."
                  />
                </div>
              </div>
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
              <span className="recovery-info__head">
                <span className="recovery-info__title title__result">
                  요청하신 임시 비밀번호는 다음과 같습니다.
                </span>
                <span className="form-tip_text_gray">
                  로그인 후 반드시 비밀번호를 변경해 주세요.
                </span>
              </span>

              <span className="recovery-info__contents">
                {tempPassword}
              </span>
            </div>

            <div className="form-actions">
              <button
                className="btn_w_full default_btn_black"
                onClick={() => navigate("/login")}
              >
                로그인
              </button>
            </div>
          </>
        )}
      </section>

      {/* 이니시스 hidden form */}
      <form ref={saFormRef} name="saForm" style={{ display: "none" }}>
        <input type="hidden" name="mid" value={inicisParams?.mid || ""} />
        <input type="hidden" name="reqSvcCd" value={inicisParams?.reqSvcCd || ""} />
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
