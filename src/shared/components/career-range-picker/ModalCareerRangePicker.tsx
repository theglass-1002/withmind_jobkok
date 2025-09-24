import React, { useState, useEffect, useMemo } from "react";
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import Switch from "react-switch";
import { NavLink } from "react-router-dom";
import refresh_black from '@/assets/icons/refresh_black.png';
import close_gray from '@/assets/icons/close_gray.png';
import "./CareerRangePicker.css";




export default function ModalCareerRangePicker() {
  
  const MIN = 0;
  const MAX = 10; // 0년 ~ 10+년 케이스에 맞춤
  
  const clampPct = (p: number) => Math.max(0, Math.min(100, p));
  const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;

  const [range, setRange] = useState<[number, number]>([0, 10]);

  const minLabel = useMemo(
    () => (range[0] === 0 ? '신입' : range[0] === 10 ? '10' : `${range[0]}`),
    [range]
  );
  const maxLabel = useMemo(
    () => (range[1] === 0 ? '신입' : range[1] === 10 ? '10' : `${range[1]}`),
    [range]
  );


  const handleReset = () => setRange([MIN, MAX]);

  return (
            <>
           <div className="popup career-range career-range--popup">
                    <div className="content career-range__content">
                      <div className="career-range__header">
                        <span className="title career-range__title">
                          {range[0]===0 ? (range[1]===10 ? '경력전체' : `${minLabel}~${maxLabel}년`) : `${minLabel}~${maxLabel}년`}
                        </span>
                      </div>

                      <div className="career-range-wrap career-range__slider-wrap">
                        <Slider
                          className="career-range-slider career-range__slider"
                          range
                          min={MIN}
                          max={MAX}
                          step={1}
                          allowCross={false}
                          pushable={1}
                          value={range}
                          onChange={(v) => setRange(v as [number, number])}
                        />
                        <div
                          className="career-range-follow career-range__label career-range__label--min"
                          style={{ left: `${clampPct(pct(range[0]))}%` }}
                        >
                          <span className="career-range__label-text">{minLabel}</span>
                        </div>
                        <div
                          className="career-range-follow career-range__label career-range__label--max"
                          style={{ left: `${clampPct(pct(range[1]))}%` }}
                        >
                          <span className="career-range__label-text">
                            {maxLabel==='10' ? `${maxLabel}년 +` : `${maxLabel}년`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="btn_wrap career-range__actions">
                    <div className="default_btn_white" onClick={handleReset}>
                        <span className="job-role-picker__reset-icon">
                          <img src={refresh_black} alt="" />
                        </span>
                        <span className="job-role-picker__reset-text">초기화</span>
                      </div>
                      <span className="default_btn_black">적용</span>
                    </div>
                  </div>
    </>
  );
}

