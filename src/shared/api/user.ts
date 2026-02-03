// src/shared/api/account.ts
export type UserProfile = {
    email: string;
    number: string;
    name: string;
    birth: string;           // "YYYY.MM.DD"
    gender: "M" | "W";
    certified: boolean;
  };
  
  export async function getProfile(): Promise<UserProfile> {
    const r = await fetch("/api/profile");
    if (!r.ok) throw new Error("프로필 조회 실패");
    return r.json();
  }
  
  export async function updateProfile(patch: Partial<UserProfile>): Promise<UserProfile> {
    const r = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!r.ok) throw new Error("프로필 수정 실패");
    return r.json();
  }
  
  export async function deleteAccount(): Promise<void> {
    const r = await fetch("/api/account", { method: "DELETE" });
    if (!r.ok) throw new Error("탈퇴 실패");
  }
  