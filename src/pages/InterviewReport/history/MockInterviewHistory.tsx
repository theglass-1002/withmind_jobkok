import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UiFilter, { type UiFilterOption } from "@/shared/components/ui-filter/UiFilter";
import MockInterviewHistoryList, {
  type InterviewReportHistoryItemData,
} from "./MockInterviewHistoryList";

import ic_switch_right_white_20 from "@/assets/icons/size20/ic_switch_right_white_20.png";
import ic_arrow_up_right_gray900_20 from "@/assets/icons/size20/ic_arrow_up_right_gray900_20.png";
import ic_selected_file_purple_20 from "@/assets/icons/size20/ic_selected_file_purple_20.png";
import ic_keyboard_arrow_left_gray700_20 from "@/assets/icons/size20/ic_keyboard_arrow_left_gray700_20.png";
import ic_keyboard_arrow_right_gray700_20 from "@/assets/icons/size20/ic_keyboard_arrow_right_gray700_20.png";

import { fetchInterviewReportList } from "@/api/interview/interview.api";
import type { InterviewReportItem } from "@/api/interview/interview.types";

const DEFAULT_FILTERS: UiFilterOption[] = [
  { label: "전체", value: "all" },
  { label: "진행 완료", value: "done" },
  { label: "진행 중", value: "ongoing" },
];

const PAGE_SIZE = 10;

interface InterviewReportHistoryProps {
  filter: string;
  onChangeFilter: (v: string) => void;
  onStart: () => void;
  filters?: UiFilterOption[];
  emptyIconSrc: string;
}

function formatDate(d: string) {
  if (!d) return "";
  return d.replace(/-/g, ".");
}

export default function InterviewReportHistory({
  filter,
  onChangeFilter,
  onStart,
  filters = DEFAULT_FILTERS,
  emptyIconSrc,
}: InterviewReportHistoryProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [list, setList] = useState<InterviewReportItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [avatarMap, setAvatarMap] = useState<Record<number, string>>({});

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const interviewAllYn =
          filter === "done" ? "Y" : filter === "ongoing" ? "N" : undefined;

        const res = await fetchInterviewReportList({
          page,
          size: PAGE_SIZE,
          interviewAllYn,
        });
        console.log("📦 interview report list:", res);
        const baseList = res.list ?? [];
        if (cancelled) return;
        setList(baseList);
        setTotalCount(res.totalCount ?? 0);
        setAvatarMap({});

        const entries = await Promise.all(
          baseList.map(async (item) => {
            if (!item.photoUrl) return [item.qzGroup, ""] as const;
            try {
              const r = await fetch(item.photoUrl);
              const data = await r.json();
              return [item.qzGroup, data?.signedUrl ?? ""] as const;
            } catch (e) {
              console.error("❌ photoUrl 해석 실패:", item.qzGroup, e);
              return [item.qzGroup, ""] as const;
            }
          })
        );
        if (cancelled) return;
        setAvatarMap(Object.fromEntries(entries));
      } catch (error) {
        console.error("❌ interview report list fetch error:", error);
        if (cancelled) return;
        setList([]);
        setTotalCount(0);
        setAvatarMap({});
      }
    };
    fetchData();

    return () => {
      cancelled = true;
    };
  }, [page, filter]);

  const doneCountOnPage = useMemo(
    () => list.filter((i) => i.interviewAllYn === "Y").length,
    [list]
  );

  const items: InterviewReportHistoryItemData[] = useMemo(
    () =>
      list.map((item, idx) => ({
        id: item.qzGroup,
        no: (page - 1) * PAGE_SIZE + idx + 1,
        title: "",
        avatarSrc: avatarMap[item.qzGroup] ?? "",
        scoreText: `${item.totalScore}점`,
        roleText: item.jobGroup || item.job || "",
        dateText: formatDate(item.regdate),
        statusText: item.interviewAllYn === "Y" ? "진행완료" : "진행중",
        statusState: item.interviewAllYn === "Y" ? "done" : "doing",
        resumeLabelIconSrc: ic_selected_file_purple_20,
        resumeText: item.resumeTitle || "",
        resumeDate: formatDate(item.resumeDate),
        onClickView: () => navigate(`/mock-interview/analysis/${item.qzGroup}`),
      })),
    [list, page, navigate, avatarMap]
  );

  const isEmpty = totalCount === 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <>
      <div className="mock-interview__stats">
        <div className="mock-interview__stats-total">
          총 <span className="mock-interview__stats-count">{totalCount}건</span>
        </div>
        <div className="mock-interview__stats-done">
          진행완료 <span className="mock-interview__stats-count">{doneCountOnPage}건</span>
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
          items={items}
          page={page}
          totalPages={totalPages}
          onChangePage={setPage}
          pageWindow={5}
          prevIcon={<img src={ic_keyboard_arrow_left_gray700_20} alt="" aria-hidden="true" />}
          nextIcon={<img src={ic_keyboard_arrow_right_gray700_20} alt="" aria-hidden="true" />}
        />
      )}
    </>
  );
}
