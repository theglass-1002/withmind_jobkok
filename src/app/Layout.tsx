import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import { Outlet } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div >
      <Navbar />
      <main >{children}
      </main>
      <Footer/>
    </div>
  );
}
