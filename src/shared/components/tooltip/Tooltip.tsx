import { Icons } from "@/assets/icons";
import React from "react";



// 사용법
// import Tooltip from "@/shared/components/tooltip/Tooltip";
// <Tooltip
// title="이력서 기반 추천이란?"
// desc="등록된 기본 이력서를 기반으로, 적합한 채용 공고를 찾아주는 잡콕만의 AI 추천 서비스입니다. 적합도가 높은 공고에는 [AI Pick] 태그가 표시됩니다."
// position="top"
// className="job-posting__tooltip"
// />

type TooltipProps = {
  iconElement?: React.ReactNode; 
  title: string;
  desc: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
};

export default function Tooltip({
  iconElement=<img src={Icons.ic_error_gray500_20} alt="" />,
  title,
  desc,
  position = "top",
  className,
}: TooltipProps) {
  const wrapperClass = [
    "tooltip",
    `tooltip--${position}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={wrapperClass}>
      {iconElement}
      {/* <img
        className="tooltip-icon"
        src={ic_error_gray500_20}
        alt=""
        aria-hidden="true"
        tabIndex={0}
      /> */}
      <div className="tooltip__content" role="tooltip">
        <span className="tooltip__title">{title}</span>
        <span className="tooltip__desc">{desc}</span>
      </div>
    </span>
  );
}
