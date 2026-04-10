import React, { useEffect, useMemo, useState } from "react";

import test_company_logo from "@/assets/testImg/company_logo/test_company_logo.png";
import ic_saramin_18 from "@/assets/icons/size18/ic_saramin_18.png";
import ic_star_green_18 from "@/assets/icons/size18/ic_star_green_18.png";
import ic_fire_16 from "@/assets/icons/size16/ic_fire_16.png";
import ic_seed_16 from "@/assets/icons/size16/ic_seed_16.png";

import ic_print_gray900_24 from "@/assets/icons/size24/ic_print_gray900_24.png";
import ic_arrow_left_gray900_20 from "@/assets/icons/size20/ic_arrow_left_gray900_20.png";
import ic_star_white_20 from "@/assets/icons/size20/ic_star_white_20.png";
import ic_weakness_circle_24 from "@/assets/icons/size24/ic_weakness_circle_24.png";
import ic_strength_circle_24 from "@/assets/icons/size24/ic_strength_circle_24.png";

// ✅ 비디오 파일 import
import interview_video_01 from "@/assets/testImg/interview_video_01.webm";
import interview_video_02 from "@/assets/testImg/interview_video_02.webm";
import interview_video_03 from "@/assets/testImg/interview_video_03.webm";

import MockAnalysisHeader from "@/pages/InterviewReport/analysis/MockAnalysisHeader";
import OverviewPage from "@/pages/InterviewReport/analysis/overview/OverviewPage";
import DetailPage from "@/pages/InterviewReport/analysis/detail/DetailPage";
import ResumeInterviewMatchPage from "@/pages/InterviewReport/analysis/match/ResumeInterviewMatchPage";
import KpiRadarChart from "@/pages/InterviewReport/analysis/chart/KpiRadarChart";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { fetchInterviewReportDetail } from "@/api/report/report.api";
import { InterviewReportDetailResponse } from "@/api/report/report.types";

type TabKey = "overview" | "detail" | "match";

