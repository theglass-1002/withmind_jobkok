


import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";    

import Linkview from "@/pages/Linkview/Linkview";


// 모바일

import M_ResumeCreate from "@/pages/Resume/M_ResumeCreate";
import M_MockInterviewLive from "@/pages/MockInterview/MockInterviewLive/M_MockInterviewLive";
import M_MockSettings from "@/pages/MockInterview/MockSettings/M_MockSettings";
import M_EnvironmentTestView from "@/pages/MockInterview/MockSettings/step-test/M_EnvironmentTestView";


import Home from "@/pages/Home/Home";
import JobsList from "@/pages/Jobs/JobsList";
import JobDetail from "@/pages/Jobs/JobDetail";


import ResumeList from "@/pages/Resume/ResumeList";
import ResumeDetail from "@/pages/Resume/ResumeDetail/ResumeDetail";
import ResumeEdit from "@/pages/Resume/ResumeEdit/ResumeEdit";
import ResumeCreate from "@/pages/Resume/ResumeCreate";

import InterviewReport from "@/pages/InterviewReport/InterviewReport";
import MockAnalysisPage from "@/pages/InterviewReport/analysis/MockAnalysisPage";

import MockInterviewGuide from "@/pages/MockInterview/MockInterviewGuide/MockInterviewGuide";
import MockInstructions from "@/pages/MockInterview/MockInstructions/MockInstructions";
import MockSettings from "@/pages/MockInterview/MockSettings/MockSettings";
import EnvironmentTestView from "@/pages/MockInterview/MockSettings/step-test/EnvironmentTestView";
import MockInterviewLive from "@/pages/MockInterview/MockInterviewLive/MockInterviewLive";

import Mypage from "@/pages/Mypage/Mypage";
import EditProfile from "@/pages/Mypage/EditProfile/EditProfile";
import PlanHistory from "@/pages/Mypage/Plan/PlanHistory";
import SavedPostings from "@/pages/Mypage/Postings/SavedPostings";
import Faq from "@/pages/Mypage/Support/Faq";
import Inquiry from "@/pages/Mypage/Support/Inquiry/Inquiry";
import InquiryDetail from "@/pages/Mypage/Support/Inquiry/InquiryDetail";
import InquiryCreate from "@/pages/Mypage/Support/Inquiry/InquiryCreate";
import InquiryEdit from "@/pages/Mypage/Support/Inquiry/InquiryEdit";
import NoticeList from "@/pages/Mypage/Support/Notices/NoticeList";
import NoticeDetail from "@/pages/Mypage/Support/Notices/NoticeDetail";
import ReportJob from "@/pages/Mypage/Support/ReportJob/ReportJob";
import RecentJobsList from "@/pages/Jobs/RecentJobs/RecentJobsList";


import PurchaseLayout from "@/pages/Purchase/PurchaseLayout";
import PurchaseSuccess from "@/pages/PurchaseResult/PurchaseSuccess";
import PurchaseFail from "@/pages/PurchaseResult/PurchaseFail";


import Login from "@/pages/Auth/Login/Login";
import Signup from "@/pages/Auth/Signup/Signup";
import InicisSuccess from "@/pages/Auth/Signup/InicisSuccess";

import SocialConsent from "@/pages/Auth/Consent/SocialConsent";
import Recovery from "@/pages/Auth/Recovery/Recovery";
import NotFound from "@/pages/NotFound";
import MyPageLayout from "@/pages/Mypage/MyPageLayout";


// 잡콕_기업
import CompanyLogin from "@/pages/Company/login/CompanyLogin";
import CompanySignup from "@/pages/Company/signup/CompanySignup";
import CompanyDashboard from "@/pages/Company/dashboard/CompanyDashboard";
import Guide from "@/pages/Company/dashboard/Guide/Guide";
import AIMatching from "@/pages/Company/dashboard/AIMatching/AIMatching";
import MatchHistory from "@/pages/Company/dashboard/MatchHistory/MatchHistory";
import Statistics from "@/pages/Company/dashboard/Statistics/Statistics";
import Pricing from "@/pages/Company/dashboard/Pricing/Pricing";
import AIReport from "@/pages/Company/dashboard/AIMatching/report/AIReport";
import Terms from "@/pages/Docs/Terms";
import PrivacyPolicy from "@/pages/Docs/PrivacyPolicy";
import PrivacyConsent from "@/pages/Docs/PrivacyConsent";
import MarketingConsent from "@/pages/Docs/MarketingConsent";
import PaidServiceTerms from "@/pages/Docs/PaidServiceTerms";



