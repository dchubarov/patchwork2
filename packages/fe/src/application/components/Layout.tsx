import React from 'react';
import {
  Box,
  BoxProps,
  DialogContent,
  DialogTitle,
  Drawer as JoyDrawer,
  GlobalStyles,
  ModalClose,
} from '@mui/joy';
import { Toast, Toaster as HotToaster } from 'react-hot-toast';
import { SidebarPlacement } from '@/types/view';
import Notification from '@/components/Notification';
import { useActiveView } from '@/hooks';
import { useDrawer } from '@/hooks/view';

const Root: React.FC<BoxProps> = ({ sx, ...other }) => (
  <Box
    {...other}
    sx={[
      { display: 'flex', flexDirection: 'column', height: '100dvh' },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  />
);

const Header: React.FC<BoxProps> = ({ children, sx, ...other }) => (
  <Box
    {...other}
    component="header"
    sx={[
      { height: 'var(--Header-height)', zIndex: 1000 },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}>
    <GlobalStyles
      styles={
        (/*theme*/) => ({
          ':root': {
            '--Header-height': '68px',
          },
        })
      }
    />

    {children}
  </Box>
);

const Main: React.FC<BoxProps> = ({ sx, ...other }) => (
  <Box
    {...other}
    component="main"
    sx={[{ flex: 1, display: 'flex' }, ...(Array.isArray(sx) ? sx : [sx])]}
  />
);

type SidebarProps = BoxProps & {
  placement: SidebarPlacement;
};

const Sidebar: React.FC<SidebarProps> = ({
  placement,
  children,
  sx,
  ...other
}) => {
  const { sidebarPlacement } = useActiveView();

  return sidebarPlacement === placement ? (
    <Box
      {...other}
      sx={[
        {
          height: 'calc(100dvh - var(--Header-height, 0px))',
          width: 'var(--Sidebar-width)',
          // overflow: "auto",
          zIndex: 900,
          '& > *': {
            minHeight: '100%',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}>
      <GlobalStyles
        styles={
          (/*theme*/) => ({
            ':root': {
              '--Sidebar-width': '280px',
            },
          })
        }
      />

      {children}
    </Box>
  ) : null;
};

const View: React.FC<BoxProps> = ({ sx, ...other }) => (
  <Box
    {...other}
    component="main"
    sx={[
      {
        flex: 1,
        height: 'calc(100dvh - var(--Header-height, 0px))',
        overflow: 'auto',
        '& > *': {
          minHeight: '100%',
        },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  />
);

const Drawer: React.FC = () => {
  const { isOpen, title, element, closeDrawer } = useDrawer();
  const { sidebarPlacement } = useActiveView();
  return (
    <JoyDrawer
      open={isOpen}
      anchor={sidebarPlacement === 'left' ? 'right' : 'left'}
      onClose={closeDrawer}
      sx={{
        '--Drawer-horizontalSize':
          'clamp(250px, 520px, calc(100vw - var(--Sidebar-width)))',
        zIndex: 1100,
      }}>
      {isOpen && (
        <>
          <ModalClose />
          {title && <DialogTitle>{title}</DialogTitle>}
          <DialogContent>{element}</DialogContent>
        </>
      )}
    </JoyDrawer>
  );
};

const Toaster: React.FC = () => {
  return (
    <HotToaster position="bottom-center" gutter={16}>
      {(t: Toast) => <Notification.ToastBar toast={t} />}
    </HotToaster>
  );
};

const defaultExports = {
  Drawer,
  Header,
  Main,
  Root,
  Sidebar,
  Toaster,
  View,
};

export default defaultExports;
