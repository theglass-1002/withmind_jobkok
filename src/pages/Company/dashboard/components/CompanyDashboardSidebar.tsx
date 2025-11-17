import React from "react";

import ic_guide_gray500_24 from "@/assets/icons/size24/ic_guide_gray500_24.png";

import ic_ai_matching_gray500_24 from "@/assets/icons/size24/ic_ai_matching_gray500_24.png";
import ic_ai_matching_white_24 from "@/assets/icons/size24/ic_ai_matching_white_24.png";

import ic_match_history_gray500_24 from "@/assets/icons/size24/ic_match_history_gray500_24.png";
import ic_match_history_white_24 from "@/assets/icons/size24/ic_match_history_white_24.png";

import ic_stats_gray500_24 from "@/assets/icons/size24/ic_stats_gray500_24.png";
import ic_stats_white_24 from "@/assets/icons/size24/ic_stats_white_24.png";

import ic_plan_gray500_24 from "@/assets/icons/size24/ic_plan_gray500_24.png";
import ic_plan_white_24 from "@/assets/icons/size24/ic_plan_white_24.png";
type TabKey = "이용안내" | "AI 인재 매칭" | "매칭 히스토리" | "통계" | "이용권";

type Props = {
  activeTab: TabKey; // <-- 이전 답변에서 수정한 대로 TabKey로 명시하는 것이 좋음
  onSelect: (tab: TabKey) => void;
};

// **해결책: TABS 배열에 타입을 명시적으로 지정**
const TABS: { label: TabKey; icon: string; iconActive: string }[] = [
  {
    label: "이용안내",
    icon: ic_guide_gray500_24,
    iconActive: ic_guide_gray500_24,
  },
  {
    label: "AI 인재 매칭",
    icon: ic_ai_matching_gray500_24,
    iconActive: ic_ai_matching_white_24,
  },
  {
    label: "매칭 히스토리",
    icon: ic_match_history_gray500_24,
    iconActive: ic_match_history_white_24,
  },
  {
    label: "통계",
    icon: ic_stats_gray500_24,
    iconActive: ic_stats_white_24,
  },
  {
    label: "이용권",
    icon: ic_plan_gray500_24,
    iconActive: ic_plan_white_24,
  },
];

export default function CompanyDashboardSidebar({ activeTab, onSelect }: Props) {
  return (
    <div className="company-dashboard__sidebar">
      <span className="company-dashboard__logo">잡콕 _ 기업</span>

      <div className="company-dashboard__nav">
        {TABS.map(({ label, icon, iconActive }) => {
          // label이 TabKey 타입이므로 activeTab (TabKey)과 비교 가능
          const isActive = activeTab === label;

          return (
            <div
              key={label}
              className={
                "company-dashboard__nav-item" +
                (isActive ? " on" : "")
              }
              // label이 TabKey 타입으로 보장되어 오류가 사라짐
              onClick={() => onSelect(label)} 
            >
              <img
                className="company-dashboard__nav-icon"
                src={isActive ? iconActive : icon}
                alt={label}
              />
              <span className="company-dashboard__nav-text">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}