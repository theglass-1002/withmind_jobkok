// components/ai/AiSuggestChips.tsx
import React from 'react';
import ic_star_gray700_20 from '@/assets/icons/size20/ic_star_gray700_20.png';
import ic_add_btn_green_20 from '@/assets/icons/size20/ic_add_btn_green_20.png';

import './AiSuggestChips.css';
type Props = {
  /** 상단 문구 */
  title: string;
  /** 표시할 태그들 (ex. ["pm", "풀스택 개발자"] 또는 ["css","javascript"]) */
  tags: string[];
  /** 태그 클릭 시 콜백 (선택) */
  onTagClick?: (tag: string) => void;
  /** 태그 앞에 붙일 접두어 (기본 "+") */
  prefix?: string;
  /** 외부에서 스타일 추가하고 싶을 때 */
  className?: string;
  /** 클릭 비활성화 */
  disabled?: boolean;
};

export default function AiSuggestChips({
  title,
  tags,
  onTagClick,
  prefix = '+',
  className,
  disabled = false,
}: Props) {
  return (
    <div className={['ai-suggest', className ?? ''].join(' ').trim()}>
      <div className="ai-suggest__title">
        <img src={ic_star_gray700_20} alt="" />
        {title}</div>

      <div className="ai-suggest__chips">
        {tags.map((t, i) => {
          return (
            <span
              key={`${t}-${i}`}
              className={[
                'ai-suggest__chip',
                disabled ? 'ai-suggest__chip--disabled' : '',
              ].join(' ').trim()}
              onClick={() => !disabled && onTagClick?.(t)}
              aria-disabled={disabled || undefined}
            >
                <img src={ic_add_btn_green_20} alt="" />
              {t}
            </span>
          );
        })}
      </div>
    </div>
  );
}
