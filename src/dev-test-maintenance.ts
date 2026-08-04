// 개발 환경에서만 사용하는 점검모드 테스트 함수
import { getMaintenanceStatus, updateMaintenanceConfig } from '@/api/maintenance';
import type { UpdateMaintenanceConfigRequest } from '@/api/maintenance';

// window 객체에 테스트 함수 노출
declare global {
  interface Window {
    testMaintenanceAPI: () => void;
    testGetMaintenanceStatus: () => Promise<void>;
    testUpdateMaintenanceConfig: (config: UpdateMaintenanceConfigRequest) => Promise<void>;
    testMockMaintenance: (enabled: boolean, message?: string) => void;
    testTrigger503: () => void;
  }
}

// 원본 API 함수 저장
const originalGetStatus = getMaintenanceStatus;

let mockEnabled = false;
let mockMessage = '';

// Mock 활성화/비활성화
window.testMockMaintenance = (enabled: boolean, message?: string) => {
  mockEnabled = enabled;
  mockMessage = message || '현재 서비스 점검 중입니다. 잠시 후 다시 이용해 주세요.';

  console.log('========================================');
  console.log(`🎭 Mock 점검모드: ${enabled ? 'ON' : 'OFF'}`);
  if (enabled) {
    console.log(`📝 Mock 메시지: ${mockMessage}`);
    console.log('⏳ 5초 후 자동으로 상태가 반영됩니다.');
  }
  console.log('========================================');

  // 5초 후 MaintenanceGuard의 polling이 자동으로 감지하도록
  // 실제 구현에서는 getMaintenanceStatus를 mock해야 함
  // 지금은 안내만 출력
  console.log('💡 실제 테스트를 위해서는 Network 탭에서 /dev/maintenance/status 응답을 mock하거나,');
  console.log('   백엔드 개발 환경에서 점검모드를 직접 변경하세요.');
};

// 503 이벤트 강제 발생
window.testTrigger503 = () => {
  console.log('========================================');
  console.log('🚨 503 점검모드 이벤트 발생');
  console.log('========================================');

  window.dispatchEvent(new CustomEvent('jobkok:maintenance-detected', {
    detail: { message: '503 에러로 인한 점검 화면 전환 테스트' }
  }));
};

window.testGetMaintenanceStatus = async () => {
  try {
    console.log('🔍 점검모드 상태 조회 시작...');
    const result = await getMaintenanceStatus(false);
    console.log('✅ 점검모드 상태 조회 성공:', result);
  } catch (error) {
    console.error('❌ 점검모드 상태 조회 실패:', error);
  }
};

window.testUpdateMaintenanceConfig = async (config: UpdateMaintenanceConfigRequest) => {
  try {
    console.log('🔧 점검모드 설정 변경 시작...', config);
    const result = await updateMaintenanceConfig(config);
    console.log('✅ 점검모드 설정 변경 성공:', result);
    console.log('⚠️ 주의: 실제 운영 환경에서는 이 함수를 호출하지 마세요!');
  } catch (error) {
    console.error('❌ 점검모드 설정 변경 실패:', error);
  }
};

window.testMaintenanceAPI = () => {
  console.log('========================================');
  console.log('🧪 점검모드 API 테스트 함수 사용 가능');
  console.log('========================================');
  console.log('1. 상태 조회:');
  console.log('   window.testGetMaintenanceStatus()');
  console.log('');
  console.log('2. 설정 변경 (주의: 실제 API 호출):');
  console.log('   window.testUpdateMaintenanceConfig({ enabled: false })');
  console.log('');
  console.log('3. Mock 점검모드 ON (화면 전환 테스트):');
  console.log('   window.testMockMaintenance(true, "테스트 점검 메시지")');
  console.log('');
  console.log('4. Mock 점검모드 OFF (정상 복귀 테스트):');
  console.log('   window.testMockMaintenance(false)');
  console.log('');
  console.log('5. 503 이벤트 강제 발생:');
  console.log('   window.testTrigger503()');
  console.log('========================================');
};

// 페이지 로드 시 안내 메시지
console.log('========================================');
console.log('🧪 점검모드 테스트 준비 완료');
console.log('========================================');
console.log('사용법: window.testMaintenanceAPI()');
console.log('========================================');
