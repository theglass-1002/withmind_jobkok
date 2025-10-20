import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";    
import Home from "@/pages/Home/Home";
import JobsList from "@/pages/Jobs/JobsList";
import JobDetail from "@/pages/Jobs/JobDetail";
import CompaniesList from "@/pages/Companies/CompaniesList";
import CompanyDetail from "@/pages/Companies/CompanyDetail";

import ResumeList from "@/pages/Resume/ResumeList";
import ResumeDetail from "@/pages/Resume/ResumeDetail/ResumeDetail";
import ResumeEdit from "@/pages/Resume/ResumeEdit/ResumeEdit";
import ResumeCreate from "@/pages/Resume/ResumeCreate";

import MockInterview from "@/pages/MockInterview/MockInterview"; //

import Mypage from "@/pages/Mypage/Mypage";
import EditProfile from "@/pages/Mypage/EditProfile/EditProfile";
import PlanHistory from "@/pages/Mypage/Plan/PlanHistory";
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

export const router = createBrowserRouter([
  { path: "/", element: <Layout><Home/></Layout>, errorElement: <Layout><NotFound /></Layout> },
  { path: "/jobs", element: <Layout><JobsList /></Layout>,
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

  { path: "/mock-interview", element: <Layout><MockInterview /></Layout> },


  { path: "jobs/:jobId", element: <Layout><JobDetail /></Layout>  } ,
  { path: "/companies", element: <Layout><CompaniesList /></Layout> },
  { path: "/companies/:companyId", element: <Layout><CompanyDetail /></Layout> },
  { path: "/login", element: <Layout><Login /></Layout> },
  { path: "/signup", element: <Layout><Signup /></Layout> },
  { path: "/recovery", element: <Layout><Recovery/></Layout> },
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
   { path: "/purchase", element: <Layout><PurchaseLayout /></Layout> },
   {
    path: "/purchase/result/success",
    element: <Layout><PurchaseSuccess /></Layout>,
  },
  {
    path: "/purchase/result/fail",
    element: <Layout><PurchaseFail /></Layout>,
  }
]);
