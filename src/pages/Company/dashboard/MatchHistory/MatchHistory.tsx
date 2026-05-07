import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Storage } from "@/shared/utils/StorageManager";
import { getCompanyMatchHistory } from "@/api/company/job/companyJob.api";
import type { CompanyMatchHistoryItem } from "@/api/company/job/companyJob.types";

import ic_bell_gray900_24 from "@/assets/icons/size24/ic_bell_gray900_24.png";
import ic_search_white_20 from "@/assets/icons/size20/ic_search_white_20.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import ic_arrow_up_right_gray900_20 from "@/assets/icons/size20/ic_arrow_up_right_gray900_20.png";

import "./MatchHistory.css";

const formatRegisterDate = (value?: string) => {
  if (!value) return "-";
  const datePart = value.split("T")[0];
  if (!datePart) return "-";
  return datePart.replace(/-/g, ".");
};

export default function MatchHistory() {
  const companyName = Storage.getCompanyName();
  const navigate = useNavigate();

  const [historyItems, setHistoryItems] = useState<CompanyMatchHistoryItem[]>([]);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      //const companyIdx = 2571;
      const companyIdx = localStorage.getItem("companyIdx");

      if (!companyIdx) {
        console.log("매칭 히스토리 조회 스킵: companyIdx 값이 없습니다.");
        return;
      }

      try {
        console.log("매칭 히스토리 조회 요청:", {
          companyIdx,
          page: 1,
          size: 10,
        });

        const res = await getCompanyMatchHistory({
          companyIdx,
          page: 1,
          size: 10,
        });

        if (!res?.success) {
          console.warn("매칭 히스토리 조회 실패 응답:", res);
          setHistoryItems([]);
          return;
        }

        const items = res?.data?.items ?? [];

        console.log("매칭 히스토리 조회 응답:", res);
        console.log("매칭 히스토리 items:", items);

        setHistoryItems(items);
      } catch (error) {
        console.error("매칭 히스토리 조회 실패:", error);
        setHistoryItems([]);
      }
    };

    void fetchMatchHistory();
  }, []);
  return (
    <>
    <div className="company-dashboard-page">
      <div className="company-dashboard-header">
        <span className="company-dashboard-header__title">매칭 히스토리</span>
        
        <div className="company-dashboard-header__actions">
          <div className="company-dashboard-header__notification">
            <img 
              src={ic_bell_gray900_24} 
              alt="알림" 
              className="company-dashboard-header__icon" 
            />
          </div>
          <div className="company-dashboard-header__info">
            <span className="company-dashboard-header__company-name">
            {companyName || "-"}</span>
            <img src={ic_arrow_drop_down_gray900_24} alt="" />
          </div>
        </div>       
      </div> 
      <div className='company-dashboard-main'>
        <div className='history-controls-bar'>
              <div className='history-controls-bar__filter'>
                  <div className='history-controls-bar__filter-label'>전체공고
                      <img src={ic_arrow_drop_down_gray900_24} alt="드롭다운 아이콘" className='history-controls-bar__dropdown-icon' />
                  </div>
              </div>
              
              {/* 검색 입력 및 버튼 */}
              <div className='history-controls-bar__search'>
                  <input type="text" placeholder='검색어 입력' name="" id="" className='history-controls-bar__search-input' />
                  <button className='history-controls-bar__search-button default_btn_gray_800'>
                    <img 
                      src={ic_search_white_20} 
                      alt="검색 아이콘" 
                      className="history-controls-bar__search-icon" 
                    />
                    검색
                  </button>
              </div>
          </div>
          <div className= 'match-historyt-list'>
          <div className='match-history-table__header match-history-table__row'>
            <div className='match-history-table__col match-history-table__col--name'>이름</div>          
            <div className='match-history-table__col match-history-table__col--job'>채용공고</div>
            <div className='match-history-table__col match-history-table__col--rate'>적합률</div>
            <div className='match-history-table__col match-history-table__col--ai-status'>AI 면접</div>
            <div className='match-history-table__col match-history-table__col--date'>등록일</div>
            <div className='match-history-table__col match-history-table__col--action'></div>                             
          </div>
          {historyItems.length === 0 ? (
            <div className='match-history-table__item match-history-table__row'>
              <div className='match-history-table__col' style={{ flex: 1, textAlign: 'center' }}>
                매칭 히스토리가 없습니다.
              </div>
            </div>
          ) : (
            historyItems.map((item) => {
              const isPublic = item.aiInterview === "공개";
              return (
                <div
                  key={item.recommendationIdx}
                  className='match-history-table__item match-history-table__row'
                >
                  <div className='match-history-table__col match-history-table__col--name'>
                    {item.name ?? "-"}
                  </div>
                  <div className='match-history-table__col match-history-table__col--job'>
                    {item.jobName ?? "-"}
                  </div>
                  <div className='match-history-table__col match-history-table__col--rate'>
                    {item.aiMatchPercent !== undefined && item.aiMatchPercent !== null
                      ? `${item.aiMatchPercent}%`
                      : "-"}
                  </div>
                  <div
                    className={`match-history-table__col match-history-table__col--ai-status${
                      isPublic ? " on" : ""
                    }`}
                  >
                    <span>{item.aiInterview ?? "-"}</span>
                  </div>
                  <div className='match-history-table__col match-history-table__col--date'>
                    {formatRegisterDate(item.resumeUpdatedAt)}
                  </div>
                  <div className='match-history-table__col match-history-table__col--action'>
                    <button
                      className='match-history-table__action-button default_btn_white'
                      onClick={() => {
                        navigate(`/company/ai-matching/report/${item.recommendationIdx}`, {
                          state: {
                            recommendationItem: {
                              idx: item.recommendationIdx,
                              name: item.name,
                              aiInterview: item.aiInterview,
                              aiMatchPercent: item.aiMatchPercent,
                              resumeUpdatedAt: item.resumeUpdatedAt,
                            },
                          },
                        });
                      }}
                    >
                      자세히 보기
                      <img src={ic_arrow_up_right_gray900_20} alt="" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
          </div>
        
      </div>

    </div>
    </>
  )
}
