import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";       // ← 실제 위치에 맞게
import Home from "@/pages/Home/Home";
import JobsList from "@/pages/Jobs/JobsList";
import JobDetail from "@/pages/Jobs/JobDetail";
import CompaniesList from "@/pages/Companies/CompaniesList";
import CompanyDetail from "@/pages/Companies/CompanyDetail";

import Mypage from "@/pages/Mypage/Mypage";
import EditProfile from "@/pages/Mypage/EditProfile/EditProfile";
import PlanHistory from "@/pages/Mypage/Plan/PlanHistory";
import Faq from "@/pages/Mypage/Support/Faq";
import Inquiry from "@/pages/Mypage/Support/Inquiry";

import PurchaseLayout from "@/pages/Purchase/PurchaseLayout";
import PurchaseSuccess from "@/pages/PurchaseResult/PurchaseSuccess";
import PurchaseFail from "@/pages/PurchaseResult/PurchaseFail";


import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import NotFound from "@/pages/NotFound";
import MyPageLayout from "@/pages/Mypage/MyPageLayout";

export const router = createBrowserRouter([
  { path: "/", element: <Layout><Home /></Layout>, errorElement: <Layout><NotFound /></Layout> },
  { path: "/jobs", element: <Layout><JobsList /></Layout>,
    children:[
      {index:true,element:<>전체공고내용</>},
      {path:"all",element:<>전체공고내용2ß</>},
      {path:"bookmarks",element:<>북마크공고</>}
    ]

   },
  { path: "/jobs/:jobId", element: <Layout><JobDetail /></Layout> },
  { path: "/companies", element: <Layout><CompaniesList /></Layout> },
  { path: "/companies/:companyId", element: <Layout><CompanyDetail /></Layout> },
  { path: "/login", element: <Layout><Login /></Layout> },
  { path: "/signup", element: <Layout><Signup /></Layout> },
  { path: "/mypage", 
    element: <Layout><MyPageLayout/></Layout>,
      children:[
        {index:true,element:<Mypage/>},
        {path:"edit-profile",element:<EditProfile/>},
        {path:"plan/history",element:<PlanHistory/>},
        {path:"support/faq",element:<Faq/>},
        {path:"support/inquiry",element:<Inquiry/>},
        
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
