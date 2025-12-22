// Layout.tsx
import React, { useEffect, useState } from 'react';
import { LayoutContext } from './LayoutContext';
import {useParams, useSearchParams } from 'react-router-dom';
import {SortOption,LayoutProps, scrollToTop} from '@/shared/utils/util';
import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import BottomNav from '@/shared/components/bottomNav/BottomNav';
import MockPageHeader from '@/shared/components/custom-header/MockPageHeader';
import PageHeader from '@/shared/components/custom-header/PageHeader'; 
import ActionHeader from '@/shared/components/custom-header/ActionHeader';

import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; 
import { SlideDown } from '@/shared/lib/toastConfig';

import 'react-toastify/dist/ReactToastify.css';
import '@/shared/styles/toast.css';
import "./Layout.css";


import ic_close_gray900_24 from "@/assets/icons/size24/ic_close_gray900_24.png";
import ic_arrow_back_ios_gray900_20 from "@/assets/icons/size20/ic_arrow_back_ios_gray900_20.png";
import ic_home_gray900_20 from "@/assets/icons/size20/ic_home_gray900_20.png";
import ic_download_gray900_20 from "@/assets/icons/size20/ic_download_gray900_20.png";
import ic_search_gray900_24 from "@/assets/icons/size24/ic_search_gray900_24.png";
import ic_bookmark_gray900_24 from "@/assets/icons/size24/ic_bookmark_gray900_24.png";

import ic_close_white_24 from "@/assets/icons/size24/ic_close_white_24.png";
import ic_more_horiz_white_24 from "@/assets/icons/size24/ic_more_horiz_white_24.png";
import ic_logout_red_18 from "@/assets/icons/size18/ic_logout_red_18.png";


