import React from 'react';
import { Divider, DividerProps } from '@mui/joy';

const SidebarDivider: React.FC<DividerProps> = ({ sx, ...other }) => (
  <Divider
    {...other}
    color="primary"
    sx={[
      {
        backgroundColor: 'var(--joy-palette-primary-300)',
        background:
          'linear-gradient(90deg, ' +
          'var(--joy-palette-primary-softBg) 0%, ' +
          'var(--joy-palette-primary-softActiveBg) 25%, ' +
          'var(--joy-palette-primary-softActiveBg) 75%, ' +
          'var(--joy-palette-primary-softBg) 100%)',
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  />
);

export default SidebarDivider;
