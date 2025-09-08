import React from 'react'
import { useEffect } from "react";
import { useParams } from "react-router-dom"
import arrow_back_big from '@/assets/icons/arrow_back_big.png';
import chevron_left from '@/assets/icons/chevron_left.png';
import edit from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';
import Select from 'react-select'


export default function InquiryEdit() {
const {id} = useParams<{ id:string}>();  

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'strawberry', label: 'Strawberry' },
  ]
 
  useEffect(() => {
  console.log('실행');
}, [])


return (
    <div className="inquiry edit">
        <header className="mypage__content-header detail">
             <h2 className="title">
                <span className="icon_wrap">
                <img src={arrow_back_big} alt="" />
                </span>
                1:1 문의 수정</h2>
        </header> 
        <section className='create'>
        <div className='select_box_wrap'>
        <span className='label'>문의 유형 <em>*</em></span>          
            <Select 
            className='select_box'
            options={options}
            classNamePrefix="select_box"
            placeholder="값끌고오기"
            menuPortalTarget={document.body}   // 포털로 띄우면 z-index 충돌 예방
            menuPosition="fixed"
            />
        </div> 
        <div className='field'>
        <span className='label'>문의 제목 <em>*</em></span>    
        <input className='' type="text" placeholder='값 끌고오기'/>
        </div>   
        <div className='field content'>
        <span className='label'>문의 내용 <em>*</em></span>    
        <textarea name="" id="" placeholder="값 끌고오기">
        </textarea>
      
        </div>        
        <div className='info_box'>
            <ul className='info_box_items'>
                <li>
                ※ 1:1 문의를 통해 고객님의 문의사항을 답변해 드립니다.
                </li>
                <li>
                ※ 고객 지원의 [자주 묻는 질문]을 이용하시면 자세한 답변을 보다 빠르게 확인하실 수 있습니다.

                </li>
                <li>
                ※ 문의하신 내용은 운영 시간을 기준으로 확인 후 답변해 드립니다.
                </li>
                <li>

                ※ 주말과 공휴일 접수 건은 답변이 다소 늦어질 수 있는 점 양해 부탁드립니다.
                </li>
            </ul>
        </div>
        </section>

    <div className="inquiry-actions">
        <div className="inquiry-actions__left">
        <button className="btn default_btn_white">
        <img src={deleteIcon} alt="" />
            삭제</button>
        </div>
        <div className="inquiry-actions__right">
        <button className="btn default_btn_white">
       
            취소</button>
        <button className="btn default_btn_black">
        
            삭제</button>
        </div>
    </div>
    </div>
  )
}
