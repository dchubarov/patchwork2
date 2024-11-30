import React, { useEffect, useState } from 'react';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import {
  Button,
  ButtonGroup,
  Dropdown,
  IconButton,
  ListItem,
  ListItemDecorator,
  ListSubheader,
  Menu,
  MenuButton,
  MenuItem,
  SupportedColorScheme,
  useColorScheme,
} from '@mui/joy';
import {
  Api as ApiIcon,
  CloudOff as OfflineIcon,
  CloudOutlined as OnlineIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  MoreVert as SettingsIcon,
  ViewSidebarOutlined as SidebarIcon,
  Webhook as ReactQueryDevtoolsIcon,
} from '@mui/icons-material';
import { useActiveView, useEnvironment } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { SidebarPlacement } from '@/types/view';
import { ApplicationEnvironment } from '@/types/env';
import ApiPlayground from './ApiPlayground';
import { useDrawer } from '@/hooks/view';

const AppSettingsMenu: React.FC = () => {
  const { mode: colorScheme, setMode: setColorScheme } = useColorScheme();
  const { sidebarPlacement, configureView } = useActiveView();
  const { openDrawer } = useDrawer();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { environment, versionInfo, backendStatus, backendInfo } =
    useEnvironment();
  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleColorSchemeButtonClick = (mode: SupportedColorScheme) => {
    if (mode !== colorScheme) {
      setColorScheme(mode);
    }
    setOpen(false);
  };

  const handleSidebarPlacementButtonClick = (placement: SidebarPlacement) => {
    if (placement !== sidebarPlacement) {
      configureView({ sidebarPlacement: placement });
    }
    setOpen(false);
  };

  const handleOpenApiPlaygroundItemClick = () => {
    openDrawer(<ApiPlayground />, 'API playground');
  };

  const handleOpenReactQueryDevtoolsItemClick = () => {
    openDrawer(
      <ReactQueryDevtoolsPanel
        client={queryClient}
        style={{ minHeight: '100%', height: '100%' }}
      />,
      'React Query Devtools'
    );
  };

  return (
    <Dropdown open={open} onOpenChange={(_, isOpen) => setOpen(isOpen)}>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', size: 'sm' } }}>
        <SettingsIcon />
      </MenuButton>

      <Menu size="sm">
        <ListSubheader>Color scheme</ListSubheader>
        <ListItem>
          <ButtonGroup
            disabled={!mounted}
            size="sm"
            buttonFlex={1}
            sx={{ width: '100%', resize: 'horizontal' }}>
            <Button
              onClick={() => handleColorSchemeButtonClick('light')}
              startDecorator={<LightModeIcon />}
              sx={{
                backgroundColor:
                  colorScheme === 'light' ? 'background.level1' : 'initial',
              }}>
              Light
            </Button>
            <Button
              onClick={() => handleColorSchemeButtonClick('dark')}
              startDecorator={<DarkModeIcon />}
              sx={{
                backgroundColor:
                  colorScheme === 'dark' ? 'background.level1' : 'initial',
              }}>
              Dark
            </Button>
          </ButtonGroup>
        </ListItem>

        <ListSubheader>Sidebar placement</ListSubheader>
        <ListItem>
          <ButtonGroup
            size="sm"
            buttonFlex={1}
            sx={{ width: '100%', resize: 'horizontal' }}>
            <Button
              onClick={() => handleSidebarPlacementButtonClick('left')}
              startDecorator={
                <SidebarIcon sx={{ transform: 'rotate(180deg)' }} />
              }
              sx={{
                backgroundColor:
                  sidebarPlacement === 'left' ? 'background.level1' : 'initial',
              }}>
              Left
            </Button>
            <Button
              onClick={() => handleSidebarPlacementButtonClick('right')}
              endDecorator={<SidebarIcon />}
              sx={{
                backgroundColor:
                  sidebarPlacement === 'right'
                    ? 'background.level1'
                    : 'initial',
              }}>
              Right
            </Button>
          </ButtonGroup>
        </ListItem>

        {environment === ApplicationEnvironment.Development && (
          <>
            <ListSubheader>Developer</ListSubheader>
            <MenuItem onClick={handleOpenApiPlaygroundItemClick}>
              <ListItemDecorator>
                <ApiIcon />
              </ListItemDecorator>
              Open API playground
            </MenuItem>
            <MenuItem onClick={handleOpenReactQueryDevtoolsItemClick}>
              <ListItemDecorator>
                <ReactQueryDevtoolsIcon />
              </ListItemDecorator>
              Open React Query Devtools
            </MenuItem>
          </>
        )}

        <ListSubheader>Backend</ListSubheader>
        <MenuItem color={backendStatus !== 'online' ? 'danger' : 'neutral'}>
          <ListItemDecorator>
            {backendStatus === 'online' ? <OnlineIcon /> : <OfflineIcon />}
          </ListItemDecorator>
          {backendInfo
            ? `${backendInfo}: ${backendStatus}`
            : 'Backend is not available'}
        </MenuItem>

        <ListSubheader>About</ListSubheader>
        <MenuItem>{versionInfo}</MenuItem>
      </Menu>
    </Dropdown>
  );
};

export default AppSettingsMenu;
