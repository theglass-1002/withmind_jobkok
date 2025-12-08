// src/pages/Resume/ResumeSidebar/ResumeSidebar.tsx
import React, { useEffect, useState } from "react";
import Switch from "react-switch";
import ic_check_gray300_20 from "@/assets/icons/size20/ic_check_gray300_20.png";
import ic_check_purple_20 from "@/assets/icons/size20/ic_check_purple_20.png";
import "./ResumeSidebar.css";

export type SectionId =
  | "title"
  | "basic"
  | "location"
  | "career"
  | "education"
  | "desiredRole"
  | "hardSkills"
  | "softSkills"
  | "activities"
  | "awards"
  | "portfolio"
  | "selfIntro"
  | "mockInterview";

export type Status = "completed" | "pending";

type Props = {
  statusMap?: Partial<Record<SectionId, Status>>;
  isDefault?: boolean;
  onToggleDefault?: (checked: boolean) => void;
};

type Section = { id: SectionId; title: string; required?: boolean };

const SECTIONS: Section[] = [
  { id: "title", title: "이력서 제목", required: true },
  { id: "basic", title: "기본 정보", required: true },
  { id: "location", title: "희망 근무 지역", required: true },
  { id: "career", title: "경력", required: true },
  { id: "education", title: "학력", required: true },
  { id: "desiredRole", title: "희망 직무", required: true },
  { id: "hardSkills", title: "하드 스킬" },
  { id: "softSkills", title: "소프트 스킬" },
  { id: "activities", title: "활동ㆍ경험" },
  { id: "awards", title: "수상ㆍ자격증" },
  { id: "portfolio", title: "포트폴리오ㆍ기타 문서" },
  { id: "selfIntro", title: "자기소개서" },
  { id: "mockInterview", title: "모의면접 분석 결과" },
];

export default function ResumeSidebar({
  statusMap = {},
  isDefault,
  onToggleDefault,
}: Props) {
  const [localDefault, setLocalDefault] = useState<boolean>(!!isDefault);

  useEffect(() => {
    if (typeof isDefault !== "undefined") setLocalDefault(!!isDefault);
  }, [isDefault]);

  const checked =
    typeof isDefault === "undefined" ? localDefault : !!isDefault;

  const handleToggle = (next: boolean) => {
    onToggleDefault?.(next);
    if (typeof isDefault === "undefined") setLocalDefault(next);
  };

  return (
    <aside className="resume-create-page__aside">
      <div className="resume-sidebar__header">
        <span className="resume-sidebar__title">이력서 관리</span>
      </div>

      <div className="resume-sidebar__default">
        <span className="resume-sidebar__default-text">기본 이력서로 설정</span>
        <label
          className="resume-sidebar__default-label"
          aria-label="기본 이력서로 설정"
        >
          <Switch
            checked={checked}
            onChange={handleToggle}
            onColor="#000000"
            offColor="#E5E7EB"
            onHandleColor="#FFFFFF"
            offHandleColor="#FFFFFF"
            handleDiameter={18}
            height={22}
            width={42}
            uncheckedIcon={false}
            checkedIcon={false}
            aria-label="기본 이력서로 설정"
          />
        </label>
      </div>

      <div className="resume-sidebar__sections">
        {SECTIONS.map((s) => {
          const st: Status = statusMap[s.id] ?? "pending";
          const icon =
            st === "completed" ? ic_check_purple_20 : ic_check_gray300_20;

          return (
            <div key={s.id} className="resume-sidebar__section-row">
              <span className="resume-sidebar__section-name">
                {s.title}
                {s.required && (
                  <em className="badge--required" aria-label="필수">
                    *
                  </em>
                )}
              </span>
              <img
                src={icon}
                alt={st === "completed" ? "설정완료" : "설정 필요"}
              />
            </div>
          );
        })}
      </div>
    </aside>
  );
}
