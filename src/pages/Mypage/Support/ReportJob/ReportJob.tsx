import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import loud_speaker from "@/assets/icons/loud_speaker_purple.png";
import Modal from "@/shared/components/modal/Modal";
import { insertJobReport } from "@/api/support/support.api";

export default function ReportJob() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [jobUrl, setJobUrl] = useState("");
  const [memo, setMemo] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({
    jobUrl: false,
    memo: false,
    email: false,
  });

  const validate = () => {
    const nextErrors = {
      jobUrl: !jobUrl.trim(),
      memo: !memo.trim(),
      email: !email.trim(),
    };

    setErrors(nextErrors);

    return !nextErrors.jobUrl && !nextErrors.memo && !nextErrors.email;
  };

  const handleSubmit = async () => {
    const isValid = validate();
    if (!isValid) return;

    try {
      await insertJobReport({
        userIdx: id ?? "", // 필요하면 로그인 유저값으로 변경
        jobUrl,
        memo,
        email,
      });

      setIsModalOpen(true);
    } catch (error) {
      console.error("공고 제보 실패:", error);
      alert("공고 제보에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleChangeJobUrl = (value: string) => {
    setJobUrl(value);
    if (errors.jobUrl && value.trim()) {
      setErrors((prev) => ({ ...prev, jobUrl: false }));
    }
  };

  const handleChangeMemo = (value: string) => {
    setMemo(value);
    if (errors.memo && value.trim()) {
      setErrors((prev) => ({ ...prev, memo: false }));
    }
  };

  const handleChangeEmail = (value: string) => {
    setEmail(value);
    if (errors.email && value.trim()) {
      setErrors((prev) => ({ ...prev, email: false }));
    }
  };

  return (
    <>
      <div className="inquiry report">
        <header className="mypage__content-header">
          <h2 className="title">공고 제보하기</h2>
        </header>

        <section className="create">
          <div className="announce_field">
            <span>
              <img src={loud_speaker} alt="" />
            </span>
            <div className="info_desc">
              <span className="info_title">
                <h1>아직 등록되지 않은 공고가 있다면 알려주세요!</h1>
              </span>
              <span className="info_content">
                잡콕은 현재 다양한 채용 공고를 자동으로 수집하고 있습니다.
                <br />
                아직 등록되지 않은 공고가 있다면 제보해 주세요.
              </span>
            </div>
          </div>

          <div className="field">
            <span className="label">
              공고 링크(URL)<em>*</em>
            </span>
            <div className={`input-group e ${errors.jobUrl ? "error" : ""}`}>
              <input
                type="text"
                placeholder="https://"
                value={jobUrl}
                onChange={(e) => handleChangeJobUrl(e.target.value)}
              />
            </div>
            {errors.jobUrl && (
              <span className="label">
                <em>공고 링크를 입력해 주세요.</em>
              </span>
            )}
          </div>

          <div className="field">
            <span className="label">
              세부 내용<em>*</em>
            </span>
            <div className="content">
              <textarea
                className={errors.memo ? "error" : ""}
                placeholder="메모를 입력해 주세요."
                value={memo}
                onChange={(e) => handleChangeMemo(e.target.value)}
              />
            </div>
            {errors.memo ? (
              <span className="label">
                <em>세부 내용을 입력해 주세요.</em>
              </span>
            ) : (
              <span className="explain">
                참고사항이나 간단한 설명이 있다면 자유롭게 작성해 주세요.
              </span>
            )}
          </div>

          <div className="field">
            <span className="label">
              이메일<em>*</em>
            </span>
            <div className={`input-group ${errors.email ? "error" : ""}`}>
              <input
                type="text"
                placeholder="이메일을 입력해 주세요."
                value={email}
                onChange={(e) => handleChangeEmail(e.target.value)}
              />
            </div>
            {errors.email ? (
              <span className="label">
                <em>이메일을 입력해 주세요.</em>
              </span>
            ) : (
              <span className="explain">
                등록이 완료된 경우 안내 메일을 보내드립니다.
              </span>
            )}
          </div>
        </section>

        <div className="btn_wrap create">
          <button className="default_btn_black" onClick={handleSubmit}>
            제출
          </button>
        </div>

        <Modal
          open={isModalOpen}
          title="공고 제보가 완료되었습니다."
          desc="제보해 주신 공고는 확인 후 빠르게 반영하겠습니다."
          confirmText="확인"
          showCancel={false}
          confirmClassName="btn_w_full default_btn_black"
          onConfirm={() => navigate(`/mypage`)}
        />
      </div>
      <div className="inquiry report mobile">
        <header className="mypage__content-header">
          <h2 className="title">공고 제보하기</h2>
        </header>

        <section className="create">
          <div className="announce_field">
            <span>
              <img src={loud_speaker} alt="" />
            </span>
            <div className="info_desc">
              <span className="info_title">
                <h1>아직 등록되지 않은 공고가 있다면 알려주세요!</h1>
              </span>
              <span className="info_content">
                잡콕은 현재 다양한 채용 공고를 자동으로 수집하고 있습니다.
                <br />
                아직 등록되지 않은 공고가 있다면 제보해 주세요.
              </span>
            </div>
          </div>

          <div className="field">
            <span className="label">
              공고 링크(URL)<em>*</em>
            </span>
            <div className={`input-group e ${errors.jobUrl ? "error" : ""}`}>
              <input
                type="text"
                placeholder="https://"
                value={jobUrl}
                onChange={(e) => handleChangeJobUrl(e.target.value)}
              />
            </div>
            {errors.jobUrl && (
              <span className="label">
                <em>공고 링크를 입력해 주세요.</em>
              </span>
            )}
          </div>

          <div className="field">
            <span className="label">
              세부 내용<em>*</em>
            </span>
            <div className="content">
              <textarea
                className={errors.memo ? "error" : ""}
                placeholder="메모를 입력해 주세요."
                value={memo}
                onChange={(e) => handleChangeMemo(e.target.value)}
              />
            </div>
            {errors.memo ? (
              <span className="label">
                <em>세부 내용을 입력해 주세요.</em>
              </span>
            ) : (
              <span className="explain">
                참고사항이나 간단한 설명이 있다면 자유롭게 작성해 주세요.
              </span>
            )}
          </div>

          <div className="field">
            <span className="label">
              이메일<em>*</em>
            </span>
            <div className={`input-group ${errors.email ? "error" : ""}`}>
              <input
                type="text"
                placeholder="이메일을 입력해 주세요."
                value={email}
                onChange={(e) => handleChangeEmail(e.target.value)}
              />
            </div>
            {errors.email ? (
              <span className="label">
                <em>이메일을 입력해 주세요.</em>
              </span>
            ) : (
              <span className="explain">
                등록이 완료된 경우 안내 메일을 보내드립니다.
              </span>
            )}
          </div>
        </section>

        <div className="btn_wrap create">
          <button className="default_btn_black" onClick={handleSubmit}>
            제출
          </button>
        </div>

        <Modal
          open={isModalOpen}
          title="공고 제보가 완료되었습니다."
          desc="제보해 주신 공고는 확인 후 빠르게 반영하겠습니다."
          confirmText="확인"
          showCancel={false}
          confirmClassName="btn_w_full default_btn_black"
          onConfirm={() => navigate(`/mypage`)}
        />
      </div>
    </>
  );
}