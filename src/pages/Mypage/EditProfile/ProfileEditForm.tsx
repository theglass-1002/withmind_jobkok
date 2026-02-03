import React, { useEffect, useMemo, useRef, useState } from "react";
import calendar_today from "@/assets/icons/calendar_today.png";
import { UserProfile } from "@/shared/api/user";
import { formatPhoneNumber, openAuthPopup } from "@/shared/utils/util";
import { formatBirthdate } from "@/api/auth/auth.types";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { toast } from "react-toastify";

import { saConfirm, saInit } from "@/api/auth/auth.api";
import { InicisParams, VerifiedUserInfo } from "@/api/auth/auth.types";

interface ProfileEditFormProps {
  userInfo: UserProfile;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
  onRequestDelete: () => void;
}


export default function ProfileEditForm({
  userInfo,
  onCancel,
  onSubmit,
  onRequestDelete,
}: ProfileEditFormProps) {
  const saFormRef = useRef<HTMLFormElement | null>(null);

  const [inicisParams, setInicisParams] = useState<InicisParams | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [verifiedUserInfo, setVerifiedUserInfo] = useState<VerifiedUserInfo | null>(null);
  const [verifiedCertified, setVerifiedCertified] = useState<boolean>(false);

  const handledRef = useRef(false);

  const viewModel = useMemo(() => {


    return {
      email: userInfo?.email ?? "",
      certified: verifiedCertified || (userInfo?.certified ?? false),
      name: verifiedUserInfo?.name ?? userInfo?.name ?? "",
      number: verifiedUserInfo?.phone ?? userInfo?.number ?? "",
      birth: verifiedUserInfo?.birth ?? userInfo?.birth ?? "",
      gender: userInfo.gender??"M",
    };
  }, [userInfo, verifiedUserInfo, verifiedCertified]);

  useEffect(() => {
    const allowedOrigins = new Set([window.location.origin, "https://api.jobkok.kr"]);

    const handleMessage = async (event: MessageEvent) => {
      if (!allowedOrigins.has(event.origin)) return;
      if (handledRef.current) return;

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

        handledRef.current = true;

        try {
          const confirmRes = await saConfirm(txId);

          if (!confirmRes?.verified) {
            handledRef.current = false;
            toast.error("본인인증 검증에 실패했습니다.");
            return;
          }
          //여기서 변경 반영
          const info: VerifiedUserInfo = {
            name: confirmRes.userName,
            phone: confirmRes.userPhone,
            birth: confirmRes.userBirth,
            gender: confirmRes.userSex??"M",
            ci: confirmRes.ci,
          };

          setVerifiedUserInfo(info);
          setVerifiedCertified(true);
          setIsVerified(true);

          toast.success("본인인증이 완료되었습니다.");
        } catch (e) {
          handledRef.current = false;
          toast.error("본인인증 처리 중 오류가 발생했습니다.");
        }

        return;
      }

      if (event.data?.type === "INICIS_AUTH_SUCCESS") {
        handledRef.current = true;

        const { name, phone, birth, ci, gender } = event.data.data || {};

        if (!name || !phone || !birth || !ci) {
          handledRef.current = false;
          toast.error("본인인증 데이터가 올바르지 않습니다.");
          return;
        }

        const info: VerifiedUserInfo = {
          name,
          phone,
          birth,
          gender,
          ci,
        };

        setVerifiedUserInfo(info);
        setVerifiedCertified(true);
        setIsVerified(true);

        toast.success("본인인증이 완료되었습니다.");
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
      handledRef.current = false;
      setIsVerified(false);
      setVerifiedCertified(false);
      setVerifiedUserInfo(null);

      const init = await saInit();

      const userName = `${viewModel.name}본인인증한것12`;
      const userPhone = viewModel.number || "";
      const userBirth = viewModel.birth || "";

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
      toast.error("본인인증을 시작할 수 없습니다.");
    }
  };

  if (!userInfo) return <LoadingOverlay />;

  return (
    <>
    <div className="account-main">
      <div className="field">
        <span className="field__label">아이디(이메일)</span>
        <span className="field__value_gray">{viewModel.email || "-"}</span>
      </div>

      <div className="field">
        <span className="field__label">
          휴대폰 번호 <em>*</em>
        </span>

        <div className="number_field_value">
          <div className="field__value_gray">
            <span className={`value-text ${viewModel.certified ? "is-verified" : ""}`}>
              {formatPhoneNumber(viewModel.number) || "-"}
            </span>
          </div>

          <button
            type="button"
            className="default_btn_white"
            onClick={handleVerify}
            disabled={isVerified}
          >
            {isVerified ? "인증 완료" : "본인 인증"}
          </button>
        </div>

        <span className="field__label">
          이름 <em>*</em>
        </span>
        <div className="field__value_gray">
          <span>{viewModel.name || "-"}</span>
        </div>

        <span className="field__label">
          생년월일 <em>*</em>
        </span>
        <div className="field__value_gray birth">
          <span>
            <img src={calendar_today} alt="달력 아이콘" />
          </span>
          <span className="date">{formatBirthdate(viewModel.birth) || "-"}</span>
        </div>

        <span className="field__label">
          성별 <em>*</em>
        </span>
        <div className="btn_wrap">
          <button
            type="button"
            className={`default_btn_white ${viewModel.gender === "M" ? "on" : ""}`}
          >
            남성
          </button>

          <button
            type="button"
            className={`default_btn_white ${viewModel.gender === "W" ? "on" : ""}`}
          >
            여성
          </button>
        </div>

        <div className="field__value_gray hint">
          <span>※ 휴대폰 번호, 이름, 생년월일은 본인 인증 완료 시 자동 반영됩니다.</span>
        </div>
      </div>

      <div className="field">
        <button type="button" className="default_a_btn_line" onClick={onRequestDelete}>
          회원 탈퇴
        </button>
      </div>

      <div className="field form-action-group">
        <div className="btn_wrap">
          <button type="button" className="default_btn_white btn-cancel" onClick={onCancel}>
            취소
          </button>
          <button type="button" className="default_btn_black btn_w_full" onClick={onSubmit}>
            저장
          </button>
        </div>
      </div>

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
    </div>
    <div className="account-main mobile">
      <div className="field email">
        <span className="field__label">아이디(이메일)</span>
        <span className="field__value_gray">{viewModel.email || "-"}</span>
      </div>
      
      <div className="field">
        <div className="field-group"> 
        <span className="field__label">
          휴대폰 번호 <em>*</em>
        </span>
        <div className="number_field_value">
          <div className="field__value_gray">
            <span className={`value-text ${viewModel.certified ? "is-verified" : ""}`}>
              {formatPhoneNumber(viewModel.number) || "-"}
            </span>
          </div>

          <button
            type="button"
            className="default_btn_white"
            onClick={handleVerify}
            disabled={isVerified}
          >
            {isVerified ? "인증 완료" : "본인 인증"}
          </button>
        </div>

        </div>
        <div className="field-group"> 
        <span className="field__label">
          이름 <em>*</em>
        </span>
        <div className="field__value_gray">
          <span>{viewModel.name || "-"}</span>
        </div>
        </div>
  
        <div className="field-group"> 
        <span className="field__label">
          생년월일 <em>*</em>
        </span>
        <div className="field__value_gray birth">
          <span>
            <img src={calendar_today} alt="달력 아이콘" />
          </span>
          <span className="date">{formatBirthdate(viewModel.birth) || "-"}</span>
        </div>
        </div>

        <div className="field-group"> 
        <span className="field__label">
          성별 <em>*</em>
        </span>
        <div className="btn_wrap">
          <button
            type="button"
            className={`default_btn_white ${viewModel.gender === "M" ? "on" : ""}`}
          >
            남성
          </button>

          <button
            type="button"
            className={`default_btn_white ${viewModel.gender === "W" ? "on" : ""}`}
          >
            여성
          </button>
        </div>
        </div>
     

        <div className="field__value_gray hint">
          <span>※ 휴대폰 번호, 이름, 생년월일은 본인 인증 완료 시 자동 반영됩니다.</span>
        </div>
      </div>

      <button type="button" className="default_a_btn_line account-withdraw-btn" onClick={onRequestDelete}>
          회원 탈퇴
        </button>
      <div className="field form-action-group">
        <div className="btn_wrap">
       
          <button type="button" className="default_btn_black btn_w_full" onClick={onSubmit}>
            저장
          </button>
        </div>
      </div>

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
   
    
    </div>
    </>
  );
}
