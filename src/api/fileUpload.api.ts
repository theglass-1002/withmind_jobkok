// src/api/fileUpload.api.ts
import instance from "@/api/axios.instance";
import axios from "axios";
import { Storage } from "@/shared/utils/StorageManager";

// OCI Object Storage 발급 응답 (AWS presigned/CloudFront 대체)
// 백엔드 POST /api/file/getPreUrl 이 OCI 업로드 PAR + DB저장용 object_name 을 발급한다.
export interface PreSignedUrlResponse {
  uploadUrl: string; // OCI PAR (PUT 전용, 만료됨 → 저장 금지)
  objectName: string; // DB 저장용 경로 (interview/media 등)
  thumObjectName: string; // 썸네일 object_name
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

// OCI 업로드 URL(PAR) + object_name 발급. 백엔드가 category(interview/media)를 판정한다.
export async function getPreSignedUrl(
  fileName: string,
  folderPath?: string,
  callType: "media" | "video" = "video"
): Promise<PreSignedUrlResponse> {
  try {
    const res = await instance.post<PreSignedUrlResponse>("/api/file/getPreUrl", {
      callType,
      fileName,
      folderPath,
    });
    return res.data;
  } catch (error) {
    console.error("❌ OCI 업로드 URL 발급 실패:", error);
    throw error;
  }
}

// OCI PAR 에 파일 직접 PUT (서버 경유 X, 1-hop)
export async function uploadFileToOci(uploadUrl: string, file: File): Promise<void> {
  try {
    const response = await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type },
    });
    console.log("OCI 파일 업로드 성공:", response.status);
  } catch (error) {
    console.error("OCI 파일 업로드 실패:", error);
    throw error;
  }
}

function resolveFilePath(finalUrl: string, s3Key: string): string {
  if (finalUrl && finalUrl.includes(".cloudfront.net/")) {
    return finalUrl.split(".cloudfront.net/")[1] || "";
  }
  if (finalUrl && finalUrl.includes("amazonaws.com/")) {
    const parts = finalUrl.split("amazonaws.com/");
    if (parts[1]) return parts[1].split("?")[0] || "";
  }
  return s3Key;
}

function joinPath(base: string, fileName: string): string {
  const b = (base || "").replace(/\/+$/, "");
  const f = (fileName || "").replace(/^\/+/, "");
  return `${b}/${f}`;
}

export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type || "video/webm" });
}

// 사진/이미지 업로드 (media). DB 저장값 = objectName(경로).
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

    const { uploadUrl, objectName } = await getPreSignedUrl(uniqueFileName, folderPath, "media");
    await uploadFileToOci(uploadUrl, file);

    // finalUrl/s3_key = object_name(경로). 백엔드가 조회 시 download-url 로 resolve.
    return {
      s3_key: objectName,
      finalUrl: objectName,
      uniqueFileName,
      originalFileName,
    };
  } catch (error) {
    console.error("❌ 사진 업로드 프로세스 실패:", error);
    throw error;
  }
}

/**
 * 환경 테스트 영상 업로드 (video). DB 저장값 = objectName.
 * 즉시 미리보기는 호출부에서 로컬 blob URL 사용(objectName 은 재생 불가 경로).
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

    const { uploadUrl, objectName } = await getPreSignedUrl(uniqueFileName, folderPath, "video");
    await uploadFileToOci(uploadUrl, file);

    return {
      s3_key: objectName,
      finalUrl: objectName,
      uniqueFileName,
      originalFileName,
    };
  } catch (error) {
    console.error(" 환경테스트 비디오 업로드 실패:", error);
    throw error;
  }
}

/**
 * 면접 영상 업로드(모의면접/기업면접 본건). DB 저장값 = objectName / thumObjectName.
 */
export async function uploadJobInterviewVideo(
  videoBlob: Blob,
  originalFileName: string = "interview.webm",
  folderPath: string = "interview"
): Promise<{
  fileName: string;
  fileSize: number;
  s3_key: string;
  finalUrl: string;
  thumbUrl: string;
  uniqueFileName: string;
  originalFileName: string;
}> {
  try {
    const uniqueFileName = generateUniqueFileName(originalFileName);
    const file = blobToFile(videoBlob, uniqueFileName);

    const { uploadUrl, objectName, thumObjectName } = await getPreSignedUrl(
      uniqueFileName,
      folderPath,
      "video"
    );
    await uploadFileToOci(uploadUrl, file);

    return {
      fileName: file.name,
      fileSize: file.size,
      s3_key: objectName,
      finalUrl: objectName,
      thumbUrl: thumObjectName,
      uniqueFileName,
      originalFileName,
    };
  } catch (error) {
    console.error("모의면접 영상 업로드 실패:", error);
    throw error;
  }
}
