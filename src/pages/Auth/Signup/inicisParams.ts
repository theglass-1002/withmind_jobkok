import { API_BASE_URL, LOCAL_BASE_URL } from "@/config/config";

  // 이니시스 파라미터 (실제 값은 백엔드에서 받아서 채워야 함)
 export const inicisParams = {
  mid: "INIiasTest",        // 테스트 MID
  reqSvcCd: "01",
  mTxId: "test_20230327",   // 테스트용 임의 값
  authHash: "...",          // (이건 백엔드에서 계산해주는 게 맞음)
  flgFixedUser: "Y",
  userName: "홍길동",
  userPhone: "01012345678",
  userBirth: "19901101",
  userHash: "...",          // 이것도 sha256 계산 결과
  reservedMsg: "isUseToken=Y",
  directAgency: "",
  successUrl: `${API_BASE_URL}/inicisSuccess`,
  failUrl: `${API_BASE_URL}/inicisSuccess`,
  };