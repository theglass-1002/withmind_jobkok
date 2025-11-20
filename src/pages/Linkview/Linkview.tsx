import React from 'react'
import './Linkview.css'
import { Link } from "react-router-dom"; // BrowserRouter 제거!

export default function Linkview() {
  return (
    <div className='link-list-page'>
      Linkview

      {/* 목록 헤더 */}
      <div className='link-list-page__header'>
        <span className='link-list-page__header-item name'>페이지명</span>
        <span className='link-list-page__header-item address'>이동</span>
      </div>

      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>로그인</span>
        <Link to="/login" className='link-list-page__header-item address link-list-page__item-address' >
          /login 로그인
        </Link>
      </div>
      
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>회원가입</span>
        <Link to="/signup" className='link-list-page__header-item address link-list-page__item-address' >
        /signup 회원가입
        </Link>
      </div>

      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>아이디/비밀번호 찾기</span>
        <Link to="/recovery" className='link-list-page__header-item address link-list-page__item-address' >
        /recovery 아이디 비밀번호 찾기</Link>
      </div>

      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>메인</span>
        <Link to="/" className='link-list-page__header-item address link-list-page__item-address' >
        / 메인</Link>
      </div>

      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>채용공고</span>
        <Link to="/jobs" className='link-list-page__header-item address link-list-page__item-address' >
        /job 채용공고</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>공고상세</span>
        <Link to={`/jobs/${13}?title=${'위드마인드'}`} className='link-list-page__header-item address link-list-page__item-address' >
        /job/:공고id</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>이력서</span>
        <Link to="/resumes" className='link-list-page__header-item address link-list-page__item-address' >
        /resumes이력서</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>이력서 작성</span>
        <Link to="/resumes/create" className='link-list-page__header-item address link-list-page__item-address' >
        /resumes/create이력서작성</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>이력서 화면</span>
        <Link to="/resumes/11" className='link-list-page__header-item address link-list-page__item-address' >
        /resumes/:이력서id 이력서화면</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>이력서 화면</span>
        <Link to="/resumes/11/edit" className='link-list-page__header-item address link-list-page__item-address' >
        /resumes/:이력서id/edit 이력서 수정</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>-my리포트 화면</span>
        <Link to="/mock-interview-report" className='link-list-page__header-item address link-list-page__item-address' >
        /mock-interview-report 모의면접-my리포트</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>종합분석 화면</span>
        <Link to="/mock-interview/analysis/10" className='link-list-page__header-item address link-list-page__item-address' >
        /mock-interview-report/analysis/:id 종합분석</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>모의면접 화면</span>
        <Link to="/mock-interview/guide" className='link-list-page__header-item address link-list-page__item-address' >
        /mock-interview/guide 모의면접</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>모의면접 / 안내사항 - 01</span>
        <Link to="/mock-interview/instructions" className='link-list-page__header-item address link-list-page__item-address' >
        /mock-interview/instructions 모의면접 / 안내사항 - 01</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>모의면접 / 설정</span>
        <Link to="/mock-interview/settings" className='link-list-page__header-item address link-list-page__item-address' >
        /mock-interview/settings 모의면접 / 설정</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>모의면접 / 면접 진행 / 생각시간-완료()/</span>
        <Link to="/mock-interview/mock-interview-live" className='link-list-page__header-item address link-list-page__item-address' >
        /mock-interview/mock-interview-live 모의면접 / 설정</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>마이페이지</span>
        <Link to="/mypage" className='link-list-page__header-item address link-list-page__item-address' >
        /mypage 마이페이지</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>저장한 공고</span>
        <Link to="/saved-jobs" className='link-list-page__header-item address link-list-page__item-address' >
        /saved-jobs 저장한 공고</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>회원 정보 수정</span>
        <Link to="/mypage/edit-profile" className='link-list-page__header-item address link-list-page__item-address' >
        /mypage/edit-profile회원 정보 수정</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>이용권 내역</span>
        <Link to="/mypage/plan/history" className='link-list-page__header-item address link-list-page__item-address' >
        /mypage/plan/history 이용권 내역</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>자주묻는질문</span>
        <Link to="/mypage/support/faq" className='link-list-page__header-item address link-list-page__item-address' >
        /mypage/support/faq 자주묻는질문</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>1:1 문의</span>
        <Link to="/mypage/support/inquiry" className='link-list-page__header-item address link-list-page__item-address' >
        /mypage/support/inquiry 1:1 문의</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>1:1 문의 문의하기</span>
        <Link to="/mypage/support/inquiry/create" className='link-list-page__header-item address link-list-page__item-address' >
        /mypage/support/inquiry/create 문의하기</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>1:1 문의 문의하기</span>
        <Link to="/mypage/support/inquiry/12" className='link-list-page__header-item address link-list-page__item-address' >
        /mypage/support/inquiry/id 문의하기 상세</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>1:1 문의 문의하기 수정</span>
        <Link to="/mypage/support/inquiry/edit" className='link-list-page__header-item address link-list-page__item-address' >
        /mypage/support/inquiry/edit 문의하기 수정</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>공지사항</span>
        <Link to="/mypage/support/inquiry/edit" className='link-list-page__header-item address link-list-page__item-address' >
        /mypage/support/notices 공지사항</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>공지사항상세</span>
        <Link to="/mypage/support/notices/1" className='link-list-page__header-item address link-list-page__item-address' >
        /mypage/support/notices/id 공지사항화면</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>공고제보하기</span>
        <Link to="/mypage/support/report-job" className='link-list-page__header-item address link-list-page__item-address' >
        /mypage/support/report-job 공고제보하기</Link>
      </div>

      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>기업페이지로그인</span>
        <Link to="/company/login" className='link-list-page__header-item address link-list-page__item-address' >
        /company/login 기업페이지로그인</Link>
      </div>
      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>기업페이지회원가입</span>
        <Link to="/company/signup" className='link-list-page__header-item address link-list-page__item-address' >
        /company/signup 기업페이지회원가입</Link>
      </div>

      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>기업페이지</span>
        <Link to="/company" className='link-list-page__header-item address link-list-page__item-address' >
        /company 기업페이지</Link>
      </div>

      <div className='link-list-page__header link-list-page__item'>
        <span className='link-list-page__header-item name link-list-page__item-name'>
            기업페이지</span>
        <Link to="/company/ai-matching/report" className='link-list-page__header-item address link-list-page__item-address' >
        /company/ai-matching/report AI 인재 매칭
        AI 리포트 </Link>
      </div>
    </div>
  )
}