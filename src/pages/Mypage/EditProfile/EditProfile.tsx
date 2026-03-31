import { useEffect, useState } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import PasswordTab from "./PasswordTab";
import ProfileEditForm, { ProfileEditSubmitPayload } from "./ProfileEditForm";
import Modal from "@/shared/components/modal/Modal";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { UserProfile } from "@/shared/api/user";
import Tabs from "@/shared/components/tabs/Tabs";
import type { MyInfo, UpdateUserRequest } from "@/api/auth/auth.types";
import { updateUser } from "@/api/auth/auth.api";

type DialogKind =
  | "deleteAccount"
  | "editAccountSuccess"
  | "deleteAccountSuccess"
  | "error"
  | null;

type OutletContextType = {
  myInfo: MyInfo | null;
  setMyInfo: React.Dispatch<React.SetStateAction<MyInfo | null>>;
};

type LocationState = {
  myInfo?: MyInfo | null;
};

function toUserProfileFromMyInfo(myInfo: MyInfo | null): UserProfile {
  if (!myInfo) {
    return {
      email: "",
      number: "",
      name: "",
      birth: "",
      gender: "M",
      certified: false,
    };
  }

  const gender: "M" | "W" =
    myInfo.gender === "M" || myInfo.gender === "W" ? myInfo.gender : "M";

  return {
    email: myInfo.userId ?? "",
    number: myInfo.phone ?? "",
    name: myInfo.userName ?? "",
    birth: myInfo.birthdate ?? "",
    gender,
    certified: Boolean(myInfo.ciHash && myInfo.ciHash.trim() !== ""),
  };
}

export default function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const outletContext = useOutletContext<OutletContextType | null>();
  const myInfoFromLocation =
    (location.state as LocationState | null)?.myInfo ?? null;

  const myInfo = outletContext?.myInfo ?? myInfoFromLocation ?? null;

  const [dialog, setDialog] = useState<DialogKind>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "password">("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<UserProfile>({
    email: "",
    number: "",
    name: "",
    birth: "",
    gender: "M",
    certified: false,
  });

  const tabItems = [
    { key: "edit", label: "기본 정보" },
    { key: "password", label: "비밀번호" },
  ];

  useEffect(() => {
    if (!myInfo) return;

    const mapped = toUserProfileFromMyInfo(myInfo);
    setUserData(mapped);
  }, [outletContext, myInfoFromLocation, myInfo]);

  useEffect(() => {
    
  }, [userData]);

  const handleTabClick = (key: "password" | "edit") => {
    setActiveTab(key);
  };

  const closeDialog = () => {
    setDialog(null);
  };

  const openDeleteAccountModal = () => {
    setDialog("deleteAccount");
  };

  const handleConfirmDeleteAccount = async () => {
    setDialog("deleteAccountSuccess");
  };

  const handleConfirmEditAccount = async (
    payload: ProfileEditSubmitPayload
  ) => {
    try {
      setIsSaving(true);

      console.log("수정");
      console.log("전달받은 전체 payload:", payload);
      console.log("휴대폰 번호:", payload.phone);
      console.log("이름:", payload.name);
      console.log("생년월일:", payload.birth);
      console.log("성별:", payload.gender);
      console.log("인증 여부:", payload.certified);

      const requestPayload: UpdateUserRequest = {
        userIdx: Number(myInfo?.idx ?? 0),
        email: myInfo?.userId ?? userData.email ?? "",
   
        phone: payload.phone,
        userName: payload.name,
        birthdate: payload.birth,
        gender: payload.gender,
        certified: payload.certified,
      };

   

      const res = await updateUser(requestPayload);



      setUserData((prev) => ({
        ...prev,
        number: payload.phone,
        name: payload.name,
        birth: payload.birth,
        gender: payload.gender,
        certified: payload.certified,
      }));

      if (outletContext?.setMyInfo) {
        outletContext.setMyInfo((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            phone: payload.phone,
            userName: payload.name,
            birthdate: payload.birth,
            gender: payload.gender,
          };
        });
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      document.documentElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      document.body.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setDialog("editAccountSuccess");
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);
      setDialog("error");
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (activeTab === "password") {
      return (
        <PasswordTab onCancel={() => navigate("/mypage", { replace: true })} />
      );
    }

    return (
      <ProfileEditForm
        userInfo={userData}
        onCancel={() => navigate("/mypage", { replace: true })}
        onSubmit={handleConfirmEditAccount}
        onRequestDelete={openDeleteAccountModal}
      />
    );
  };

  return (
    <>
      <LoadingOverlay
        isLoading={isSaving}
        isLogo={false}
        text="회원 정보를 저장하고 있습니다."
      />

      <div className="edit-profile__container">
        <header className="mypage__content-header tabs">
          <h2 className="title">회원 정보 수정</h2>
          <Tabs
            tabs={tabItems}
            active={activeTab}
            onChange={handleTabClick}
            className="my-page_edit-tabs default_tabs"
            itemClassName="my-page-tabs__item"
            activeClassName="on"
          />
        </header>

        <div className="mypage__content-main">{renderContent()}</div>
      </div>

      <div className="edit-profile__container mobile">
        <header className="edit-profile__sticky-tabs">
          <Tabs
            tabs={tabItems}
            active={activeTab}
            onChange={handleTabClick}
            className="my-page_edit-tabs default_tabs"
            itemClassName="my-page-tabs__item"
            activeClassName="on"
          />
        </header>

        <div className="mypage__content-main">{renderContent()}</div>
      </div>

      <Modal
        open={dialog === "deleteAccount"}
        title="정말 탈퇴하시겠습니까?"
        desc={
          <>
            회원 탈퇴 시 보유하신 이용권은 소멸되며,
            <br />
            이용 내역 등의 모든 계정 정보는 복구가 불가능합니다.
          </>
        }
        cancelText="취소"
        confirmText="탈퇴하기"
        showCancel={true}
        cancelClassName="btn_w_full default_btn_white"
        confirmClassName="btn_w_full default_btn_red"
        onClose={closeDialog}
        onConfirm={handleConfirmDeleteAccount}
      />

      <Modal
        open={dialog === "editAccountSuccess"}
        title="회원 정보 수정이 완료되었습니다."
        confirmText="확인"
        showCancel={false}
        confirmClassName="btn_w_full default_btn_black"
        onConfirm={closeDialog}
        onClose={closeDialog}
      />

      <Modal
        open={dialog === "deleteAccountSuccess"}
        title="회원 탈퇴가 완료되었습니다."
        desc="잡콕을 이용해 주셔서 감사합니다."
        confirmText="확인"
        showCancel={false}
        confirmClassName="btn_w_full default_btn_black"
        onConfirm={() => navigate("/", { replace: true })}
        onClose={closeDialog}
      />

      <Modal
        open={dialog === "error"}
        title="수정에 실패하였습니다."
        desc="잠시후 다시 시도하여주세요."
        confirmText="확인"
        showCancel={false}
        confirmClassName="btn btn--primary"
        onConfirm={closeDialog}
        onClose={closeDialog}
      />
    </>
  );
}