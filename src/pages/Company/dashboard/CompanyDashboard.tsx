import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./CompanyDashboard.css";
import CompanyDashboardSidebar from "./components/CompanyDashboardSidebar";
import { ToastContainer } from "react-toastify";
import { SlideDown } from "@/shared/lib/toastConfig";

type TabKey = "이용안내" | "AI 인재 매칭" | "매칭 히스토리" | "통계" | "이용권";

const tabKeyToPath = (tab: TabKey): string => {
  switch (tab) {
    case "이용안내":
      return "guide";
    case "AI 인재 매칭":
      return "ai-matching";
    case "매칭 히스토리":
      return "history";
    case "통계":
      return "statistics";
    case "이용권":
      return "pricing";
    default:
      return "guide";
  }
};

const pathToTabKey = (pathSegment: string): TabKey => {
  switch (pathSegment) {
    case "guide":
    case "":
      return "이용안내";
    case "ai-matching":
    case "report":
      return "AI 인재 매칭";
    case "history":
      return "매칭 히스토리";
    case "statistics":
      return "통계";
    case "pricing":
      return "이용권";
    default:
      return "이용안내";
  }
};

const getTabSegmentFromPath = (pathname: string): string => {
  const segments = pathname.split("/").filter((s) => s);

  if (segments.length >= 2 && segments[0] === "company") {
    return segments[1];
  }

  return "";
};

const getCompanyAccessToken = () =>
  sessionStorage.getItem("companyAccessToken") ??
  localStorage.getItem("companyAccessToken");

const getCompanyRefreshToken = () =>
  sessionStorage.getItem("companyRefreshToken") ??
  localStorage.getItem("companyRefreshToken");

export default function CompanyDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPathSegment = getTabSegmentFromPath(location.pathname);
  const initialTab = pathToTabKey(currentPathSegment);

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  useEffect(() => {
    const companyAccessToken = getCompanyAccessToken();
    const companyRefreshToken = getCompanyRefreshToken();
    if (!companyAccessToken || !companyRefreshToken) {
      navigate("/company/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const segment = getTabSegmentFromPath(location.pathname);
    const tabSegmentToActivate = segment;

    setActiveTab(pathToTabKey(tabSegmentToActivate));
  }, [location.pathname]);

  const handleTabSelect = (tab: TabKey) => {
    navigate(tabKeyToPath(tab));
    setActiveTab(tab);
  };

  return (
    <div className="company-dashboard-layout">
      <div className="company-dashboard">
        <CompanyDashboardSidebar
          activeTab={activeTab}
          onSelect={handleTabSelect}
        />

        <div className="company-dashboard__main">
          <Outlet />
        </div>

        <ToastContainer
          limit={1}
          className="app-toast"
          position="top-center"
          transition={SlideDown}
          newestOnTop
          hideProgressBar
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
          draggable
          theme="light"
          autoClose={100}
        />
      </div>
    </div>
  );
}