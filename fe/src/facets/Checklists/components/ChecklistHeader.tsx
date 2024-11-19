import React from 'react';
import { AspectRatio, ListItemContent, Tooltip } from '@mui/joy';
import PieProgress from '@/components/PieProgress';
import Editable from '@/components/Editable';

import { useChecklist } from '../lib/context';

const ChecklistHeader: React.FC = () => {
  const { data, groups, isLoading, updateChecklist } = useChecklist();
  const group = groups.get(null);
  const progress =
    !!group && group.doableCount > 0
      ? (group.doneCount / group.doableCount) * 100
      : 0;
  const counts = group ? `${group.doneCount} / ${group.doableCount}` : '';

  const handleTitleEdited = (title?: string) => {
    if (title && title !== data?.title) {
      updateChecklist({
        id: data?.id ?? null,
        title: title ?? '',
        items: [],
      });
    } else return false;
  };

  return (
    <ListItemContent
      sx={{
        minHeight: '46px',
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        ml: '-0.35rem',
      }}>
      <Tooltip title={counts} arrow>
        <AspectRatio
          ratio={1}
          variant="soft"
          sx={(theme) => ({
            width: theme.vars.fontSize.xl4,
            borderRadius: '50%',
          })}>
          <PieProgress
            value={progress}
            margin={3}
            thickness={6}
            zeroIndicator
          />
        </AspectRatio>
      </Tooltip>

      <Editable.Typography
        noWrap
        level="h2"
        id="checklist-title"
        disabled={isLoading || !data}
        value={data?.title}
        inputPlaceholder={data?.title}
        onEdited={handleTitleEdited}
      />
    </ListItemContent>
  );
};

export default ChecklistHeader;
