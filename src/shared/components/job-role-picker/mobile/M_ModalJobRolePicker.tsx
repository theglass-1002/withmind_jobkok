import React, { useState, useEffect } from "react";

import check_box_purple from '@/assets/icons/check_box_purple.png';
import check_box_outline_blank_gray from '@/assets/icons/check_box_outline_blank_gray.png';
import chevron_right_gray_light from '@/assets/icons/chevron_right_gray_light.png';
import ic_close_gray500_20 from '@/assets/icons/size20/ic_close_gray500_20.png';
import ic_arrow_back_ios_gray900_20 from '@/assets/icons/size20/ic_arrow_back_ios_gray900_20.png';
import ic_replay_gray900_20 from "@/assets/icons/size20/ic_replay_gray900_20.png";
import chevron_right_black from '@/assets/icons/chevron_right_black.png';

import "../ModalJobRolePicker.css";

type Category = {
  key: string;
  title: string;
  count: number;
  roles: Role[];
};

type Role = {
  key: string;
  label: string;
};

export type SelectedRole = {
  categoryKey: string;
  categoryTitle: string;
  roleKey: string;
  roleLabel: string;
};

// 가짜 데이터
const CATEGORIES: Category[] = [
  {
    key: 'dev',
    title: '개발',
    count: 11,
    roles: [
      { key: 'server_dev', label: '서버 개발자' },
      { key: 'frontend_dev', label: '프론트엔드 개발자' },
      { key: 'web_dev', label: '웹 개발자' },
      { key: 'software_engineer', label: '소프트웨어 엔지니어' },
      { key: 'android_dev', label: '안드로이드 개발자' },
      { key: 'ios_dev', label: 'iOS 개발자' },
      { key: 'data_engineer', label: '데이터 엔지니어' },
      { key: 'ml_engineer', label: '머신러닝 엔지니어' },
      { key: 'devops', label: 'DevOps' },
      { key: 'qa', label: 'QA/테스터' },
      { key: 'game_dev', label: '게임 개발자' },
    ]
  },
  {
    key: 'design',
    title: '디자인',
    count: 8,
    roles: [
      { key: 'ux_designer', label: 'UX 디자이너' },
      { key: 'ui_designer', label: 'UI 디자이너' },
      { key: 'web_designer', label: '웹 디자이너' },
      { key: 'graphic_designer', label: '그래픽 디자이너' },
      { key: 'product_designer', label: '프로덕트 디자이너' },
      { key: '3d_designer', label: '3D 디자이너' },
      { key: 'video_designer', label: '영상 디자이너' },
      { key: 'brand_designer', label: '브랜드 디자이너' },
    ]
  },
  {
    key: 'marketing',
    title: '마케팅ㆍ광고',
    count: 6,
    roles: [
      { key: 'digital_marketer', label: '디지털 마케터' },
      { key: 'content_marketer', label: '콘텐츠 마케터' },
      { key: 'growth_marketer', label: '그로스 마케터' },
      { key: 'performance_marketer', label: '퍼포먼스 마케터' },
      { key: 'brand_marketer', label: '브랜드 마케터' },
      { key: 'sns_marketer', label: 'SNS 마케터' },
    ]
  },
  {
    key: 'sales',
    title: '영업',
    count: 5,
    roles: [
      { key: 'sales_manager', label: '영업 관리자' },
      { key: 'b2b_sales', label: 'B2B 영업' },
      { key: 'b2c_sales', label: 'B2C 영업' },
      { key: 'key_account', label: '주요고객 관리' },
      { key: 'channel_sales', label: '채널 영업' },
    ]
  },
  {
    key: 'biz',
    title: '경영ㆍ비즈니스',
    count: 7,
    roles: [
      { key: 'pm', label: 'PM' },
      { key: 'po', label: 'PO' },
      { key: 'strategy', label: '전략 기획' },
      { key: 'biz_dev', label: '사업 개발' },
      { key: 'finance', label: '재무' },
      { key: 'accounting', label: '회계' },
      { key: 'hr', label: '인사' },
    ]
  },
];

interface M_ModalJobRolePickerProps {
  onChange?: (selected: SelectedRole[]) => void;
  onReset?: () => void; // 초기화 콜백 추가
}

