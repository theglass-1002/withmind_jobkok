import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PasswordTab from "./PasswordTab";
import ProfileEditForm from "./ProfileEditForm";
import Modal from "@/shared/components/modal/Modal";
import { UserProfile } from "@/shared/api/user";
import Tabs from "@/shared/components/tabs/Tabs";
import type { MyInfo } from "@/api/auth/auth.types";

type DialogKind =
  | "deleteAccount"
  | "editAccountSuccess"
  | "deleteAccountSuccess"
  | "error"
  | null;

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

  const myInfoFromState =
    (location.state as LocationState | null)?.myInfo ?? null;

  const [userData, setUserData] = useState<UserProfile>(() =>
    toUserProfileFromMyInfo(myInfoFromState)
  );

  useEffect(() => {
    setUserData(toUserProfileFromMyInfo(myInfoFromState));
  }, [myInfoFromState]);

  const [dialog, setDialog] = useState<DialogKind>(null);

  const [activeTab, setActiveTab] = useState<"edit" | "password">("edit");
  const tabItems = [
    { key: "edit", label: "기본 정보" },
    { key: "password", label: "비밀번호" },
  ];

  const handleTabClick = (key: "password" | "edit") => setActiveTab(key);

  const closeDialog = () => setDialog(null);
  const openDeleteAccountModal = () => setDialog("deleteAccount");

  const handleConfirmDeleteAccount = async () => {
    setDialog("deleteAccountSuccess");
  };

  const handleConfirmEditAccount = async () => {
    setDialog("editAccountSuccess");
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
        onConfirm={() => navigate("/", { replace: true })}
        onClose={closeDialog}
      />
    </>
  );
}
