import { useEffect } from "react";
import { useParams } from "react-router-dom"


export default function InquiryDetail() {
const {id} = useParams<{ id:string}>();  

useEffect(() => {
  console.log('실행');
}, [])


return (
    <div className="inquiry">
        <header className="mypage__content-header">
             <h2 className="title">1:1 문의 상세</h2>
        </header> 
        <section className="mypage__content-main inquiry-detail-view__main">
        {/* 문의 카드 */}
        <article className="inquiry-card question" aria-labelledby="inquiry-title">
            <span className="badge badge--answered">답변완료</span>
            <div className="inquiry-card__infos">
            <h1 id="inquiry-title" className="inquiry-card__title">
            모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요?
            </h1>
            <div className="inquiry-card__meta">
            <span className="inquiry-card__meta data">작성일: 2025.00.00</span>
            <span className="inquiry-card__meta category">유형: 오류 신고</span>
            </div>
            </div>
            <div className="inquiry-card__content scrollbox">
            내용 : 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나
            완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수
            있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? …
        </div>
       

        {/* 길면 내부 스크롤 */}
        </article>

        {/* 답변 카드 */}
        <article className="inquiry-card answer" aria-labelledby="answer-title">
        <div className="inquiry-card__meta">
            <span className="inquiry-card__meta data">작성일: 2025.00.00</span>
           
            </div>
        <div className="inquiry-card__content scrollbox">
            안녕하세요 문의하신 답변 내용입니다. …
        </div>
        </article>
    </section>

    <div className="inquiry-actions">
        <div className="inquiry-actions__left">
        <button className="btn btn--secondary">목록으로</button>
        </div>
        <div className="inquiry-actions__right">
        <button className="btn btn--ghost">수정</button>
        <button className="btn btn--danger">삭제</button>
        </div>
    </div>
    </div>
  )
}
