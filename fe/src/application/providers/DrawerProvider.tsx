import React, { PropsWithChildren, useState } from 'react';
import { DrawerContext, DrawerState } from '@/types/view';
import { developmentLogger } from '@/utils/logging';

const DrawerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState(
    (): DrawerState => ({
      isOpen: false,
      element: null,

      openDrawer: (element, title) =>
        setState((prev) => {
          if (prev.isOpen) {
            developmentLogger.warn('openDrawer() invoked while drawer is open');
          }
          return {
            ...prev,
            isOpen: true,
            element,
            title,
          };
        }),

      closeDrawer: () =>
        setState((prev) => {
          return prev.isOpen
            ? { ...prev, isOpen: false, element: null, title: undefined }
            : prev;
        }),
    })
  );

  return (
    <DrawerContext.Provider value={state}>{children}</DrawerContext.Provider>
  );
};

export default DrawerProvider;
