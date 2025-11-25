import ic_radio_checked_purple_20 from '@/assets/icons/size20/ic_radio_checked_purple_20.png';
import ic_radio_unchecked_gray400_20 from '@/assets/icons/size20/ic_radio_unchecked_gray400_20.png';

export type Plan = {
  id: string;
  name: string;
  price: number;
  features: string[];
};

type Props = {  
   
  plan: Plan;
  active: boolean;
  onSelect: (plan: Plan) => void;
};

export default  function PlanCard({plan, active, onSelect }: Props) {

  return (
    <li
      className={`plans__item ${active ? "on" : ""}`}
      role="radio"
      aria-checked={active}
      tabIndex={0}
      onClick={() => onSelect(plan)}
    
    >
      <div className="plans__item__title">
      <div className="plans__item__title-group">
        <span className="plans__item__title__name">{plan.name}</span>
         <img className="plans__item__icon" src={active?ic_radio_checked_purple_20:ic_radio_unchecked_gray400_20} alt="" />
        </div>
        <span className="plans__item__title__price">
          {plan.price.toLocaleString("ko-KR")}원
        </span>
      </div>
      <ul className="plans__item__desc" role="list">
        {plan.features.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
    </li>
  );
}