export default function Layout({ 
  children,
  showHeader = true,
  showFooter = true,
  showBottomNav = true,
  screen = '',
  customHeader,
  onScreenAction
  
}: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);
  const [searchParams] = useSearchParams();
  const [ActionsValue, setActionsValue] = useState(''); 
  
  const sortMockOptions: SortOption[] = [
    { label: "면접 진행 현황", value: "view_status" },
    { label: "나가기", value: "exit", emoji: <img src={ic_logout_red_18} alt="닫기" />, className: "logout_icon-container" },
  ];
  const handleSendActions = (newValue: string) => {
    setActionsValue(newValue);
  };

  const resetAction = () => {
    setActionsValue('');
  };
  
  useEffect(() => {
    scrollToTop();  // ← 여기!
    console.log('스크롤위로');
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
        />);
        }else if(path === '/jobs'){
              return(
                <Navbar 
                titleText='채용 공고'
        />);
      }else if(path ==='/saved-jobs'){
        return(
          <PageHeader 
          title="저장한 공고" 
          leftElement={<img src={ic_arrow_back_ios_gray900_20} alt="닫기" />}
          onLeftElementClick={() => navigate('/mypage')}
          rightIcons={<img src={ic_home_gray900_20}/>}
          onRightElementClick={()=> navigate('/')}
        />);
      }else if(screen ==='JobPostingDetail'){
        const jobTitle = searchParams.get('title');
        console.log(jobTitle);
        return(
          <PageHeader 
          title={jobTitle} 
          leftElement={<img src={ic_arrow_back_ios_gray900_20} alt="닫기" />}
          onLeftElementClick={() => navigate('/jobs')}
          rightIcons={<img src={ic_home_gray900_20}/>}
          onRightElementClick={() => navigate('/')}
          // rightIcons={<img src={ic_download_gray900_20}/>}
          // onRightElementClick={()=> {
          //   console.log('pdf 저장버튼 ');
          // }}
        />);
      }else if(screen ==='Resumes'){
        return(
          <Navbar 
          titleText='이력서'
       />);
      }else if(screen==='ResumeCreation'){
        return(
          <PageHeader 
          title={'이력서 상세'} 
          leftElement={<img src={ic_arrow_back_ios_gray900_20} alt="닫기" />}
          onLeftElementClick={() => navigate('/resumes')}
          rightIcons={<img src={ic_download_gray900_20}/>}
          onRightElementClick={()=>{console.log('다운로드')}}
        />);
      }else if(screen==='ResumeDetail'){
        return(
          <PageHeader 
          title={'이력서 상세'} 
          leftElement={<img src={ic_arrow_back_ios_gray900_20} alt="닫기" />}
          onLeftElementClick={() => navigate('/resumes')}
          rightIcons={<img src={ic_download_gray900_20}/>}
          onRightElementClick={()=>{console.log('다운로드')}}
        />);
      } else if(screen==='MockInterviewReport'){
        return(
          <Navbar 
          titleText='모의면접'
       />);
      }else if(screen ==='MockAnalysisPage'){
        return(
          <PageHeader 
          title={'분석 결과'} 
          leftElement={<img src={ic_arrow_back_ios_gray900_20} alt="닫기" />}
          onLeftElementClick={() => navigate('/mock-interview-report')}
          rightIcons={<img src={ic_home_gray900_20}/>}
          onRightElementClick={()=> navigate('/')}
        />);
      }else if(screen ==='Mypage'){
        return(
          <Navbar 
          titleText='마이페이지'
       />);
      }else if(screen ==='EditProfile'){
        return(
          <PageHeader 
          title={'회원 정보 수정'} 
          leftElement={<img src={ic_arrow_back_ios_gray900_20} alt="닫기" />}
          onLeftElementClick={() => navigate('/mypage')}
          rightIcons={<img src={ic_home_gray900_20}/>}
          onRightElementClick={()=> navigate('/')}
        />);
      }else if(screen ==='PlanHistory'){
        return(
          <PageHeader 
          title={'이용권 내역'} 
          leftElement={<img src={ic_arrow_back_ios_gray900_20} alt="닫기" />}
          onLeftElementClick={() => navigate('/mypage')}
          rightIcons={<img src={ic_home_gray900_20}/>}
          onRightElementClick={()=> navigate('/')}
        />);
      }else if(screen ==='Purchase'){
        return(
          <PageHeader 
          title={'이용권 내역'} 
          leftElement={<img src={ic_arrow_back_ios_gray900_20} alt="닫기" />}
          onLeftElementClick={() => navigate('/mypage')}
          rightIcons={<img src={ic_home_gray900_20}/>}
          onRightElementClick={()=> navigate('/')}
        />);
      }else if(screen ==='Faq'){
        return(
          <PageHeader 
          title={'자주 묻는 질문'} 
          leftElement={<img src={ic_arrow_back_ios_gray900_20} alt="닫기" />}
          onLeftElementClick={() => navigate('/mypage')}
          rightIcons={<img src={ic_home_gray900_20}/>}
          onRightElementClick={()=> navigate('/')}
        />);
      }else if(screen ==='Inquiry'){
        return(
          <PageHeader 
          title={'1:1 문의'} 
          leftElement={<img src={ic_arrow_back_ios_gray900_20} alt="닫기" />}
          onLeftElementClick={() => navigate('/mypage')}
          rightIcons={<img src={ic_home_gray900_20}/>}
          onRightElementClick={()=> navigate('/')}
        />);
      }else if(screen ==='InquiryDetail'){
        return(
          <PageHeader 
          title={'1:1 문의'} 
          leftElement={<img src={ic_arrow_back_ios_gray900_20} alt="닫기" />}
          onLeftElementClick={() => navigate('/mypage/m-support/inquiry')}
        />);
      }else if(screen ==='InquiryCreate'){
        return(
          <PageHeader 
          title={'1:1 문의하기'} 
          leftElement={<img src={ic_arrow_back_ios_gray900_20} alt="닫기" />}
          onLeftElementClick={() => navigate('/mypage/m-support/inquiry')}
        />);
      }else if(screen ==='NoticeList'){
        return(
          <PageHeader 
          title={'공지사항'} 
          leftElement={<img src={ic_arrow_back_ios_gray900_20} alt="닫기" />}
          onLeftElementClick={() => navigate('/mypage')}
          rightIcons={<img src={ic_home_gray900_20}/>}
          onRightElementClick={()=> navigate('/')}
        />);
      }else if(screen ==='ReportJob'){
        return(
          <PageHeader 
          title={'공고 제보하기'} 
          leftElement={<img src={ic_arrow_back_ios_gray900_20} alt="닫기" />}
          onLeftElementClick={() => navigate('/mypage')}
          rightIcons={<img src={ic_home_gray900_20}/>}
          onRightElementClick={()=> navigate('/')}
        />);
      }else if(screen ==='MockSetting'){
        return(
          <MockPageHeader 
          title={'모의면접 설정'}
          leftElement={null}  
          rightIcons={<img src={ic_more_horiz_white_24}/>}
          sort={true}
          sortOptions={sortMockOptions}
          sortClassName={'mock-setting'}
          onSortChange={(handleSendActions)}
        />);
      }else if(screen ==='EnvironmentTestView'){
        return(
          <MockPageHeader 
          title={'환경 테스트'}
          leftElement={null}  
          rightIcons={<img src={ic_more_horiz_white_24}/>}
          sort={true}
          sortOptions={sortMockOptions}
          sortClassName={'mock-setting'}
          onSortChange={(handleSendActions)}
        />);
      }else if(screen ==='MockInterviewLive'){
        return(
          <MockPageHeader 
          title={'모의면접'}
          leftElement={null}  
          rightIcons={<img src={ic_more_horiz_white_24}/>}
          sort={true}
          sortOptions={sortMockOptions}
          sortClassName={'mock-setting'}
          onSortChange={(handleSendActions)}
        />);
      }   
    return null;
  }


  const getHeader = () => {

    if (customHeader) return customHeader;
    if (isMobile) {
      const mobileHeader = getMobileHeader();
      if (mobileHeader) return mobileHeader;
    }
    
    // 기본 Navbar
    return <Navbar />;
  };

  const shouldShowBottomNav = showBottomNav && isMobile;

  return (
    <LayoutContext.Provider value={{ 
      actionType:ActionsValue,
      resetAction: resetAction
      
    }}>
     <div>
        {shouldShowHeader() && getHeader()}
        
        <main>{children}</main>
        
        {shouldShowFooter() && <Footer />}
        {shouldShowBottomNav && <BottomNav />}
        
        <ToastContainer
          limit={2}
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
      </LayoutContext.Provider>
  );
}