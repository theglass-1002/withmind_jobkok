import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { API_BASE_URL } from "@/config/config";
import ComingSoon from "@/pages/ComingSoon/ComingSoon";

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "ok" | "maintenance">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/dev/maintenance/status`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json();
      })
      .then((data) => {
        if (data.blocked) {
          setMessage(data.message || "서비스 점검 중입니다.");
          setStatus("maintenance");
        } else {
          setStatus("ok");
        }
      })
      .catch(() => {
        fetch(`${API_BASE_URL}/version`, { method: "GET" })
          .then((res) => {
            if (res.status === 503) {
              setMessage("서비스 점검 중입니다. 잠시 후 다시 이용해 주세요.");
              setStatus("maintenance");
            } else {
              setStatus("ok");
            }
          })
          .catch(() => setStatus("ok"));
      });
  }, []);

  if (status === "loading") return null;
  if (status === "maintenance") {
    return (
      <BrowserRouter>
        <ComingSoon message={message} />
      </BrowserRouter>
    );
  }
  return <>{children}</>;
}
