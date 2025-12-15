// src/pages/InterviewReport/history/InterviewReportHistory.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UiFilter, { type UiFilterOption } from "@/shared/components/ui-filter/UiFilter";
import MockInterviewHistoryList, {
  type InterviewReportHistoryItemData,
} from "./MockInterviewHistoryList";

import ic_switch_right_white_20 from "@/assets/icons/size20/ic_switch_right_white_20.png";
import test_profile_img2 from "@/assets/testImg/test_profile_img2.png";
import ic_arrow_up_right_gray900_20 from "@/assets/icons/size20/ic_arrow_up_right_gray900_20.png";
import ic_selected_file_purple_20 from "@/assets/icons/size20/ic_selected_file_purple_20.png";
import ic_keyboard_arrow_left_gray700_20 from "@/assets/icons/size20/ic_keyboard_arrow_left_gray700_20.png";
import ic_keyboard_arrow_right_gray700_20 from "@/assets/icons/size20/ic_keyboard_arrow_right_gray700_20.png";

// ✅ webm import (경로 맞게)
import interview_video_02 from "@/assets/testImg/interview_video_02.webm";
import { createVideoThumbnail } from "@/shared/utils/util";

const DEFAULT_FILTERS: UiFilterOption[] = [
  { label: "전체", value: "all" },
  { label: "진행 완료", value: "done" },
  { label: "진행 중", value: "ongoing" },
];

interface InterviewReportHistoryProps {
  totalCount: number;
  doneCount: number;
  filter: string;
  onChangeFilter: (v: string) => void;
  onStart: () => void;
  filters?: UiFilterOption[];
  emptyIconSrc: string;
}


export default function InterviewReportHistory({
  totalCount,
  doneCount,
  filter,
  onChangeFilter,
  onStart,
  filters = DEFAULT_FILTERS,
  emptyIconSrc,
}: InterviewReportHistoryProps) {
  const navigate = useNavigate();
  const isEmpty = totalCount === 0;
  const [page, setPage] = useState(1);

  // ✅ 썸네일 상태 (dataURL)
  const [videoThumb, setVideoThumb] = useState<string | null>(null);

  // ✅ 컴포넌트 마운트 시 썸네일 생성
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const thumb = await createVideoThumbnail(interview_video_02, 1);
        if (mounted) setVideoThumb(thumb);
      } catch (e) {
        console.error("썸네일 생성 실패:", e);
        if (mounted) setVideoThumb(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const HISTORY_ITEMS: InterviewReportHistoryItemData[] = useMemo(
    () => [
      {
        id: 1,
        title: "",
        no: 1,
        // ✅ video 썸네일 있으면 그걸, 없으면 기존 이미지
        avatarSrc: videoThumb ?? interview_video_02,
        scoreText: "82점",
        roleText: "서비스 기획",
        dateText: "2025.12.10",
        statusText: "진행완료",
        statusState: "done",
        resumeLabelIconSrc: ic_selected_file_purple_20,
        resumeText: "성장하는 서비스 기획자",
        resumeDate: "2025.12.10",
        onClickView: () => {
          navigate(`/mock-interview/analysis/${1}`);
        },
      },
    ],
    [navigate, videoThumb]
  );

  return (
    <>
      <div className="mock-interview__stats">
        <div className="mock-interview__stats-total">
          총 <span className="mock-interview__stats-count">{totalCount}건</span>
        </div>
        <div className="mock-interview__stats-done">
          진행완료 <span className="mock-interview__stats-count">{doneCount}건</span>
        </div>
      </div>

      <UiFilter
        options={filters}
        value={filter}
        onChange={onChangeFilter}
        className="mock-interview__filters"
      />

      {isEmpty ? (
        <div className="mock-interview-empty mock-interview-empty--centered">
          <div className="mock-interview-empty__texts">
            <span className="mock-interview-empty__title">
              아직 진행한 모의면접이 없습니다.
            </span>
            <span className="mock-interview-empty__subtitle">
              모의면접을 진행하고 분석 리포트와 결과 기반 피드백을 받아보세요.
            </span>
          </div>
          <button type="button" className="default_btn_white" onClick={onStart}>
            <img src={emptyIconSrc} alt="" aria-hidden="true" />
            모의면접 시작
          </button>
        </div>
      ) : (
        <MockInterviewHistoryList
          sortIconSrc={ic_switch_right_white_20}
          viewIconSrc={ic_arrow_up_right_gray900_20}
          items={HISTORY_ITEMS}
          page={page}
          totalPages={1}
          onChangePage={setPage}
          pageWindow={1}
          prevIcon={<img src={ic_keyboard_arrow_left_gray700_20} alt="" aria-hidden="true" />}
          nextIcon={<img src={ic_keyboard_arrow_right_gray700_20} alt="" aria-hidden="true" />}
        />
      )}
    </>
  );
}
