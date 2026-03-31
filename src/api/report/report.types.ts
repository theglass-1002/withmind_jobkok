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
  jobGroup?: string | null;
  job?: string | null;
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

/**
 * tab1 기준 요약 응답
 */
export interface InterviewReportResponse {
  qzGroup: number;
  overallScore: OverallScore;
  itemTotalScores: ItemTotalScores;
  feedback: Feedback;
  groupRankInfo: RankInfo;
  jobRankInfo: RankInfo;
  powerKeywords: PowerKeywords;
  jobFitInfo: JobFitInfo;
}

// =========================
// 공통
// =========================

export interface ChartData10 {
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  x5: number;
  x6: number;
  x7: number;
  x8: number;
  x9: number;
  x10: number;
}

export interface UserInfo {
  interviewStatus: string;
  aiTrustLevel: string;
  interviewTime: string;
  name: string;
  desiredJob: string;
  interviewDate: string;
  userName: string;
  email: string;
}

// =========================
// 음성 분석
// =========================

export interface VoiceTone {
  chartData: ChartData10;
  levelText: string;
  avgHz: number;
  scoreText: string;
  toneAnalysisText: string;
}

export interface VoiceSpeed {
  avgSps: number;
  chartData: ChartData10;
  levelText: string;
  scoreText: string;
}

export interface VoiceAnalysis {
  voiceTotalScoreText: string;
  voiceGrade: string;
  tone: VoiceTone;
  voiceFeedBack: string;
  voiceAnalysisDetailText: string;
  voiceAnalysisText: string;
  voiceTotalScore: number;
  speed: VoiceSpeed;
}

// =========================
// 적합도 / 역량
// =========================

export interface JobFitInfo {
  jobFitScore: number;
  jobFitText: string;
  jobFitFeedback: string;
}

export interface DetailAbility {
  abilityTotalScoreText: string;
  abilityTotalScore: number;
  abilityFeedBack: string;
}

export interface InterviewVideoItem {
  evaluation: string;
  score: number;
  stt: string;
  qzTxt: string;
  grade: number;
  regdate: string;
  fileUrl: string;
  qzNum: number;
  keyAnswerEval1: string;
  keyAnswerEval2: string;
  keyAnswerEval3: string;
}

export interface AbilityAnalysis {
  detailAbility: DetailAbility;
  interviewVideo: InterviewVideoItem[];
  frequentlyUsedWords: string[];
  frequentlyUsedHabitWords: string[];
}

// =========================
// 자세 분석
// =========================

export interface GroupTypeMovementData {
  groupType: string;
  centerMoveCount: number;
  rightMoveCount: number;
  leftMoveCount: number;
}

export interface GroupTypeAngleData {
  groupType: string;
  faceAngle: number;
  shoulderAngle: number;
}

export interface ShoulderMovement {
  dataList: GroupTypeMovementData[];
}

export interface PostureAngle {
  postureScore: number;
  postureGrade: string;
  dataList: GroupTypeAngleData[];
}

export interface PostureShoulderAngleData {
  shoulderMovement: ShoulderMovement;
  postureAngle: PostureAngle;
}

export interface Posture {
  postureScore: number;
  postureGrade: string;
  analysisText: string;
  detailText: string;
  postureShoulderAngleData: PostureShoulderAngleData;
}

// =========================
// 시선 분석
// =========================

export interface Point2D {
  x: number;
  y: number;
}

export interface GazeSectionData {
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  x5: number;
  x6: number;
  x7: number;
  x8: number;
  x9: number;
  pointValue: number;
  pointName: string;
}

export interface GazeInfo {
  gazeScore: number;
  pointList: Point2D[];
  pointValue: number;
  pointName: string;
  gazeGrade: string;
  section: GazeSectionData[];
}

export interface GazeData {
  geze: GazeInfo; // API 응답 그대로 유지
}

export interface Gaze {
  gazeScore: number;
  gazeGrade: string;
  analysisText: string;
  detailText: string;
  gazeData: GazeData;
}

// =========================
// 제스처 분석
// =========================

export interface GestureSection {
  pointCount: number;
  pointValue: string;
}

export interface GestureGroupData {
  groupType: string;
  handTime: number;
  handMoveCount: number;
}

export interface GestureInfo {
  gestureSectionList: GestureSection[];
  gestureScore: number;
  gestureGrade: string;
  dataList: GestureGroupData[];
}

export interface GestureData {
  gesture: GestureInfo;
}

export interface Gesture {
  gestureScore: number;
  gestureGrade: string;
  analysisText: string;
  detailText: string;
  gestureData: GestureData;
}

// =========================
// 표정 분석
// =========================

export interface EmotionData {
  topEmotionName: string;
  topEmotionPercent: number;
  negative: number;
  neutral: number;
  positive: number;
  dominantEmotion: string;
  feedBack: string;
  emotionScore: number;
  emotionGrade: string;
}

