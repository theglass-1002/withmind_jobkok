// LayoutContext.tsx
import { createContext, useContext } from 'react';

interface LayoutContextType {
  actionType?: string;
}

export const LayoutContext = createContext<LayoutContextType>({});

export const useLayoutContext = () => useContext(LayoutContext);