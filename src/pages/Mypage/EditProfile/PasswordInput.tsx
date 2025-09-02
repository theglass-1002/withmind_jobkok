// PasswordInput.tsx
import { useState, useCallback } from "react";
import visibility from '@/assets/icons/visibility.png';
import error_Item from '@/assets/icons/error_Item.png';

type Tone = "error" | "success" | "help" | undefined;
type Props = {
    id?: string;
    name?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    autoComplete?: string;    // "current-password" | "new-password"
    required?: boolean;
    className?: string;       
    message?: string;
    tone?: Tone; // "error" | "success" | "help"
  };
  

  export default function PasswordInput({
    id, name, value, onChange, onBlur, placeholder,
    autoComplete,
    required,message, className 
  }: Props) {
    const [visible, setVisible] = useState(false);
    const toggle = useCallback(() => setVisible(v => !v), []);
    const hasMsg = Boolean(message);
return (
    <div className={`field__value${hasMsg?"-is-error":""}`}>
        
      <input
        id={id}
        name={name ?? id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        onKeyDown={(e)=>{if (e.code === 'Space') e.preventDefault()}}
        onBlur={onBlur}
        minLength={8}
        maxLength={16}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`field__input ${className ?? ""}`}/>
        <span className="icon_wrap">
       {hasMsg?<img 
          onClick={toggle}
          src={error_Item}
        />:<></>}
         <img
          onClick={toggle}
          src={visibility}
        />         
        </span>
 
    </div>
  );
}
