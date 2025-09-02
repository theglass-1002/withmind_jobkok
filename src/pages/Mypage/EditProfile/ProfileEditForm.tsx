import { useState, useRef, UseEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import calendar_today from '@/assets/icons/calendar_today.png';
import certified_user from '@/assets/icons/certified_user.png';
import Modal from '@/shared/components/modal/Modal';



type Props = {
  userInfo: UserProfile;
  onCancel: () => void;                                  
  onSubmit: (patch: Partial<UserProfile>) => void;         
  onRequestDelete: () => void;                              
};



export default function ProfileEditForm({
  userInfo, onCancel, onSubmit, onRequestDelete,
}: Props) {
    if (!userInfo || !userInfo.email) return <div>2불러오는 중…</div>;
    const [form, setForm] = useState<UserProfile>(userInfo);
    const [openCal, setOpenCal] = useState(false);
    const selectGender = (g: "m" | "f") =>
      setForm((prev) => ({ ...prev, gender: g }));

    return (
         <>
        <div className="account-main">
              <div className="field">
                <span className="field__label">아이디(이메일)</span>
                <span className="field__value_gray">{userInfo.email}</span>
              </div>

              <div className="field">
                <span className="field__label">휴대폰 번호 <em>*</em> </span>
               <div className="number_field_value">
               <span className="field__value">
               <input placeholder={userInfo.number}type="text"/> 
               <span className="icon_fit"> <img src={certified_user}  /></span>
               </span>          
              <button type="button" className="default_btn_white">본인 인증</button>
              </div>
                <span className="field__label">이름 <em>*</em></span>
                <span className="field__value">
                  <input placeholder={userInfo.name} type="text"/>
                  </span>    
                <span className="field__label">생년월일 <em>*</em></span>
                <div className="field__value birth">
                  <span> <img 
                  onClick={()=> setOpenCal((v)=>!v)}
                  src={calendar_today} /></span>
                  <span className="date">{userInfo.birth}</span>
                  {openCal && (
                  <div  className="cal-pop" role="dialog" aria-label="날짜 선택">
                    안녕
                  </div>
                  )}
                </div>
                <span className="field__label">성별 <em>*</em></span>
                <div className="btn_wrap">
                  <span>
                  
                  <button 
                     onClick={()=>selectGender("m")}
                     className={`default_btn_white ${form.gender === "m" ? "on" : ""}`}
                     >
                    남성</button>
                  </span>
                  <span>
                  <button 
                   onClick={() => selectGender("f")}
                   className={`default_btn_white ${form.gender === "f" ? "on" : ""}`}>
                    여성</button>
                  </span>
                  
                  </div>
                <div className="field__value_gray hint">
                  <span>※ 휴대폰 번호, 이름, 생년월일은 본인 인증 완료 후 수정 가능합니다.</span>      
                </div>
              </div>
              <div className="field">
                <button className="default_a_btn_line" onClick={onRequestDelete}>회원 탈퇴</button>
              </div>
              <div className="field">
              <div className="btn_wrap">            
                  <button className="default_btn_white" onClick={onCancel}>취소</button>            
                  <button className="default_btn_black" 
                  onClick={() => onSubmit(form)}
                  >저장</button>              
                  </div>
              </div>
         </div>
            </>
    );
  }