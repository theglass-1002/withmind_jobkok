import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Recovery.css";

import { openAuthPopup } from "@/shared/utils/util";
import { findIdByCi, saConfirm, saInit } from "@/api/auth/auth.api";
import { InicisParams, VerifiedUserInfo, FindIdAccount } from "@/api/auth/auth.types";

export default function FindId() {
  const navigate = useNavigate();
  const saFormRef = useRef<HTMLFormElement | null>(null);

  const [isVerified, setIsVerified] = useState(false);

  // 인증 완료 후 확보되는 사용자 정보(원하면 화면에도 표시 가능)
  const [verifiedUserInfo, setVerifiedUserInfo] = useState<VerifiedUserInfo | null>(null);

  // 이니시스 hidden form 파라미터
  const [inicisParams, setInicisParams] = useState<InicisParams | null>(null);

  // 아이디 찾기 결과(여러 개 가능)
  const [foundAccounts, setFoundAccounts] = useState<FindIdAccount[]>([]);

  // 아이디 조회 결과 없음 모달
  const [showNoResultModal, setShowNoResultModal] = useState(false);

  console.log("[FindId render]", { isVerified, foundAccounts, foundAccountsLength: foundAccounts.length });

  useEffect(() => {
    const allowedOrigins = new Set([window.location.origin, "https://api.jobkok.kr"]);

    const handleMessage = async (event: MessageEvent) => {
      if (!allowedOrigins.has(event.origin)) {
        return;
      }
      console.log("📩 [FindId] postMessage 수신:", { origin: event.origin, data: event.data });
      
      // 유효한 메시지일 때만 로그
      if (event.data?.type === "SA_RESULT" ||
          event.data?.type === "INICIS_AUTH_SUCCESS" ||
          event.data?.type === "INICIS_AUTH_FAIL") {
        console.log("📩 [FindId] postMessage 수신:", { origin: event.origin, data: event.data });
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

          console.log("🔍 [FindId] 아이디 찾기 API 호출 직전");
          console.log("🔍 [FindId] CI 값:", confirmRes.ci);
          const idRes = await findIdByCi(confirmRes.ci);
          console.log("✅ [FindId] 아이디 찾기 API 호출 완료");
          console.log("✅ [FindId] 아이디 찾기 응답:", idRes);
          console.log("✅ [FindId] 찾은 아이디 목록:", idRes.accounts);

          if (idRes.code !== 200) {
            toast.error("아이디 찾기에 실패했습니다.");
            return;
          }

          const foundUserAccounts = idRes.accounts || [];

          // ✅ 상태 세팅 (결과 화면으로 전환)
          console.log("🎯 [FindId] state 업데이트 직전:", { userInfo, foundAccounts: foundUserAccounts });
          setVerifiedUserInfo(userInfo);
          setFoundAccounts(foundUserAccounts);
          setIsVerified(true);
          console.log("🎯 [FindId] state 업데이트 호출 완료");
        } catch (e: any) {
          console.error("[FindId] error:", e);

          // 409 에러 응답 데이터 추출
          const errorData = e?.raw?.response?.data;

          // 409 에러이고 CI 값이 있으면 아이디 찾기 시도
          if (e?.code === 409 && errorData?.ci) {
            console.log("🔍 [FindId] 409 에러지만 CI 값으로 아이디 찾기 시도");
            console.log("🔍 [FindId] 409 응답 데이터:", errorData);
            console.log("🔍 [FindId] CI 값:", errorData.ci);

            try {
              const idRes = await findIdByCi(errorData.ci);
              console.log("✅ [FindId] 아이디 찾기 API 호출 완료 (409 케이스)");
              console.log("✅ [FindId] 아이디 찾기 응답:", idRes);
              console.log("✅ [FindId] 찾은 아이디 목록:", idRes.accounts);

              if (idRes.code !== 200) {
                toast.error("아이디 찾기에 실패했습니다.");
                return;
              }

              const foundUserAccounts = idRes.accounts || [];

              // 409 에러 응답에서 사용자 정보 추출
              const userInfo: VerifiedUserInfo = {
                name: errorData.userName || "",
                phone: errorData.userPhone || "",
                birth: errorData.userBirth || "",
                ci: errorData.ci,
                gender: errorData.userGender || "M"
              };

              console.log("🎯 [FindId] state 업데이트 직전 (409 케이스):", { userInfo, foundAccounts: foundUserAccounts });
              setVerifiedUserInfo(userInfo);
              setFoundAccounts(foundUserAccounts);
              setIsVerified(true);
              console.log("🎯 [FindId] state 업데이트 호출 완료 (409 케이스)");
            } catch (findIdError) {
              console.error("[FindId] 아이디 찾기 실패:", findIdError);
              toast.error("아이디 찾기 처리 중 오류가 발생했습니다.");
            }
          } else {
            toast.error("아이디 찾기 처리 중 오류가 발생했습니다.");
          }
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
          console.log("🔍 [FindId] 아이디 찾기 API 호출 직전 (구버전)");
          console.log("🔍 [FindId] CI 값:", ci);
          const idRes = await findIdByCi(ci);
          console.log("✅ [FindId] 아이디 찾기 API 호출 완료 (구버전)");
          console.log("✅ [FindId] 아이디 찾기 응답:", idRes);
          console.log("✅ [FindId] 찾은 아이디 목록:", idRes.accounts);

          if (idRes.code !== 200) {
            toast.error("아이디 찾기에 실패했습니다.");
            return;
          }

          const foundUserAccounts = idRes.accounts || [];

          setVerifiedUserInfo({ name, phone, birth, ci,gender});
          setFoundAccounts(foundUserAccounts);
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

  // 아이디 조회 결과가 0개일 때 모달 표시
  useEffect(() => {
    if (isVerified && foundAccounts.length === 0) {
      setShowNoResultModal(true);
    }
  }, [isVerified, foundAccounts]);

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
      console.log("[FindId] InicisParams 설정:", params);

      const popup = openAuthPopup();
      if (!popup) {
        alert("팝업이 차단되었습니다. 브라우저 팝업 허용을 확인해 주세요.");
        return;
      }

      // state 업데이트를 기다린 후 submit (타이밍 이슈 해결)
      setTimeout(() => {
        const form = saFormRef.current;
        if (!form) {
          toast.error("본인인증 폼을 찾을 수 없습니다.");
          return;
        }

        console.log("[FindId] Form submit 준비 완료");
        form.target = "sa_popup";
        form.setAttribute("method", "post");
        form.setAttribute("action", "https://sa.inicis.com/auth");
        console.log("[FindId] Form submit 실행");
        form.submit();
      }, 100);
    } catch (e) {
      console.error("[FindId] saInit error:", e);
      toast.error("본인인증을 시작할 수 없습니다.");
    }
  };

  const resultTitle = useMemo(() => {
    return isVerified ? "요청하신 아이디는 다음과 같습니다." : "잡콕 회원가입 정보로\n아이디 찾기를 진행해 주세요";
  }, [isVerified]);

  const handleCloseNoResultModal = () => {
    setShowNoResultModal(false);
    setIsVerified(false);
    setFoundAccounts([]);
    setVerifiedUserInfo(null);
  };

  // accountType에 따른 메시지 생성 함수
  const getAccountTypeMessage = (accountType: string): string => {
    // "oauth:kakao" -> "카카오"
    // "oauth:naver" -> "네이버"
    // "oauth:google" -> "구글"
    // "email" -> "이메일"
    if (accountType.startsWith("oauth:")) {
      const provider = accountType.split(":")[1];
      const providerNames: { [key: string]: string } = {
        kakao: "카카오",
        naver: "네이버",
        google: "구글",
      };
      return providerNames[provider] || provider;
    }
    return "이메일";
  };

  // 이메일 마스킹 함수 (앞 3글자만 보이고 @ 앞까지 마스킹)
  const maskEmail = (email: string): string => {
    if (!email) return "";

    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) return email;

    if (localPart.length <= 3) {
      return `${localPart}@${domain}`;
    }

    const visiblePart = localPart.substring(0, 3);
    const maskedPart = "*".repeat(localPart.length - 3);

    return `${visiblePart}${maskedPart}@${domain}`;
  };

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
                {foundAccounts.length > 0 ? (
                  foundAccounts.map((account) => {
                    const isOAuth = account.accountType.startsWith("oauth:");
                    const displayEmail = isOAuth ? maskEmail(account.email || account.userId) : (account.email || account.userId);
                    const accountTypeMsg = isOAuth ? ` [${getAccountTypeMessage(account.accountType)}] 계정으로 가입하셨습니다.` : "";
                    return (
                      <div key={account.userId}>
                        {displayEmail}{accountTypeMsg}
                      </div>
                    );
                  })
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
              {foundAccounts.length > 0 ? (
                foundAccounts.map((account) => {
                  const isOAuth = account.accountType.startsWith("oauth:");
                  const displayEmail = isOAuth ? maskEmail(account.email || account.userId) : (account.email || account.userId);
                  const accountTypeMsg = isOAuth ? ` [${getAccountTypeMessage(account.accountType)}] 계정으로 가입하셨습니다.` : "";
                  return (
                    <div key={account.userId}>
                      {displayEmail}{accountTypeMsg}
                    </div>
                  );
                })
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

      {/* 아이디 조회 결과 없음 모달 */}
      {showNoResultModal && (
        <div className="modal-overlay" onClick={handleCloseNoResultModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>아이디를 찾을 수 없습니다.</h3>
            </div>
            <div className="modal-body">
              <p>입력하신 본인 인증 정보로 가입한 아이디가 없습니다.</p>
              <p>다른 본인 인증 정보로 검색하거나 회원 가입을 진행해 주세요.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="default_btn_white btn_w_full"
                onClick={handleCloseNoResultModal}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
