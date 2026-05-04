import { useCallback, useState } from "react";
import "@/pages/Auth/Recovery/Recovery.css";
import CompanyFindId from "./CompanyFindId";
import CompanyResetPwd from "./CompanyResetPwd";
import UiFilter, { type UiFilterOption } from "@/shared/components/ui-filter/UiFilter";

export default function CompanyRecovery() {
  type TabKey = "id" | "password";
  const [tab, setTab] = useState<TabKey>("id");
  const recoveryOptions: UiFilterOption[] = [
    { label: "아이디 찾기", value: "id" },
    { label: "비밀번호 찾기", value: "password" },
  ];

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
      {tab === "id" ? <CompanyFindId /> : <CompanyResetPwd />}
    </div>
  );
}
