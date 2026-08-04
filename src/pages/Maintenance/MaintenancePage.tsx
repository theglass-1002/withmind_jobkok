import "./MaintenancePage.css";

interface MaintenancePageProps {
  message?: string;
}

export default function MaintenancePage({ message }: MaintenancePageProps) {
  // 서버에서 받은 message만 표시 (기본 문구 제거)
  const displayMessage = message?.trim() || "";

  return (
    <div className="maintenance-page">
      <div className="maintenance-content">
        <div className="maintenance-icon">
         
        </div>

        <h1 className="maintenance-title">
          <span className="maintenance-title-highlight">서비스 점검중</span>
          <span className="maintenance-title-text">입니다</span>
        </h1>

        {displayMessage && (
          <p className="maintenance-message">{displayMessage}</p>
        )}
      </div>
    </div>
  );
}
