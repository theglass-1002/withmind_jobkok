import { useState, useCallback } from "react";
import { Icons } from "@/assets/icons";

type Tone = "error" | "success" | "help" | undefined;

type Props = {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
  message?: string;
  tone?: Tone;
};

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  required,
  message,
  className,
}: Props) {
  const [visible, setVisible] = useState(false);
  const toggle = useCallback(() => setVisible((v) => !v), []);
  const hasMsg = Boolean(message);

  return (
    <div className={`field__value${hasMsg ? "-is-error" : ""}`}>
      <input
        id={id}
        name={name ?? id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.code === "Space") e.preventDefault();
        }}
        onBlur={onBlur}
        minLength={8}
        maxLength={16}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`field__input ${className ?? ""}`}
      />

      <span className="icon_wrap">
        {hasMsg ? <img src={Icons.ic_error_red100_20} alt="" /> : null}

        <img
          onClick={toggle}
          src={
            visible
              ? Icons.ic_visibility_off700_20
              : Icons.ic_visibility700_20
          }
          alt=""
        />
      </span>
    </div>
  );
}