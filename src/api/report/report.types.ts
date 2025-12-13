// src/api/report/report.types.ts

export interface OverallScore {
    myScore: number;
    myScoreText: string;
    rank: number;
    totalCount: number;
    topPercent: number;
  }
  
  export interface ItemTotalScores {
    voiceTotalScore: number;
    voiceTotalScoreText: string;
    attitudeTotalScore: number;
    attitudeTotalScoreText: string;
    abilityTotalScore: number;
    abilityTotalScoreText: string;
    tensionTotalScore: number;
    tensionTotalScoreText: string;
  }
  
  export interface Feedback {
    overall: string;
    competency: string;
    attitude: string;
    voice: string;
    tension: string;
  }
  
  export interface RankInfo {
    jobGroup: string | null;
    job: string | null;
    myScore: number;
    myRank: number;
    totalCount: number;
    topPercent: number;
    distribution: number[];
  }
  
  export interface PowerKeywords {
    strength1: string;
    strength2: string;
    weakness1: string;
    weakness2: string;
    strength: string;
    weakness: string;
  }
  
  export interface InterviewReportResponse {
    qzGroup: number;
    overallScore: OverallScore;
    itemTotalScores: ItemTotalScores;
    feedback: Feedback;
    groupRankInfo: RankInfo;
    jobRankInfo: RankInfo;
    powerKeywords: PowerKeywords;
  }
  