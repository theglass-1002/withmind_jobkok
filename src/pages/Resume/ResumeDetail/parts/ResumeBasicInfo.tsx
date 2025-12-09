import React from "react";
import ic_mail_gray500_20 from "@/assets/icons/size20/ic_mail_gray500_20.png";
import ic_mobile_gray_20 from "@/assets/icons/size20/ic_mobile_gray_20.png";

type Props = {
  name: string;
  meta: string;
  email: string;
  phone: string;
  imageSrc: string;
};

export default function ResumeBasicInfo({
  name,
  meta,
  email,
  phone,
  imageSrc,
}: Props) {
  return (
    <div className="resume-basic">
      <div className="resume-basic__text">
        <div className="resume-basic__identity">
          <span className="resume-basic__name">{name}</span>
          <span className="resume-basic__meta">{meta}</span>
        </div>
        <div className="resume-basic__contact">
          <span className="resume-basic__email">
            <img src={ic_mail_gray500_20} alt="" />
            {email}
          </span>
          <span className="resume-basic__phone">
            <img src={ic_mobile_gray_20} alt="" />
            {phone}
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
  );
}
