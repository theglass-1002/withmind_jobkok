import React, { useEffect, useMemo, useState } from "react";
import ic_exclamation_white_48 from "@/assets/icons/size48/ic_exclamation_white_48.png";

type EnvAnalyzeResult = {
  status: number;
  message: "pass" | "fail" | "nopass";
  faceCheck: number;
  soundCheck: number;
};

type FailureCode = 0 | 1 | 2 | 3;

type TestFailedProps = {

  speechText?: string;
  videoUrl?: string;
  analyzeResult?: EnvAnalyzeResult | null;
  failureCode?: FailureCode;
  isViewingVideo?: boolean;
};

type SignedUrlResponse = {
  signedUrl?: string;
};

export default function TestFailed({

  speechText,
  videoUrl,
  analyzeResult,
  failureCode,
  isViewingVideo = false,
}: TestFailedProps) {
  const [signedVideoUrl, setSignedVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    if (!isViewingVideo) return;

    setSignedVideoUrl(null);
    setVideoError(null);

    if (!videoUrl) return;

    let cancelled = false;

    const loadSignedUrl = async () => {
      try {
        setVideoLoading(true);

        const looksSigned =
          videoUrl.includes("Expires=") ||
          videoUrl.includes("Policy=") ||
          videoUrl.includes("Signature=") ||
          videoUrl.includes("Key-Pair-Id=");

        if (looksSigned) {
          if (!cancelled) setSignedVideoUrl(videoUrl);
          return;
        }

        const res = await fetch(videoUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error(`signedUrl 요청 실패 (HTTP ${res.status})`);

        const data: SignedUrlResponse = await res.json();
        if (!data?.signedUrl) throw new Error("응답에 signedUrl이 없습니다.");

        if (!cancelled) setSignedVideoUrl(data.signedUrl);
      } catch (e: any) {
        if (!cancelled) setVideoError(e?.message ?? "signedUrl 로딩 실패");
      } finally {
        if (!cancelled) setVideoLoading(false);
      }
    };

    loadSignedUrl();

    return () => {
      cancelled = true;
    };
  }, [isViewingVideo, videoUrl]);

  const resolvedFailureCode: FailureCode | undefined = useMemo(() => {
    if (typeof failureCode === "number") return failureCode;
    if (!analyzeResult) return undefined;

    const faceFail = analyzeResult.faceCheck === 1;
    const soundFail = analyzeResult.soundCheck === 1;

    if (faceFail && soundFail) return 3;
    if (faceFail) return 1;
    if (soundFail) return 2;

    return undefined;
  }, [failureCode, analyzeResult]);

  const isUploadFailed = resolvedFailureCode === 0;
  const isFaceFailed = resolvedFailureCode === 1 || resolvedFailureCode === 3;
  const isSoundFailed = resolvedFailureCode === 2 || resolvedFailureCode === 3;

  const getTitle = () => {
    switch (resolvedFailureCode) {
      case 0:
        return "영상 업로드에 실패했습니다.";
      case 1:
        return "얼굴 인식에 문제가 있습니다.";
      case 2:
        return "음성 인식에 문제가 있습니다.";
      case 3:
        return "정상적이지 않은 면접 환경입니다.";
      default:
        return "정상적이지 않은 면접 환경입니다.";
    }
  };

  const getDescription = () => {
    switch (resolvedFailureCode) {
      case 0:
        return "네트워크 상태를 확인한 후 다시 시도해 주세요.";
      case 1:
        return "카메라 각도, 조명, 얼굴 위치를 조정해 주세요.";
      case 2:
        return "마이크 연결 상태와 주변 소음을 확인해 주세요.";
      case 3:
        return "카메라와 마이크 환경을 모두 점검한 후 다시 시도해 주세요.";
      default:
        return "환경 테스트 실패 시 대처 매뉴얼을 확인해 주세요.";
    }
  };

  if (isViewingVideo) {
    return (
      <div className="env-test-result env-test-result--video-view show">
        <div className="env-test-result__content">
          <span className="env-test-result__title">테스트 영상 확인</span>
          <span className="env-test-result__description">녹화된 영상을 확인해 주세요.</span>
        </div>

        {videoLoading && (
          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
            영상 링크 불러오는 중...
          </div>
        )}

        {videoError && (
          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
            영상 링크를 불러오지 못했습니다: {videoError}
          </div>
        )}

        {signedVideoUrl && (
          <div className="env-test-result__video-player">
            <video
              src={signedVideoUrl}
              controls
              style={{
                width: "100%",
                maxWidth: "600px",
                borderRadius: "8px",
                marginTop: "20px",
              }}
            />
          </div>
        )}

        {speechText && (
          <div className="env-test-result__details">
            <span className="env-test-result__detail">• 읽은 문장: {speechText}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="env-test-result env-test-result--error show">
      <div className="env-test-result__icon">
        <img src={ic_exclamation_white_48} alt="Exclamation icon" />
      </div>

      <div className="env-test-result__content">
        <span className="env-test-result__title">{getTitle()}</span>
        <span className="env-test-result__description">{getDescription()}</span>
      </div>

      <div className="env-test-result__details">
        {isUploadFailed && (
          <span className="env-test-result__detail">
            • 환경 테스트 영상 업로드가 정상적으로 완료되지 않았습니다.
          </span>
        )}

        {!isUploadFailed && isFaceFailed && (
          <span className="env-test-result__detail">
            • 얼굴 인식이 정상적으로 이루어지지 않았습니다.
          </span>
        )}

        {!isUploadFailed && isSoundFailed && (
          <span className="env-test-result__detail">
            • 음성 인식이 정상적으로 이루어지지 않았습니다.
          </span>
        )}

        {speechText && (
          <span className="env-test-result__detail">• 읽은 문장: {speechText}</span>
        )}
      </div>
    </div>
  );
}
