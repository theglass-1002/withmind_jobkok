// src/api/fileUpload.api.ts
import instance from "@/api/axios.instance";
import axios from 'axios';
import { Storage } from '@/shared/utils/StorageManager';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 타입 정의
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface PreSignedUrlResponse {
  presignedUrlApi: string;
  s3Folder: string;
  awsFrontUrlStr: string;
}

export interface GetPreSignedUrlRequest {
  callType: 'media' | 'video';
  fileName: string;
  folderPath: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 유틸리티 함수: 고유 파일명 생성
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
 * 파일명에 유저ID + 타임스탬프를 추가하여 고유한 파일명 생성
 * @param originalFileName - 원본 파일명 (예: "profile.jpg")
 * @returns 고유 파일명 (예: "profile_123_20251205143025.jpg")
 */
function generateUniqueFileName(originalFileName: string): string {
  // 파일명과 확장자 분리
  const lastDotIndex = originalFileName.lastIndexOf('.');
  const nameWithoutExt = lastDotIndex > 0 
    ? originalFileName.substring(0, lastDotIndex) 
    : originalFileName;
  const extension = lastDotIndex > 0 
    ? originalFileName.substring(lastDotIndex) 
    : '';

  // 유저 ID 가져오기
  const userIdx = Storage.getUserIdx();

  // 현재 시간 (년월일시분초)
  const now = new Date();
  const timestamp = 
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');

  // 고유 파일명 생성: 원본명_유저ID_타임스탬프.확장자
  return `${nameWithoutExt}_${userIdx}_${timestamp}${extension}`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1단계: Pre-signed URL 받아오기
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
 * Pre-signed URL을 받아오는 함수 (✅ instance 사용)
 * @param fileName - 업로드할 파일명 (예: "profile.jpg")
 * @param folderPath - S3 폴더 경로 (예: "resume/profile")
 * @param callType - 파일 타입 (기본값: "media")
 */
export async function getPreSignedUrl(
  fileName: string,
  folderPath: string = "resume/profile",
  callType: 'media' | 'video' = 'media'
): Promise<PreSignedUrlResponse> {
  try {
 
    
    // ✅ instance 사용 (토큰 자동 갱신 적용)
    const res = await instance.post<PreSignedUrlResponse>(
      "/api/file/getPreUrl",
      {
        callType,
        fileName,
        folderPath,
      }
    );
    
   
    return res.data;
  } catch (error) {
    console.error("❌ Pre-signed URL 요청 실패:", error);
    throw error;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2단계: AWS에서 실제 presigned_url 받아오기
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
 * AWS API에서 실제 presigned_url과 s3_key를 받아오는 함수
 * ⚠️ 이 API는 AWS Lambda이므로 우리 서버가 아님 → axios 직접 사용
 * @param presignedUrlApi - 1단계에서 받은 presignedUrlApi
 */
export async function getAwsPresignedUrl(
  presignedUrlApi: string
): Promise<{ presigned_url: string; s3_key: string }> {
  try {
 
    // ⚠️ AWS Lambda 호출이므로 axios 직접 사용 (인증 불필요)
    const response = await axios.get<{ presigned_url: string; s3_key: string }>(
      presignedUrlApi
    );
    

    return response.data;
  } catch (error) {
    console.error("❌ AWS presigned_url 요청 실패:", error);
    throw error;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3단계: S3에 파일 업로드
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
 * Presigned URL을 사용하여 실제 파일을 S3에 업로드하는 함수
 * ⚠️ 이 API는 S3 직접 업로드이므로 우리 서버가 아님 → axios 직접 사용
 * @param presignedUrl - AWS에서 받은 presigned_url
 * @param file - 업로드할 파일
 */
export async function uploadFileToS3(
  presignedUrl: string,
  file: File
): Promise<void> {
  try {

    
    // ⚠️ S3 직접 업로드이므로 axios 직접 사용 (인증 불필요)
    const response = await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
    
    console.log("✅ S3 파일 업로드 성공:", response.status);
  } catch (error) {
    console.error("❌ S3 파일 업로드 실패:", error);
    throw error;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 통합 함수: 전체 파일 업로드 프로세스 (3단계 자동 실행)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
 * 전체 파일 업로드 프로세스 (고유 파일명 생성 + 3단계 업로드)
 * @param file - 업로드할 파일
 * @param folderPath - S3 폴더 경로
 * @returns { s3_key, finalUrl, uniqueFileName, originalFileName }
 */
export async function uploadPhotoFile(
  file: File,
  folderPath: string = "resume/profile"
): Promise<{ 
  s3_key: string; 
  finalUrl: string; 
  uniqueFileName: string;
  originalFileName: string;
}> {
  try {
    // ─────────────────────────────────────────────────────
    // 고유 파일명 생성
    // ─────────────────────────────────────────────────────
    const originalFileName = file.name;
    const uniqueFileName = generateUniqueFileName(originalFileName);
    

    
    // ─────────────────────────────────────────────────────
    // 1단계: 우리 서버로 presignedUrlApi 요청 (✅ instance 사용)
    // ─────────────────────────────────────────────────────
    const preSignedData = await getPreSignedUrl(uniqueFileName, folderPath);
    
    // ─────────────────────────────────────────────────────
    // 2단계: AWS에 직접 GET 해서 presigned_url, s3_key 받음
    // ─────────────────────────────────────────────────────
    const awsData = await getAwsPresignedUrl(preSignedData.presignedUrlApi);
    
    // ─────────────────────────────────────────────────────
    // 3단계: presigned_url로 PUT 업로드
    // ─────────────────────────────────────────────────────
    await uploadFileToS3(awsData.presigned_url, file);
    
    // ─────────────────────────────────────────────────────
    // 최종 파일 URL 생성 & filePath 추출
    // ─────────────────────────────────────────────────────
    const finalUrl = preSignedData.awsFrontUrlStr || "";
    
    // awsFrontUrlStr에서 filePath 추출
    // 예: "https://d3oz4mcjf9zx2l.cloudfront.net/jobkok/resume/profile/2025/12/05/ai_pick_639_20251205115434.png"
    //  → "jobkok/resume/profile/2025/12/05/ai_pick_639_20251205115434.png"
    let filePath = awsData.s3_key; // 기본값: s3_key 사용
    
    if (finalUrl && finalUrl.includes('.cloudfront.net/')) {
      // CloudFront URL에서 경로 추출
      filePath = finalUrl.split('.cloudfront.net/')[1];
    } else if (finalUrl && finalUrl.includes('amazonaws.com/')) {
      // S3 직접 URL에서 경로 추출
      const parts = finalUrl.split('amazonaws.com/');
      if (parts[1]) {
        // 쿼리 파라미터 제거 (? 이전까지만)
        filePath = parts[1].split('?')[0];
      }
    }
    

    
    return {
      s3_key: filePath,
      finalUrl: finalUrl,
      uniqueFileName: uniqueFileName,
      originalFileName: originalFileName,
    };
  } catch (error) {
    console.error("❌ 파일 업로드 프로세스 실패:", error);
    throw error;
  }
}