export const router = createBrowserRouter([

  // 모바일화면

  { path: "/resumes/m-create", element: <Layout screen="ResumeCreation" showFooter="desktop-only" showBottomNav={false}><M_ResumeCreate/></Layout> },

  {path: "/mypage/m-edit-profile", element:<Layout screen="EditProfile" showFooter="desktop-only" showBottomNav={false}> <EditProfile/></Layout> },
  {path: "/mypage/m-plan/history", element:<Layout screen="PlanHistory" showFooter="desktop-only" showBottomNav={false}> <PlanHistory/></Layout> },
  {path: "/mypage/m-support/faq", element:<Layout screen="Faq" showFooter="desktop-only" showBottomNav={false}> <Faq/></Layout> },
  {path: "/mypage/m-support/inquiry", element:<Layout screen="Inquiry" showFooter="desktop-only" showBottomNav={false}> <Inquiry/></Layout> },
  {path: "/mypage/m-support/inquiry/:id",element:<Layout screen="InquiryDetail" showFooter="desktop-only" showBottomNav={false}> <InquiryDetail/></Layout> },
  {path: "/mypage/m-support/inquiry/create", element:<Layout screen="InquiryCreate" showFooter="desktop-only" showBottomNav={false}> <InquiryCreate/></Layout> },
  {path: "/mypage/m-support/inquiry/edit/:id", element:<Layout screen="InquiryEdit" showFooter="desktop-only" showBottomNav={false}> <InquiryEdit/></Layout> },
  
  {path: "/mypage/m-support/notices", element:<Layout screen="NoticeList" showFooter="desktop-only" showBottomNav={false}> <NoticeList/></Layout> },
  {path: "/mypage/m-support/notices/:id", element:<Layout screen="NoticeList" showFooter="desktop-only" showBottomNav={false}> <NoticeDetail/></Layout> },
  {path: "/mypage/m-support/report-job", element:<Layout screen="ReportJob" showFooter="desktop-only" showBottomNav={false}> <ReportJob/></Layout> },
  {path: "/mock-interview/m-settings", element:<Layout screen="MockSetting" showFooter="desktop-only" showBottomNav={false}> <M_MockSettings/></Layout> },
  {path: "/mock-interview/m-environment-test", element:<Layout screen="EnvironmentTestView" showFooter="desktop-only" showBottomNav={false}> <M_EnvironmentTestView/> </Layout> },
  { path: "/mock-interview/m-mock-interview-live",element:<Layout screen="MockInterviewLive" showFooter="desktop-only" showBottomNav={false}> <M_MockInterviewLive/> </Layout> },



  { path: "/", element: <Layout><Home/></Layout>, errorElement: <Layout><Home /></Layout>},
  {path:"/linkview",element:<Layout><Linkview/></Layout>},
 
  { path: "/jobs", element: <Layout ><JobsList /></Layout>,
    children:[
      {index:true,element:<>전체공고내용</>},
      {path:"all",element:<>전체공고내용2ß</>},
      {path:"bookmarks",element:<>북마크공고</>},
    ]

   },
  { path: "/resumes", element: <Layout screen="Resumes"><ResumeList/></Layout> },
  { path: "/resumes/create", element: <Layout screen="ResumeCreation"><ResumeCreate /></Layout> },
  { path: "/resumes/:resumeId", element: <Layout screen="ResumeDetail" showFooter="desktop-only" showBottomNav={false} ><ResumeDetail /></Layout> },
  { path: "/resumes/:resumeId/edit", element: <Layout screen="ResumeEdit"  showFooter="desktop-only" showBottomNav={false} ><ResumeEdit /></Layout> },

  { path: "/mock-interview-report", element: <Layout screen="MockInterviewReport"><InterviewReport /></Layout> },
  { path: "/mock-interview/analysis/:interviewId", element: <Layout screen="MockAnalysisPage" showFooter="desktop-only" showBottomNav={false} ><MockAnalysisPage /></Layout> } ,
 
  { path: "jobs/:jobId", element: <Layout screen="JobPostingDetail"
    showFooter="desktop-only" showBottomNav={false} ><JobDetail/></Layout>  } ,
  { 
    path: "/login", 
    element: <Layout showHeader="desktop-only" showFooter="desktop-only" showBottomNav={false}><Login /></Layout> 
  },
  { 
    path: "/auth/oauth/kakao/callback", 
    element: <Layout showHeader="desktop-only" showFooter="desktop-only" showBottomNav={false}><Login /></Layout> 
  },
  
  { 
    path: "/auth/oauth/naver/callback", 
    element: <Layout showHeader="desktop-only" showFooter="desktop-only" showBottomNav={false}><Login /></Layout> 
  },

  { 
    path: "/auth/oauth/google/callback", 
    element: <Layout showHeader="desktop-only" showFooter="desktop-only" showBottomNav={false}><Login /></Layout> 
  },

  { path: "/signup", element:<Layout showFooter="desktop-only" showBottomNav={false}> <Signup/></Layout> },
  {
    path: "/inicis/callback",  //  프론트 경로로 변경!
    element: <InicisSuccess />,
  },

  { path: "/social-consent", element:<Layout showFooter="desktop-only" showBottomNav={false}> <SocialConsent/></Layout> },
  { path: "/recovery", element: <Layout showFooter="desktop-only" showBottomNav={false}><Recovery/></Layout> },
  { path: "/recent-jobs", element: <Layout showFooter="desktop-only" showBottomNav={false}><RecentJobsList/></Layout> },
  
  { path: "/mypage", 
    element: <Layout screen="Mypage" ><MyPageLayout/></Layout>,
      children:[
        {index:true,element:<Mypage/>},
        {path:"edit-profile",element:<EditProfile/>},
        {path:"plan/history",element:<PlanHistory/>},
        {path:"support/faq",element:<Faq/>},
        {path:"support/inquiry",element:<Inquiry/>},
        {path:"support/inquiry/:id",element:<InquiryDetail/>},
        {path:"support/inquiry/create",element:<InquiryCreate/>},
        {path:"support/inquiry/edit/:id", element: <InquiryEdit/> },
        {path:"support/notices", element: <NoticeList/>},
        {path:"support/notices/:id", element: <NoticeDetail/>},
        {path:"support/report-job", element: <ReportJob/>},
        
      ]
   },

   {path: "/purchase", element:<Layout screen="Purchase" showFooter="desktop-only" showBottomNav={false}><PurchaseLayout /></Layout> },
   {path: "/purchase/result/success",element: <Layout showHeader="desktop-only" showFooter="desktop-only" showBottomNav={false}><PurchaseSuccess  /></Layout>,},
   {path: "/purchase/result/fail",element: <Layout showHeader="desktop-only" showFooter="desktop-only" showBottomNav={false}><PurchaseFail /></Layout>,},
   {path:"/saved-jobs",element:<Layout showFooter='desktop-only' showBottomNav={false} ><SavedPostings/></Layout>},
  
  { path: "/mock-interview/guide", element:<MockInterviewGuide/> },
  { path: "/mock-interview/instructions", element:<MockInstructions/> },
  { path: "/mock-interview/settings", element:<MockSettings/> },
  { path: "/mock-interview/environment-test", element: <EnvironmentTestView/> },
  { path: "/mock-interview/mock-interview-live", element: <MockInterviewLive/> },


  { path: "/company/login", element: <CompanyLogin/> },
  { path: "/company/signup", element: <CompanySignup/> },
  
  { path: "/terms", element: <Terms/> },
  { path: "/privacy-policy", element: <PrivacyPolicy/> },
  { path: "/privacy-consent", element: <PrivacyConsent/> },
  { path: "/marketing-consent", element: <MarketingConsent/> },
  { path: "/paid-service-terms", element: <PaidServiceTerms/> },


  { 
    path: "/company", 
    element: <CompanyDashboard />, // 레이아웃
    children: [
      { 
        index: true, 
        element: <Guide /> 
      },
      { 
        path: "guide", 
        element: <Guide /> 
      },
      { 
        path: "ai-matching", 
        element: <AIMatching /> 
      },
      { 
        path: "history", 
        element: <MatchHistory /> 
      },
      { 
        path: "statistics", 
        element: <Statistics /> 
      },
      { 
        path: "pricing", 
        element: <Pricing /> 
      },
      {
        path: "ai-matching/report/:id",
        element: <AIReport />
      }
    ] 
  },

]);
