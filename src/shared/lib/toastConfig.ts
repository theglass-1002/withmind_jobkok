// src/shared/lib/toastConfig.ts
import { cssTransition } from 'react-toastify';

export const SlideDown = cssTransition({
  enter: 'toast-slide-in',
  exit: 'toast-slide-out',
  // 옵션(선택): 아래는 높이 접기 애니메이션 관련
  collapse: true,
  collapseDuration: 200,
  // appendPosition: true, // 위치별로 클래스 추가하고 싶으면 켜기
});
