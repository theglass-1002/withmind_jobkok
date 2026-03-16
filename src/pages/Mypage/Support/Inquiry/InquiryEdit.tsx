import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import arrow_back_big from "@/assets/icons/arrow_back_big.png";
import { Icons } from "@/assets/icons";

import SelectDropdown from "@/shared/components/select-dropdown/SelectDropdown";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import Modal from "@/shared/components/modal/Modal";
import { useLayoutContext } from "@/app/LayoutContext";
import { deleteInquiry, fetchInquiryDetail, updateInquiry } from "@/api/support/support.api";


const MOBILE_BREAKPOINT = 760;

export default function InquiryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { actionType, resetAction } = useLayoutContext();
  const [isLoading, setIsLoading] = useState(false);

  const [inquiryType, setInquiryType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [secretYn, setSecretYn] = useState<"Y" | "N">("N");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteCompleteOpen, setIsDeleteCompleteOpen] = useState(false);
  const [saveCompleteModalOpen, setSaveCompleteModalOpen] = useState(false);
  const [cancelConfirmModalOpen, setCancelConfirmModalOpen] = useState(false);

  const inquiryOptions = [
    { value: "usage", label: "이용방법" },
    { value: "memberInfo", label: "회원정보" },
    { value: "payment", label: "결제" },
    { value: "etc", label: "기타" },
  ];

  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const inquiryListPath = isMobile
  ? "/mypage/m-support/inquiry"
  : "/mypage/support/inquiry";

