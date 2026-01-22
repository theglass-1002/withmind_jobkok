import React from 'react'

export default function JobEmptyResult() {
    return (
        <div className="job-empty">
          <div className="job-empty__content">
            <span className="job-empty__title">
              검색 결과가 없습니다.
            </span>
            <span className="job-empty__desc">
              검색어 또는 필터 설정을 다시 확인해 주세요.
            </span>
          </div>
        </div>
      );
}
