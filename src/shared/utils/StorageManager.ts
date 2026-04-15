// src/shared/utils/StorageManager.ts

export class StorageManager {
  constructor() {}

  // =====================================================
  // 기본 스토리지 접근 메서드 (localStorage / sessionStorage 공용)
  // =====================================================

  private setItem(storage: Storage, key: string, value: any) {
    try {
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
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  private removeItem(storage: Storage, key: string) {
    storage.removeItem(key);
  }

  // local 우선 → 없으면 sessionStorage 조회
  private getFromBoth<T = any>(key: string, defaultValue: T): T {
    const local = this.getItem<T | null>(localStorage, key, null);
    if (local !== null && local !== undefined) return local;

    const session = this.getItem<T | null>(sessionStorage, key, null);
    if (session !== null && session !== undefined) return session;

    return defaultValue;
  }

  // ACCESS TOKEN
  getAccessToken() {
    return this.getFromBoth<string>("accessToken", "");
  }

  setAccessToken(token: string) {
    this.setItem(sessionStorage, "accessToken", token);
  }

  removeAccessToken() {
    this.removeItem(localStorage, "accessToken");
    this.removeItem(sessionStorage, "accessToken");
  }

  // REFRESH TOKEN
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

  // USER ID
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

  // USER IDX
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

  // USER NAME
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

  // SOCIAL STATE
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

  // REMEMBER ID
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

  // =====================================================
  // RECENT SEARCH KEYWORDS
  // =====================================================

  getRecentSearchKeywords() {
    const list = this.getItem<string[]>(localStorage, "recentSearchKeywords", []);
    return Array.isArray(list) ? list : [];
  }

  setRecentSearchKeywords(keywords: string[]) {
    const normalized = Array.isArray(keywords)
      ? keywords
          .map((keyword) => (typeof keyword === "string" ? keyword.trim() : ""))
          .filter(Boolean)
      : [];

    this.setItem(localStorage, "recentSearchKeywords", normalized);
  }

  addRecentSearchKeyword(keyword: string) {
    const trimmed = (keyword ?? "").trim();
    if (!trimmed) return;

    const current = this.getRecentSearchKeywords();

    const next = [
      trimmed,
      ...current.filter((item) => item.trim() !== trimmed),
    ].slice(0, 10);

    this.setRecentSearchKeywords(next);
  }

  removeRecentSearchKeyword(keyword: string) {
    const trimmed = (keyword ?? "").trim();
    if (!trimmed) return;

    const current = this.getRecentSearchKeywords();
    const next = current.filter((item) => item.trim() !== trimmed);

    this.setRecentSearchKeywords(next);
  }

  clearRecentSearchKeywords() {
    this.setItem(localStorage, "recentSearchKeywords", []);
  }


  // COMPANY NAME
  getCompanyName() {
    return this.getFromBoth<string>("companyName", "");
  }

  setCompanyName(name: string) {
    this.setItem(localStorage, "companyName", name);
  }

  removeCompanyName() {
    this.removeItem(localStorage, "companyName");
    this.removeItem(sessionStorage, "companyName");
  }

  // CLEAR ALL
  clearAll() {
    localStorage.clear();
    sessionStorage.clear();
  }
}




// StorageManager 하나로 전체 관리
export const Storage = new StorageManager();