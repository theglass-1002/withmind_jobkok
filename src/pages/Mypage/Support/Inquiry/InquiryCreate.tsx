import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrow_back_big from "@/assets/icons/arrow_back_big.png";
import SelectDropdown from "@/shared/components/select-dropdown/SelectDropdown";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import FormField from "@/shared/components/form/FormField";
import FormInput from "@/shared/components/form/FormInput";
import Modal from "@/shared/components/modal/Modal";
import { Storage } from "@/shared/utils/StorageManager";
import { useLayoutContext } from "@/app/LayoutContext";
import { Icons } from "@/assets/icons";
import { insertInquiry } from "@/api/support/support.api";

const MOBILE_BREAKPOINT = 760;

export default function InquiryCreate() {
  const navigate = useNavigate();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { actionType, resetAction } = useLayoutContext();
  const [createdInquiryIdx, setCreatedInquiryIdx] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);

  const [inquiryType, setInquiryType] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [typeError, setTypeError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

  const inquiryListPath = isMobile
    ? "/mypage/m-support/inquiry"
    : "/mypage/support/inquiry";

  const getInquiryDetailPath = (inquiryIdx: number) =>
    isMobile
      ? `/mypage/m-support/inquiry/${inquiryIdx}`
      : `/mypage/support/inquiry/${inquiryIdx}`;

  const inquiryOptions = [
    { value: "usage", label: "이용방법" },
    { value: "memberInfo", label: "회원정보" },
    { value: "payment", label: "결제" },
    { value: "etc", label: "기타" },
  ];

  const getInquiryTypeLabel = (value: string) => {
    return inquiryOptions.find((option) => option.value === value)?.label ?? "";
  };

  const startEditing = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e) {
      if (e.nativeEvent?.isComposing) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setEditing(true);
      }
    } else {
      setEditing(true);
    }
  };

  const handleCancelClick = () => {
    setCancelModalOpen(true);
  };

  useEffect(() => {
    if (inquiryType.trim() !== "") setTypeError("");
  }, [inquiryType]);

  useEffect(() => {
    if (title !== "") setTitleError("");
  }, [title]);

  useEffect(() => {
    if (content !== "") setContentError("");
  }, [content]);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    if (actionType === "INQUIRY_CREATE_CANCEL") {
      setCancelModalOpen(true);
      resetAction();
    }
  }, [actionType, resetAction]);

  const validate = () => {
    const isInquiryTypeValid = inquiryType.trim() !== "";
    const isTitleValid = title !== "";
    const isContentValid = content !== "";

    setTypeError(isInquiryTypeValid ? "" : "문의 유형을 선택해 주세요.");
    setTitleError(isTitleValid ? "" : "문의 제목을 입력해 주세요.");
    setContentError(isContentValid ? "" : "문의 내용을 입력해 주세요.");

    return isInquiryTypeValid && isTitleValid && isContentValid;
  };

  const handleSubmit = async () => {
    const ok = validate();
    if (!ok) return;

    const payload = {
      userId: Storage.getUserId(),
      inquiryType: getInquiryTypeLabel(inquiryType.trim()),
      title: title,
      content: content,
      secretYn: "N" as const,
    };

    console.log("문의 등록 요청 데이터:", payload);

    try {
      setIsLoading(true);
      const res = await insertInquiry(payload);
      console.log("문의 등록 응답:", res);

      if (res.code === 200) {
        setCreatedInquiryIdx(res.inquiryIdx);
        setOpenModal(true);
      }
    } catch (error) {
      console.error("문의 등록 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmModal = () => {
    setOpenModal(false);

    if (createdInquiryIdx) {
      navigate(getInquiryDetailPath(createdInquiryIdx));
      return;
    }

    navigate(inquiryListPath);
  };

  const handleCancelConfirm = () => {
    setCancelModalOpen(false);
    navigate(inquiryListPath);
  };

  const renderForm = () => (
    <section className="create">
      <div className="select_box_wrap">
        <SelectDropdown
          label="문의 유형"
          required
          placeholder="문의 유형을 선택해 주세요."
          options={inquiryOptions}
          value={inquiryType}
          onChange={setInquiryType}
          errorText={typeError || undefined}
          errorIconSrc={typeError ? Icons.ic_error_red100_20 : undefined}
          className="inquiry-form__type-select"
        />
      </div>

      <FormField
        label={
          <>
            문의 제목 <em>*</em>
          </>
        }
        className={`in_icon ${titleError ? "error" : ""}`}
      >
        <FormInput
          id="inquiry-title"
          required
          value={title}
          onChange={setTitle}
          invalid={Boolean(titleError)}
          errorMessage={titleError || undefined}
          rightIconSrc={titleError ? Icons.ic_error_red100_20 : undefined}
          rightIconAlt="error"
          placeholder="문의 제목을 입력해 주세요."
        />
      </FormField>

      <div className="field">
        <span className="label">
          문의 내용 <em>*</em>
        </span>

        <div
          className={`content ${contentError ? "error" : ""}`}
          onClick={!editing ? startEditing : undefined}
          onKeyDown={!editing ? startEditing : undefined}
          role="button"
          tabIndex={editing ? -1 : 0}
        >
          {editing ? (
            <textarea
              ref={ref}
              value={content}
              onChange={(e) => {
                console.log('onChange - 입력된 값:', JSON.stringify(e.target.value));
                console.log('onChange - 값 길이:', e.target.value.length);
                setContent(e.target.value);
              }}
              onKeyDown={(e) => {
                console.log('onKeyDown - 키:', e.key, 'code:', e.code);
                e.stopPropagation(); // 외부 div로 이벤트 전파 차단
              }}
              onClick={(e) => {
                e.stopPropagation(); // 외부 div로 이벤트 전파 차단
              }}
              onBeforeInput={(e) => {
                console.log('onBeforeInput - data:', e.data);
                // 스페이스 두 번 → 마침표 자동 변환 방지
                if (e.data === '.' && content.endsWith(' ')) {
                  const nativeEvent = e.nativeEvent as InputEvent;
                  if (nativeEvent.inputType === 'insertText') {
                    e.preventDefault();
                    setContent(content + ' ');
                  }
                }
              }}
              style={{ whiteSpace: 'pre' }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          ) : (
            <div className="content-info">
              <span className="header">문의 내용을 입력해 주세요.</span>
              <span className="body">
                <ul className="body_items">
                  <li className="strong">※ 1:1 문의 작성 전 확인해 주세요!</li>
                  <li>
                    <p className="strong">이용 방법:</p>
                    [자주 묻는 질문]을 통해 도움을 받아보세요. 자세한 답변을 보다 빠르게 답변을
                    확인하실 수 있어요.
                  </li>
                  <li>
                    <p className="strong">회원 정보:</p>
                    아이디/비밀번호의 경우 개인정보로 도움 안내에 제한이 있을 수 있어요. 사이트
                    내 아이디/비밀번호 찾기를 먼저 시도해 주세요.
                  </li>
                  <li>
                    <p className="strong">결제:</p>
                    결제 이용권 문의의 경우 결제 이용권의 이용권명, 결제일시, 결제자명 등의 결제
                    정보를 함께 작성해 주세요.
                  </li>
                  <li>
                    <p className="strong">기타:</p>
                    문의 시, 문의하고자 하는 서비스의 경로와 문의 내용을 상세히 작성해 주세요.
                  </li>
                </ul>
              </span>
            </div>
          )}
        </div>

        {contentError && <p className="form-error-text">{contentError}</p>}
      </div>

      <div className="info_box">
        <ul className="info_box_items">
          <li>※ 1:1 문의를 통해 고객님의 문의사항을 답변해 드립니다.</li>
          <li>
            ※ 고객 지원의 [자주 묻는 질문]을 이용하시면 자세한 답변을 보다 빠르게 확인하실 수
            있습니다.
          </li>
          <li>※ 문의하신 내용은 운영 시간을 기준으로 확인 후 답변해 드립니다.</li>
          <li>※ 주말과 공휴일 접수 건은 답변이 다소 늦어질 수 있는 점 양해 부탁드립니다.</li>
        </ul>
      </div>
    </section>
  );

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <div className="inquiry">
        <header className="mypage__content-header detail">
          <h2 className="title">
            <span className="icon_wrap back_btn_icon" onClick={handleCancelClick}>
              <img src={arrow_back_big} alt="" />
            </span>
            1:1 문의 하기
          </h2>
        </header>

        {renderForm()}

        <div className="btn_wrap create">
          <button className="btn_w_full default_btn_white" onClick={handleCancelClick}>
            취소
          </button>
          <button className="btn_w_full default_btn_black" onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>

      <div className="inquiry mobile">
        <header className="mypage__content-header detail">
          <h2 className="title">
            <span className="icon_wrap back_btn_icon" onClick={handleCancelClick}>
              <img src={arrow_back_big} alt="" />
            </span>
            1:1 문의 하기
          </h2>
        </header>

        {renderForm()}

        <div className="btn_wrap create">
          {/* <button className="btn_w_full default_btn_white" onClick={handleCancelClick}>
            취소
          </button> */}
          <button className="btn_w_full default_btn_black" onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>

      <Modal
        open={openModal}
        title="1:1 문의가 등록되었습니다."
        confirmText="확인"
        showCancel={false}
        confirmClassName="btn_w_full default_btn_black"
        onConfirm={handleConfirmModal}
      />

      <Modal
        open={cancelModalOpen}
        title="1:1 문의 작성을 취소하겠습니까?"
        confirmText="예"
        cancelText="아니요"
        showCancel
        confirmClassName="btn_w_full default_btn_black"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={handleCancelConfirm}
        onClose={() => setCancelModalOpen(false)}
      />
    </>
  );
}