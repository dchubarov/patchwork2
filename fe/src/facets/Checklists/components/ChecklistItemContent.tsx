import React from "react";
import {Chip, ListItemContent, Switch, Typography} from "@mui/joy";
import {Circle as PlaceholderIcon, Done as DoneIcon} from "@mui/icons-material";
import {ChecklistItemData} from "../types/schema";
import {ChecklistGroupState} from "../types/context";

interface ChecklistItemContentProps {
    level: number;
    item: ChecklistItemData;
    group?: ChecklistGroupState | null;
    showId?: boolean;
}

const ChecklistItemContent: React.FC<ChecklistItemContentProps> = ({level, item, group = null, showId}) => {
    return (
        <ListItemContent sx={{display: "flex", gap: 1, alignItems: "center"}}>
            {group
                ? <PlaceholderIcon sx={{mx: "2px", color: "var(--joy-palette-neutral-700)"}}/>
                : <Switch
                    defaultChecked={item.done}
                    slotProps={{track: {children: <DoneIcon fontSize="sm" sx={{ml: "0.25rem"}}/>}}}
                    variant="soft"
                    size="lg"
                />}

            {group && <Typography level="body-xs" sx={{color: "text.tertiary"}}>{`[${group.doneCount}/${group.items.length}]`}</Typography>}

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
