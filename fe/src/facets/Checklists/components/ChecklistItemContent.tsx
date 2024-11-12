import React from "react";
import {
    AspectRatio,
    Chip,
    CircularProgress,
    Dropdown,
    IconButton, List, ListDivider, ListItem,
    ListItemContent, ListItemDecorator, ListSubheader,
    Menu,
    MenuButton,
    MenuItem,
    Radio,
    Switch,
    Tooltip
} from "@mui/joy";
import {
    Done as DoneIcon,
    MoreVert as MenuIcon,
    RadioButtonChecked as TargetIcon,
    DeleteOutline as DeleteIcon
} from "@mui/icons-material";
import PieProgress from "@/components/PieProgress";
import Editable from "@/components/Editable";
import {ChecklistItemData} from "../types/schema";
import {ChecklistGroupState} from "../types/context";
import {useChecklist} from "../hooks";
import ColorLabel from "@/components/ColorLabel";

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

interface ChecklistItemContentProps {
    level: number;
    item: ChecklistItemData;
    group?: ChecklistGroupState | null;
    showId?: boolean;
}

const ChecklistItemContent: React.FC<ChecklistItemContentProps> = ({level, item, group = null, showId}) => {
    const {updateItem, isUpdatingItem, updatingItemId, targetItemId, setTargetItem} = useChecklist();
    const isUpdating = isUpdatingItem && updatingItemId === item.id;
    const chipContent = `ID:${item.id} LV:${level} SQ:${item.sequenceCode}`;

    const handleNoteEdited = (editedValue?: string) => {
        if (editedValue && editedValue !== item.note)
            updateItem({...item, note: editedValue});
        else
            return false;
    }

    return (
        <ListItemContent sx={{display: "flex", gap: 1, alignItems: "center"}}>
            {group
                ? <Tooltip title={`${group.doneCount} / ${group.doableCount}`} arrow>
                    <AspectRatio
                        ratio={1}
                        variant="soft"
                        sx={{
                            "--AspectRatio-radius": "50%",
                            width: "24px",
                        }}>

                        {isUpdating
                            ? <CircularProgress variant="plain" color="neutral" thickness={3} sx={{
                                '--CircularProgress-size': "18px",
                                padding: "3px"
                            }}/>
                            : <PieProgress value={group.doneCount / group.doableCount * 100} margin={3} thickness={9}
                                           zeroIndicator/>}
                    </AspectRatio>
                </Tooltip>
                : <Switch
                    id={`toggle-${item.id}`}
                    checked={item.done}
                    onChange={(e) => updateItem({...item, done: e.target.checked})}
                    disabled={isUpdating}
                    slotProps={{
                        track: {children: <DoneIcon fontSize="sm" sx={{ml: "0.25rem"}}/>},
                        thumb: {
                            children: isUpdating &&
                                <CircularProgress variant="plain" color="neutral" thickness={3} sx={{
                                    '--CircularProgress-size': "calc(var(--Switch-thumbSize))",
                                }}/>
                        },
                    }}
                    variant="soft"
                    size="lg"
                />}

            <Editable.Typography
                name={`item-${item.id}-note`}
                level={group ? "title-md" : "body-md"}
                value={item.note}
                inputPlaceholder={item.note}
                disabled={isUpdating}
                onEdited={handleNoteEdited}
                sx={{minWidth: 0, flex: 1}}
            />

            {showId && <Chip size="sm">{chipContent}</Chip>}

            <Dropdown>
                <MenuButton
                    slots={{root: IconButton}}
                    slotProps={{root: {size: 'sm'}}}>
                    <MenuIcon/>
                </MenuButton>
                <Menu size="sm">
                    <MenuItem
                        disabled={targetItemId === item.id}
                        onClick={() => setTargetItem(item.id)}>
                        <ListItemDecorator><TargetIcon/></ListItemDecorator>
                        Set as target
                    </MenuItem>
                    <MenuItem
                        disabled={targetItemId === item.id || targetItemId === item.parent}
                        onClick={() => updateItem({...item, parent: targetItemId || null})}>
                        <ListItemDecorator/>
                        {targetItemId ? `Make child of #${targetItemId}` : 'Move to top level'}
                    </MenuItem>
                    <ListDivider/>
                    <MenuItem color="danger">
                        <ListItemDecorator><DeleteIcon/></ListItemDecorator>
                        Delete
                    </MenuItem>
                    <ListDivider/>
                    <ListItem nested>
                        <ListSubheader>Color Label</ListSubheader>
                        <List orientation="horizontal" size="sm">
                            <ColorLabel.MenuItems onChange={(colorLabel) =>
                                updateItem({...item, colorLabel: colorLabel ?? null})}
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
}

export default ChecklistItemContent;
