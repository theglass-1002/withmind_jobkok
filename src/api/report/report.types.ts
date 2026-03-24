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

// 분석결과

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
  email: string;
}

export interface VoiceTone {
  chartData: ChartData10;
  levelText: string;
  avgHz: number;
  scoreText: string;
}

export interface VoiceSpeed {
  avgSps: number;
  chartData: ChartData10;
  levelText: string;
  scoreText: string;
}

export interface VoiceAnalysis {
  voiceTotalScoreText: string;
  tone: VoiceTone;
  levelText?: string;
  voiceFeedBack: string;
  voiceTotalScore: number;
  speed: VoiceSpeed;
}

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
  dataList: GroupTypeAngleData[];
}

export interface PostureShoulderAngleData {
  shoulderMovement: ShoulderMovement;
  postureAngle: PostureAngle;
}

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
  dataList: GestureGroupData[];
}

export interface GestureData {
  gesture: GestureInfo;
}

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
  pointList: Point2D[];
  pointValue: number;
  pointName: string;
  section: GazeSectionData[];
}

export interface GazeData {
  geze: GazeInfo;
}

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
  lowTension: TensionRangeData;
  highTension: TensionRangeData;
  heartRate: HeartRateSummary;
  heartRateCharts: ChartData10[];
  tensionScore: number;
}

export interface TensionData {
  tebHeartRate: TensionHeartRate;
}

export interface EmotionData {
  negative: number;
  neutral: number;
  positive: number;
  dominantEmotion: string;
  feedBack: string;
}

export interface DetailAttitude {
  postureShoulderAngleData: PostureShoulderAngleData;
  attitudeTotalScore: number;
  gestureData: GestureData;
  attitudeFeedBack: string;
  gazeData: GazeData;
  tensionData: TensionData;
  attitudeTotalScoreText: string;
  emotionData: EmotionData;
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
}

export interface ResumeAnalysis {
  expectedQuestions: ExpectedQuestion[];
  matchItems: MatchItem[];
  supplementSuggestions: SupplementSuggestion[];
  overallComment: string;
  overallDescription: string;
}

export interface InterviewReportDetailResponse {
  userInfo: UserInfo;
  jobRankInfo: RankInfo;
  voiceAnalysis: VoiceAnalysis;
  itemTotalScores: ItemTotalScores;
  overallScore: OverallScore;
  frequentlyUsedHabitWords: string[];
  powerKeywords: PowerKeywords;
  jobFitInfo: JobFitInfo;
  detailAbility: DetailAbility;
  frequentlyUsedWords: string[];
  groupRankInfo: RankInfo;
  feedback: Feedback;
  detailAttitude: DetailAttitude;
  interviewVideo: InterviewVideoItem[];
  qzGroup: number;
  resumeAnalysis: ResumeAnalysis;
}