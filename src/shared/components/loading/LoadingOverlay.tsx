import React from "react";
import "./LoadingOverlay.css";
import { Icons } from "@/assets/icons";


type Props = {
  isLoading: boolean;
  isLogo?:boolean;
  text?: string;
  overlayClassName?: string;
  boxClassName?: string;
  barClassName?: string;
  textClassName?: string;
};

export default function LoadingOverlay({
  isLoading,
  text = "",
  isLogo = true,
  overlayClassName = "",
  boxClassName = "",
  barClassName = "",
  textClassName = "",
}: Props) {
  if (!isLoading) return null;

  return (
    console.log(text),
    console.log(isLogo),
    <div className={`loading-overlay ${overlayClassName}`}>
      <div className={`loading-box ${boxClassName}`}>
        {isLogo?<img className={`loading-logo`} src={Icons.jobkok_logo_purple} alt="" />:
        <span>{text}</span>}
        {text?? <p className={`loading-text ${textClassName}`}>{text}</p>}
      </div>
    </div>
  );
}
