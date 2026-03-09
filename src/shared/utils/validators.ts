

/*

isValidPassword 비밀번호: 영문, 숫자, 특수문자 포함 8~16자 검증 함수
validatePassword  유효하지 않을 때 안내 문구 반환, 유효하면 undefined
formatPhone 01012345678 → 010-1234-5678 자동 변환
isValidPhone  // 형식 검증

**/


// 비밀번호: 영문, 숫자, 특수문자 포함 8~16자 검증
export function isValidPassword(password: string): boolean {
  const lengthOk = /^.{8,16}$/.test(password);
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return lengthOk && hasLetter && hasNumber && hasSpecial;
}

// 유효하지 않을 때 안내 문구 반환, 유효하면 undefined
export function validatePassword(password: string): string | number {  

  if (password.length < 8 || password.length > 16) {
    return 2;
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return 2;
  }
  return 3;
}




// 번호 전화번호 01012345678 → 010-1234-5678 자동 변환
export const formatPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, ""); // 숫자만
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return digits.replace(/(\d{3})(\d+)/, "$1-$2");
  return digits.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3").slice(0, 13);
};

// 형식 검증
export const isValidPhone = (phone: string) =>
  /^010-\d{4}-\d{4}$/.test(phone);
