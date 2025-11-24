import { useState } from "react";
import PasswordInput from "./PasswordInput";
import * as util from "@/shared/utils/util";
import { data } from "react-router-dom";




type Form = { current: string; next: string; confirm: string };
type Errors = Partial<Record<keyof Form, string>>;

type PasswordTabProps = {
  onCancel: () => void;
 };


export default function PasswordTab({onCancel}:PasswordTabProps) {
  const [form, setForm] = useState<Form>({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);


  const onChange = (key: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.replace(/\s/g, "");
      setForm((f) => ({ ...f, [key]: v }));
    };
    
    const validate = (f: Form) => {
      const current = util.stripAllWhitespace(f.current.trim());
      const next    = util.stripAllWhitespace(f.next.trim());
      const confirm = util.stripAllWhitespace(f.confirm.trim());
      const errs: Errors = {};
      if (!current) errs.current = "비밀번호를 입력해 주세요.";
      if (!next)    errs.next    = "비밀번호를 입력해 주세요.";
      if (!confirm) errs.confirm = "비밀번호를 입력해 주세요.";
    
      if (!errs.next && !util.isValidPassword(next)) {
        errs.next = "입력한 비밀번호를 확인해 주세요.";
      }  if (!errs.confirm && !util.isValidPassword(confirm)) {
        errs.confirm = "입력한 비밀번호를 확인해 주세요.";
      }
      
      if (!errs.confirm && next !== confirm) {
        errs.next = "비밀번호가 일치하지 않습니다.";
        errs.confirm = "비밀번호가 일치하지 않습니다.";
      }
     
      return { data: { current, next, confirm }, errs };
    };

    const handleSave = async () => {
       console.log('비밀번호 변경 api 통신');
      setSubmitted(true);
      setNotice(null);
      const { data, errs } = validate(form);
      setErrors(errs);
      
    };

    return (
           <>
             <div className="account-main password-tab">
             <div className="field">
                <span className="field__label">현재 비밀번호 <em>*</em></span>
                <PasswordInput
                id="pw-current"
                value={form.current}
                onChange={onChange("current")}
                placeholder="현재 비밀번호를 입력해 주세요."
                message={errors.current}
              
                autoComplete="current-password"
                required
                />
               <span className="field__label"><em> {errors.current}</em></span>
                <span className="field__label">새 비밀번호 <em>*</em></span>
                <PasswordInput
                id="pw-new"
                value={form.next}                 
                onChange={onChange("next")}
                placeholder="새 비밀번호를 입력해 주세요."
                message={errors.next}
                autoComplete="new-password"
                required/>
                 <span className="field__label"><em> {errors.next}</em></span>
                <span className="field__label">새 비밀번호 확인 <em>*</em></span>
                <PasswordInput
                id="pw-confirm"
                value={form.confirm}
                onChange={onChange("confirm")}
                message={errors.confirm}
                placeholder="새 비밀번호를 다시 입력해 주세요."
                autoComplete="new-password"
                required
                />
              <span className="field__label"><em> {errors.confirm}</em></span>
            </div>
            <div>
            <div className="field">
            <div className="field__value_gray hint">
                  <span>※ 비밀번호는 영문, 숫자, 특수문자를 모두 포함한 8~16자로 입력해 주세요.</span>
                </div>
              </div>
              <div className="field form-action-group">
              <div className="btn_wrap">
                  <button className="default_btn_white btn-cancel" onClick={onCancel}>취소</button>
                  <button className="default_btn_black"  onClick={handleSave}>저장</button>
                  </div>
              </div>
              </div>
            </div>
            
            </>
    );
  }