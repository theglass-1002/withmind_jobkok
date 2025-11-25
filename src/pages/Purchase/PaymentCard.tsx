import type { Method } from "./PurchaseLayout";

type Props = {
  method: Method;
  active: boolean;
  onSelect: (m: Method) => void;
};

export default function PaymentCard({ method, active, onSelect }: Props) {
  return (
    <li
      className={`payment__item ${active ? "on" : ""}`}
      role="radio"
      aria-checked={active}
      tabIndex={0}
      onClick={() => onSelect(method)}
    >
      <span className="paymethod__icon" aria-hidden="true">
        <img className={method.id} src={method.icon} alt="" />
      </span>
      <span className="paymethod__label">{method.label}</span>
    </li>
  );
}
