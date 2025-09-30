import React,{useState}from 'react'
import { Link, NavLink } from "react-router-dom";
import "./ResumeCreate.css";

import BasicInfoSection from "./ResumeCreate/BasicInfoSection/BasicInfoSection";
import LocationSection from "./ResumeCreate/LocationSection/LocationSection";
import CareerSection from "./ResumeCreate/CareerSection/CareerSection";
import EducationSection from "./ResumeCreate/EducationSection/EducationSection";
import DesiredRoleSection from "./ResumeCreate/DesiredRoleSection/DesiredRoleSection";
import HardSkillSection from "./ResumeCreate/HardSkillSection/HardSkillSection";
import SoftSkillsSection from "./ResumeCreate/SoftSkillsSection/SoftSkillsSection";
import ActivitiesSection from "./ResumeCreate/ActivitiesSection/ActivitiesSection";




import ic_star_gray700_20 from '@/assets/icons/size20/ic_star_gray700_20.png';


type FormState = { basic: BasicInfo };
const initial: FormState = {
  basic: { name:'', birth:'', gender:null, email:'', phone:'', photoUrl:'' },
};


export default function ResumeCreate() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<{ basic: BasicErrors }>({ basic: {} });

    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<0|1|2>(0);
    const [resumeReco, setResumeReco] = useState(true); // 이력서 기반 추천 토글
    const [allChecked, setAllChecked] = useState(false);
    const [checkedRoles, setCheckedRoles] = useState<Set<string>>(new Set());
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const isOn = (key: string) => activeCategory === key;
  

    const updateBasic = (patch: Partial<BasicInfo>) =>
      setForm(prev => ({ ...prev, basic: { ...prev.basic, ...patch } }));
  
    const resetBasicErrors = () => setErrors(prev => ({ ...prev, basic: {} }));
  
    const validateBasic = (b: BasicInfo): BasicErrors => {
      const e: BasicErrors = {};
      if (!b.name.trim()) e.name = '이름을 입력해 주세요.';
      if (!b.birth.trim()) e.birth = '생년월일을 입력해 주세요.';
      if (!b.gender) e.gender = '성별을 선택해 주세요.';
      if (!b.email.trim()) e.email = '이메일을 입력해 주세요.';
      if (!b.phone.trim()) e.phone = '연락처를 입력해 주세요.';
      return e;
    };
  

    const onSubmit = () => {
      const be = validateBasic(form.basic);
      setErrors({ basic: be });
      if (Object.keys(be).length) return; // 에러 있으면 중단
    };

    const toggleCategory = (key: string) =>
      setActiveCategory(prev => (prev === key ? null : key));
    
  
  const onClickAll = () => {
    setAllChecked(prev => {
      const next = !prev;
      if (next) setCheckedRoles(new Set()); 
      return next;
    });
  };
  
  
  const onClickRole = (key: string) => {
    setAllChecked(false);
    setCheckedRoles(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };
  
  const handleReset = () => {
    setAllChecked(false);          
    setCheckedRoles(new Set());    
    setActiveCategory(null);
  };
    
    return (
      <div className="resume-create-page">
      <div className="resume-create-page__status">
        <span className="default_btn_white">임시저장</span>
        <span className="default_btn_black">작성 완료</span>
      </div>
    
      <div className="resume-create-page__container">
        <div className="resume-create-page__main">
        <div className="resume-create-page__section resume-create-page__section--title">
        <div className="resume-create-page__field">
            <span className="resume-create-page__label">이력서 제목을 입력해 주세요. *</span>
            <span className="resume-create-page__error">이력서 제목을 입력해 주세요.</span>
            </div>
            <div className="resume-create-page__assist">
            <span className="resume-create-page__assist-text">
              <img src={ic_star_gray700_20} alt="" />
                더 적합한 문장을 추천을 위해 아래 항목들을 먼저 채워주세요.</span>
                <span className="career-section__summary-ai-btn">
                AI 문장 추천</span>
            </div>
          </div>
          <BasicInfoSection
              values={form.basic}
              errors={errors.basic}
              onChange={updateBasic}
              onFocusAny={resetBasicErrors}
           />
            <LocationSection/>
            <CareerSection
               values={form.basic}
               errors={errors.basic}
               onChange={updateBasic}
               onFocusAny={resetBasicErrors}
            />
          <EducationSection
               values={form.basic}
               errors={errors.basic}
               onChange={updateBasic}
               onFocusAny={resetBasicErrors}
            />
          <DesiredRoleSection/>
          <HardSkillSection/>
          <SoftSkillsSection/>
          <ActivitiesSection/>
          <div>하드 스킬</div>
          <div>소프트스킬 칸</div>
          <div>활동경력 칸</div>
          <div>수상자격증 칸</div>
          <div>포트폴리오 기타문서 칸</div>
          <div>자기소개서 칸</div>
          <div>모의면접 분석 결과 칸</div>
        </div>
        <div className="resume-create-page__aside">왼쪽: 이력서 관리 사이드바</div>
      </div>
    </div>    
    );
}
