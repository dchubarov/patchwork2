import React, { memo } from 'react';
import { Box, Skeleton } from '@mui/joy';

const ChecklistSkeleton = memo(() => (
  <Box sx={{ mx: 2, my: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
    <Skeleton
      variant="circular"
      sx={(theme) => ({
        alignSelf: 'center',
        width: theme.fontSize.xl4,
        height: theme.fontSize.xl4,
      })}
    />
    <Skeleton variant="text" level="h2" width={200} />
  </Box>
));

export default ChecklistSkeleton;
