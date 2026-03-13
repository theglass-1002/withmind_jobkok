import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import arrow_back_big from "@/assets/icons/arrow_back_big.png";
import deleteIcon from "@/assets/icons/delete.png";
import SelectDropdown from "@/shared/components/select-dropdown/SelectDropdown";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { fetchInquiryDetail } from "@/api/support/support.api";
import { toast } from "react-toastify";

export default function InquiryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [inquiryType, setInquiryType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const inquiryOptions = [
    { value: "usage", label: "이용방법" },
    { value: "memberInfo", label: "회원정보" },
    { value: "payment", label: "결제" },
    { value: "etc", label: "기타" },
  ];

  const getInquiryTypeValue = (label: string) => {
    return inquiryOptions.find((option) => option.label === label)?.value ?? "";
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
      } catch (error) {
        console.error("문의 수정 정보 조회 실패:", error);
        toast.error("문의 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  const handleBack = () => {
    navigate(`/mypage/support/inquiry/${id}`);
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <div className="inquiry edit">
        <header className="mypage__content-header detail">
          <h2 className="title">
            <span className="icon_wrap back_btn_icon" onClick={handleBack}>
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
          <div className="inquiry-actions__left">
            <button className="btn default_btn_white">
              <img src={deleteIcon} alt="" />
              삭제
            </button>
          </div>

          <div className="inquiry-actions__right">
            <button className="default_btn_white" onClick={handleBack}>
              취소
            </button>
            <button className="default_btn_black">저장</button>
          </div>
        </div>
      </div>
    </>
  );
}