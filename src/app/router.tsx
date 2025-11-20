


import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";    

import Linkview from "@/pages/Linkview/Linkview";

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



import PurchaseLayout from "@/pages/Purchase/PurchaseLayout";
import PurchaseSuccess from "@/pages/PurchaseResult/PurchaseSuccess";
import PurchaseFail from "@/pages/PurchaseResult/PurchaseFail";


import Login from "@/pages/Auth/Login/Login";
import Signup from "@/pages/Auth/Signup/Signup";
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



export const router = createBrowserRouter([
  { path: "/", element: <Layout><Home/></Layout>, errorElement: <Layout><NotFound /></Layout>},
  {path:"/linkview",element:<Layout><Linkview/></Layout>},
 
  { path: "/jobs", element: <Layout ><JobsList /></Layout>,
    children:[
      {index:true,element:<>전체공고내용</>},
      {path:"all",element:<>전체공고내용2ß</>},
      {path:"bookmarks",element:<>북마크공고</>},
    ]

   },
  { path: "/resumes", element: <Layout><ResumeList/></Layout> },
  { path: "/resumes/create", element: <Layout><ResumeCreate /></Layout> },
  { path: "/resumes/:resumeId", element: <Layout><ResumeDetail /></Layout> },
  { path: "/resumes/:resumeId/edit", element: <Layout><ResumeEdit /></Layout> },

  { path: "/mock-interview-report", element: <Layout><InterviewReport /></Layout> },
  { path: "/mock-interview/analysis/:interviewId", element: <Layout><MockAnalysisPage /></Layout> } ,
 
  { path: "jobs/:jobId", element: <Layout 
    screen="JobPostingDetail"
    showFooter="desktop-only" showBottomNav={false} ><JobDetail/></Layout>  } ,
  { 
    path: "/login", 
    element: <Layout showHeader="desktop-only" showFooter="desktop-only" showBottomNav={false}><Login /></Layout> 
  },

  { path: "/signup", element:<Layout showFooter="desktop-only" showBottomNav={false}> <Signup/></Layout> },
  { path: "/recovery", element: <Layout showFooter="desktop-only" showBottomNav={false}><Recovery/></Layout> },
  { path: "/mypage", 
    element: <Layout><MyPageLayout/></Layout>,
      children:[
        {index:true,element:<Mypage/>},
        {path:"edit-profile",element:<EditProfile/>},
        {path:"plan/history",element:<PlanHistory/>},
        {path:"support/faq",element:<Faq/>},
        {path:"support/inquiry",element:<Inquiry/>},
        {path:"support/inquiry/:id",element:<InquiryDetail/>},
        {path:"support/inquiry/create",element:<InquiryCreate/>},
        {path:"support/inquiry/edit",element:<InquiryEdit/>},
        {path:"support/notices", element: <NoticeList/>},
        {path:"support/notices/:id", element: <NoticeDetail/>},
        {path:"support/report-job", element: <ReportJob/>},
        
      ]
   },
   {path:"/saved-jobs",element:<Layout showFooter='desktop-only' showBottomNav={false} ><SavedPostings/></Layout>},
   { path: "/purchase", element: <Layout><PurchaseLayout /></Layout> },
   {
    path: "/purchase/result/success",
    element: <Layout><PurchaseSuccess /></Layout>,
  },
  {
    path: "/purchase/result/fail",
    element: <Layout><PurchaseFail /></Layout>,
  },
  { path: "/mock-interview/guide", element:<MockInterviewGuide/> },
  { path: "/mock-interview/instructions", element:<MockInstructions/> },
  { path: "/mock-interview/settings", element:<MockSettings/> },
  { path: "/mock-interview/environment-test", element: <EnvironmentTestView/> },
  { path: "/mock-interview/mock-interview-live", element: <MockInterviewLive/> },

  { path: "/company/login", element: <CompanyLogin/> },
  { path: "/company/signup", element: <CompanySignup/> },
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
        path: "ai-matching/report", 
        element: <AIReport /> 
      }
    ] 
  },

]);
