import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "../pages/Home/Home";
import JobsList from "../pages/Jobs/JobsList";
import JobDetail from "../pages/Jobs/JobDetail";
import CompaniesList from "../pages/Companies/CompaniesList";
import CompanyDetail from "../pages/Companies/CompanyDetail";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  { path: "/", element: <Layout><Home /></Layout>, errorElement: <Layout><NotFound /></Layout> },
  { path: "/jobs", element: <Layout><JobsList /></Layout>,
    children:[
      {index:true,element:<>전체공고내용</>},
      {path:"all",element:<>전체공고내용</>},
      {path:"bookmarks",element:<>북마크공고</>}
    ]

   },
  { path: "/jobs/:jobId", element: <Layout><JobDetail /></Layout> },
  { path: "/companies", element: <Layout><CompaniesList /></Layout> },
  { path: "/companies/:companyId", element: <Layout><CompanyDetail /></Layout> },
  { path: "/login", element: <Layout><Login /></Layout> },
  { path: "/signup", element: <Layout><Signup /></Layout> },
]);