type Props = {
  id?: number;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔥 공통 공고 데이터
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const baseJobs = [
  {
    jobIdx: 101,
    logoSrc: test_company_logo,
    company: "위드마인드",
    sourceLogoSrc: ic_saramin_18,
    role: "프로젝트 기획자",
    isBookmarked: true,
    matchIconSrc: ic_star_green_18,
    locationMeta: "서울 마포구ㆍ신입 이상ㆍ대졸 이상",
    employmentMeta: "정규직ㆍ계약직",
    deadline: "~2025.08.31(일)",
    badges: [
      { text: "재택근무ㆍ유연근무제", iconSrc: ic_seed_16 },
      { text: "인기있는ㆍ마감임박", iconSrc: ic_fire_16 },
    ],
  },
  {
    jobIdx: 102,
    logoSrc: test_company_logo,
    company: "에이프로소프트",
    sourceLogoSrc: ic_saramin_18,
    role: "프론트엔드 엔지니어",
    isBookmarked: false,
    matchIconSrc: ic_star_green_18,
    locationMeta: "서울 서초구ㆍ1~3년ㆍ학력무관",
    employmentMeta: "정규직",
    deadline: "~2025.09.10(수)",
    badges: [
      { text: "재택 선택 가능", iconSrc: ic_seed_16 },
      { text: "마감임박", iconSrc: ic_fire_16 },
    ],
  },
  {
    jobIdx: 103,
    logoSrc: test_company_logo,
    company: "넥스트랩",
    sourceLogoSrc: ic_saramin_18,
    role: "웹 프론트엔드",
    isBookmarked: false,
    matchIconSrc: ic_star_green_18,
    locationMeta: "경기 성남시ㆍ신입~3년ㆍ대졸",
    employmentMeta: "정규직",
    deadline: "~2025.09.25(목)",
    badges: [{ text: "리액트ㆍ타입스크립트", iconSrc: ic_seed_16 }],
  },
  {
    jobIdx: 104,
    logoSrc: test_company_logo,
    company: "브라이트테크",
    sourceLogoSrc: ic_saramin_18,
    role: "UI 개발자",
    isBookmarked: true,
    matchIconSrc: ic_star_green_18,
    locationMeta: "서울 강남구ㆍ3~5년ㆍ학력무관",
    employmentMeta: "정규직",
    deadline: "~2025.10.02(목)",
    badges: [{ text: "디자인 협업 우대", iconSrc: ic_seed_16 }],
  },
  {
    jobIdx: 105,
    logoSrc: test_company_logo,
    company: "에버소스",
    sourceLogoSrc: ic_saramin_18,
    role: "프론트엔드(React)",
    isBookmarked: false,
    matchIconSrc: ic_star_green_18,
    locationMeta: "부산 해운대구ㆍ신입~2년ㆍ학력무관",
    employmentMeta: "계약직",
    deadline: "~2025.10.15(수)",
    badges: [{ text: "원격 근무 가능", iconSrc: ic_seed_16 }],
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔥 fallback mock data
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const analysisData1 = {
  name: "위마",
  userId: "jeongyuri",
  desiredRole: "웹 기획자",
  resumeTitle: "성장하는 기획자",
  reliability: "높음",
  interviewTime: "12분",
  score: 92,
  totalCandidates: 171,
  percentile: 5,
  fit: 92,
  videoSrc: interview_video_02,
  jobMatches: baseJobs.map((job, idx) => ({
    ...job,
    matchPercent: [92, 88, 85, 82, 78][idx] || 70,
  })),
  categoryScores: {
    attitude: 95,
    voice: 88,
    tension: 20,
    competence: 92,
  },
  detailScores: {
    competence: 92,
    attitude: 95,
    voice: 88,
    tension: 20,
  },
  scoreSection: {
    labels: [
      ["0", "~9"],
      ["10", "~19"],
      ["20", "~35"],
      ["36", "~45"],
      ["46", "~59"],
      ["60", "~75"],
      ["76", "~85"],
      ["86", "~93"],
      ["94", "~100"],
    ],
    max: 100,
    left: {
      role: "기획직군",
      rankText: "응시자 1,851명 중 12위",
      badgeText: "상위 5%",
      values: [20, 30, 40, 60, 75, 82, 88, 92, 95],
      highlightScore: 92,
    },
    right: {
      role: "웹 기획 직무",
      rankText: "응시자 267명 중 8위",
      badgeText: "상위 5%",
      values: [25, 35, 45, 65, 78, 85, 90, 92, 96],
      highlightScore: 92,
    },
  },
  categorySummary: {
    left: {
      scoreTitle: "위마님의 점수",
      scores: { attitude: 95, voice: 88, tension: 20, competence: 92 },
      RadarChartComponent: KpiRadarChart,
    },
    right: {
      items: [
        {
          label: "역량",
          gradeText: "최우수",
          gradeTone: "excellent" as const,
          description:
            "면접 과정에서 보인 의사소통능력과 문제해결능력은 매우 우수한 것으로 평가됩니다. 사용자 중심 사고와 데이터 기반 의사결정 능력이 뛰어나며, 기획자로서의 역량이 탁월하다고 판단됩니다.",
        },
        {
          label: "태도",
          gradeText: "최우수",
          gradeTone: "excellent" as const,
          description:
            "적극적이고 긍정적인 태도로 면접에 임했으며, 질문에 대한 이해도가 높고 명확한 답변을 제시했습니다. 팀워크와 협업 마인드가 우수합니다.",
        },
        {
          label: "목소리",
          gradeText: "우수",
          gradeTone: "good" as const,
          description:
            "명확하고 안정적인 목소리로 답변했습니다. 적절한 톤과 속도로 의사전달이 원활했으며, 전문성이 느껴졌습니다.",
        },
        {
          label: "긴장도",
          gradeText: "보통",
          gradeTone: "fair" as const,
          description:
            "초반 약간의 긴장이 보였으나, 면접이 진행되면서 안정적인 모습을 보였습니다. 전반적으로 적절한 수준의 긴장감을 유지했습니다.",
        },
      ],
    },
  },
  aiSummary: {
    strength: {
      iconSrc: ic_strength_circle_24,
      label: "강점",
      tags: ["사용자 중심 사고", "데이터 기반 의사결정", "협업 능력"],
      description:
        "위위님 강점으로 두드러지는 점은 사용자 중심적 사고방식과 데이터 기반 의사결정 능력입니다. 팀과의 협업에서도 뛰어난 커뮤니케이션 능력을 보였습니다.",
    },
    weakness: {
      iconSrc: ic_weakness_circle_24,
      label: "약점",
      tags: ["초반 긴장감", "기술적 깊이"],
      description:
        "면접 초반 약간의 긴장감이 보였으며, 일부 기술적 질문에 대한 깊이 있는 이해가 필요해 보입니다.",
    },
  },
};

const analysisData2 = {
  ...analysisData1,
  name: "이택진",
  userId: "leetaekjin",
  desiredRole: "백엔드 개발자",
  resumeTitle: "안정적인 서버를 만드는 백엔드 개발자",
  reliability: "중",
  interviewTime: "15분",
  score: 60,
  totalCandidates: 243,
  percentile: 40,
  fit: 60,
  videoSrc: interview_video_03,
  jobMatches: baseJobs.map((job, idx) => ({
    ...job,
    matchPercent: [60, 65, 58, 62, 55][idx] || 50,
  })),
  categoryScores: {
    attitude: 55,
    voice: 68,
    tension: 75,
    competence: 58,
  },
  detailScores: {
    competence: 58,
    attitude: 55,
    voice: 68,
    tension: 75,
  },
};

const analysisData3 = {
  ...analysisData1,
  name: "임서하",
  userId: "imseoha",
  desiredRole: "프론트엔드 개발자",
  resumeTitle: "사용자 경험을 최우선으로 하는 프론트엔드 개발자",
  reliability: "높음",
  interviewTime: "14분",
  score: 80,
  totalCandidates: 198,
  percentile: 15,
  fit: 80,
  videoSrc: interview_video_01,
  jobMatches: baseJobs.map((job, idx) => ({
    ...job,
    matchPercent: [80, 84, 82, 78, 75][idx] || 70,
  })),
  categoryScores: {
    attitude: 82,
    voice: 78,
    tension: 35,
    competence: 85,
  },
  detailScores: {
    competence: 85,
    attitude: 82,
    voice: 78,
    tension: 35,
  },
};

function getFallbackData(id: number) {
  if (id === 2) return analysisData2;
  if (id === 3) return analysisData3;
  return analysisData1;
}

function getFallbackVideo(id: number) {
  if (id === 2) return interview_video_03;
  if (id === 3) return interview_video_01;
  return interview_video_02;
}

export default function AIAnalysisSection({ id = 1 }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [reportDetail, setReportDetail] =
    useState<InterviewReportDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fallbackData = useMemo(() => getFallbackData(id), [id]);

  const [jobs, setJobs] = useState(fallbackData.jobMatches);

  useEffect(() => {
    setJobs(fallbackData.jobMatches);
  }, [fallbackData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchInterviewReportDetail(id);
  
        console.log("=== fetchInterviewReportDetail response ===");
        console.log("id:", id);
        console.log(res);
  
        setReportDetail(res);
      } catch (error) {
        console.error("분석결과 상세 조회 실패:", error);
        setReportDetail(null);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [id]);

  const handleTabClick = (key: TabKey) => setActiveTab(key);

  const handleOpenPrintPage = () => {
    const currentUrl = window.location.href;
    const separator = currentUrl.includes("?") ? "&" : "?";
    const printUrl = `${currentUrl}${separator}printViewr&tab=${activeTab}`;

    const A4_WIDTH = 794;
    const A4_HEIGHT = 1123;

    window.open(
      printUrl,
      "_blank",
      `width=${A4_WIDTH},height=${A4_HEIGHT},scrollbars=yes,resizable=yes`
    );
  };

  const handleToggleFavorite = (id: number | string, nextValue?: boolean) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.jobIdx === id
          ? { ...j, isBookmarked: nextValue ?? !j.isBookmarked }
          : j
      )
    );
  };

  const headerMetaRows = reportDetail
    ? [
        [
          { key: "이름", value: reportDetail.userInfo.name },
          { key: "아이디", value: reportDetail.userInfo.email },
        ],
        [
          { key: "희망직무", value: reportDetail.userInfo.desiredJob },
          { key: "선택 이력서", value: fallbackData.resumeTitle },
        ],
        [
          { key: "신뢰도", value: reportDetail.userInfo.aiTrustLevel },
          { key: "면접시간", value: reportDetail.userInfo.interviewTime },
        ],
      ]
    : [
        [
          { key: "이름", value: fallbackData.name },
          { key: "아이디", value: fallbackData.userId },
        ],
        [
          { key: "희망직무", value: fallbackData.desiredRole },
          { key: "선택 이력서", value: fallbackData.resumeTitle },
        ],
        [
          { key: "신뢰도", value: fallbackData.reliability },
          { key: "면접시간", value: fallbackData.interviewTime },
        ],
      ];

  const overviewScore = reportDetail?.tab1.overallScore.myScore ?? fallbackData.score;
  const overviewTotalCandidates =
    reportDetail?.tab1.overallScore.totalCount ?? fallbackData.totalCandidates;
  const overviewPercentile =
    reportDetail?.tab1.overallScore.topPercent ?? fallbackData.percentile;
  const overviewFit = reportDetail?.tab1.jobFitInfo.jobFitScore ?? fallbackData.fit;

  const detailCompetenceScore =
    reportDetail?.tab2.abilityAnalysis.detailAbility.abilityTotalScore ??
    fallbackData.detailScores.competence;
  const detailAttitudeScore =
    reportDetail?.tab2.detailAttitude.attitudeTotalScore ??
    fallbackData.detailScores.attitude;
  const detailVoiceScore =
    reportDetail?.tab2.voiceAnalysis.voiceTotalScore ??
    fallbackData.detailScores.voice;
  const detailTensionScore =
    reportDetail?.tab1.itemTotalScores.tensionTotalScore ??
    fallbackData.detailScores.tension;

  const detailVideoSrc = getFallbackVideo(id);

  return (
    <div className="mock-analysis" style={{ position: "relative" }}>
      <LoadingOverlay isLoading={isLoading} isLogo text="분석 결과 불러오는 중..." />

      <div className="mock-analysis__inner page-summary">
        <MockAnalysisHeader
          title="분석결과"
          date={reportDetail?.userInfo.interviewDate ?? "2025.12.10 00:00"}
          status={reportDetail?.userInfo.interviewStatus ?? "진행 완료"}
          activeTab={activeTab}
          metaRows={headerMetaRows}
        />

        <div className="mock-analysis-tabs default_tabs ">
          <span
            className={`mock-analysis-tabs__item tab ${
              activeTab === "overview" ? "on" : ""
            }`}
            role="button"
            tabIndex={0}
            onClick={() => handleTabClick("overview")}
          >
            종합 분석
          </span>
          <span
            className={`mock-analysis-tabs__item tab ${
              activeTab === "detail" ? "on" : ""
            }`}
            role="button"
            tabIndex={0}
            onClick={() => handleTabClick("detail")}
          >
            상세 분석
          </span>
          <span
            className={`mock-analysis-tabs__item tab ${
              activeTab === "match" ? "on" : ""
            }`}
            role="button"
            tabIndex={0}
            onClick={() => handleTabClick("match")}
          >
            이력서−면접 일치도 분석
          </span>
        </div>
      </div>

      <div className="mock-analysis-panel mock-analysis-report">
        <div className="mock-analysis-report__container">
          <div className="mock-analysis-report__inner">
            <span
              className="mock-analysis-report__icon-btn"
              onClick={handleOpenPrintPage}
              role="button"
              aria-label="리포트 인쇄"
            >
              <img
                className="mock-analysis-report__icon"
                src={ic_print_gray900_24}
                alt=""
              />
            </span>

            {activeTab === "overview" && (
              <OverviewPage
              reportDetail={reportDetail}
              // score={overviewScore}
                // totalCandidates={overviewTotalCandidates}
                // percentile={overviewPercentile}
                // fit={overviewFit}
                // jobs={jobs}
                // onToggleFavorite={handleToggleFavorite}
                // scoreSection={fallbackData.scoreSection}
                // categorySummary={fallbackData.categorySummary}
                // aiSummary={fallbackData.aiSummary}
              />
            )}

            {activeTab === "detail" && (
              <DetailPage
                reportDetail={reportDetail} 
              // competence_score={detailCompetenceScore}
                // attitude_score={detailAttitudeScore}
                // voice_score={detailVoiceScore}
                // tension_score={detailTensionScore}
                // videoSrc={detailVideoSrc}
              />
            )}

            {activeTab === "match" && (
              <ResumeInterviewMatchPage
                onToggleFavorite={handleToggleFavorite}
                jobs={jobs}
              />
            )}

            <div className="btn_wrap mock-analysis-report__actions">
              <span className="default_btn_white">
                <img
                  className="mock-analysis-report__btn-icon"
                  src={ic_arrow_left_gray900_20}
                  alt=""
                />
                목록으로
              </span>
              <span className="default_btn_black">
                <img
                  className="mock-analysis-report__btn-icon"
                  src={ic_star_white_20}
                  alt=""
                />
                모의면접 다시 보기
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}