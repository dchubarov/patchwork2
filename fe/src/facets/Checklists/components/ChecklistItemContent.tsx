import React from "react";
import {Chip, CircularProgress, ListItemContent, Switch, Typography} from "@mui/joy";
import {Circle as PlaceholderIcon, Done as DoneIcon} from "@mui/icons-material";
import {ChecklistItemData} from "../types/schema";
import {ChecklistGroupState} from "../types/context";
import {useChecklist} from "../hooks";

interface ChecklistItemContentProps {
    level: number;
    item: ChecklistItemData;
    group?: ChecklistGroupState | null;
    showId?: boolean;
}

const ChecklistItemContent: React.FC<ChecklistItemContentProps> = ({level, item, group = null, showId}) => {
    const {addOrUpdateItem, isUpdatingItem, updatingItemId} = useChecklist();
    const isUpdating = isUpdatingItem && updatingItemId === item.id;

    return (
        <ListItemContent sx={{display: "flex", gap: 1, alignItems: "center"}}>
            {group
                ? <PlaceholderIcon sx={{mx: "2px", color: "var(--joy-palette-neutral-700)"}}/>
                : <Switch
                    checked={item.done}
                    onChange={(e) => addOrUpdateItem({...item, done: e.target.checked})}
                    disabled={isUpdating}
                    slotProps={{
                        track: {children: <DoneIcon fontSize="sm" sx={{ml: "0.25rem"}}/>},
                        thumb: {
                            children: isUpdating && <CircularProgress variant="plain" thickness={3} sx={{
                                '--CircularProgress-size': "calc(var(--Switch-thumbSize))",
                            }}/>
                        },
                    }}
                    variant="soft"
                    size="lg"
                />}

            {group && <Typography level="body-xs"
                                  sx={{color: "text.tertiary"}}>{`[${group.doneCount}/${group.items.length}]`}</Typography>}

            <Typography
                noWrap
                level={group ? "title-md" : "body-md"}
                sx={{
                    minWidth: 0,
                    // flex: 1
                }}>
                {item.note}
            </Typography>

            {showId && <Chip size="sm">{`ID:${item.id} LV:${level}`}</Chip>}
        </ListItemContent>
    );
}

export default ChecklistItemContent;
