import React from "react";


// 사용법
// import Tabs from "@/shared/components/tabs/Tabs";
// type TabKey = "overview" | "detail" | "match";
// const tabItems: { key: TabKey; label: React.ReactNode }[] = [
//   { key: "overview", label: "종합 분석" },
//   { key: "detail", label: "상세 분석" },
//   { key: "match", label: "이력서−면접 일치도 분석" },
// ];
// <Tabs
//   tabs={tabItems}
//   active={activeTab}
//   onChange={(key) => handleTabClick(key as TabKey)}
//   className="mock-analysis-tabs default_tabs"
//   itemClassName="mock-analysis-tabs__item tab"
//   activeClassName="on"
// />

type TabItem = {
  key: string;
  label: React.ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;

  className?: string;             // wrapper class
  itemClassName?: string;         // each tab class
  activeClassName?: string;       // active tab class
};

export default function Tabs({
  tabs,
  active,
  onChange,
  className = "",
  itemClassName = "",
  activeClassName = "on",
}: TabsProps) {
  return (
    <div className={`${className}`.trim()}>
      {tabs.map((tab) => (
        <span
          key={tab.key}
          className={
            `tabs__item ${itemClassName} ${active === tab.key ? activeClassName : ""}`
              .trim()
          }
          role="button"
          tabIndex={0}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </span>
      ))}
    </div>
  );
}
