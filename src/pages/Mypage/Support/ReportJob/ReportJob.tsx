import React from 'react'
import { useEffect ,useRef,useState} from "react";
import { useParams } from "react-router-dom"
import loud_speaker from '@/assets/icons/loud_speaker_purple.png';
import Modal from '@/shared/components/modal/Modal';

export default function ReportJob() {
const {id} = useParams<{ id:string}>();  
const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
  console.log('실행');
}, [])


return (
    <div className="inquiry">
        <header className="mypage__content-header detail">
             <h2 className="title">
                공고 제보하기</h2>
        </header> 
        <section className='create'>
        <div className='announce_field'>
        <span>
          <img src={loud_speaker} alt="" />
          </span>
        <div className='info_desc'>
        <span className='info_title'><h1>아직 등록되지 않은 공고가 있다면 알려주세요!</h1></span> 
        <span className='info_content'>잡콕은 현재 다양한 채용 공고를 자동으로 수집하고 있습니다.<br />
        아직 등록되지 않은 공고가 있다면 제보해 주세요. 확인 후 빠르게 반영하겠습니다.</span>
        </div>
        
        </div>     
        <div className='field'>
        <span className='label'>공고 링크(URL)<em>*</em></span>    
        <div className='input-group'>

        <input className='' type="text" placeholder='https://'/>
        </div>
        <span className='label'><em>공고 링크를 입력해 주세요.</em></span>    
        </div>   
        <div className='field'>
        <span className='label'>세부 내용</span>   
        <div className='content'>
        <textarea name="" id="" placeholder="메모를 입력해 주세요." >
        </textarea> 
        </div> 
        <span className='explain'>참고사항이나 간단한 설명이 있다면 자유롭게 작성해 주세요.</span> 
        </div>      
        <div className='field'>
        <span className='label'>이메일</span>    
        <div className='input-group'>
        <input className='' type="text" placeholder='이메일을 입력해 주세요.'/>
        </div>
        <span className='explain'>등록이 완료된 경우,안내 메일을 보내드립니다.</span>  
        </div>     
        <div className='info_box'>
            <ul className='info_box_items'>
                <li>
                ※ 작성하신 이메일은 외부에 공개되지 않으며, 등록 안내 목적으로만 사용됩니다.
                </li>
            </ul>
        </div>
        </section>

    <div className="btn_wrap create">
        <button className="btn default_btn_black">
            제출</button>
    </div>
    <Modal
              open={true}
              title="공고 제보가 완료되었습니다."
              desc="제보해 주신 공고는 확인 후 빠르게 반영하겠습니다. 감사합니다."
              confirmText="확인"
              showCancel = {false}
              confirmClassName="btn_w_full default_btn_black"
              onConfirm={() => {}}
              onClose={()=>{}}
            />
    </div>
  )
}
