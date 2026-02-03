import React, { useState } from "react";
import M_MyPageSideMenu from "@/pages/Mypage/mobile/M_MyPageSideMenu";
import M_Mypage from "@/pages/Mypage/mobile/M_Mypage";
import { useStickyTabs } from "@/shared/utils/util";
import Tabs from "@/shared/components/tabs/Tabs";
import { MyInfo } from "@/api/auth/auth.types";

type Props = {
  myInfo: MyInfo | null;
};

export default function M_MyPageMain({ myInfo }: Props) {
  const [activeTab, setActiveTab] = useState("profile");

  const isTabsSticky = useStickyTabs(
    "sticky-trigger",
    ".default_tabs",
    ".page-header"
  );

  const tabItems = [
    { key: "profile", label: "프로필" },
    { key: "activity", label: "내 활동" },
  ];

  const handleTabClick = (key: "profile" | "activity") => {
    setActiveTab(key);
  };

  return (
    <div className="container mypage__container mobile">
      <Tabs
        tabs={tabItems}
        active={activeTab}
        onChange={handleTabClick}
        className={`my-page-tabs default_tabs ${isTabsSticky ? "is-sticky" : ""}`}
        itemClassName="my-page-tabs__item"
        activeClassName="on"
      />

      <div id="sticky-trigger" className="mypage__body">
        {activeTab === "profile" ? (
          <M_MyPageSideMenu myInfo={myInfo} />
        ) : (
          <M_Mypage />
        )}
      </div>
    </div>
  );
}
