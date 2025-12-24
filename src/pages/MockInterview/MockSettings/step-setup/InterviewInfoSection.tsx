import React, { useEffect, useMemo, useRef, useState } from "react";
import FormField from "@/shared/components/form/FormField";
import FormInput from "@/shared/components/form/FormInput";
import SelectDropdown from "@/shared/components/select-dropdown/SelectDropdown";

import ic_error_red_20 from "@/assets/icons/size20/ic_error_red100_20.png";
import { toast } from "react-toastify";

import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { fetchResumeList } from "@/api/resume/resume.api";
import { logout } from "@/api/auth/auth.api";
import { useNavigate } from "react-router-dom";

type InterviewInfoSectionProps = {
  selectedResume: string;
  onResumeChange: (value: string) => void;

  desiredJob: string;
  onDesiredJobChange: (value: string) => void;

  jobPostingUrl: string;
  onJobPostingUrlChange: (value: string) => void;

  showErrors?: boolean;
  errors?: {
    selectedResume?: string;
    desiredJob?: string;
    jobPostingUrl?: string;
  };
};

type ResumeOption = { value: string; label: string };

export default function InterviewInfoSection({
  selectedResume,
  onResumeChange,
  desiredJob,
  onDesiredJobChange,
  jobPostingUrl,
  onJobPostingUrlChange,
  showErrors = false,
  errors = {},
}: InterviewInfoSectionProps) {
  const navigate = useNavigate();

  const resumeError = showErrors ? errors.selectedResume : undefined;
  const desiredJobError = showErrors ? errors.desiredJob : undefined;
  const urlError = showErrors ? errors.jobPostingUrl : undefined;

  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const size = 10;

  const [totalCount, setTotalCount] = useState(0);
  const [resumeOptions, setResumeOptions] = useState<ResumeOption[]>([]);

  const didFetchRef = useRef(false);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / size));
  }, [totalCount]);

  const loadResumes = async (nextPage: number) => {
    try {
      setIsLoading(true);

      const result = await fetchResumeList(nextPage, size, "DONE");


      const nextResumeOptions: ResumeOption[] = (result.list || [])
        .map((r: any) => ({
          value: String(r.resumeIdx ?? r.id ?? r.resumeId ?? ""),
          label: String(r.title ?? "제목 없는 이력서"),
        }))
        .filter((opt) => opt.value);

      setResumeOptions(nextResumeOptions);
      setTotalCount(typeof result.totalCount === "number" ? result.totalCount : 0);
      setPage(nextPage);
    } catch (e: any) {
      console.error("fetchResumeList error:", e);

      if (e?.code === 999) {
        logout();
        navigate("/login");
        return;
      }

      toast.error("이력서 목록을 불러오는 데 실패했습니다.", {
        toastId: "resume-list-error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    loadResumes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResumeSelect = (value: string) => {
    console.log("자식(InterviewInfoSection)에서 선택한 값:", value);

    const selected = resumeOptions.find((opt) => opt.value === value);


    onResumeChange(value);
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} text="영상을 분석하고 있습니다..." isLogo={true}  />

      <div className="mock-settings__section">
        <div className="mock-settings__section-header">
          <span className="mock-settings__section-title">
            모의면접 정보 설정 <em className="badge--required_20">*</em>
          </span>
          <p className="mock-settings__section-description">
            설정한 정보를 기반으로 AI가 맞춤형 면접 질문을 자동 생성합니다.
          </p>
        </div>

        <div className="mock-settings__section-body">
          <SelectDropdown
            label="이력서"
            required
            placeholder="이력서를 선택해 주세요."
            options={resumeOptions}
            value={selectedResume}
            onChange={handleResumeSelect}
            className="mock-settings__field"
            errorIconSrc={resumeError ? ic_error_red_20 : undefined}
          />

          <FormField
            label={
              <>
                희망 직무 <em>*</em>
              </>
            }
            className={`in_icon ${desiredJobError ? "error" : ""}`}
          >
            <FormInput
              id="mock-settings__field_desiredJob"
              required
              value={desiredJob}
              onChange={onDesiredJobChange}
              invalid={!!desiredJobError}
              placeholder="희망 직무를 입력해 주세요."
            />
          </FormField>

          <FormField
            label={
              <>
                채용 공고 링크(URL) <em>*</em>
              </>
            }
            className={`in_icon ${urlError ? "error" : ""}`}
          >
            <FormInput
              id="mock-settings__field_jobPostingUrl"
              required
              value={jobPostingUrl}
              onChange={onJobPostingUrlChange}
              invalid={!!urlError}
              placeholder="https://"
            />
            <span className="mock-settings__field-hint">
              지원하려는 공고의 URL을 입력하시면, 해당 공고에 맞춘 질문을 구성해 드립니다.
            </span>
          </FormField>
        </div>
      </div>
    </>
  );
}
