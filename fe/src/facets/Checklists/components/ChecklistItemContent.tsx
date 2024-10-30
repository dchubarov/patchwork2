import React from "react";
import {Chip, ListItemContent, Switch, Typography} from "@mui/joy";
import {ChecklistGroupSummaryData, ChecklistItemData} from "../types";

type ChecklistItemContentComponentType = React.FC<{
    item: ChecklistItemData;
    group: ChecklistGroupSummaryData | null;
    showId?: boolean;
}>;

const ChecklistItemContent: ChecklistItemContentComponentType = ({item, group, showId}) => {
    return (
        <ListItemContent sx={{display: "flex", gap: 1, alignItems: "center"}}>
            {!group && <Switch
                defaultChecked={item.done}
                variant="soft"
                size="lg"/>}

            <Typography
                noWrap
                sx={{
                    minWidth: 0,
                    flex: 1
                }}>
                {item.note}
            </Typography>

            {showId && <Chip size="sm">{`#${item.id}`}</Chip>}
        </ListItemContent>
    );
}

export default ChecklistItemContent;
