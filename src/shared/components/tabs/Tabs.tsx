import React from "react";

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
