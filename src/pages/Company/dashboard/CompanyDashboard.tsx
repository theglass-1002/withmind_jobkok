import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./CompanyDashboard.css";
import CompanyDashboardSidebar from "./components/CompanyDashboardSidebar";
import { ToastContainer } from 'react-toastify'; 
import { SlideDown } from '@/shared/lib/toastConfig';

type TabKey = "이용안내" | "AI 인재 매칭" | "매칭 히스토리" | "통계" | "이용권";

// 탭 레이블을 URL 경로 세그먼트로 변환하는 헬퍼 함수
const tabKeyToPath = (tab: TabKey): string => {
  switch (tab) {
    case "이용안내": return "guide";
    case "AI 인재 매칭": return "ai-matching";
    case "매칭 히스토리": return "history";
    case "통계": return "statistics";
    case "이용권": return "pricing";
    default: return "guide";
  }
};

// URL 경로 세그먼트를 탭 레이블로 변환하는 헬퍼 함수
const pathToTabKey = (pathSegment: string): TabKey => {
  switch (pathSegment) {
    case "guide":
    case "": // /company 경로 (index: true)
      return "이용안내";
      
    // 'ai-matching' 탭을 활성화하는 모든 경로를 매핑합니다.
    case "ai-matching":
    case "report": // /company/ai-matching/report 와 같은 하위 경로를 처리하기 위함
      return "AI 인재 매칭";
      
    case "history": return "매칭 히스토리";
    case "statistics": return "통계";
    case "pricing": return "이용권";
    default: return "이용안내";
  }
};

const getTabSegmentFromPath = (pathname: string): string => {

    const segments = pathname.split('/').filter(s => s); 
    
    if (segments.length >= 2 && segments[0] === 'company') {
        return segments[1]; 
    }
       return ''; 
};


export default function CompanyDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. 초기 activeTab 설정 (URL에 따라)
  const currentPathSegment = getTabSegmentFromPath(location.pathname);
  const initialTab = pathToTabKey(currentPathSegment);

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  // 2. URL이 변경될 때 activeTab을 업데이트합니다.
  useEffect(() => {
    // URL에서 탭을 결정하는 세그먼트 (예: "ai-matching")를 가져옵니다.
    const segment = getTabSegmentFromPath(location.pathname); 
    
    let tabSegmentToActivate = segment;
    
    // 만약 현재 경로가 report 라면, 이는 'ai-matching' 탭의 하위 페이지이므로 
    // tabSegmentToActivate를 'ai-matching'으로 설정해야 하지만,
    // getTabSegmentFromPath 로직상 'ai-matching'이 추출되므로 이 단계는 필요 없습니다.

    // 단, /company/report와 같이 라우팅을 설정했다면, 
    // 'report'가 추출될 것입니다. 이 경우, 'ai-matching'으로 매핑해야 합니다.
    // 여기서는 `pathToTabKey` 함수가 'report'를 'AI 인재 매칭'으로 매핑하도록 수정했기 때문에
    // 추가적인 조건문 없이 바로 pathToTabKey를 사용할 수 있습니다.

    setActiveTab(pathToTabKey(tabSegmentToActivate));
  }, [location.pathname]);

  // Sidebar에서 탭 선택 시 URL로 이동하고 상태를 업데이트하는 핸들러
  const handleTabSelect = (tab: TabKey) => {
    // navigate(tabKeyToPath(tab))는 /company/guide에서 guide로 이동시키므로 상대 경로 이동
    // '/company/guide'로 이동시키려면 navigate('/company/' + tabKeyToPath(tab)) 사용
    navigate(tabKeyToPath(tab)); 
    setActiveTab(tab);
  };

  return (
    <div className="company-dashboard">
      <CompanyDashboardSidebar activeTab={activeTab} onSelect={handleTabSelect} />
      
      <div className="company-dashboard__main">
          <Outlet />
      </div>
           
      <ToastContainer
          className="app-toast"
          position="top-center"
          transition={SlideDown}
          autoClose={2000}
          newestOnTop
          hideProgressBar
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
          draggable
          theme="light"
        />
    </div>
  );
}