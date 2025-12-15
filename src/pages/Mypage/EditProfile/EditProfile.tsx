import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordTab from "./PasswordTab";
import ProfileReadonly from "./ProfileReadonly";
import ProfileEditForm from "./ProfileEditForm";
import Modal from '@/shared/components/modal/Modal';
import { UserProfile } from '@/shared/api/user';
import Tabs from "@/shared/components/tabs/Tabs";


const initialProfile: UserProfile = {
  email: "hong1234@withmind.net",
  number: "010-1234-5678",
  name: "정유리",
  birth: "2000.01.01",
  gender: "m",
  certified: true,
};




type DialogKind = "deleteAccount" | "editAccountSuccess"|"deleteAccountSuccess"|"error";


export default function EditProfile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserProfile>(initialProfile);
    const profileMode: "view" | "edit" = userData.certified ? "edit" : "view";
    const [dialog, setDialog] = useState<DialogKind>("deleteAccount");

    const [activeTab, setActiveTab] = useState("edit");
    const tabItems = [
      { key: "edit", label: "기본 정보" },
      { key: "password", label: "비밀번호" },
    ];

    const handleTabClick = (key: "password" | "edit") => {
      setActiveTab(key);
    }

    const closeDialog = () => setDialog(null);

  const openDeleteAccountModal = () => setDialog("deleteAccount");      



  const handleConfirmDeleteAccount = async () => {
    setDialog("deleteAccountSuccess");
    console.log('회원탈퇴 api 진행');;
  };


  const handleConfirmEditAccount = async () => {
    console.log('회원정보수정api 진행');;
    setDialog("editAccountSuccess");
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
          <div className="mypage__content-main">
            {activeTab === "password" ? (
              <PasswordTab 
              onCancel={() => navigate("/mypage", { replace: true })}
               />
            ) : profileMode === "edit" ? (
              <ProfileEditForm 
              userInfo={userData as UserProfile}
              onCancel={() => navigate("/mypage", { replace: true })}
              onSubmit={handleConfirmEditAccount}                             // 부모가 API 호출
              onRequestDelete={openDeleteAccountModal} 
              />
            ) : (
              <ProfileReadonly
              userInfo={userData as UserProfile}
              />
            )}
          </div>
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
          <div className="mypage__content-main">
            {activeTab === "password" ? (
              <PasswordTab 
              onCancel={() => navigate("/mypage", { replace: true })}
               />
            ) : profileMode === "edit" ? (
              <ProfileEditForm 
              userInfo={userData as UserProfile}
              onCancel={() => navigate("/mypage", { replace: true })}
              onSubmit={handleConfirmEditAccount}                             // 부모가 API 호출
              onRequestDelete={openDeleteAccountModal} 
              />
            ) : (
              <ProfileReadonly
              userInfo={userData as UserProfile}
              />
            )}
          </div>
         </div>
          <Modal
              open={dialog=="deleteAccount"}
              title="정말 탈퇴하시겠습니까?"
              desc={
                <>
                  회원 탈퇴 시 보유하신 이용권은 소멸되며,<br/>
                  이용 내역 등의 모든 계정 정보는 복구가 불가능합니다.
                </>
              }
              cancelText="취소"
              confirmText="탈퇴하기"
              showCancel = {true}
              cancelClassName="btn_w_full default_btn_white"
              confirmClassName="btn_w_full default_btn_red"
              onClose={closeDialog}
              onConfirm={handleConfirmDeleteAccount}
            />
            <Modal
              open={dialog=="editAccountSuccess"}
              title="회원 정보 수정이 완료되었습니다."
              confirmText="확인"
              showCancel = {false}
              confirmClassName="btn_w_full default_btn_black"
              onConfirm={closeDialog}
              onClose={closeDialog}
            />
             <Modal
              open={dialog=="deleteAccountSuccess"}
              title="회원 탈퇴가 완료되었습니다."
              desc="잡콕을 이용해 주셔서 감사합니다."
              confirmText="확인"
              showCancel = {false}
              confirmClassName="btn_w_full default_btn_black"
              onConfirm={() => navigate("/", { replace: true })}
              onClose={closeDialog}
            />
              <Modal
              open={dialog=="error"}
              title="수정에 실패하였습니다."
              desc="잠시후 다시 시도하여주세요."
              confirmText="확인"
              showCancel = {false}
              confirmClassName="btn btn--primary"
              onConfirm={() => navigate("/", { replace: true })}
              onClose={closeDialog}
            />
          </>
    );
  }