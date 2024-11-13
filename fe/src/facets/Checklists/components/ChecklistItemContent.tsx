import React from 'react';
import {
  AspectRatio,
  Chip,
  CircularProgress,
  Dropdown,
  IconButton,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  ListSubheader,
  Menu,
  MenuButton,
  MenuItem,
  Radio,
  Switch,
  switchClasses,
  Tooltip,
  useColorScheme,
} from '@mui/joy';
import {
  Clear as DeleteIcon,
  Done as DoneIcon,
  MoreVert as MenuIcon,
  RadioButtonChecked as TargetIcon,
} from '@mui/icons-material';
import PieProgress from '@/components/PieProgress';
import Editable from '@/components/Editable';
import { ChecklistItemData } from '../types/schema';
import { ChecklistGroupState } from '../types/context';
import { useChecklist } from '../hooks';
import ColorLabel from '@/components/ColorLabel';
import { useLabelColors } from '@/hooks';

/*const DragHandle: React.FC = () => (
    <DragIcon fontSize="lg" sx={{
        mx: '-0.65rem',
        transform: 'rotate(-90deg)',
        color: 'transparent',//'var(--joy-palette-neutral-300)',
        [':hover']: {
            color: 'var(--joy-palette-neutral-300)',
            cursor: 'grab',
        }
    }}/>
);*/

interface ChecklistItemColors {
  plain: string;
  hover: string;
  active: string;
  inactive: string;
  progress: string;
}

interface ChecklistItemContentProps {
  level: number;
  item: ChecklistItemData;
  group?: ChecklistGroupState | null;
  showId?: boolean;
}

const GroupProgress: React.FC<{
  isUpdating?: boolean;
  group: ChecklistGroupState;
  colors: ChecklistItemColors;
}> = ({ isUpdating, group, colors }) => {
  return (
    <Tooltip title={`${group.doneCount} / ${group.doableCount}`} arrow>
      <AspectRatio
        ratio={1}
        variant="soft"
        slotProps={{
          content: {
            sx: { backgroundColor: colors.plain, color: colors.active },
          },
        }}
        sx={{
          '--AspectRatio-radius': '50%',
          width: '24px',
        }}>
        {isUpdating ? (
          <CircularProgress
            variant="plain"
            color="neutral"
            thickness={3}
            sx={{
              '--CircularProgress-trackColor': colors.plain,
              '--CircularProgress-progressColor': colors.progress,
              '--CircularProgress-size': '18px',
              padding: '3px',
            }}
          />
        ) : (
          <PieProgress
            value={(group.doneCount / group.doableCount) * 100}
            margin={3}
            thickness={9}
            zeroIndicator
          />
        )}
      </AspectRatio>
    </Tooltip>
  );
};

const ItemToggle: React.FC<{
  isUpdating?: boolean;
  item: ChecklistItemData;
  colors: ChecklistItemColors;
}> = ({ isUpdating, item, colors }) => {
  const { updateItem } = useChecklist();

  return (
    <Switch
      id={`toggle-${item.id}`}
      checked={item.done}
      onChange={(e) => updateItem({ ...item, done: e.target.checked })}
      disabled={isUpdating}
      variant="soft"
      size="lg"
      slotProps={{
        track: { children: <DoneIcon fontSize="sm" sx={{ ml: '0.25rem' }} /> },
        thumb: {
          children: isUpdating && (
            <CircularProgress
              variant="plain"
              color="neutral"
              thickness={3}
              sx={{
                '--CircularProgress-size': 'calc(var(--Switch-thumbSize))',
                '--CircularProgress-progressColor': colors.progress,
              }}
            />
          ),
        },
      }}
      sx={{
        '--Switch-trackBackground': colors.plain,
        '--Switch-thumbBackground': colors.inactive,
        '--Switch-thumbColor': colors.active,
        [`& .${switchClasses.checked}`]: {
          '--Switch-trackColor': colors.active,
          '--Switch-trackBackground': colors.plain,
          '--Switch-thumbBackground': colors.active,
        },
        [`&:hover`]: {
          '--Switch-trackBackground': colors.hover,
          '--Switch-thumbBackground': colors.active,
        },
      }}
    />
  );
};

