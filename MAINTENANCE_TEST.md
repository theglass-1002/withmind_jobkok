# 점검모드 테스트 가이드

## 브라우저 테스트 방법

### 1. 개발 서버 접속
```
http://localhost:5173/
```

### 2. 브라우저 콘솔 열기
- Chrome/Edge: F12 또는 Cmd+Option+I (Mac)
- 콘솔 탭 선택

### 3. 테스트 함수 확인
콘솔에 다음과 같은 메시지가 표시됩니다:
```
🧪 점검모드 테스트 준비 완료
사용법: window.testMaintenanceAPI()
```

### 4. 테스트 명령어

#### 4.1. 도움말 보기
```javascript
window.testMaintenanceAPI()
```

#### 4.2. 점검 상태 조회 (실제 API 호출)
```javascript
window.testGetMaintenanceStatus()
```
- 실제 서버의 점검모드 상태를 조회합니다
- 콘솔에 응답값이 표시됩니다

#### 4.3. 503 이벤트 강제 발생 (Mock 테스트)
```javascript
window.testTrigger503()
```
- 503 에러 발생 시 점검 화면 전환을 시뮬레이션
- 즉시 `/maintenance` 화면으로 전환됩니다
- 현재 URL이 자동으로 저장됩니다

## 검증 체크리스트

### ✅ 기본 동작
- [ ] 사이트 접속 시 자동으로 점검 상태 조회
- [ ] 콘솔에 `[MaintenanceGuard] CHECK_START` 로그 확인
- [ ] 콘솔에 `[MaintenanceGuard] CHECK_RESULT` 로그 확인
- [ ] enabled=false일 때 정상 사이트 표시

### ✅ 점검 화면 전환
- [ ] `window.testTrigger503()` 실행
- [ ] URL이 `/maintenance`로 변경됨
- [ ] 흰색 배경의 점검 화면만 표시
- [ ] 파란색 원형 아이콘 표시
- [ ] "서비스 점검중입니다" 타이틀 (파란색 + 회색)
- [ ] 점검 안내 메시지 표시
- [ ] 확인/취소/닫기 버튼 없음
- [ ] Header/Footer/Navigation 없음

### ✅ URL 차단
점검 화면 상태에서:
- [ ] 브라우저 뒤로가기 → `/maintenance` 유지
- [ ] 브라우저 앞으로가기 → `/maintenance` 유지
- [ ] 주소창에 `/jobs` 입력 후 Enter → `/maintenance` 유지
- [ ] F5 새로고침 → `/maintenance` 유지

### ✅ 자동 복귀
1. 점검 전 URL: `/jobs/123?test=1#section`
2. `window.testTrigger503()` 실행
3. 점검 화면으로 전환됨
4. Network 탭에서 `/dev/maintenance/status` 요청 찾기
5. 우클릭 → Copy → Copy as fetch
6. 콘솔에서 다음과 같이 수정하여 실행:
```javascript
// enabled를 false로 mock
fetch("https://api.jobkok.kr/dev/maintenance/status", {
  method: "GET",
  headers: { "accept": "application/json" }
}).then(r => r.json()).then(data => {
  // 실제로는 서버 응답이지만, 여기서는 로그만 확인
  console.log('실제 응답:', data);
});
```
- [ ] 30초 이내에 polling이 실행되어 원래 URL로 복귀

### ✅ Polling
- [ ] 최초 접속 시 즉시 조회
- [ ] 30초마다 자동 조회 (콘솔 로그 확인)
- [ ] 탭 전환 후 돌아오면 즉시 재조회
- [ ] 윈도우 포커스 복귀 시 재조회

### ✅ 반응형
- [ ] 데스크톱 (1920px): 중앙 정렬, 적절한 여백
- [ ] 태블릿 (768px): 레이아웃 유지
- [ ] 모바일 (375px): 아이콘/텍스트 크기 조정

### ✅ 오류 처리
Network 탭에서 Offline 모드 활성화:
- [ ] 최초 조회 실패 → 정상 사이트 표시 (fail-open)
- [ ] 점검 중 조회 실패 → 점검 화면 유지

## Mock 서버 응답 테스트

Chrome DevTools의 Network 탭에서 응답을 override할 수 있습니다:

1. Network 탭 열기
2. `/dev/maintenance/status` 요청 우클릭
3. "Override content" 선택
4. JSON 수정:

**점검모드 ON:**
```json
{
  "enabled": true,
  "message": "시스템 점검 중입니다. 2026-08-04 14:00에 재개됩니다."
}
```

**점검모드 OFF:**
```json
{
  "enabled": false
}
```

## 실제 운영 주의사항

⚠️ **절대 실행하지 마세요:**
```javascript
// 실제 운영 점검모드를 변경합니다!
window.testUpdateMaintenanceConfig({ enabled: true })
```

실제 점검모드 설정 변경은 관리자 화면에서만 수행해야 합니다.
