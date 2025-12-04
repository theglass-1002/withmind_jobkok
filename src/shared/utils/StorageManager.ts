// src/shared/utils/StorageManager.ts

export class StorageManager {
    constructor() {}
  
    // =====================================================
    // 기본 스토리지 접근 메서드 (localStorage / sessionStorage 공용)
    // =====================================================
  
    private setItem(storage: Storage, key: string, value: any) {
      try {
        // 여기서는 계속 JSON.stringify로 저장
        storage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error("Storage set error:", e);
      }
    }
  
    private getItem<T = any>(
      storage: Storage,
      key: string,
      defaultValue: T | null = null
    ): T | null {
      const raw = storage.getItem(key);
      if (raw === null) return defaultValue;
  
      try {
        // JSON 형식이면 파싱
        return JSON.parse(raw) as T;
      } catch {
        // 🔥 JSON 아니면 (예전처럼 그냥 문자열로 저장된 경우) raw 그대로 반환
        return raw as unknown as T;
      }
    }
  
    private removeItem(storage: Storage, key: string) {
      storage.removeItem(key);
    }
  
    // =====================================================
    //  local 우선 → 없으면 sessionStorage 조회
    // =====================================================
    private getFromBoth<T = any>(key: string, defaultValue: T): T {
      const local = this.getItem<T | null>(localStorage, key, null);
      if (local !== null && local !== undefined) return local;
  
      const session = this.getItem<T | null>(sessionStorage, key, null);
      if (session !== null && session !== undefined) return session;
  
      return defaultValue;
    }
  
    // =====================================================
    //  set/remove 는 어디 저장할지 결정해서 사용
    // =====================================================
  
    // --------------------------
    // ACCESS TOKEN (session 우선)
    // --------------------------
    getAccessToken() {
      return this.getFromBoth<string>("accessToken", "");
    }
  
    setAccessToken(token: string) {
      this.setItem(sessionStorage, "accessToken", token); // 세션에 저장
    }
  
    removeAccessToken() {
      this.removeItem(localStorage, "accessToken");
      this.removeItem(sessionStorage, "accessToken");
    }
  
    // --------------------------
    // REFRESH TOKEN (local 우선)
    // --------------------------
    getRefreshToken() {
      return this.getFromBoth<string>("refreshToken", "");
    }
  
    setRefreshToken(token: string) {
      this.setItem(localStorage, "refreshToken", token);
    }
  
    removeRefreshToken() {
      this.removeItem(localStorage, "refreshToken");
      this.removeItem(sessionStorage, "refreshToken");
    }
  
    // --------------------------
    // USER ID
    // --------------------------
    getUserId() {
      return this.getFromBoth<string>("userId", "");
    }
  
    setUserId(id: string | number) {
      this.setItem(localStorage, "userId", id.toString());
    }
  
    removeUserId() {
      this.removeItem(localStorage, "userId");
      this.removeItem(sessionStorage, "userId");
    }
  
    // --------------------------
    // USER IDX
    // --------------------------
    getUserIdx() {
      return this.getFromBoth<number>("userIdx", 0);
    }
  
    setUserIdx(idx: number) {
      this.setItem(localStorage, "userIdx", idx);
    }
  
    removeUserIdx() {
      this.removeItem(localStorage, "userIdx");
      this.removeItem(sessionStorage, "userIdx");
    }
  
    // --------------------------
    // USER NAME
    // --------------------------
    getUserName() {
      return this.getFromBoth<string>("userName", "");
    }
  
    setUserName(name: string) {
      this.setItem(localStorage, "userName", name);
    }
  
    removeUserName() {
      this.removeItem(localStorage, "userName");
      this.removeItem(sessionStorage, "userName");
    }
  
    // --------------------------
    // SOCIAL STATE
    // --------------------------
    getKakaoState() {
      return this.getFromBoth<string>("kakao_oauth_state", "");
    }
  
    setKakaoState(v: string) {
      this.setItem(sessionStorage, "kakao_oauth_state", v);
    }
  
    removeKakaoState() {
      this.removeItem(localStorage, "kakao_oauth_state");
      this.removeItem(sessionStorage, "kakao_oauth_state");
    }
  
    getNaverState() {
      return this.getFromBoth<string>("naver_oauth_state", "");
    }
  
    setNaverState(v: string) {
      this.setItem(sessionStorage, "naver_oauth_state", v);
    }
  
    removeNaverState() {
      this.removeItem(localStorage, "naver_oauth_state");
      this.removeItem(sessionStorage, "naver_oauth_state");
    }
  
    // --------------------------
    // REMEMBER ID
    // --------------------------
    getRememberId() {
      return this.getFromBoth<string>("rememberId", "");
    }
  
    setRememberId(id: string) {
      this.setItem(localStorage, "rememberId", id);
    }
  
    removeRememberId() {
      this.removeItem(localStorage, "rememberId");
      this.removeItem(sessionStorage, "rememberId");
    }
  
    // --------------------------
    // CLEAR ALL
    // --------------------------
    clearAll() {
      localStorage.clear();
      sessionStorage.clear();
    }
  }
  
  // StorageManager 하나로 전체 관리
  export const Storage = new StorageManager();
  