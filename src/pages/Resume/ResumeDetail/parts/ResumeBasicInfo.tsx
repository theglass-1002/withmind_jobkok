import React from "react";
import ic_mail_gray500_20 from "@/assets/icons/size20/ic_mail_gray500_20.png";
import ic_mobile_gray_20 from "@/assets/icons/size20/ic_mobile_gray_20.png";

type Props = {
  name: string;
  meta: string;
  email: string;
  phone: string;
  imageSrc?: string;
};

// 이름 마스킹: 첫 글자만 보여주고 나머지는 ㅇ
function maskName(name: string): string {
  if (!name || name === "-") return name;

  if (name.length === 1) return name;

  const firstChar = name[0];
  const masked = "ㅇ".repeat(name.length - 1);

  return firstChar + masked;
}

// 이메일 마스킹: 첫 글자와 @ 이후만 보여주고 나머지는 *
function maskEmail(email: string): string {
  if (!email || email === "-") return email;

  const atIndex = email.indexOf("@");
  if (atIndex <= 0) return email;

  const localPart = email.substring(0, atIndex);
  const domainPart = email.substring(atIndex);

  if (localPart.length === 1) {
    return localPart + domainPart;
  }

  const firstChar = localPart[0];
  const masked = "*".repeat(localPart.length - 1);

  return firstChar + masked + domainPart;
}

// 전화번호 마스킹: 010만 보여주고 나머지는 **
function maskPhone(phone: string): string {
  if (!phone || phone === "-") return phone;

  // 010으로 시작하는 경우
  if (phone.startsWith("010")) {
    const rest = phone.substring(3);
    const masked = rest.replace(/\d/g, "*");
    return "010" + masked;
  }

  return phone;
}

export default function ResumeBasicInfo({
  name,
  meta,
  email,
  phone,
  imageSrc,
}: Props) {
  const maskedName = maskName(name);
  const maskedEmail = maskEmail(email);
  const maskedPhone = maskPhone(phone);
  return (
    <>
    <div className="resume-basic">
      <div className="resume-basic__text">
        <div className="resume-basic__identity">
          <span className="resume-basic__name">{maskedName}</span>
          <span className="resume-basic__meta">{meta}</span>
        </div>
        <div className="resume-basic__contact">
          <span className="resume-basic__email">
            <img src={ic_mail_gray500_20} alt="" />
            {maskedEmail}
          </span>
          <span className="resume-basic__phone">
            <img src={ic_mobile_gray_20} alt="" />
            {maskedPhone}
          </span>
        </div>
      </div>
      {imageSrc?
       <span className="resume-basic__img">
       <img src={imageSrc} alt="" />
     </span>
      :<></>}
      {/* <span className="resume-basic__img">
        <img src={imageSrc} alt="" />
      </span> */}
    </div>
    <div className="resume-basic mobile">
    <span className="resume-field__label">기본 정보</span>
    <div className="resume-basic__content">


      <div className="resume-basic__text">
        <div className="resume-basic__identity">
          <span className="resume-basic__name">{maskedName}</span>
          <span className="resume-basic__meta">{meta}</span>
        </div>
        <div className="resume-basic__contact">
          <span className="resume-basic__email">
            <img src={ic_mail_gray500_20} alt="" />
            {maskedEmail}
          </span>
          <span className="resume-basic__phone">
            <img src={ic_mobile_gray_20} alt="" />
            {maskedPhone}
          </span>
        </div>
      </div>
      {imageSrc?
       <span className="resume-basic__img">
       <img src={imageSrc} alt="" />
     </span>
      :<></>}
    </div>    
    </div>
    </>
  );
}
