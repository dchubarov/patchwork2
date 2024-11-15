import _ from 'lodash';
import React from 'react';
import {
  AspectRatio,
  Box,
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
  UnfoldMore as MenuIcon,
} from '@mui/icons-material';
import PieProgress from '@/components/PieProgress';
import Editable from '@/components/Editable';
import { ChecklistItemData } from '../types/schema';
import { ChecklistGroupState } from '../types/context';
import { useChecklist } from '../hooks';
import ColorLabel from '@/components/ColorLabel';
import { useLabelColors } from '@/hooks';

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

/*const DragHandle: React.FC = () => (
  <DragIcon
    className="item-secondary-control"
    fontSize="xl"
    sx={{
      mx: '-0.65rem',
      cursor: 'grab',
      //transform: 'rotate(-90deg)',
    }}
  />
);*/

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
  item,
  group = null,
  showId,
}) => {
  const {
    updateItem,
    deleteItem,
    isUpdatingItem,
    updatingItemId,
    targetItem,
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

  const handleChangeParent = (newParent?: string | null) => {
    if (newParent === undefined) newParent = targetItem?.id ?? null;
    if (item.id !== newParent && item.parent !== newParent)
      updateItem({ ...item, parent: newParent });
  };

  const handleChangeSuccessor = () => {
    if (targetItem) {
    }
  };

  const handleDeleteItem = (deleteItemId: string) => {
    deleteItem(deleteItemId);
  };

  const chipContent = `ID:${item.id} SQ:${item.sequenceCode}`;

  return (
    <ListItemContent
      sx={{
        gap: 1,
        display: 'flex',
        alignItems: 'center',
      }}>
      {group ? (
        <GroupProgress isUpdating={isUpdating} group={group} colors={colors} />
      ) : (
        <ItemToggle isUpdating={isUpdating} item={item} colors={colors} />
      )}

      {/*<DragHandle />*/}

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

      {/* TODO make item menu reusable */}
      <Dropdown>
        <MenuButton
          className="item-secondary-control"
          slots={{ root: IconButton }}
          slotProps={{
            root: {
              size: 'sm',
              sx: {
                background: 'transparent',
                color: 'var(--joy-palette-text-tertiary)',
                '&:hover': {
                  background: 'transparent',
                },
              },
            },
          }}>
          <MenuIcon />
        </MenuButton>
        <Menu size="sm">
          <MenuItem
            disabled={item.parent == null}
            onClick={() => handleChangeParent(null)}>
            Move to top level
          </MenuItem>
          {targetItem && targetItem.id !== item.id && (
            <>
              <MenuItem
                disabled={item.parent === targetItem.id || group?.targetWithin}
                onClick={() => handleChangeParent()}>
                {`Make child of "${_.truncate(targetItem.note, { length: 20 })}" [#${targetItem.id}]`}
              </MenuItem>
              <MenuItem onClick={() => handleChangeSuccessor()}>
                {`Make predecessor of "${_.truncate(targetItem.note, { length: 20 })}" [#${targetItem.id}]`}
              </MenuItem>
            </>
          )}
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
                onChange={handleColorLabelChange}
                showNoColor
              />
            </List>
          </ListItem>
        </Menu>
      </Dropdown>

      <Radio
        className={
          item.id === targetItem?.id || group?.targetWithin
            ? 'item-secondary-control-active'
            : 'item-secondary-control'
        }
        size="sm"
        color="neutral"
        variant="soft"
        uncheckedIcon={
          group?.targetWithin && item.id !== targetItem?.id ? (
            <Box
              component="span"
              sx={(theme) => ({
                width: 'calc(var(--Radio-size) / 2)',
                height: 'calc(var(--Radio-size) / 2)',
                backgroundColor: theme.palette.divider,
                borderRadius: 'inherit',
              })}
            />
          ) : undefined
        }
        checked={item.id === targetItem?.id}
        onChange={() => setTargetItem(item)}
        slotProps={{
          icon: {
            sx: (theme) => ({ color: theme.palette.text }),
          },
        }}
      />
    </ListItemContent>
  );
};

export default ChecklistItemContent;
