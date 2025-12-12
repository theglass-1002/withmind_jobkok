// auth.types.ts
// 요청(Request) 타입 응답(Response) 타입
// 회원가입 API
// 로그인 API
// 로그아웃 API
// accessToken 재발급
// 카카오 로그인
// 네이버 로그인
// Apple 로그인
// 이니시스 본인인증(precheck)
// 비밀번호 재설정 인증

import { ApiResponse } from "./axios.instance";


export interface LoginRequest {
    userId: string;
    password: string;
    deviceId: string;
  }
  export interface EmailCheckResponse {
    code: number;
    check: boolean;
    msg: string;
  }
  export interface RegisterRequest {
    userId: string;
    password: string;
    userName: string;
    ci: string;
    ciProvider: string;
    realName: string;
    birthdate: string;
    gender: string;
    phone: string;
    email: string;
  }
  export interface LoginUser {
    userName: string;
    userIdx: number;
    userId: string;
  }
  export interface LoginResponse {
    code: number;
    tokenType: string;
    user: LoginUser;
    token: string;
    refreshToken: string;
  }

  export type RegisterResponse = ApiResponse<{
    userIdx: number;
  }>;
  
  // export interface RegisterResponse {
  //   code: number;
  //   msg: string;
  //   data?: any;
  // }
  