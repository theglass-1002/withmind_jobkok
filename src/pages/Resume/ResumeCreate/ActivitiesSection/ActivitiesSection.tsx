import React, { useEffect, useRef, useState } from "react";
import "./ActivitiesSection.css";
// import roles from "@/data/desired_roles.json"; // 필요 시 사용
// import { toast } from "react-toastify";

import FormInput from "@/shared/components/form/FormInput";
// import FormField from "@/shared/components/form/FormField";
import DateInline from "@/shared/components/form/DateInline";
import icon_calendar_red_20 from '@/assets/icons/size20/icon_calendar_red_20.png';
import ic_add_btn_gray900_20 from "@/assets/icons/size20/ic_add_btn_gray900_20.png";
import ic_calendar_gray900_20 from '@/assets/icons/size20/ic_calendar_gray900_20.png';
import ic_add_purple_20 from "@/assets/icons/size20/ic_add_purple_20.png";
import ic_close_gray500_20 from "@/assets/icons/size20/ic_close_gray500_20.png";
import ic_arrow_drop_down_gray900_24 from "@/assets/icons/size24/ic_arrow_drop_down_gray900_24.png";
import ic_key_arrow_down_gray500_20 from "@/assets/icons/size20/ic_key_arrow_down_gray500_20.png";
import ic_key_arrow_up_gray500_20 from "@/assets/icons/size20/ic_key_arrow_up_gray500_20.png";
import ic_trash_gray500_20 from "@/assets/icons/size20/ic_trash_gray500_20.png";
import ic_star_gray700_20 from '@/assets/icons/size20/ic_star_gray700_20.png';

type ActivityItem = {
  id: string;
  activityType: string | null;
  activityName: string;
};

const makeId = () => Math.random().toString(36).slice(2, 10);

