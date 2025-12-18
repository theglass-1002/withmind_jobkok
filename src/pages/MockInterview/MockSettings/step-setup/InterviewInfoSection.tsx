import React from "react";
import FormField from "@/shared/components/form/FormField";
import FormInput from "@/shared/components/form/FormInput";
import SelectDropdown from "@/shared/components/select-dropdown/SelectDropdown";

import ic_error_red_20 from "@/assets/icons/size20/ic_error_red100_20.png";

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
  const resumeError = showErrors ? errors.selectedResume : undefined;
  const desiredJobError = showErrors ? errors.desiredJob : undefined;
  const urlError = showErrors ? errors.jobPostingUrl : undefined;

  return (
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
          options={[
            { value: "1", label: "기획자 이력서" },
            { value: "2", label: "웹 기획자 이력서" },
          ]}
          value={selectedResume}
          onChange={onResumeChange}
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
  );
}
