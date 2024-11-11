import React from "react";
import {AspectRatio, Chip, CircularProgress, ListItemContent, Switch, Tooltip, Typography} from "@mui/joy";
import {Done as DoneIcon} from "@mui/icons-material";
import EditableContent from "@/components/EditableContent";
import PieProgress from "@/components/PieProgress";
import {ChecklistItemData} from "../types/schema";
import {ChecklistGroupState} from "../types/context";
import {useChecklist} from "../hooks";

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
    const {addOrUpdateItem, isUpdatingItem, updatingItemId} = useChecklist();
    const isUpdating = isUpdatingItem && updatingItemId === item.id;
    const chipContent = `ID:${item.id} LV:${level} SQ:${item.sequenceCode}`;

    const handleNoteEdited = (editedValue: string) => {
        if (editedValue !== '' && editedValue !== item.note)
            addOrUpdateItem({...item, note: editedValue});
        else
            return false;
    }

    const handleParentEdited = (editedValue: string) => {
        if (editedValue !== item.parent) {
            addOrUpdateItem({...item, parent: editedValue !== '' ? editedValue : null})
        }
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
                    onChange={(e) => addOrUpdateItem({...item, done: e.target.checked})}
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

            <EditableContent
                id={`${item.id}-note`}
                value={item.note}
                inputPlaceholder={item.note}
                editOn="doubleClick"
                disableEdit={isUpdating}
                onEdited={handleNoteEdited}
                sx={{minWidth: 0, flex: 1}}>
                <Typography level={group ? "title-md" : "body-md"} noWrap/>
            </EditableContent>

            {/* DEVELOPER BACKDOOR: allows to change parent/order */}
            <EditableContent
                id={`${item.id}-parent`}
                value={item.parent || ''}
                inputPlaceholder="Parent id"
                editOn="doubleClick"
                disableEdit={isUpdating}
                onEdited={handleParentEdited}>
                <Typography startDecorator="{P=" endDecorator="}"/>
            </EditableContent>
            {/*END*/}

            {showId && <Chip size="sm">{chipContent}</Chip>}
        </ListItemContent>
    );
}

export default ChecklistItemContent;
