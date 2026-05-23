import { useCallback, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./Recovery.css";
import FindId from "./FindId";
import ResetPwd from "./ResetPwd";
import UiFilter, { type UiFilterOption } from "@/shared/components/ui-filter/UiFilter";


export default function Recovery() {
  type TabKey = 'id' | 'password';
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<TabKey>('id');
  const recoveryOptions: UiFilterOption[] = [
    { label: '아이디 찾기', value: 'id' },
    { label: '비밀번호 찾기', value: 'password' },
  ];

  // URL 쿼리 파라미터로 초기 탭 설정
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'password') {
      setTab('password');
    } else if (tabParam === 'id') {
      setTab('id');
    }
  }, [searchParams]);

  const onChangeFilter = useCallback((value: string) => {
    setTab(value as TabKey);
  }, []);

  return (
    <div className="recovery-page">
    <UiFilter
        options={recoveryOptions}
        value={tab}
        onChange={onChangeFilter}
        className="recovery-tabs"
      />
        {tab==='id'?<FindId/>:<ResetPwd/>}
    </div>
  );
}