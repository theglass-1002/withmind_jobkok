import React, { useMemo, useState } from "react";
import JobCardV2, { type JobCardV2Props } from "@/shared/components/job-card-v2/JobCardV2";
import PaginationRound from "@/shared/components/pagination/PaginationRound";

export type JobCardV2Item = JobCardV2Props & { id: number };

type Props = {
  /** 섹션 제목 */
  title: string;
  /** 제목 아이콘 */
  titleIconSrc?: string;
  /** 추천 공고 목록 */
  jobs: JobCardV2Item[];
  /** 페이지당 아이템 수 (기본 3) */
  pageSize?: number;
  /** 페이지네이션 아이콘 */
  prevIconSrc?: string;
  nextIconSrc?: string;
  /** 북마크 토글 콜백 (옵션) */
  onToggleFavorite?: (id: number, nextValue: boolean) => void;
};

export default function ResumeRecommendedJobsSection({
  title,
  titleIconSrc,
  jobs,
  pageSize = 3,
  prevIconSrc,
  nextIconSrc,
  onToggleFavorite,
}: Props) {
  const [current, setCurrent] = useState(1);

  const total = useMemo(() => Math.max(1, Math.ceil(jobs.length / pageSize)), [jobs.length, pageSize]);
  const startIndex = (current - 1) * pageSize;
  const pageJobs = jobs.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => setCurrent((c) => Math.max(1, c - 1));
  const handleNext = () => setCurrent((c) => Math.min(total, c + 1));

  return (
    <div className="analysis-section mock-analysis-overview__recommended-jobs">
      <span className="analysis-section__title">
        {titleIconSrc && <img src={titleIconSrc} alt="" />}
        {title}
      </span>

      <div className="analysis-section__body">
        <div className="analysis-resume-recommended-jobs">
          {pageJobs.map((job) => (
            <div key={job.id} className="analysis-resume-recommended-jobs__item">
              <JobCardV2
                {...job}
                onClickFavorite={
                  onToggleFavorite
                    ? () => onToggleFavorite(job.id, !job.isBookmarked)
                    : job.onClickFavorite
                }
              />
            </div>
          ))}
        </div>

        <PaginationRound
          current={current}
          total={total}
          onPrev={handlePrev}
          onNext={handleNext}
          prevIconSrc={prevIconSrc}
          nextIconSrc={nextIconSrc}
        />
      </div>
    </div>
  );
}
