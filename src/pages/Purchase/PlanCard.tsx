
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
        <span className="plans__item__title__name">{plan.name}</span>
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
