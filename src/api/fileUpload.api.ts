// src/api/fileUpload.api.ts
import instance from "@/api/axios.instance";
import axios from "axios";
import { Storage } from "@/shared/utils/StorageManager";

export interface PreSignedUrlResponse {
  presignedUrlApi: string;
  s3Folder: string;
  awsFrontUrlStr: string;
}

export interface GetPreSignedUrlRequest {
  callType: "media" | "video";
  fileName: string;
  folderPath: string;
}

function generateUniqueFileName(originalFileName: string): string {
  const lastDotIndex = originalFileName.lastIndexOf(".");
  const nameWithoutExt =
    lastDotIndex > 0 ? originalFileName.substring(0, lastDotIndex) : originalFileName;
  const extension = lastDotIndex > 0 ? originalFileName.substring(lastDotIndex) : "";

  const userIdx = Storage.getUserIdx();

  const now = new Date();
  const timestamp =
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  return `${nameWithoutExt}_${userIdx}_${timestamp}${extension}`;
}

export async function getPreSignedUrl(
  fileName: string,
  folderPath?: string,
  callType: "media" | "video" = "video"
): Promise<PreSignedUrlResponse> {
  console.log('callType',callType);

  try {
 
      const res = await instance.post<PreSignedUrlResponse>("/api/file/getPreUrl", {
        callType,
        fileName,
        folderPath,
      });
      console.log('응답값 getpreurl',res.data);
      return res.data;
    
 
  } catch (error) {
    console.error("❌ Pre-signed URL 요청 실패:", error);
    throw error;
  }
}

export async function getAwsPresignedUrl(
  presignedUrlApi: string
): Promise<{ presigned_url: string; s3_key: string }> {
  try {
    const response = await axios.get<{ presigned_url: string; s3_key: string }>(
      presignedUrlApi
    );
    return response.data;
  } catch (error) {
    console.error("❌ AWS presigned_url 요청 실패:", error);
    throw error;
  }
}

export async function uploadFileToS3(presignedUrl: string, file: File): Promise<void> {
  try {
    const response = await axios.put(presignedUrl, file, {
      headers: { "Content-Type": file.type },
    });
    console.log("✅ S3 파일 업로드 성공:", response.status);
  } catch (error) {
    console.error("❌ S3 파일 업로드 실패:", error);
    throw error;
  }
}

function resolveFilePath(finalUrl: string, s3Key: string): string {
  if (finalUrl && finalUrl.includes(".cloudfront.net/")) {
    return finalUrl.split(".cloudfront.net/")[1];
  }
  if (finalUrl && finalUrl.includes("amazonaws.com/")) {
    const parts = finalUrl.split("amazonaws.com/");
    if (parts[1]) return parts[1].split("?")[0];
  }
  return s3Key;
}

function joinPath(base: string, fileName: string): string {
  const b = (base || "").replace(/\/+$/, "");
  const f = (fileName || "").replace(/^\/+/, "");
  return `${b}/${f}`;
}

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
    const originalFileName = file.name;
    const uniqueFileName = generateUniqueFileName(originalFileName);

    const preSignedData = await getPreSignedUrl(uniqueFileName, folderPath, "media");
    const awsData = await getAwsPresignedUrl(preSignedData.presignedUrlApi);
    await uploadFileToS3(awsData.presigned_url, file);

    const finalUrl = preSignedData.awsFrontUrlStr || "";
    const filePath = resolveFilePath(finalUrl, awsData.s3_key);

    return {
      s3_key: filePath,
      finalUrl,
      uniqueFileName,
      originalFileName,
    };
  } catch (error) {
    console.error("❌ 사진 업로드 프로세스 실패:", error);
    throw error;
  }
}

export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type || "video/webm" });
}

/**
 * 환경 테스트 영상 업로드
 * 기본 folderPath = "interviewTest/<파일명>"
 * - 필요하면 호출하는 쪽에서 folderPath를 원하는 값으로 덮어쓰기 가능
 */
export async function uploadInterviewTestVideo(
  videoBlob: Blob,
  originalFileName: string = "env_test.webm",
  folderPath: string = "interviewTest"
): Promise<{
  s3_key: string;
  finalUrl: string;
  uniqueFileName: string;
  originalFileName: string;
}> {
  try {
    const uniqueFileName = generateUniqueFileName(originalFileName);
    const file = blobToFile(videoBlob, uniqueFileName);

    const finalFolderPath = joinPath(folderPath, uniqueFileName);
    console.log('전송 어떻게 보내는지 ',uniqueFileName);
    const preSignedData = await getPreSignedUrl(uniqueFileName, "video");
    console.log('비디오2',preSignedData);
    const awsData = await getAwsPresignedUrl(preSignedData.presignedUrlApi);
    console.log('비디오3',awsData);
    await uploadFileToS3(awsData.presigned_url, file);

    const finalUrl = preSignedData.awsFrontUrlStr || "";
    const filePath = resolveFilePath(finalUrl, awsData.s3_key);

    return {
      s3_key: filePath,
      finalUrl,
      uniqueFileName,
      originalFileName,
    };
  } catch (error) {
    console.error("❌ 환경테스트 비디오 업로드 실패:", error);
    throw error;
  }
}

/**
 * 실제 면접 영상 업로드(기업면접 본건)
 * 기본 folderPath = "jobkok/<파일명>"
 * - 필요하면 호출하는 쪽에서 folderPath를 원하는 값으로 덮어쓰기 가능
 */
export async function uploadJobInterviewVideo(
  videoBlob: Blob,
  originalFileName: string = "interview.webm",
  folderPath: string = "jobkok"
): Promise<{
  s3_key: string;
  finalUrl: string;
  uniqueFileName: string;
  originalFileName: string;
}> {
  try {

    //https://d3oz4mcjf9zx2l.cloudfront.net/interviewTest/env_test_644_20251223172951.webm
    const uniqueFileName = generateUniqueFileName(originalFileName);
    const file = blobToFile(videoBlob, uniqueFileName);

    const finalFolderPath = joinPath(folderPath, uniqueFileName);

    const preSignedData = await getPreSignedUrl(uniqueFileName, finalFolderPath, "video");
    const awsData = await getAwsPresignedUrl(preSignedData.presignedUrlApi);
    await uploadFileToS3(awsData.presigned_url, file);

    const finalUrl = preSignedData.awsFrontUrlStr || "";
    const filePath = resolveFilePath(finalUrl, awsData.s3_key);

    return {
      s3_key: filePath,
      finalUrl,
      uniqueFileName,
      originalFileName,
    };
  } catch (error) {
    console.error("❌ 면접 비디오 업로드 실패:", error);
    throw error;
  }
}
