import { useEffect } from "react";
import { useParams } from "react-router-dom"
import arrow_back_big from '@/assets/icons/arrow_back_big.png';
import chevron_left from '@/assets/icons/chevron_left.png';
import edit from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';


export default function NoticeDetail() {
const {id} = useParams<{ id:string}>();  

useEffect(() => {
  console.log('실행');
}, [])


return (
    <>
    <div className="inquiry">
        <header className="mypage__content-header detail">
             <h2 className="title">
                <span className="icon_wrap">
                <img src={arrow_back_big} alt="" />
                </span>
               공지사항 상세</h2>
        </header> 
        <section className="mypage__content-main mypage__detail-view">
        {/* 문의 카드 */}
        <article className="card question">
            <div className="card__infos">
            <h1  className="card__title">
            모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요?
            </h1>
            <div className="card__meta">
            <span className="card__meta date">2025.00.00</span>
            </div>
            </div>
            <div className="card__content">
            모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
            모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
            모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
         모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
      
         모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
         모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
         
         모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
      
         모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
         모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
         
                  </div>
    
        </article>
      
    </section>

    <div className="inquiry-actions">
        <div className="inquiry-actions__left">
        <button className="btn default_btn_white">
        <img src={chevron_left} alt="" />목록으로</button>
        </div>
        {/* <div className="inquiry-actions__right">
        <button className="btn default_btn_white">
        <img src={edit} alt="" />
            수정</button>
        <button className="btn default_btn_white">
        <img src={deleteIcon} alt="" />
            삭제</button>
        </div> */}
    </div>
    </div>

    <div className="inquiry mobile">
        <header className="mypage__content-header detail">
             <h2 className="title">
                <span className="icon_wrap">
                <img src={arrow_back_big} alt="" />
                </span>
               공지사항 상세</h2>
        </header> 
        <section className="mypage__content-main mypage__detail-view notice__detail">
        {/* 문의 카드 */}
        <article className="card question">
            <div className="card__infos">
            <h1  className="card__title">
            [공지] 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요?
            </h1>
            <div className="card__meta">
            <span className="card__meta date">2025.00.00</span>
            </div>
            </div>
            <div className="card__content">
            모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
            모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
            모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
         모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
      
         모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
         모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
         
         모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
      
         모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
         모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 모의면접을 다시 보거나 완료된 모의면접을 삭제할 수 있나요? 
         
                  </div>
    
        </article>
      
    </section>


    </div>
    </>
  )
}
