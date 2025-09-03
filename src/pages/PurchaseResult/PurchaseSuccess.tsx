import { Link } from "react-router-dom";
import "./PurchaseResult.css";
import successIcon from '@/assets/icons/check_circle.png';

export default function PurchaseSuccess() {
return (<>
   
      <div className="purchase-result__container" aria-labelledby="result-title">
        <div className="purchase-result__header">
        <div className="purchase-result__icon" aria-hidden="true">
           <img src={successIcon} alt="" />
        </div>
        <div className="purchase-result__info">
        <h1 className="title">이용권 구매가 완료되었습니다. </h1>
         <p className="desc">결제일시: 2025.00.00 00:00</p>
        </div>
        </div>
        <div className="purchase-result__actions">
        <Link to="/" className="default_btn_black">메인 페이지로</Link>
         </div>
      </div>
    </>);
}