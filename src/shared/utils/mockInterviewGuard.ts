import { fetchResumeList } from "@/api/resume/resume.api";

/**
 * 모의면접 진행을 위한 이력서 체크
 * @returns {Promise<boolean>} 유효한 이력서가 있으면 true, 없으면 false
 */
export async function checkValidResume(): Promise<boolean> {
  try {
    const { list } = await fetchResumeList(1, 100);
    const validResumes = list.filter(r => r.temp === 'N');
    return validResumes.length > 0;
  } catch (e) {
    console.error("❌ 이력서 체크 실패:", e);
    return false;
  }
}

/**
 * 모의면접 페이지 진입 가드 (직접 URL 접근 차단용)
 * 이력서가 없으면 모달을 띄우고 false 반환
 * @param setModalOpen 모달 상태 setter
 * @returns {Promise<boolean>} 진입 가능 여부
 */
export async function guardMockInterviewPage(
  setModalOpen: (open: boolean) => void
): Promise<boolean> {
  const hasValidResume = await checkValidResume();

  if (!hasValidResume) {
    console.log("❌ 유효한 이력서 없음 - 진입 차단");
    setModalOpen(true);
    return false;
  }

  console.log("✅ 유효한 이력서 있음 - 진입 허용");
  return true;
}

/**
 * 모의면접 리포트 페이지용 가드 (이력서 작성 유도)
 * 이력서가 없으면 "이력서 작성" 모달 표시
 */
export async function guardMockInterviewStart(
  setModalOpen: (open: boolean) => void
): Promise<boolean> {
  return await guardMockInterviewPage(setModalOpen);
}
