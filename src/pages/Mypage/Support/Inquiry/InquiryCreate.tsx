import React from 'react'
import { useEffect ,useRef,useState} from "react";
import { useParams } from "react-router-dom"
import arrow_back_big from '@/assets/icons/arrow_back_big.png';
import chevron_left from '@/assets/icons/chevron_left.png';
import edit from '@/assets/icons/edit.png';
import deleteIcon from '@/assets/icons/delete.png';

import SelectDropdown from "@/shared/components/select-dropdown/SelectDropdown";


export default function InquiryCreate() {
const {id} = useParams<{ id:string}>();  
const ref = useRef<HTMLTextAreaElement>(null);
const [editing, setEditing] = useState(false);
const [inquiryType, setInquiryType] = useState<string>(''); //  문의 유형 상태 추가 및 초기화

const startEditing = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e) {
      if (e.nativeEvent?.isComposing) return;
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
    }
    setEditing(true);
  };

  const inquiryOptions = [
    { value: 'usage', label: '이용방법' },
    { value: 'memberInfo', label: '회원정보' },
    { value: 'payment', label: '결제' },
    { value: 'etc', label: '기타' },
];
 
  useEffect(() => {
  console.log('실행');
}, [])


return (
    console.log(editing),
    <div className="inquiry">
        <header className="mypage__content-header detail">
             <h2 className="title">
                <span className="icon_wrap">
                <img src={arrow_back_big} alt="" />
                </span>1:1 문의 하기</h2>
        </header> 
        <section className='create'>
        <div className='select_box_wrap'>    
        <SelectDropdown
          label="문의 유형" 
                    required
                    placeholder="문의 유형을 선택해 주세요."
                    options={inquiryOptions} //                         
                    value={inquiryType} // 
                    onChange={setInquiryType} // 
                    className="inquiry-form__type-select"
          />    
        </div> 
        <div className='field inquiry_title'>
        <span className='label'>문의 제목 <em>*</em></span>    
         <input className='' type="text" placeholder='문의 제목을 입력해 주세요.'/>
        </div>   
        <div className='field'>
        <span className='label'>문의 내용 <em>*</em></span>   
        <div className='content' onClick={startEditing} onKeyDown={startEditing}>
       {editing? (<textarea></textarea>):(<div className='content-info'>
        <span className='header'>문의 내용을 입력해 주세요.
        </span>
        <span className='body'>
            <ul className='body_items'>
                <li className='strong'>
                ※ 1:1 문의 작성 전 확인해 주세요!
                </li>
                <li><p className='strong'>이용 방법:</p>
                [자주 묻는 질문]을 통해 도움을 받아보세요. 자세한 답변을 보다 빠르게 답변을 확인하실 수 있어요.
                </li>

                <li>
                회원 정보: 아이디/비밀번호의 경우 개인정보로 도움 안내에 제한이 있을 수 있어요. 사이트 내 아이디/비밀번호 찾기를 먼저
                </li>
                <li>
                결제: 결제 이용권 문의의 경우 결제 이용권의 이용권명, 결제일시, 결제자명 등의 결제 정보를 함께 작성해 주세요.
                </li>
                <li>
                기타: 문의 시, 문의하고자 하는 서비스의 경로와 문의 내용을 상세히 작성해 주세요.     </li>
            </ul>
        </span>
        </div>)}  
       
        {/* <textarea name="" id="" placeholder="" >
        </textarea>  */}
        </div> 
     
      
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

    <div className="btn_wrap create">
    <button className="btn_w_full default_btn_white">
        취소</button>
        <button className="btn_w_full default_btn_black">
            등록</button>
    </div>
    </div>
  )
}