export default function M_ModalJobRolePicker({ onChange, onReset }: M_ModalJobRolePickerProps) {
  // 1단계 (카테고리 리스트) / 2단계 (상세 직무 리스트)
  const [currentView, setCurrentView] = useState<'category' | 'detail'>('category');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // 선택된 직무들
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  // 전체 선택 여부 (카테고리별)
  const [allCheckedMap, setAllCheckedMap] = useState<Record<string, boolean>>({});

  // 선택된 직무들을 상세 정보로 변환
  const getSelectedRoleDetails = (): SelectedRole[] => {
    const result: SelectedRole[] = [];
    
    CATEGORIES.forEach(category => {
      category.roles.forEach(role => {
        if (selectedRoles.has(role.key)) {
          result.push({
            categoryKey: category.key,
            categoryTitle: category.title,
            roleKey: role.key,
            roleLabel: role.label,
          });
        }
      });
    });

    return result;
  };

  // selectedRoles가 변경될 때마다 부모에게 알림
  useEffect(() => {
    const details = getSelectedRoleDetails();
    console.log("🎯 선택된 직무:", details);
    if (onChange) {
      onChange(details);
    }
  }, [selectedRoles]);

  // 카테고리 클릭 → 상세 화면으로 이동
  const handleCategoryClick = (category: Category) => {
    console.log("📂 카테고리 클릭:", category.title);
    setSelectedCategory(category);
    setCurrentView('detail');
  };

  // 뒤로 가기 → 카테고리 리스트로 (선택 유지!)
  const handleBack = () => {
    console.log("⬅️ 뒤로 가기 (선택 유지)");
    setCurrentView('category');
    setSelectedCategory(null);
    // 선택된 값은 유지!
  };

  // 전체 선택 토글
  const handleAllToggle = () => {
    if (!selectedCategory) return;

    const categoryKey = selectedCategory.key;
    const isCurrentlyAll = allCheckedMap[categoryKey] ?? false;

    if (isCurrentlyAll) {
      // 전체 해제
      setSelectedRoles(prev => {
        const next = new Set(prev);
        selectedCategory.roles.forEach(role => next.delete(role.key));
        return next;
      });
      setAllCheckedMap(prev => ({ ...prev, [categoryKey]: false }));
    } else {
      // 전체 선택
      setSelectedRoles(prev => {
        const next = new Set(prev);
        selectedCategory.roles.forEach(role => next.add(role.key));
        return next;
      });
      setAllCheckedMap(prev => ({ ...prev, [categoryKey]: true }));
    }
  };

  // 개별 직무 선택/해제
  const handleRoleToggle = (roleKey: string) => {
    if (!selectedCategory) return;

    setSelectedRoles(prev => {
      const next = new Set(prev);
      if (next.has(roleKey)) {
        next.delete(roleKey);
        // 하나라도 해제하면 전체 선택 해제
        setAllCheckedMap(p => ({ ...p, [selectedCategory.key]: false }));
      } else {
        next.add(roleKey);
        // 모두 선택되었는지 확인
        const allSelected = selectedCategory.roles.every(r => 
          r.key === roleKey || next.has(r.key)
        );
        if (allSelected) {
          setAllCheckedMap(p => ({ ...p, [selectedCategory.key]: true }));
        }
      }
      return next;
    });
  };

  // 칩 삭제 (개별 직무 해제)
  const handleRemoveChip = (roleKey: string) => {
    console.log("🗑️ 칩 삭제:", roleKey);
    setSelectedRoles(prev => {
      const next = new Set(prev);
      next.delete(roleKey);
      
      // 해당 카테고리의 전체 선택 해제
      const category = CATEGORIES.find(cat => 
        cat.roles.some(role => role.key === roleKey)
      );
      if (category) {
        setAllCheckedMap(p => ({ ...p, [category.key]: false }));
      }
      
      return next;
    });
  };

  // 초기화
  const handleReset = () => {
    console.log("🔄 초기화");
    setSelectedRoles(new Set());
    setAllCheckedMap({});
    setCurrentView('category'); // 1단계로 이동
    setSelectedCategory(null);
    if (onReset) onReset(); // 부모에게도 알림
  };

  // 적용하기 → 1단계로 이동 (선택 유지!)
  const handleApply = () => {
    console.log("✅ 적용하기 (1단계로 이동, 선택 유지)");
    setCurrentView('category'); // 1단계로 이동
    setSelectedCategory(null);
    // 선택된 값은 유지!
  };

  // 카테고리에서 선택된 개수 계산
  const getSelectedCount = (category: Category) => {
    return category.roles.filter(role => selectedRoles.has(role.key)).length;
  };

  // 상세 정보 배열 가져오기 (칩 표시용)
  const selectedRoleDetails = getSelectedRoleDetails();

  return (
    <>
   <div className="job-role-picker job-role-picker--popup">
      <div className="job-role-picker__body">
        {currentView === 'category' ? (
          /* 1단계: 카테고리 리스트 */
          <div className="job-role-picker__column job-role-picker__column--left">
            <div className="job-role-picker__category_group">
              <span className="job-role-picker__options-note">
                ※ 옵션은 최대 5개까지 선택 가능합니다.
              </span>
              {CATEGORIES.map((category) => {
                const count = getSelectedCount(category);
                return (
                  <div
                    key={category.key}
                    className="job-role-picker__category"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="job-role-picker__category-meta">
                      <span className="job-role-picker__category-title">
                        {category.title}
                      </span>
                      <span className="job-role-picker__category-count">
                        {count > 0 ? count : category.count}
                      </span>
                    </div>
                    <span className="job-role-picker__category-toggle">
                      <img src={chevron_right_gray_light} alt="" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* 2단계: 상세 직무 리스트 */
          <div className="job-role-picker__column job-role-picker__column--right">
            {/* 헤더 (뒤로 가기) */}
            <div className="job-role-picker__detail-header">
              <img
                src={ic_arrow_back_ios_gray900_20}
                alt="뒤로"
                className="job-role-picker__back-icon"
                onClick={handleBack}
                style={{ cursor: 'pointer' }}
              />
              <span className="job-role-picker__detail-title">
                {selectedCategory?.title}
              </span>
              <span></span>
            </div>

            {/* 직무 리스트 */}
            <div className="job-role-picker__group job-role-picker__group--right">
              {/* 전체 선택 */}
              <div
                className={`job-role-picker__role job-role-picker__role--all ${
                  allCheckedMap[selectedCategory?.key ?? ''] ? 'on' : ''
                }`}
                onClick={handleAllToggle}
              >
                <span className="job-role-picker__checkbox-wrap">
                  <img
                    src={
                      allCheckedMap[selectedCategory?.key ?? '']
                        ? check_box_purple
                        : check_box_outline_blank_gray
                    }
                    alt=""
                  />
                </span>
                <span className="job-role-picker__role-label">
                  {selectedCategory?.title} 전체
                </span>
              </div>

              {/* 개별 직무 */}
              {selectedCategory?.roles.map((role) => (
                <div
                  key={role.key}
                  className={`job-role-picker__role ${
                    selectedRoles.has(role.key) ? 'on' : ''
                  }`}
                  onClick={() => handleRoleToggle(role.key)}
                >
                  <span className="job-role-picker__checkbox-wrap">
                    <img
                      src={
                        selectedRoles.has(role.key)
                          ? check_box_purple
                          : check_box_outline_blank_gray
                      }
                      alt=""
                    />
                  </span>
                  <span className="job-role-picker__role-label">{role.label}</span>
                </div>
              ))}
            </div>

            {/* 하단 칩 + 버튼 영역 */}
            <div className="job-filter-panel__footer">
              <div className="job-filter-panel__selected-chips">
                {selectedRoleDetails.length > 0 ? (
                  <div className="jobs-chips">
                    {selectedRoleDetails.map((role) => (
                      <div key={role.roleKey} className="jobs-chips__item">
                        <span className="job-role-picker__chip-group">
                          {role.categoryTitle}
                        </span>
                        <span className="job-role-picker__chip-role">
                          <span className="job-role-picker__chip-chevron">
                            <img src={chevron_right_black} alt="" />
                          </span>
                          {role.roleLabel}
                        </span>
                        <img 
                          onClick={() => handleRemoveChip(role.roleKey)}
                          style={{ cursor: 'pointer' }}
                        src={ic_close_gray500_20} alt="" />
                      </div>
                    ))}
                  </div>
                ) : (
                 <></>
                )}
              </div>

              <div className="btn_wrap">
                <button 
                  className="btn_w_full default_btn_white" 
                  type="button"
                  onClick={handleReset}
                >
                  <img src={ic_replay_gray900_20} alt="" /> 초기화
                </button>
                <button 
                  className="btn_w_full default_btn_black" 
                  type="button"
                  onClick={handleApply}
                >
                  적용하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