const getInquiryDetailPath = (inquiryId: number | string) =>
  isMobile
    ? `/mypage/m-support/inquiry/${inquiryId}`
    : `/mypage/support/inquiry/${inquiryId}`;
    

  const getInquiryTypeValue = (label: string) => {
    return inquiryOptions.find((option) => option.label === label)?.value ?? "";
  };

  const getInquiryTypeLabel = (value: string) => {
    return inquiryOptions.find((option) => option.value === value)?.label ?? "";
  };

  useEffect(() => {
    if (!id) return;

    const loadDetail = async () => {
      try {
        setIsLoading(true);

        const res = await fetchInquiryDetail(Number(id));
        const data = res.data;

        setInquiryType(getInquiryTypeValue(data.inquiryType));
        setTitle(data.title ?? "");
        setContent(data.content ?? "");
        setSecretYn(data.secretYn ?? "N");
      } catch (error) {
        console.error("문의 수정 정보 조회 실패:", error);
        toast.error("문의 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  useEffect(() => {
    console.log('뒤로가기');
    if (actionType === "INQUIRY_CREATE_CANCEL") {
      openCancelConfirmModal();
      resetAction();
    }
  }, [actionType, resetAction]);

  const openCancelConfirmModal = () => {
    setCancelConfirmModalOpen(true);
  };

  const closeCancelConfirmModal = () => {
    setCancelConfirmModalOpen(false);
  };

  const handleCancelEditConfirm = () => {
    setCancelConfirmModalOpen(false);
    navigate(inquiryListPath);
  };

  const handleSaveCompleteConfirm = () => {
    setSaveCompleteModalOpen(false);
    navigate(getInquiryDetailPath(id));
    // navigate(`/mypage/support/inquiry/${id}`);
  };

  const handleSaveInquiry = async () => {
    if (!id) {
      toast.error("잘못된 접근입니다.");
      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("사용자 정보가 없습니다.");
      return;
    }

    if (!inquiryType) {
      toast.error("문의 유형을 선택해 주세요.");
      return;
    }

    if (!title.trim()) {
      toast.error("문의 제목을 입력해 주세요.");
      return;
    }

    if (!content.trim()) {
      toast.error("문의 내용을 입력해 주세요.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await updateInquiry({
        userId,
        inquiryIdx: Number(id),
        inquiryType: getInquiryTypeLabel(inquiryType),
        title: title.trim(),
        content: content.trim(),
        secretYn,
      });
      
      if (res.code === 200) {
        setSaveCompleteModalOpen(true);
      } else {
        toast.error(res.msg || "문의 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("문의 수정 실패:", error);
      toast.error("문의 수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInquiry = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;

    try {
      setIsDeleteConfirmOpen(false);
      setIsLoading(true);

      const res = await deleteInquiry(Number(id));
      console.log("문의 삭제 응답:", res);

      if (res.code === 200) {
        setIsDeleteCompleteOpen(true);
      }
    } catch (error) {
      console.error("문의 삭제 실패:", error);
      toast.error("문의 삭제에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCompleteConfirm = () => {
    setIsDeleteCompleteOpen(false);
    navigate(inquiryListPath);
    //  navigate("/mypage/support/inquiry");
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <div className="inquiry edit">
        <header className="mypage__content-header detail">
          <h2 className="title">
            <span className="icon_wrap back_btn_icon" onClick={openCancelConfirmModal}>
              <img src={arrow_back_big} alt="" />
            </span>
            1:1 문의 수정
          </h2>
        </header>

        <section className="create">
          <div className="select_box_wrap">
            <SelectDropdown
              label="문의 유형"
              required
              placeholder="문의 유형을 선택해 주세요."
              options={inquiryOptions}
              value={inquiryType}
              onChange={setInquiryType}
              className="inquiry-form__type-select"
            />
          </div>

          <div className="field inquiry_title">
            <span className="label">
              문의 제목 <em>*</em>
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문의 제목을 입력해 주세요."
            />
          </div>

          <div className="field content">
            <span className="label">
              문의 내용 <em>*</em>
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="문의 내용을 입력해 주세요."
            />
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

        <div className="inquiry-actions">
          <button className="default_btn_white" onClick={handleDeleteInquiry}>
            <img src={Icons.ic_delete_gray900_20} alt="" />
            삭제
          </button>

          <div className="inquiry-actions__right">
            <button className="default_btn_white" onClick={openCancelConfirmModal}>
              취소
            </button>
            <button className="default_btn_black" onClick={handleSaveInquiry}>
              저장
            </button>
          </div>
        </div>
      </div>

      <div className="inquiry edit mobile">
        <header className="mypage__content-header detail">
          <h2 className="title">
            <span className="icon_wrap back_btn_icon" onClick={openCancelConfirmModal}>
              <img src={arrow_back_big} alt="" />
            </span>
            1:1 문의 수정
          </h2>
        </header>

        <section className="create">
          <div className="select_box_wrap">
            <SelectDropdown
              label="문의 유형"
              required
              placeholder="문의 유형을 선택해 주세요."
              options={inquiryOptions}
              value={inquiryType}
              onChange={setInquiryType}
              className="inquiry-form__type-select"
            />
          </div>

          <div className="field inquiry_title">
            <span className="label">
              문의 제목 <em>*</em>
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문의 제목을 입력해 주세요."
            />
          </div>

          <div className="field content">
            <span className="label">
              문의 내용 <em>*</em>
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="문의 내용을 입력해 주세요."
            />
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

        <div className="inquiry-actions">
          <button className="default_btn_white delete" onClick={handleDeleteInquiry}>
            <img src={Icons.ic_delete_gray900_20} alt="" />
            삭제
          </button>
          <button className="default_btn_black save" onClick={handleSaveInquiry}>
              저장
            </button>
         </div>
      </div>

      <Modal
        open={isDeleteConfirmOpen}
        title="1:1 문의 내역을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        showCancel
        confirmClassName="btn_w_full default_btn_red"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteConfirmOpen(false)}
      />

    <Modal
        open={isDeleteCompleteOpen}
        title="1:1 문의가 삭제되었습니다."
        confirmText="확인"
        showCancel={false}
        confirmClassName="btn_w_full default_btn_black"
        onConfirm={handleDeleteCompleteConfirm}
      />
      <Modal
        open={saveCompleteModalOpen}
        title="수정사항이 저장되었습니다."
        confirmText="확인"
        showCancel={false}
        confirmClassName="btn_w_full default_btn_black"
        onConfirm={handleSaveCompleteConfirm}
      />

      <Modal
        open={cancelConfirmModalOpen}
        title="1:1 문의 수정을 취소하시겠습니까?"
        confirmText="예"
        cancelText="아니요"
        showCancel
        confirmClassName="btn_w_full default_btn_black"
        cancelClassName="btn_w_full default_btn_white"
        onConfirm={handleCancelEditConfirm}
        onClose={closeCancelConfirmModal}
      />
    </>
  );
}