export default function ActivitiesSection() {
    const MAX_SUMMARY = 2000;
  const [isAdding, setIsAdding] = useState(false);
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [summary, setSummary] = useState('');
  const [editing, setEditing] = useState(false);
  
  // 드롭다운 바깥 클릭 감지용 refs
  const selectRefs = useRef<(HTMLDivElement | null)[]>([]);

  const startAdd = () => {
    setIsAdding(true);
    if (items.length === 0) {
      setItems([{ id: makeId(), activityType: null, activityName: "" }]);
    }
  };

  const stopAdd = () => {
    setIsAdding(false);
    setItems([]);
    setOpenDropdownIndex(null);
  };

  const addItem = () => {
    setItems(prev => [...prev, { id: makeId(), activityType: null, activityName: "" }]);
  };

  const removeItem = (index: number) => {
    setItems(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    setOpenDropdownIndex(cur => (cur === index ? null : cur));
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setItems(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index >= items.length - 1) return;
    setItems(prev => {
      const next = [...prev];
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
      return next;
    });
  };

  const selectType = (index: number, val: string) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], activityType: val };
      return next;
    });
    setOpenDropdownIndex(null);
  };

  const changeName = (index: number, v: any) => {
    const value = typeof v === "string" ? v : v?.target ? v.target.value : "";
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], activityName: value };
      return next;
    });
  };

  const startEditing = (e?: React.KeyboardEvent | React.MouseEvent) => {
    console.log('클릭');
    console.log(editing);
    if (e && "key" in e) {
      if (e.nativeEvent?.isComposing) return;
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
    }
    setEditing(true);
  };

  const onChangeSummary = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 브라우저가 maxLength로도 막아주지만, 안전하게 한 번 더 잘라줌
    const v = e.target.value.slice(0, MAX_SUMMARY);
    setSummary(v);
  };
  const count = summary.length;
  

  // 바깥 클릭 시 열려있는 드롭다운 닫기
  useEffect(() => {
    if (openDropdownIndex === null) return;

    const onDocClick = (e: MouseEvent) => {
      const ref = selectRefs.current[openDropdownIndex];
      if (!ref) return;
      if (!ref.contains(e.target as Node)) setOpenDropdownIndex(null);
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openDropdownIndex]);

  // 모든 아이템 제거되면 섹션 닫기
  useEffect(() => {
    if (isAdding && items.length === 0) setIsAdding(false);
  }, [items.length, isAdding]);

  return (
    <div className="resume-create-page__section resume-create-page__section--activities">
      <div className="resume-create-page__section-title resume-create-page__section-title--simple">
        <div className="section-title__row">
          <div className="section-title__left">
            <div className="resume-create-page__section-title__heading">활동ㆍ경험</div>
          </div>
          <div className="section-title__right">
            {isAdding ? (
              <img src={ic_close_gray500_20} alt="닫기" onClick={stopAdd} />
            ) : (
              <span className="resume-section-title__action--import" onClick={startAdd}>
                <img src={ic_add_purple_20} alt="" />
                추가
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        className={`resume-create-page__section-body ${
          isAdding ? "activities-section" : "empty"
        }`}
      >
        {isAdding ? (
          <>
            {items.map((item, index) => (
              <div className="activities-section__item" key={item.id}>
                <div className="activities-section__fields">
                  <div className="activities-section__group">
                    <div className="activities-section__control">
                      <label className="small_labe_black-14">
                        활동ㆍ경험명 <em className="error_text_red">*</em>
                      </label>

                      {/* 드롭다운 */}
                      <div
                        className="ui-select"
                        ref={el => (selectRefs.current[index] = el)}
                        role="combobox"
                        aria-expanded={openDropdownIndex === index}
                        tabIndex={0}
                        onClick={() =>
                          setOpenDropdownIndex(cur => (cur === index ? null : index))
                        }
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setOpenDropdownIndex(cur => (cur === index ? null : index));
                          }
                          if (e.key === "Escape") setOpenDropdownIndex(null);
                        }}
                      >
                        {item.activityType ?? (
                          <span className="ui-select-none-default">구분</span>
                        )}
                        <img src={ic_arrow_drop_down_gray900_24} alt="" />

                        {openDropdownIndex === index && (
                          <div
                            className="ui-select__menu"
                            role="listbox"
                            onClick={e => e.stopPropagation()} // ✅ 부모 토글로 버블링 방지
                          >
                            {["교내활동", "인턴", "자원봉사", "동아리"].map(opt => (
                              <div
                                key={opt}
                                className="ui-select__option"
                                role="option"
                                onClick={e => {
                                  e.stopPropagation(); // ✅ 더블 안전
                                  selectType(index, opt);
                                }}
                                onKeyDown={e => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    selectType(index, opt);
                                  }
                                }}
                                tabIndex={0}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 활동명 입력 */}
                    <FormInput
                      placeholder="활동ㆍ경험명을 입력해 주세요."
                      inputClassName="activity_name"
                      id={`activity_name_${item.id}`}
                      value={item.activityName}
                      onChange={(v: any) => changeName(index, v)}
                    />
                  </div>
                  <div className="activities-period">
                    <label className="activities-period__label small_labe_black-14">
                        활동ㆍ경험 기간 <em className="error_text_red">*</em>
                    </label>

                    <div className="activities-period__fields">
                        <div className="activities-period__field activities-period__field--start">
                            <DateInline
                            id="activities"
                            iconSrc={ic_calendar_gray900_20}
                            value={"YYYY.MM"}
                            onClick={() => {/* date picker open */}}
                            invalid={false}
                        
        
                            />
                        </div>
                        <div className="activities-period__divider">~</div>
                        <div className="activities-period__field activities-period__field--end">
                        <DateInline
                            id="activities"
                            iconSrc={ic_calendar_gray900_20}
                            value={"YYYY.MM"}
                            onClick={() => {/* date picker open */}}
                            invalid={false}
                        
        
                            />
                        </div>
                    </div>
                    </div>
                    <div className="field activities-section__control activities-section__control--summary">
                <div className="small_labe_black-14">세부 내용</div>
                {editing?
                <div className='activities-section__summary-input'>
                    <textarea className=''
                      value={summary}
                      onChange={onChangeSummary}
                      maxLength={MAX_SUMMARY}
                    ></textarea>
                    <span className="activities-section__char-count">
                       <span>{count}</span>
                       <span className="max"> / {MAX_SUMMARY}</span>
                   </span>
                </div>
                :
                   <div className={`activities-section__summary-input`} onClick={startEditing} onKeyDown={startEditing}>
                   <ul className="activities-section__summary-tips">
                     <li className="activities-section__summary-tip">
                      세부 내용을 입력해 주세요.
                     </li>
                     
                   </ul>
                   <span className="activities-section__char-count">
                       <span>{count}</span>
                       <span className="max"> / {MAX_SUMMARY}</span>
                   </span>
                 </div>
                
                }
                    </div>
                </div>

                {/* 아이템 컨트롤 */}
                <div className="activities-section__controls">
                  <span
                    className="activities-section__control_btn activities-section__control--up"
                    onClick={() => moveUp(index)}
                    aria-label="위로"
                    role="button"
                    tabIndex={0}
                  >
                    <img src={ic_key_arrow_up_gray500_20} alt="" />
                  </span>
                  <span
                    className="activities-section__control_btn activities-section__control--down"
                    onClick={() => moveDown(index)}
                    aria-label="아래로"
                    role="button"
                    tabIndex={0}
                  >
                    <img src={ic_key_arrow_down_gray500_20} alt="" />
                  </span>
                  <span
                    className="activities-section__control_btn activities-section__control--remove"
                    onClick={() => removeItem(index)}
                    aria-label="삭제"
                    role="button"
                    tabIndex={0}
                  >
                    <img src={ic_trash_gray500_20} alt="" />
                  </span>
                </div>
              </div>
            ))}

            <span className="default_btn_white" onClick={addItem} role="button" tabIndex={0}>
              <img src={ic_add_btn_gray900_20} alt="" />
              추가
            </span>
          </>
        ) : (
          <>활동ㆍ경험을 추가해 주세요.</>
        )}
      </div>
    </div>
  );
}