export interface Emotion {
  emotionScore: number;
  emotionGrade: string;
  analysisText: string;
  detailText: string;
  emotionData: EmotionData;
}

// =========================
// 긴장도 분석
// =========================

export interface TensionInfo {
  score: number;
  code: number;
  name: string;
}

export interface TensionRangeData {
  standard: number;
  min?: string;
  data: number[];
  subject: string;
  time: number;
  qzNum: number;
}

export interface HeartRateSummary {
  average: string;
  highest: string;
  heartRateMax: number;
  heartAvg: number;
  lowest: string;
  heartRateMin: number;
}

export interface TensionHeartRate {
  heartRateCount: number;
  tensionInfo: TensionInfo;
  tensionGrade: string;
  lowTension: TensionRangeData;
  highTension: TensionRangeData;
  heartRate: HeartRateSummary;
  heartRateCharts: ChartData10[];
  tensionSummaryText: string;
  tensionAnalysisText: string;
  tensionAnalysisDetailText: string;
  tensionScore: number;
}

export interface TensionData {
  tensionScore: number;
  tensionGrade: string;
  tensionAnalysisText: string;
  tensionAnalysisDetailText: string;
  tensionSummaryText: string;
  tebHeartRate: TensionHeartRate;
}

// =========================
// 태도 분석
// =========================

export interface DetailAttitude {
  attitudeTotalScore: number;
  attitudeTotalScoreText: string;
  attitudeFeedBack: string;
  posture: Posture;
  gaze: Gaze;
  gesture: Gesture;
  emotion: Emotion;
  tensionData: TensionData;
}

// =========================
// 이력서 분석
// =========================

export interface ExpectedQuestion {
  mainCategory: string;
  subCategory: string;
  question: string;
}

export interface MatchItem {
  category: string;
  description: string;
  detail: string;
  grade: string;
  matchRate: number;
}

export interface SupplementSuggestion {
  missingSkill: string;
  suggestion: string;
  expectedEffect: string;
  ex: string;
}

export interface ResumeAnalysis {
  expectedQuestions: ExpectedQuestion[];
  matchItems: MatchItem[];
  supplementSuggestions: SupplementSuggestion[];
  overallComment: string;
  overallDescription: string;
}

// =========================
// 실제 API 응답 구조
// =========================

export interface InterviewReportTab1 {
  overallScore: OverallScore;
  jobFitInfo: JobFitInfo;
  groupRankInfo: RankInfo;
  jobRankInfo: RankInfo;
  itemTotalScores: ItemTotalScores;
  feedback: Feedback;
  powerKeywords: PowerKeywords;
}

export interface InterviewReportTab2 {
  abilityAnalysis: AbilityAnalysis;
  detailAttitude: DetailAttitude;
  voiceAnalysis: VoiceAnalysis;
}

export interface InterviewReportTab3 {
  resumeAnalysis: ResumeAnalysis;
}

export interface InterviewReportDetailResponse {
  qzGroup: number;
  userInfo: UserInfo;
  tab1: InterviewReportTab1;
  tab2: InterviewReportTab2;
  tab3: InterviewReportTab3;
}

// =========================
// 마이 리포트
// =========================

export interface MyReportResponse {
  isSample: boolean;
  summaryCards: SummaryCards;
  myAvgScore: MyAvgScore;
  bestScore: number;
  bestScoreIndex: number;
  scoreTrend: ScoreTrendItem[];
  categoryTrend: CategoryTrendItem[];
  categorySummary: CategorySummary;
  myAvgFeedback: MyAvgFeedback;
  frequentWords: FrequentWord[];
  resumeAnalysis: ResumeAnalysis;
}

export interface SummaryCards {
  lastInterviewDate?: string;
  totalCount: number;
  avgDuration?: number;
  bestScore?: number;
  bestScoreDate?: string;
}

export interface MyAvgScore {
  avgScore: number;
  gradeText: string;
  topPercent: number;
  groupAvg: number;
  globalAvg: number;
  basicLevel: string;
  readiness: string;
}

export interface ScoreTrendItem {
  date: string;
  score: number;
}

export interface CategoryTrendItem {
  date: string;
  abilityScore: number;
  attitudeScore: number;
  voiceScore: number;
  tensionScore: number;
}

export interface CategorySummary {
  abilityAvg: number;
  attitudeAvg: number;
  voiceAvg: number;
  tensionAvg: number;
  globalAbilityAvg: number;
  globalAttitudeAvg: number;
  globalVoiceAvg: number;
  globalTensionAvg: number;
  abilityGrade: string;
  attitudeGrade: string;
  voiceGrade: string;
  tensionGrade: string;
}

export interface MyAvgFeedback {
  overallFeedback: string;
  abilityFeedback: string;
  attitudeFeedback: string;
  voiceFeedback: string;
  tensionFeedback: string;
}

export interface FrequentWord {
  rank: number;
  word: string;
  count: number;
}