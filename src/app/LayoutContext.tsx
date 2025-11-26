// LayoutContext.tsx
import { createContext, useContext } from 'react';

interface LayoutContextType {
  actionType?: string;
  resetAction?: () => void; // 추가
}

export const LayoutContext = createContext<LayoutContextType>({});

export const useLayoutContext = () => useContext(LayoutContext);