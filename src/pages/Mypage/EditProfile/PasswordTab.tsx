import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordInput from "./PasswordInput";
import * as util from "@/shared/utils/util";
import LoadingOverlay from "@/shared/components/loading/LoadingOverlay";
import { changePassword, logout, updateUser } from "@/api/auth/auth.api";

type Form = {
  current: string;
  next: string;
  confirm: string;
};

type Errors = Partial<Record<keyof Form, string>>;

type PasswordTabProps = {
  onCancel: () => void;
};

export default function PasswordTab({ onCancel }: PasswordTabProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({
    current: "",
    next: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);


  const onChange =
    (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\s/g, "");
      setForm((prev) => ({ ...prev, [key]: value }));

      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }

      if (notice) {
        setNotice(null);
      }
    };

  const validate = (f: Form) => {
    const current = util.stripAllWhitespace(f.current.trim());
    const next = util.stripAllWhitespace(f.next.trim());
    const confirm = util.stripAllWhitespace(f.confirm.trim());
    const errs: Errors = {};

    console.log("=== 비밀번호 검증 시작 ===");
    console.log("현재 비밀번호:", current);
    console.log("새 비밀번호:", next);
    console.log("새 비밀번호 확인:", confirm);

    if (!current) errs.current = "비밀번호를 입력해 주세요.";
    if (!next) errs.next = "비밀번호를 입력해 주세요.";
    if (!confirm) errs.confirm = "비밀번호를 입력해 주세요.";

    if (!errs.next && !util.isValidPassword(next)) {
      console.log("❌ 새 비밀번호가 유효하지 않음");
      console.log("새 비밀번호 길이:", next.length);
      console.log("isValidPassword(next) 결과:", util.isValidPassword(next));
      errs.next = "입력한 비밀번호를 확인해 주세요.";
    } else if (!errs.next) {
      console.log("✅ 새 비밀번호 유효성 검사 통과");
    }

    if (!errs.confirm && !util.isValidPassword(confirm)) {
      console.log("❌ 새 비밀번호 확인이 유효하지 않음");
      console.log("새 비밀번호 확인 길이:", confirm.length);
      console.log("isValidPassword(confirm) 결과:", util.isValidPassword(confirm));
      errs.confirm = "입력한 비밀번호를 확인해 주세요.";
    } else if (!errs.confirm) {
      console.log("✅ 새 비밀번호 확인 유효성 검사 통과");
    }

    if (!errs.next && !errs.confirm && next !== confirm) {
      console.log("❌ 새 비밀번호와 확인이 일치하지 않음");
      errs.next = "비밀번호가 일치하지 않습니다.";
      errs.confirm = "비밀번호가 일치하지 않습니다.";
    } else if (!errs.next && !errs.confirm) {
      console.log("✅ 비밀번호 일치 확인 통과");
    }

    if (!errs.current && current === next) {
      console.log("❌ 현재 비밀번호와 새 비밀번호가 동일함");
      errs.next = "현재 비밀번호와 다른 비밀번호를 입력해 주세요.";
    }

    console.log("최종 에러:", errs);
    console.log("=== 비밀번호 검증 종료 ===");

    return {
      data: { current, next, confirm },
      errs,
    };
  };

  const handleSave = async () => {
    setNotice(null);
  
    const { data, errs } = validate(form);
    setErrors(errs);
  
    if (Object.keys(errs).length > 0) {
      return;
    }
  
    try {
      setSubmitting(true);
  
      const res = await changePassword({
        oldPassword: data.current,
        newPassword: data.next,
      });
  
      console.log(res);
  
      //  성공
      if (res.code === 200) {
        toast.success("비밀번호가 변경되었습니다.");
        setNotice("비밀번호가 변경되었습니다.");
        
        setForm({
          current: "",
          next: "",
          confirm: "",
        });
  
        setErrors({});
        logout();
        navigate("/login");
        return;
      }
  
      //  현재 비밀번호 불일치
      if (res.code === 401) {
        toast.error("현재 비밀번호가 일치하지 않습니다.");

        setErrors((prev) => ({
          ...prev,
          current: "현재 비밀번호가 일치하지 않습니다.",
        }));

        return;
      }
  
      //  기타 서버 에러
      toast.error(res.msg || "비밀번호 변경에 실패했습니다.");
    } catch (error: any) {
      console.error("비밀번호 변경 실패:", error);

      // 401 에러: 현재 비밀번호 불일치
      if (error?.code === 401 || error?.response?.status === 401) {
        toast.error("현재 비밀번호가 일치하지 않습니다.");

        setErrors((prev) => ({
          ...prev,
          current: "현재 비밀번호가 일치하지 않습니다.",
        }));

        return;
      }

      // 기타 axios 에러
      const msg =
        error?.response?.data?.msg || error?.msg || "비밀번호 변경에 실패했습니다.";

      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isSubmitting}/>

      <div className="account-main password-tab">
        <div className="field">
          <span className="field__label">
            현재 비밀번호 <em>*</em>
          </span>
          <PasswordInput
            id="pw-current"
            value={form.current}
            onChange={onChange("current")}
            placeholder="현재 비밀번호를 입력해 주세요."
            message={errors.current}
            autoComplete="current-password"
            required
          />
          {errors.current ? (
            <span className="field__label">
              <em>{errors.current}</em>
            </span>
          ) : null}

          <span className="field__label">
            새 비밀번호 <em>*</em>
          </span>
          <PasswordInput
            id="pw-new"
            value={form.next}
            onChange={onChange("next")}
            placeholder="새 비밀번호를 입력해 주세요."
            message={errors.next}
            autoComplete="new-password"
            required
          />
          {errors.next ? (
            <span className="field__label">
              <em>{errors.next}</em>
            </span>
          ) : null}

          <span className="field__label">
            새 비밀번호 확인 <em>*</em>
          </span>
          <PasswordInput
            id="pw-confirm"
            value={form.confirm}
            onChange={onChange("confirm")}
            message={errors.confirm}
            placeholder="새 비밀번호를 다시 입력해 주세요."
            autoComplete="new-password"
            required
          />
          {errors.confirm ? (
            <span className="field__label">
              <em>{errors.confirm}</em>
            </span>
          ) : null}
        </div>

        <div>
          <div className="field">
            <div className="field__value_gray hint">
              <span>※ 비밀번호는 영문, 숫자, 특수문자를 모두 포함한 8~16자로 입력해 주세요.</span>
            </div>
          </div>

       

          <div className="field form-action-group">
            <div className="btn_wrap">
              <button
                type="button"
                className="default_btn_white btn-cancel"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                type="button"
                className="default_btn_black"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="account-main mobile password-tab">
        <div className="field">
          <div className="field-group">
            <span className="field__label">
              현재 비밀번호 <em>*</em>
            </span>
            <PasswordInput
              id="pw-current-mobile"
              value={form.current}
              onChange={onChange("current")}
              placeholder="현재 비밀번호를 입력해 주세요."
              message={errors.current}
              autoComplete="current-password"
              required
            />
            {errors.current ? (
              <span className="field__label">
                <em>{errors.current}</em>
              </span>
            ) : null}
          </div>

          <div className="field-group">
            <span className="field__label">
              새 비밀번호 <em>*</em>
            </span>
            <PasswordInput
              id="pw-new-mobile"
              value={form.next}
              onChange={onChange("next")}
              placeholder="새 비밀번호를 입력해 주세요."
              message={errors.next}
              autoComplete="new-password"
              required
            />
            {errors.next ? (
              <span className="field__label">
                <em>{errors.next}</em>
              </span>
            ) : null}
          </div>

          <div className="field-group">
            <span className="field__label">
              새 비밀번호 확인 <em>*</em>
            </span>
            <PasswordInput
              id="pw-confirm-mobile"
              value={form.confirm}
              onChange={onChange("confirm")}
              message={errors.confirm}
              placeholder="새 비밀번호를 다시 입력해 주세요."
              autoComplete="new-password"
              required
            />
            {errors.confirm ? (
              <span className="field__label">
                <em>{errors.confirm}</em>
              </span>
            ) : null}
          </div>
        </div>

        <div className="field">
          <div className="field__value_gray hint">
            <span>※ 비밀번호는 영문, 숫자, 특수문자를 모두 포함한 8~16자로 입력해 주세요.</span>
          </div>
        </div>

       

        <div className="field form-action-group">
          <div className="btn_wrap">
            <button
              type="button"
              className="default_btn_white btn-cancel"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="button"
              className="default_btn_black"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </>
  );
}