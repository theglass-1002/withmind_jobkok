// src/pages/InterviewReport/history/InterviewReportHistory.tsx
import React, { useState } from "react";
import UiFilter, { type UiFilterOption } from "@/shared/components/ui-filter/UiFilter";
import MockInterviewHistoryList, { type InterviewReportHistoryItemData } from "./MockInterviewHistoryList";
import ic_switch_right_white_20 from "@/assets/icons/size20/ic_switch_right_white_20.png";
import test_profile_img2 from "@/assets/testImg/test_profile_img2.png";
import ic_arrow_up_right_gray900_20 from "@/assets/icons/size20/ic_arrow_up_right_gray900_20.png";
import ic_selected_file_purple_20 from "@/assets/icons/size20/ic_selected_file_purple_20.png";
import ic_keyboard_arrow_left_gray700_20 from "@/assets/icons/size20/ic_keyboard_arrow_left_gray700_20.png";
import ic_keyboard_arrow_right_gray700_20 from "@/assets/icons/size20/ic_keyboard_arrow_right_gray700_20.png";




const DEFAULT_FILTERS: UiFilterOption[] = [
  { label: "전체", value: "all" },
  { label: "진행 완료", value: "done" },
  { label: "진행 중", value: "ongoing" },
];


  

  const HISTORY_ITEMS: InterviewReportHistoryItemData[] = [
    {
      id: 1,
      title:"",
      no: 1,
      avatarSrc: test_profile_img2,
      scoreText: "82점",
      roleText: "프론트개발자",
      dateText: "2025.01.01",
      statusText: "진행완료",
      statusState: "done",
      resumeLabelIconSrc: ic_selected_file_purple_20,
      resumeText: "개발자 준비된 홍길동입니다.",
      resumeDate: "2025.01.01",
      onClickView: () => {},
    },
    {
      id: 2,
      title:"",
      no: 2,
      avatarSrc: test_profile_img2,
      scoreText: "82점",
      roleText: "프론트개발자",
      dateText: "2025.01.01",
      statusText: "진행 중",
      statusState: "doing",
      resumeLabelIconSrc: ic_selected_file_purple_20,
      resumeText: "개발자 준비된 홍길동입니다.",
      resumeDate: "2025.01.01",
      onClickView: () => {},
    },
    {
      id: 3,
      title:"",
      no: 3,
      avatarSrc: test_profile_img2,
      scoreText: "82점",
      roleText: "프론트개발자",
      dateText: "2025.01.01",
      statusText: "진행완료",
      statusState: "done",
      resumeLabelIconSrc: ic_selected_file_purple_20,
      resumeText: "개발자 준비된 홍길동입니다.",
      resumeDate: "2025.01.01",
      onClickView: () => {},
    },
    {
        id: 3,
        title:"",
        no: 3,
        avatarSrc: test_profile_img2,
        scoreText: "82점",
        roleText: "프론트개발자",
        dateText: "2025.01.01",
        statusText: "진행 중",
        statusState: "doing",
        resumeLabelIconSrc: ic_selected_file_purple_20,
        resumeText: "성장하는 개발자, 준비된 홍길동입니다..",
        resumeDate: "2025.01.01",
        onClickView: () => {},
      },
  ];
  

interface InterviewReportHistoryProps {
  totalCount: number;
  doneCount: number;
  filter: string;
  onChangeFilter: (v: string) => void;
  onStart: () => void;
  filters?: UiFilterOption[]; // 필요 시 커스터마이즈
  emptyIconSrc: string;       // 빈 상태 버튼 아이콘 (ex. ic_star_gray900_20)
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
  const isEmpty = totalCount === 0;
  const [page, setPage] = useState(1);
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

      {!isEmpty ? (
        <div className="mock-interview-empty mock-interview-empty--centered">
          <div className="mock-interview-empty__texts">
            <span className="mock-interview-empty__title">아직 진행한 모의면접이 없습니다.</span>
            <span className="mock-interview-empty__subtitle">
              모의면접을 진행하고 분석 리포트와 결과 기반 피드백을 받아보세요.
            </span>
          </div>
          <button type="button" className="default_btn_white" onClick={onStart}>
            <img src={emptyIconSrc} alt="" aria-hidden="true" />
            모의면접 시작
          </button>
        </div>
      ) : 
      (
        <MockInterviewHistoryList
          sortIconSrc={ic_switch_right_white_20}
          viewIconSrc={ic_arrow_up_right_gray900_20}
          items={HISTORY_ITEMS}
          page={page}
          totalPages={10}
          onChangePage={setPage}
          pageWindow={5}
          prevIcon={<img src={ic_keyboard_arrow_left_gray700_20} alt="" aria-hidden="true" />}
          nextIcon={<img src={ic_keyboard_arrow_right_gray700_20} alt="" aria-hidden="true" />}
        />
      )
      }
    </>
  );
}
