// src/shared/components/Modal/Modal.tsx
import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./modal.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;

  // 헤더
  title?: React.ReactNode;      // 없으면 헤더 생략
  desc?: React.ReactNode;

  // 바디 (원하면 본문에 컴포넌트 넣기)
  children?: React.ReactNode;

  // 액션(기본 버튼을 쓰지 않고 완전 커스텀하려면 actions 사용)
  actions?: React.ReactNode;

  // 기본 버튼 설정(기본 액션을 쓸 때)
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;         // 취소 버튼 숨기기 가능
  confirmClassName?: string;    // 색/스타일 커스텀
  cancelClassName?: string;

  // 접근성
  ariaLabel?: string;

  // 오버레이 클릭시 닫기
  closeOnOverlay?: boolean;
};

export default function Modal({
  open,
  onClose,
  title,
  desc,
  children,
  actions,
  onConfirm,
  confirmText = "확인",
  cancelText = "취소",
  showCancel = true,
  confirmClassName = "btn btn--primary",
  cancelClassName = "btn btn--secondary",
  ariaLabel,
  closeOnOverlay = true,
}: ModalProps) {

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  

  if (!open) return null;

  // 오버레이 클릭 핸들러
  const onOverlayClick = () => { if (closeOnOverlay) onClose(); };
  // 패널 클릭은 전파 막기
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={title ? "modal-title" : undefined}
      onClick={onOverlayClick}
    >
      <div className="modal" role="document" onClick={stop}>
        {/* Header */}
        {(title || desc) && (
          <header className="modal__header">
            {title && <h3 id="modal-title" className="modal__title">{title}</h3>}
            {desc && <p className="modal__desc">{desc}</p>}
          </header>
        )}

        {/* Body */}
        {children && <div className="modal__body">{children}</div>}

        {/* Actions: 커스텀 우선, 없으면 기본 버튼 */}
        <div className="modal__actions">
          {actions ? (
            actions
          ) : (
            <>
              {showCancel && (
                <button type="button" className={cancelClassName} onClick={onClose}>
                  {cancelText}
                </button>
              )}
              <button
                type="button"
                className={confirmClassName}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
