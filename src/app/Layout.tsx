// Layout.tsx
import React, { useEffect, useState } from 'react';

import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import BottomNav from '@/shared/components/bottomNav/BottomNav';

import PageHeader from '@/shared/components/custom-header/PageHeader'; 
import ActionHeader from '@/shared/components/custom-header/ActionHeader';

import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; 
import { SlideDown } from '@/shared/lib/toastConfig';

import 'react-toastify/dist/ReactToastify.css';
import '@/shared/styles/toast.css';
import "./Layout.css";


import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_search_gray900_24 from "@/assets/icons/size24/ic_search_gray900_24.png";
import ic_bookmark_gray900_24 from "@/assets/icons/size24/ic_bookmark_gray900_24.png";
import ic_home_gray900_20 from "@/assets/icons/size20/ic_home_gray900_20.png";







interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean | 'mobile-only' | 'desktop-only';
  showFooter?: boolean | 'mobile-only' | 'desktop-only';
  showBottomNav?: boolean;
  customHeader?: React.ReactNode;
}

export default function Layout({ 
  children,
  showHeader = true,
  showFooter = true,
  showBottomNav = true,
  customHeader
}: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);
 
 
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 750);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shouldShowHeader = () => {
    if (showHeader === true) return true;
    if (showHeader === false) return false;
    if (showHeader === 'mobile-only') return isMobile;
    if (showHeader === 'desktop-only') return !isMobile;
    return true;
  };

  const shouldShowFooter = () => {
    if (showFooter === true) return true;
    if (showFooter === false) return false;
    if (showFooter === 'mobile-only') return isMobile;
    if (showFooter === 'desktop-only') return !isMobile;
    return true;
  };

  const getMobileHeader = () => {
    const path = location.pathname;
    console.log(path);
    if (path === '/signup') {
      return (
        <PageHeader 
          title="회원가입" 
          leftElement={<img src={ic_close_gray900_24} alt="닫기" />}
          onLeftElementClick={() => navigate('/login')}
        />
      );
    }else if(path === '/recovery'){
        return(
          <PageHeader 
          title="아이디/비밀번호 찾기" 
          leftElement={<img src={ic_close_gray900_24} alt="닫기" />}
          onLeftElementClick={() => navigate('/login')}
        />
        );
    }else if(path === '/jobs'){
      return(
        <Navbar 
        titleText='채용 공고'
      />
      );
  }
    
    return null;
  }


  const getHeader = () => {

    if (customHeader) return customHeader;
    
    console.log(isMobile);
    if (isMobile) {
      const mobileHeader = getMobileHeader();
      if (mobileHeader) return mobileHeader;
    }
    
    // 기본 Navbar
    return <Navbar />;
  };

  const shouldShowBottomNav = showBottomNav && isMobile;

  return (
     <div>
        {shouldShowHeader() && getHeader()}
        
        <main>{children}</main>
        
        {shouldShowFooter() && <Footer />}
        {shouldShowBottomNav && <BottomNav />}
        
        <ToastContainer
          className="app-toast"
          position="top-center"
          transition={SlideDown}
          autoClose={20}
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