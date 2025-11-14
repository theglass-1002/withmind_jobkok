import React, { useEffect } from 'react'; // useEffect 임포트 추가
import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import { useLocation } from "react-router-dom"; // useLocation 임포트 추가
import { ToastContainer } from 'react-toastify'; 
import { SlideDown } from '@/shared/lib/toastConfig';
import 'react-toastify/dist/ReactToastify.css';
import '@/shared/styles/toast.css'; // 방금 만든 CSS
import "./Layout.css";



export default function Layout({ children }: { children: React.ReactNode }) {
  // 현재 라우트 경로 정보를 가져옵니다.
  const location = useLocation();

  // 라우트(pathname)가 변경될 때마다 스크롤을 맨 위로 부드럽게 이동시키는 로직 추가
  useEffect(() => {
    // pathname이 바뀔 때마다 실행되어 스크롤을 (0, 0)으로 부드럽게 이동시킵니다.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // 부드러운 스크롤 애니메이션 적용
    });
  }, [location.pathname]); // location 객체의 pathname에 의존

  return (
    <div >
      <Navbar />
      <main >{children}
      </main>
      <Footer/>
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
