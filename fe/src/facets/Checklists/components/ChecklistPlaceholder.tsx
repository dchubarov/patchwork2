import React from 'react';
import {
  AspectRatio,
  CircularProgress,
  ListItemContent,
  Radio,
} from '@mui/joy';
import { AddCircle as AddIcon } from '@mui/icons-material';
import Editable from '@/components/Editable';
import { useChecklist } from '../hooks';

const ChecklistPlaceholder: React.FC = () => {
  const {
    data,
    updateChecklist,
    updateItem,
    isUpdatingItem,
    updatingItemId,
    targetItem,
    setTargetItem,
  } = useChecklist();

  const handleValueEdited = (editedValue?: string) => {
    if (editedValue && editedValue.trim()) {
      const newItem = {
        id: '' /*new*/,
        note: editedValue.trim(),
        parent: targetItem?.id ?? null,
        done: false,
        colorLabel: null,
        sequenceCode: 0,
      };
      if (data && data?.id == null)
        updateChecklist({ ...data, items: [newItem] });
      else updateItem(newItem);
    }
    // always restore original (blank) value
    return false;
  };

  return (
    <ListItemContent sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <AspectRatio
        ratio={1}
        variant="soft"
        sx={{
          '--AspectRatio-radius': '50%',
          width: '24px',
        }}>
        {isUpdatingItem && updatingItemId === '' ? (
          <CircularProgress
            variant="plain"
            color="neutral"
            thickness={3}
            sx={{
              '--CircularProgress-size': '18px',
              padding: '3px',
            }}
          />
        ) : (
          <AddIcon
            sx={{
              color: 'var(--joy-palette-neutral-400)',
            }}
          />
        )}
      </AspectRatio>

      <Editable.Typography
        name="new-item-note"
        onEdited={handleValueEdited}
        placeholder="Click here to add a new item"
        inputPlaceholder="Type what to do"
        sx={{ minWidth: 0, flex: 1 }}
      />

      <Radio
        size="sm"
        color="neutral"
        variant="soft"
        checked={!targetItem?.id}
        onClick={() => setTargetItem(null)}
      />
    </ListItemContent>
  );
};

export default ChecklistPlaceholder;
