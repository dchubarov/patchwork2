import React from "react";
import {Chip, ListItemContent, Switch, Typography} from "@mui/joy";
import {ChecklistItemData} from "../types";
import {Circle as PlaceholderIcon} from "@mui/icons-material";

type ChecklistItemContentComponentType = React.FC<{
    level: number;
    item: ChecklistItemData;
    group?: boolean;
    showId?: boolean;
}>;

const ChecklistItemContent: ChecklistItemContentComponentType = ({item, group, showId}) => {
    return (
        <ListItemContent sx={{display: "flex", gap: 1, alignItems: "center"}}>
            {group ? <PlaceholderIcon sx={{mx: "2px"}}/> : <Switch
                defaultChecked={item.done}
                variant="soft"
                size="lg"/>}

            <Typography
                noWrap
                level={group ? "title-md" : "body-md"}
                sx={{
                    minWidth: 0,
                    // flex: 1
                }}>
                {item.note}
            </Typography>

            {showId && <Chip size="sm">{`ID:${item.id}`}</Chip>}
        </ListItemContent>
    );
}

export default ChecklistItemContent;
