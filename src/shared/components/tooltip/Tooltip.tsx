import React from "react";
import ic_error_gray500_20 from "@/assets/icons/size20/ic_error_gray500_20.png";

type TooltipProps = {
  title: string;
  desc: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
};

export default function Tooltip({
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
      <img
        className="tooltip-icon"
        src={ic_error_gray500_20}
        alt=""
        aria-hidden="true"
        tabIndex={0}
      />
      <div className="tooltip__content" role="tooltip">
        <span className="tooltip__title">{title}</span>
        <span className="tooltip__desc">{desc}</span>
      </div>
    </span>
  );
}
