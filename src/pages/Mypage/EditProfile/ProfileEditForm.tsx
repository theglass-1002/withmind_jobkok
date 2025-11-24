import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import calendar_today from '@/assets/icons/calendar_today.png';
import { UserProfile } from '@/shared/api/user';


interface ProfileEditFormProps {
  userInfo: UserProfile;
  onCancel: () => void; // 또는 Promise<void>
  onSubmit: () => Promise<void>;
  onRequestDelete: () => void; 
}

export default function ProfileEditForm({ 
  userInfo, 
  onCancel, 
  onSubmit, 
  onRequestDelete 
}: ProfileEditFormProps) {
    // userInfo 객체가 유효한지 확인하고, 유효하지 않으면 로딩 메시지 표시
    if (!userInfo || !userInfo.email) {
      return <div>불러오는 중…</div>;
    }

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
                <div className="field__value_gray">
                <span className="value-text">{userInfo.number}</span>
              </div>
              <button type="button" className="default_btn_white">본인 인증</button>
              </div>
                <span className="field__label">이름 <em>*</em></span>
                <div className="field__value_gray">
                  <span>{userInfo.name}</span>
                </div>
                <span className="field__label">생년월일 <em>*</em></span>
                <div className="field__value_gray birth">
                  <span> <img src={calendar_today} alt="달력 아이콘" /></span>
                  <span className="date">{userInfo.birth}</span>

                </div>
                <span className="field__label">성별 <em>*</em></span>
                <div className="btn_wrap">
                  
                  <button
                     className={`default_btn_white ${userInfo.gender === 'm' ? 'on' : ''}`}>
                  남성</button>
                  
                  
                  <button
                  className={`default_btn_white ${userInfo.gender === 'f' ? 'on' : ''}`}>
                    여성</button>
                

                  </div>
                <div className="field__value_gray hint">
                  <span>※ 휴대폰 번호, 이름, 생년월일은 본인 인증 완료 후 수정 가능합니다.</span>

                </div>

              </div>
              <div className="field">
                <button className="default_a_btn_line">회원 탈퇴</button>
              </div>
              <div className="field form-action-group">
              <div className="btn_wrap">
                <button className="default_btn_white btn-cancel" onClick={onCancel}>취소</button>
                 <button className="default_btn_black btn_w_full" onClick={onSubmit}>저장</button>
                  </div>
              </div>
            </div>

            </>
    );
  }