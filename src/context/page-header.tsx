
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface PageHeaderContextValue {
  title: string | null;
  description: string | null;
  actions: ReactNode | null;
  setPageHeader: (data: { title?: string | null; description?: string | null; actions?: ReactNode | null }) => void;
  clearPageHeader: () => void;
}

const PageHeaderContext = createContext<PageHeaderContextValue | undefined>(undefined);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [actions, setActions] = useState<ReactNode | null>(null);

  const setPageHeader = ({ 
    title: newTitle = null, 
    description: newDescription = null, 
    actions: newActions = null 
  }) => {
    if (newTitle !== undefined) setTitle(newTitle);
    if (newDescription !== undefined) setDescription(newDescription);
    if (newActions !== undefined) setActions(newActions);
  };

  const clearPageHeader = () => {
    setTitle(null);
    setDescription(null);
    setActions(null);
  };

  return (
    <PageHeaderContext.Provider
      value={{
        title,
        description,
        actions,
        setPageHeader,
        clearPageHeader,
      }}
    >
      {children}
    </PageHeaderContext.Provider>
  );
}

export const usePageHeader = () => {
  const context = useContext(PageHeaderContext);
  
  if (context === undefined) {
    throw new Error('usePageHeader must be used within a PageHeaderProvider');
  }
  
  return context;
};
