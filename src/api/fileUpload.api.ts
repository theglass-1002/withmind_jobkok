import axios from 'axios';
import { Storage } from '@/shared/utils/StorageManager';

const API_BASE_URL = 'http://34.64.175.29:9090';

// 응답 타입 정의
export interface PreSignedUrlResponse {
  presignedUrlApi: string;
  s3Folder: string;
  awsFrontVideoUrlStr: string;
}

// 요청 타입 정의
export interface GetPreSignedUrlRequest {
  callType: 'media' | 'video'; // 파일 타입에 따라 확장 가능
  fileName: string;
  folderPath: string; // 예: "resume/profile"
}

/**
 * Pre-signed URL을 받아오는 함수
 * @param fileName - 업로드할 파일명 (예: "profile.jpg")
 * @param folderPath - S3 폴더 경로 (예: "resume/profile")
 * @param callType - 파일 타입 (기본값: "media")
 */
export async function getPreSignedUrl(
  fileName: string,
  folderPath: string = "resume/profile",
  callType: 'media' | 'video' = 'media'
): Promise<PreSignedUrlResponse> {
  const data = JSON.stringify({
    callType,
    fileName,
    folderPath,
  });

  const token = Storage.getAccessToken(); // 토큰 가져오기

  const config = {
    method: 'post' as const,
    maxBodyLength: Infinity,
    url: `${API_BASE_URL}/api/file/getPreUrl`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-API-Key': '', // 필요시 API 키 추가
    },
    data: data,
  };

  try {
    console.log("📤 Pre-signed URL 요청:", { fileName, folderPath, callType });
    const response = await axios.request<PreSignedUrlResponse>(config);
    console.log("✅ Pre-signed URL 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Pre-signed URL 요청 실패:", error);
    throw error;
  }
}

/**
 * AWS API에서 실제 presigned_url과 s3_key를 받아오는 함수 (2단계)
 * @param presignedUrlApi - 1단계에서 받은 presignedUrlApi
 */
export async function getAwsPresignedUrl(
  presignedUrlApi: string
): Promise<{ presigned_url: string; s3_key: string }> {
  try {
    console.log("📤 AWS presigned_url 요청:", presignedUrlApi);
    
    const response = await axios.get<{ presigned_url: string; s3_key: string }>(presignedUrlApi);
    
    console.log("✅ AWS presigned_url 받음:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ AWS presigned_url 요청 실패:", error);
    throw error;
  }
}

/**
 * Presigned URL을 사용하여 실제 파일을 S3에 업로드하는 함수 (3단계)
 * @param presignedUrl - AWS에서 받은 presigned_url
 * @param file - 업로드할 파일
 */
export async function uploadFileToS3(
  presignedUrl: string,
  file: File
): Promise<void> {
  try {
    console.log("📤 S3 파일 업로드 시작:", file.name);
    
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

/**
 * 전체 파일 업로드 프로세스 (3단계)
 * @param file - 업로드할 파일
 * @param folderPath - S3 폴더 경로
 * @returns { s3_key, finalUrl }
 */
export async function uploadPhotoFile(
  file: File,
  folderPath: string = "resume/profile"
): Promise<{ s3_key: string; finalUrl: string }> {
  try {
    // 1단계: 우리 서버로 presignedUrlApi 요청
    const preSignedData = await getPreSignedUrl(file.name, folderPath);
    
    // 2단계: AWS에 직접 GET 해서 presigned_url, s3_key 받음
    const awsData = await getAwsPresignedUrl(preSignedData.presignedUrlApi);
    
    // 3단계: presigned_url로 PUT 업로드
    await uploadFileToS3(awsData.presigned_url, file);
    
    // 최종 파일 URL 생성
    const finalUrl = `${preSignedData.awsFrontVideoUrlStr}/${file.name}`;
    console.log("✅ 최종 파일 URL:", finalUrl);
    console.log("✅ S3 키:", awsData.s3_key);
    
    return {
      s3_key: awsData.s3_key,
      finalUrl: finalUrl,
    };
  } catch (error) {
    console.error("❌ 파일 업로드 프로세스 실패:", error);
    throw error;
  }
}