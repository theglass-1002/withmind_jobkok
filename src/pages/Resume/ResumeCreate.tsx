import React,{useState}from 'react'
import { Link, NavLink } from "react-router-dom";
import "./ResumeCreate.css";
import resume_banner1200x218 from '@/assets/icons/resume_banner1200x218.png';
import add_btn_white20x20 from '@/assets/icons/add_btn_white20x20.png';
import ic_more_dot_gray24x24 from '@/assets/icons/ic_more_dot_gray24x24.png';
import icon_career from '@/assets/icons/icon_career_gray700_20.png';
import icon_education from '@/assets/icons/icon_education_gray700_20.png';
import icon_role from '@/assets/icons/icon_role_gray700_20.png';
import icon_copy from '@/assets/icons/icon_content_copy_gray900_20.png';
import icon_download from '@/assets/icons/icon_download_gray900_20.png';
import icon_trash from '@/assets/icons/icon_trash_red_20.png';
import icon_btn_black from '@/assets/icons/ic_add_btn_gray900_20.png';

import arrow_left from '@/assets/icons/keyboard_arrow_left.png';
import arrow_right from '@/assets/icons/keyboard_arrow_right.png';
import Pagination from "@/shared/components/Pagination";


export default function ResumeCreate() {
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<0|1|2>(0);
    
    
    return (
      <div className="resume-create-page">
      <div className="resume-create-page__status">
        <span className="default_btn_white">임시저장</span>
        <span className="default_btn_black">작성 완료</span>
      </div>
    
      <div className="resume-create-page__container">
        <div className="resume-create-page__main">오른쪽:이력서 작성화면</div>
        <div className="resume-create-page__aside">왼쪽: 이력서 관리 사이드바</div>
      </div>
    </div>    
    );
}
