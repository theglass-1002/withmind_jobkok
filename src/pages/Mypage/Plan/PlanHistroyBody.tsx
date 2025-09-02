// 상태 코드: 1=사용 중, 2=사용 완료, 3=환불됨
type StatusCode = 1 | 2 | 3;

type Row = {
  no: number;
  product: string;
  amount: string;
  method: string;
  status: StatusCode;     // ← 숫자 코드로 저장
  paidAt: string;
  validity: string;
};

const STATUS_MAP: Record<StatusCode, { label: string; className: string }> = {
  1: { label: "사용 중",   className: "is-active"   },
  2: { label: "사용 완료", className: "is-done"     },
  3: { label: "환불됨",    className: "is-refunded" },
};

const rows: Row[] = [
  { no: 1, product: "7일 이용권",  amount: "9,900원",  method: "신용카드", status: 1, paidAt: "2025.00.00", validity: "2025.00.00" },
  { no: 2, product: "30일 이용권", amount: "29,900원", method: "계좌이체", status: 2, paidAt: "2025.00.00", validity: "2025.00.00" },
  { no: 3, product: "7일 이용권",  amount: "9,900원",  method: "신용카드", status: 3, paidAt: "2025.00.00", validity: "2025.00.00" },
  { no: 4, product: "14일 이용권", amount: "19,900원", method: "신용카드", status: 3, paidAt: "2025.00.00", validity: "2025.00.00" },
  { no: 5, product: "7일 이용권",  amount: "9,900원",  method: "신용카드", status: 2, paidAt: "2025.00.00", validity: "2025.00.00" },
];

export default function PlanHistoryBody() {
    return (
      <div className="plan-history__body">
        {rows.map((r) => {
          const s = STATUS_MAP[r.status];
          return (
            <div className={`plan-history__row ${s.className}`} key={r.no}>
              <span className="cell">{r.no}</span>
              <span className="cell cell--product">{r.product}</span>
              <span className="cell">{r.amount}</span>
              <span className="cell">{r.method}</span>
              <span className="cell cell--status">
              {s.label}
              </span>
  
              <span className="cell">{r.paidAt}</span>
              <span className="cell cell--validity">{r.validity}</span>
            </div>
          );
        })}
      </div>
    );
  }
  