import { Link } from "react-router-dom";
import "./PurchaseResult.css";
import error_Item from '@/assets/icons/error_Item.png';

export default function PurchaseFail() {

    return (<>
   
        <div className="purchase-result__container" aria-labelledby="result-title">
          <div className="purchase-result__header">
          <div className="purchase-result__icon" aria-hidden="true">
             <img src={error_Item} alt="" />
          </div>
          <div className="purchase-result__info">
          <h1 className="title">이용권 구매가 실패했습니다. </h1>
           <p className="desc">일시: 2025.00.00 00:00</p>
          </div>
          </div>
          <div className="purchase-result__actions">
          <Link to="/" className="default_btn_black">메인 페이지로</Link>
           </div>
        </div>
      </>);
}