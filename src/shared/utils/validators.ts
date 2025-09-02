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