const ChecklistItemContent: React.FC<ChecklistItemContentProps> = ({
  level,
  item,
  group = null,
  showId,
}) => {
  const {
    updateItem,
    deleteItem,
    isUpdatingItem,
    updatingItemId,
    targetItemId,
    setTargetItem,
  } = useChecklist();
  const isUpdating = isUpdatingItem && updatingItemId === item.id;
  const labelColors = useLabelColors(item.colorLabel);
  const { colorScheme } = useColorScheme();
  const colors: ChecklistItemColors =
    colorScheme === 'light'
      ? {
          plain: labelColors[100],
          hover: labelColors[200],
          inactive: labelColors[400],
          active: labelColors[600],
          progress: labelColors[800],
        }
      : {
          plain: labelColors[700],
          hover: labelColors[600],
          inactive: labelColors[800],
          active: labelColors[900],
          progress: labelColors[400],
        };

  const handleNoteEdited = (editedValue?: string) => {
    if (editedValue && editedValue !== item.note)
      updateItem({ ...item, note: editedValue });
    else return false;
  };

  const handleColorLabelChange = (label?: string) => {
    if (item.colorLabel !== (label ?? null))
      updateItem({ ...item, colorLabel: label ?? null });
  };

  const handleChangeParent = () => {
    if (item.parent !== (targetItemId ?? null))
      updateItem({ ...item, parent: targetItemId ?? null });
  };

  const handleDeleteItem = (deleteItemId: string) => {
    deleteItem(deleteItemId);
  };

  const chipContent = `ID:${item.id} LV:${level} SQ:${item.sequenceCode}`;

  return (
    <ListItemContent sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {group ? (
        <GroupProgress isUpdating={isUpdating} group={group} colors={colors} />
      ) : (
        <ItemToggle isUpdating={isUpdating} item={item} colors={colors} />
      )}

      <Editable.Typography
        name={`item-${item.id}-note`}
        level={group ? 'title-md' : 'body-md'}
        value={item.note}
        inputPlaceholder={item.note}
        disabled={isUpdating}
        onEdited={handleNoteEdited}
        noWrap
        sx={{
          //color: colors.progress,
          minWidth: 0,
          flex: 1,
        }}
      />

      {showId && (
        <Chip
          size="sm"
          sx={{ backgroundColor: colors.plain, color: colors.progress }}>
          {chipContent}
        </Chip>
      )}

      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { size: 'sm' } }}>
          <MenuIcon />
        </MenuButton>
        <Menu size="sm">
          <MenuItem
            disabled={targetItemId === item.id}
            onClick={() => setTargetItem(item.id)}>
            <ListItemDecorator>
              <TargetIcon />
            </ListItemDecorator>
            Set as target
          </MenuItem>
          <MenuItem
            disabled={targetItemId === item.id || targetItemId === item.parent}
            onClick={handleChangeParent}>
            <ListItemDecorator />
            {targetItemId
              ? `Make child of #${targetItemId}`
              : 'Move to top level'}
          </MenuItem>
          <ListDivider />
          <MenuItem color="danger" onClick={() => handleDeleteItem(item.id)}>
            <ListItemDecorator>
              <DeleteIcon />
            </ListItemDecorator>
            Delete
          </MenuItem>
          <ListDivider />
          <ListItem
            nested
            sx={{
              marginX: '0.5rem',
              '--ListItem-startActionWidth': 0,
              '--ListItem-radius': 'var(--joy-radius-xs)',
            }}>
            <ListSubheader>Color Label</ListSubheader>
            <List orientation="horizontal" size="sm">
              <ColorLabel.MenuItems
                showNoColor
                onChange={handleColorLabelChange}
              />
            </List>
          </ListItem>
        </Menu>
      </Dropdown>

      <Radio
        size="sm"
        color="neutral"
        variant="soft"
        checked={item.id === targetItemId}
        onChange={() => setTargetItem(item.id)}
      />
    </ListItemContent>
  );
};

export default ChecklistItemContent;
