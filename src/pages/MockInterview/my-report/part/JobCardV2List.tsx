// src/pages/MockInterview/my-report/part/JobCardV2List.tsx
import React from "react";
import JobCardV2 from "@/shared/components/job-card-v2/JobCardV2";

// JobCardV2List.tsx
export type JobCardV2Item = {
  id: string | number;
  logoSrc: string;
  company: string;
  sourceLogoSrc: string;
  role: string;
  matchPercent: number;
  matchIconSrc: string;
  locationMeta: string;
  employmentMeta: string;
  deadline: string;
  badges: { text: string; iconSrc: string; urgent?: boolean }[];
  isBookmarked?: boolean; // ← 추가
};


// JobCardV2List.tsx
interface JobCardV2ListProps {
  items: JobCardV2Item[];
  viewAllIconSrc: string;
  onClickViewAll?: () => void;
  viewAllText?: string;
  onToggleFavorite?: (id: string | number) => void; // ← 추가
}

export default function JobCardV2List({
  items,
  viewAllIconSrc,
  onClickViewAll,
  viewAllText = "모든 채용 공고 보기",
  onToggleFavorite,
}: JobCardV2ListProps) {
  return (
    <div className="mock-interview__jobcard-list mock-interview__jobcard-list--grid">
      {items.map((job) => (
        <JobCardV2
          key={job.id}
          logoSrc={job.logoSrc}
          company={job.company}
          sourceLogoSrc={job.sourceLogoSrc}
          role={job.role}
          matchPercent={job.matchPercent}
          matchIconSrc={job.matchIconSrc}
          locationMeta={job.locationMeta}
          employmentMeta={job.employmentMeta}
          deadline={job.deadline}
          badges={job.badges}
          isBookmarked={job.isBookmarked ?? false}          // ← 상태 내려줌
          onClickFavorite={() => onToggleFavorite?.(job.id)} // ← 토글 콜백
        />
      ))}

      <div className="mock-interview__jobcard-actions">
        <button className="default_btn_white radius" onClick={onClickViewAll}>
          <img className="mock-interview__jobcard-actions-icon" src={viewAllIconSrc} alt="" />
          {viewAllText}
        </button>
      </div>
    </div>
  );
}
