const IsDev = true;

export const LOCAL_BASE_URL = "http://localhost:5173";
export const REAL_BASE_URL  = "https://jobkok.kr/";
export const AI_BASE_URL = "https://ai.api.jobkok.kr";
export const NAVER_CLIENT_ID = "SXBr96y1InAJo4dJfnCV";
export const KAKAO_REST_API_KEY = "aff22010dc842b57d737fc236ba46676";



export const API_BASE_URL = IsDev?"http://34.64.175.29:9090":"https://api.jobkok.kr";
//export const KAKAO_REDIRECT_URI = "http://localhost:5173/auth/oauth/kakao/callback";
//export const NAVER_REDIRECT_URI = "http://localhost:5173/auth/oauth/naver/callback";


export const KAKAO_REDIRECT_URI =`${IsDev?LOCAL_BASE_URL:REAL_BASE_URL}/auth/oauth/kakao/callback`;

export const NAVER_REDIRECT_URI =`${IsDev?LOCAL_BASE_URL:REAL_BASE_URL}/auth/oauth/naver/callback`;




//export const NAVER_API_URI = "http://34.64.175.29:9090/auth/oauth/naver/callback";





// export const KAKAO_REDIRECT_URI = "http://34.64.175.29:9090/auth/oauth/kakao/callback";

//export const KAKAO_REDIRECT_URI = "http://localhost:5173";



export const GOOGLE_REDIRECT_URI = "https://api.jobkok.kr/auth/oauth/google/callback";