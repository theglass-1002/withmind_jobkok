import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; 
import { SlideDown } from '@/shared/lib/toastConfig';
import 'react-toastify/dist/ReactToastify.css';
import '@/shared/styles/toast.css'; // 방금 만든 CSS
import "./Layout.css";

export default function Layout({ children }: { children: React.ReactNode }) {
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
