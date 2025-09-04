import { useState, useRef, UseEffect } from "react";
import { useNavigate } from "react-router-dom";
import PasswordTab from "./PasswordTab";
import ProfileReadonly from "./ProfileReadonly";
import ProfileEditForm from "./ProfileEditForm";
import Modal from '@/shared/components/modal/Modal';

const initialProfile: UserProfile = {
  email:"hong1234@withmind.net",
  number:"010-1234-5678",
  name:"홍길동",
  birth:"2000.01.01",
  gender:"m",
  certified:true
};



type TabKey = "profile" | "password";
type DialogKind = "deleteAccount" | "editAccountSuccess"|"deleteAccountSuccess"|"error";


export default function EditProfile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserProfile>(initialProfile);
    const profileMode: "view" | "edit" = userData.certified ? "edit" : "view";
    const [tab, setTab] = useState<TabKey>("profile");
    const [dialog, setDialog] = useState<DialogKind>("");

    const closeDialog = () => setDialog(null);
    const handleTabSelect = (key: TabKey) => {
        setTab(key);
      };
  const openDeleteAccountModal = () => setDialog("deleteAccount");      



  const handleConfirmDeleteAccount = async () => {
    console.log('회원탈퇴 api 진행');;
    // try {
    //   await UserAPI.deleteAccount();
    //   // 로그아웃/리다이렉트 등 후처리
    // } catch (e) {
    //   console.error(e);
    // } finally {
    //   closeModal();
    // }
  };


  const handleConfirmEditAccount = async () => {
    console.log('회원정보수정api 진행');;
    // try {
    //   await UserAPI.deleteAccount();
    //   // 로그아웃/리다이렉트 등 후처리
    // } catch (e) {
    //   console.error(e);
    // } finally {
    //   closeModal();
    // }
  };



    return (
         <>
         <header className="mypage__content-header tabs">
              <h2 className="title">회원 정보 수정</h2>
              <nav className="tabs" aria-label="계정 탭">
                <ul className="tabs__list" role="tablist">
                  <li className={`tabs__item${tab=='profile'?'-is-active':''}`} onClick={()=>handleTabSelect("profile")}>
                    기본 정보
                  </li>
                  <li className={`tabs__item${tab=='password'?'-is-active':''}`} onClick={()=>handleTabSelect("password")}>
                    비밀번호
                  </li>
                </ul>
              </nav>
            </header> 
       
          <div className="mypage__content-main">
            {tab === "password" ? (
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
              confirmClassName="btn default_btn_red"
              onClose={closeDialog}
              onConfirm={handleConfirmDeleteAccount}
            />
            <Modal
              open={dialog=="editAccountSuccess"}
              title="회원 정보 수정이 완료되었습니다."
              confirmText="확인"
              showCancel = {false}
              confirmClassName="btn btn--primary"
              onClose={closeDialog}
            />
             <Modal
              open={dialog=="deleteAccountSuccess"}
              title="회원 탈퇴가 완료되었습니다."
              desc="잡콕을 이용해 주셔서 감사합니다."
              confirmText="확인"
              showCancel = {false}
              confirmClassName="btn btn--primary"
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