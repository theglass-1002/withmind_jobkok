import { useState } from "react";
import "./Recovery.css";
import FindId from "./FindId";
import ResetPwd from "./ResetPwd";


export default function Recovery() {
  type TabKey = 'id' | 'password';
  const [tab, setTab] = useState<TabKey>('id'); // ← 기본값 'id'



  return (
    <div className="recovery-page">
      <div className="default_tabs recovery-tabs">
        <span className={`tab ${tab==='id'?'on':''}`} onClick={()=>setTab('id')}>아이디 찾기</span>
        <span className={`tab ${tab==='password'?'on':''}`} onClick={()=>setTab('password')}>비밀번호 찾기</span>
      </div>
        {tab==='id'?<FindId/>:<ResetPwd/>}
    </div>
  );
}