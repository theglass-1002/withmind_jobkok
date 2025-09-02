
export function stripAllWhitespace(value: string): string {
    // 스페이스/탭/개행 등 모든 공백 제거
    return value.replace(/\s+/g, "");
  }
  // 영문/숫자/특수문자 각각 1개 이상 + 공백 금지 + 8~16자
  export const pwRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s])\S{8,16}$/;

  export function isValidPassword(pw: string): boolean {
    return pwRule.test(pw);
  }
  