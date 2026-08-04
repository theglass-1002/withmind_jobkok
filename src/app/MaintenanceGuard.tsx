import { useEffect, useState, useRef } from "react";
import { getMaintenanceStatus } from "@/api/maintenance";
import MaintenancePage from "@/pages/Maintenance/MaintenancePage";

const RETURN_URL_KEY = "jobkok:maintenance:returnUrl";
const POLL_INTERVAL = 30000; // 30초
const IS_DEV = import.meta.env.DEV;

type MaintenanceState = "checking" | "normal" | "maintenance";

function log(message: string, ...args: any[]) {
  if (IS_DEV) {
    console.log(`[MaintenanceGuard] ${message}`, ...args);
  }
}

function saveReturnUrl() {
  const currentPath = window.location.pathname + window.location.search + window.location.hash;

  // /maintenance가 아니고, 이미 저장된 URL이 없을 때만 저장
  if (currentPath !== "/maintenance" && !sessionStorage.getItem(RETURN_URL_KEY)) {
    // same-origin 검증 (pathname만 저장하므로 항상 안전)
    sessionStorage.setItem(RETURN_URL_KEY, currentPath);
    log("SAVE_RETURN_URL", currentPath);
  }
}

function getReturnUrl(): string {
  const saved = sessionStorage.getItem(RETURN_URL_KEY);

  if (!saved) return "/";

  // 외부 URL 방지 - pathname은 항상 /로 시작
  if (!saved.startsWith("/")) return "/";

  // 프로토콜이나 도메인이 포함되어 있으면 무시
  if (saved.includes("://") || saved.startsWith("//")) return "/";

  return saved;
}

function clearReturnUrl() {
  sessionStorage.removeItem(RETURN_URL_KEY);
  log("CLEAR_RETURN_URL");
}

function replaceUrl(path: string) {
  if (window.location.pathname + window.location.search + window.location.hash === path) {
    return; // 이미 같은 URL이면 변경하지 않음
  }
  window.history.replaceState(null, "", path);
  log("REPLACE_URL", path);
}

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MaintenanceState>("checking");
  const [message, setMessage] = useState<string>("");
  const intervalRef = useRef<number | null>(null);
  const isCheckingRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const stateRef = useRef<MaintenanceState>("checking"); // 최신 state를 추적

  const checkMaintenanceStatus = async () => {
    // 중복 요청 방지
    if (isCheckingRef.current) {
      log("CHECK_SKIPPED (already checking)");
      return;
    }

    isCheckingRef.current = true;
    log("CHECK_START");

    try {
      const result = await getMaintenanceStatus(false);
      log("CHECK_RESULT", { enabled: result.enabled, message: result.message });

      if (result.enabled) {
        // 점검모드 진입
        if (stateRef.current !== "maintenance") {
          saveReturnUrl();
          replaceUrl("/maintenance");
          setMessage(result.message || "");
          setState("maintenance");
          stateRef.current = "maintenance";
          log("ENTER_MAINTENANCE");
        } else {
          // 이미 점검 화면인 경우 메시지만 업데이트
          setMessage(result.message || "");
        }
      } else {
        // 점검모드 해제
        if (stateRef.current === "maintenance") {
          const returnUrl = getReturnUrl();
          replaceUrl(returnUrl);
          clearReturnUrl();
          setState("normal");
          stateRef.current = "normal";
          log("EXIT_MAINTENANCE", { returnUrl });
        } else if (stateRef.current === "checking") {
          setState("normal");
          stateRef.current = "normal";
        }
      }
    } catch (error) {
      log("CHECK_FAILED", error);

      // 실패 정책: fail-open
      if (stateRef.current === "checking") {
        // 최초 조회 실패 시 정상 사이트 표시
        setState("normal");
        stateRef.current = "normal";
        log("FALLBACK_TO_NORMAL (initial check failed)");
      }
      // 이미 정상 또는 점검 상태라면 현재 상태 유지
    } finally {
      isCheckingRef.current = false;
    }
  };

  const startPolling = () => {
    // 기존 interval 정리
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    // 즉시 한 번 실행
    checkMaintenanceStatus();

    // 30초마다 polling
    intervalRef.current = window.setInterval(() => {
      checkMaintenanceStatus();
    }, POLL_INTERVAL);

    log("POLLING_START", { interval: POLL_INTERVAL });
  };

  const stopPolling = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      log("POLLING_STOP");
    }
  };

  useEffect(() => {
    startPolling();

    // 탭 visibility 변경 시 재조회
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        log("TAB_VISIBLE");
        checkMaintenanceStatus();
      }
    };

    // 윈도우 포커스 복귀 시 재조회
    const handleFocus = () => {
      log("WINDOW_FOCUS");
      checkMaintenanceStatus();
    };

    // 503 감지 이벤트
    const handle503Event = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      log("503_DETECTED", customEvent.detail);

      saveReturnUrl();
      replaceUrl("/maintenance");
      setMessage(customEvent.detail.message || "");
      setState("maintenance");
      stateRef.current = "maintenance";
    };

    // popstate 이벤트 처리 (뒤로가기/앞으로가기)
    const handlePopState = () => {
      if (stateRef.current === "maintenance") {
        // 점검 중에는 다른 페이지로 이동하지 못하게 함
        replaceUrl("/maintenance");
        log("POPSTATE_BLOCKED");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("jobkok:maintenance-detected", handle503Event);
    window.addEventListener("popstate", handlePopState);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("jobkok:maintenance-detected", handle503Event);
      window.removeEventListener("popstate", handlePopState);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // dependency 제거 - stateRef를 사용하여 최신 상태 참조

  // checking 중에는 빈 화면 (깜빡임 방지)
  if (state === "checking") {
    return <div style={{ minHeight: "100dvh", backgroundColor: "#ffffff" }}></div>;
  }

  // 점검 모드
  if (state === "maintenance") {
    return <MaintenancePage message={message} />;
  }

  // 정상 모드
  return <>{children}</>;
}
