import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "@/pages/Auth/Recovery/Recovery.css";

import { openAuthPopup } from "@/shared/utils/util";
import { saConfirm, saInit } from "@/api/auth/auth.api";
import { InicisParams, VerifiedUserInfo } from "@/api/auth/auth.types";
import { findCompanyIdByCi } from "@/api/company/auth/companyAuth.api";

function getCompanyDeviceId() {
  const key = "companyDeviceId";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const created = `device_company_${Date.now()}`;
  localStorage.setItem(key, created);
  return created;
}

export default function CompanyFindId() {
  const navigate = useNavigate();
  const saFormRef = useRef<HTMLFormElement | null>(null);

  const [isVerified, setIsVerified] = useState(false);

  const [verifiedUserInfo, setVerifiedUserInfo] = useState<VerifiedUserInfo | null>(null);

  const [inicisParams, setInicisParams] = useState<InicisParams | null>(null);

  const [foundIds, setFoundIds] = useState<string[]>([]);

  useEffect(() => {
    const allowedOrigins = new Set([window.location.origin, "https://api.jobkok.kr"]);

    const handleMessage = async (event: MessageEvent) => {
      if (!allowedOrigins.has(event.origin)) return;

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
            gender: confirmRes.userSex,
          };

          const idRes = await findCompanyIdByCi(confirmRes.ci, getCompanyDeviceId());
          console.log("✅ [CompanyFindId] 기업 아이디 찾기 응답:", idRes);
          console.log("✅ [CompanyFindId] 찾은 아이디 목록:", idRes.companyUserIds);

          if (idRes.code !== 200) {
            toast.error("아이디 찾기에 실패했습니다.");
            return;
          }

          if (!idRes.companyUserIds || idRes.companyUserIds.length === 0) {
            toast.error("해당 정보로 가입된 아이디가 없습니다.");
            return;
          }

          setVerifiedUserInfo(userInfo);
          setFoundIds(idRes.companyUserIds);
          setIsVerified(true);
        } catch (e) {
          console.error("[CompanyFindId] error:", e);
          toast.error("아이디 찾기 처리 중 오류가 발생했습니다.");
        }

        return;
      }

      if (event.data?.type === "INICIS_AUTH_SUCCESS") {
        const { name, phone, birth, ci, gender } = event.data.data || {};

        if (!name || !phone || !birth || !ci || !gender) {
          toast.error("본인인증 데이터가 올바르지 않습니다.");
          return;
        }

        try {
          const idRes = await findCompanyIdByCi(ci, getCompanyDeviceId());
          console.log("[CompanyFindId] findCompanyIdByCi result:", idRes);

          if (idRes.code !== 200) {
            toast.error("아이디 찾기에 실패했습니다.");
            return;
          }

          if (!idRes.companyUserIds || idRes.companyUserIds.length === 0) {
            toast.error("해당 정보로 가입된 아이디가 없습니다.");
            return;
          }

          setVerifiedUserInfo({ name, phone, birth, ci, gender });
          setFoundIds(idRes.companyUserIds);
          setIsVerified(true);

          toast.success("아이디 찾기가 완료되었습니다!");
        } catch (e) {
          console.error("[CompanyFindId] findCompanyIdByCi error:", e);
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
      console.error("[CompanyFindId] saInit error:", e);
      toast.error("본인인증을 시작할 수 없습니다.");
    }
  };

  const resultTitle = useMemo(() => {
    return isVerified
      ? "요청하신 아이디는 다음과 같습니다."
      : "잡콕 회원가입 정보로\n아이디 찾기를 진행해 주세요";
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
                onClick={() => navigate("/company/login")}
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

              <div className="recovery-info__contents">
                {foundIds.length > 0 ? (
                  foundIds.map((id) => <div key={id}>{id}</div>)
                ) : (
                  "아이디 조회 결과가 없습니다."
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn_w_full default_btn_black"
                onClick={() => navigate(`/company/login`)}
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
                foundIds.map((id) => <div key={id}>{id}</div>)
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
            onClick={() => navigate(`/company/login`)}
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
